using System.Windows;
using System.IO;
using System.Text.Json;
using Microsoft.Web.WebView2.Core;

namespace Gym.Net
{
    /// <summary>
    /// Host principal - carrega React via WebView2
    /// </summary>
    public partial class MainWindow : Window
    {
        private const string LocalFrontendHost = "app.local";

        public MainWindow()
        {
            InitializeComponent();
            InitializeAsync();
        }

        private static string GetFrontendRootPath()
        {
            return Path.Combine(AppContext.BaseDirectory, "wwwroot");
        }

        private static bool HasBundledFrontend(out string frontendRoot)
        {
            frontendRoot = GetFrontendRootPath();
            var indexPath = Path.Combine(frontendRoot, "index.html");
            return File.Exists(indexPath);
        }

        private async void InitializeAsync()
        {
            try
            {
                // Configura WebView2
                await webView.EnsureCoreWebView2Async(null);
                
                // Configura DevTools (apenas em Debug)
                webView.CoreWebView2.Settings.AreDevToolsEnabled = true;
                webView.CoreWebView2.Settings.AreDefaultContextMenusEnabled = true;

                // Handler para mensagens do frontend (React)
                webView.CoreWebView2.WebMessageReceived += CoreWebView2_WebMessageReceived;

                // Navegação: build local (instalado) com fallback para servidor de desenvolvimento
                if (HasBundledFrontend(out var frontendRoot))
                {
                    webView.CoreWebView2.SetVirtualHostNameToFolderMapping(
                        LocalFrontendHost,
                        frontendRoot,
                        CoreWebView2HostResourceAccessKind.Allow
                    );
                    webView.Source = new Uri($"https://{LocalFrontendHost}/index.html");
                }
                else
                {
                    webView.Source = new Uri("http://localhost:5173");
                }
                
                // Aguarda carregamento do React
                webView.NavigationCompleted += (s, e) =>
                {
                    if (e.IsSuccess)
                    {
                        // Remove loading overlay
                        loadingOverlay.Visibility = Visibility.Collapsed;
                    }
                    else
                    {
                        var details = webView.Source?.ToString() ?? "desconhecida";
                        MessageBox.Show(
                            $"Erro ao carregar interface ({details}).\n\n" +
                            "Se esta for a versão instalada, verifique se a pasta wwwroot foi incluída.\n" +
                            "Se estiver em desenvolvimento, verifique se o servidor React está rodando em http://localhost:5173.",
                            "Erro de Conexão",
                            MessageBoxButton.OK,
                            MessageBoxImage.Error
                        );
                    }
                };
            }
            catch (Exception ex)
            {
                MessageBox.Show(
                    $"Erro ao inicializar WebView2: {ex.Message}\n\nInstale o WebView2 Runtime.",
                    "Erro Fatal",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error
                );
                Application.Current.Shutdown();
            }
        }

        /// <summary>
        /// Handler para mensagens enviadas pelo frontend React
        /// </summary>
        private void CoreWebView2_WebMessageReceived(object? sender, CoreWebView2WebMessageReceivedEventArgs e)
        {
            try
            {
                var message = e.TryGetWebMessageAsString();
                
                // Parse JSON - React envia: { action: 'exit' }
                using var jsonDoc = JsonDocument.Parse(message);
                var root = jsonDoc.RootElement;
                
                if (root.TryGetProperty("action", out var actionElement))
                {
                    var action = actionElement.GetString();
                    
                    if (action == "exit")
                    {
                        // Fechar a aplicação
                        Application.Current.Dispatcher.Invoke(() =>
                        {
                            Application.Current.Shutdown();
                        });
                    }
                }
            }
            catch
            {
                // Ignora erros de parse de mensagens
            }
        }

        protected override void OnClosed(EventArgs e)
        {
            webView?.Dispose();
            base.OnClosed(e);
        }
    }
}