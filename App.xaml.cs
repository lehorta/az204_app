using System.Windows;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Builder;

namespace Gym.Net;

/// <summary>
/// Aplicação principal - inicia API local + WPF
/// </summary>
public partial class App : Application
{
    private IHost? _apiHost;

    protected override async void OnStartup(StartupEventArgs e)
    {
        base.OnStartup(e);

        try
        {
            // Inicia API local em background
            _apiHost = CreateApiHost();
            await _apiHost.StartAsync();

            // Aguarda 1 segundo para API estar pronta
            await Task.Delay(1000);

            // Abre janela principal
            var mainWindow = new MainWindow();
            mainWindow.Show();
        }
        catch (Exception ex)
        {
            MessageBox.Show(
                $"Erro ao iniciar aplicação: {ex.Message}",
                "Erro Fatal",
                MessageBoxButton.OK,
                MessageBoxImage.Error
            );
            Shutdown();
        }
    }

    protected override async void OnExit(ExitEventArgs e)
    {
        if (_apiHost != null)
        {
            await _apiHost.StopAsync();
            _apiHost.Dispose();
        }
        base.OnExit(e);
    }

    private IHost CreateApiHost()
    {
        return Host.CreateDefaultBuilder()
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseUrls("http://localhost:5001");
                webBuilder.ConfigureServices(services =>
                {
                    services.AddControllers();
                    services.AddEndpointsApiExplorer();
                    
                    services.AddCors(options =>
                    {
                        options.AddDefaultPolicy(policy =>
                        {
                            policy.AllowAnyOrigin()  // Permite qualquer origem (necessário para ngrok)
                                  .AllowAnyMethod()
                                  .AllowAnyHeader();
                        });
                    });
                });
                
                webBuilder.Configure(app =>
                {
                    app.UseCors();
                    app.UseRouting();
                    app.UseEndpoints(endpoints =>
                    {
                        endpoints.MapControllers();
                        // Redireciona root para endpoint de status (evita Swagger aparecer em /)
                        endpoints.MapGet("/", async ctx => 
                        {
                            ctx.Response.Redirect("/api/access/status");
                        });
                    });
                });
            })
            .Build();
    }
}
