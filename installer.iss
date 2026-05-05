; Script de Instalação do SisBurpee
; Requer Inno Setup 6.0 ou superior
; Download: https://jrsoftware.org/isdl.php

#define MyAppName "SisBurpee"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "SisBurpee Team"
#define MyAppURL "https://sisburpee.com"
#define MyAppExeName "SisBurpee.exe"
#define MyAppAssocName MyAppName + " Application"
#define MyAppAssocExt ".sisburpee"
#define MyAppAssocKey StringChange(MyAppAssocName, " ", "") + MyAppAssocExt

[Setup]
; Informações básicas da aplicação
AppId={{A1B2C3D4-E5F6-7890-ABCD-EF1234567890}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}

; Configurações de instalação
DefaultDirName={localappdata}\{#MyAppName}
DefaultGroupName={#MyAppName}
AllowNoIcons=yes
PrivilegesRequired=lowest
PrivilegesRequiredOverridesAllowed=dialog

; Diretório de saída do instalador
OutputDir=installer-output
OutputBaseFilename=SisBurpee-Setup-{#MyAppVersion}

; Compressão
Compression=lzma2/ultra64
SolidCompression=yes

; Modern UI
WizardStyle=modern

; Cores e estilo moderno
WizardImageStretch=no
WizardImageBackColor=clWhite
WizardImageAlphaFormat=defined

; Arquitetura
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible

; Licença e informações (opcional)
; LicenseFile=LICENSE.txt
; InfoBeforeFile=README.txt

; ===== PERSONALIZAÇÃO VISUAL =====
; Ícone principal (32x32 px)
SetupIconFile=installer-images\icon.ico

; Imagem grande do assistente (164x386 px) - exibida na lateral esquerda
WizardImageFile=installer-images\wizard-image.bmp

; Ícone pequeno do assistente (55x55 px) - exibido no topo
WizardSmallImageFile=installer-images\wizard-small-image.bmp

; DICA: Se as imagens forem PNG, converta para BMP usando:
;   - Paint do Windows: Abir arquivo > Salvar Como > BMP
;   - ou use ferramentas online como: https://convertio.co/
; As imagens devem estar na pasta: d:\ghr\Gym.net\Gym.Net\installer-images\

[Languages]
Name: "brazilianportuguese"; MessagesFile: "compiler:Languages\BrazilianPortuguese.isl"
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked
Name: "quicklaunchicon"; Description: "{cm:CreateQuickLaunchIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked; OnlyBelowVersion: 6.1; Check: not IsAdminInstallMode

[Files]
; Arquivos da aplicação principal
Source: "publish\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

; Frontend React (obrigatório para versão instalada)
Source: "frontend-react\dist\*"; DestDir: "{app}\wwwroot"; Flags: ignoreversion recursesubdirs createallsubdirs

; Arquivo de configuração da API (editável pelo usuário)
Source: "api-config.json"; DestDir: "{app}\wwwroot"; Flags: ignoreversion confirmoverwrite

; WebView2 Runtime Bootstrapper
Source: "webview2\MicrosoftEdgeWebview2Setup.exe"; DestDir: "{tmp}"; Flags: deleteafterinstall; Check: not IsWebView2Installed

; Arquivos de configuração
; Source: "appsettings.json"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
; Ícone no Menu Iniciar
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{group}\{cm:UninstallProgram,{#MyAppName}}"; Filename: "{uninstallexe}"

; Ícone na Área de Trabalho (opcional)
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

; Ícone na Barra de Inicialização Rápida (opcional, Windows antigos)
Name: "{userappdata}\Microsoft\Internet Explorer\Quick Launch\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: quicklaunchicon

[Registry]
; Opcional: Registro de associação de arquivos
Root: HKA; Subkey: "Software\Classes\{#MyAppAssocExt}\OpenWithProgids"; ValueType: string; ValueName: "{#MyAppAssocKey}"; ValueData: ""; Flags: uninsdeletevalue
Root: HKA; Subkey: "Software\Classes\{#MyAppAssocKey}"; ValueType: string; ValueName: ""; ValueData: "{#MyAppAssocName}"; Flags: uninsdeletekey
Root: HKA; Subkey: "Software\Classes\{#MyAppAssocKey}\DefaultIcon"; ValueType: string; ValueName: ""; ValueData: "{app}\{#MyAppExeName},0"
Root: HKA; Subkey: "Software\Classes\{#MyAppAssocKey}\shell\open\command"; ValueType: string; ValueName: ""; ValueData: """{app}\{#MyAppExeName}"" ""%1"""
Root: HKA; Subkey: "Software\Classes\Applications\{#MyAppExeName}\SupportedTypes"; ValueType: string; ValueName: ".myp"; ValueData: ""

[Run]
; Instalar WebView2 Runtime se necessário (pode solicitar permissões de administrador)
Filename: "{tmp}\MicrosoftEdgeWebview2Setup.exe"; Parameters: "/silent /install"; StatusMsg: "Instalando Microsoft Edge WebView2 Runtime..."; Flags: waituntilterminated shellexec; Check: not IsWebView2Installed

; Executar aplicação após instalação (opcional)
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent runascurrentuser

[Code]
// Verificar se o WebView2 Runtime está instalado
function IsWebView2Installed(): Boolean;
var
  RegKey: string;
begin
  // Verifica no registro se o WebView2 está instalado
  RegKey := 'SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}';
  Result := RegKeyExists(HKLM, RegKey);
  
  // Se não encontrou na chave WOW6432Node, tenta na chave normal (64-bit)
  if not Result then
  begin
    RegKey := 'SOFTWARE\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}';
    Result := RegKeyExists(HKLM, RegKey);
  end;
end;

// Verificar se o .NET Runtime está instalado
function IsDotNetInstalled(): Boolean;
var
  ResultCode: Integer;
begin
  // Verificar se o .NET 10.0 está instalado
  Result := Exec('dotnet', '--list-runtimes', '', SW_HIDE, ewWaitUntilTerminated, ResultCode) and (ResultCode = 0);
end;

function InitializeSetup(): Boolean;
begin
  Result := True;
  
  // Se a aplicação não for self-contained, verificar o .NET
  // Como nossa publicação é self-contained, este check é opcional
  {
  if not IsDotNetInstalled() then
  begin
    if MsgBox('Este aplicativo requer o .NET 10.0 Runtime.' + #13#10#13#10 +
              'Deseja abrir a página de download?', mbConfirmation, MB_YESNO) = IDYES then
    begin
      ShellExec('open', 'https://dotnet.microsoft.com/download', '', '', SW_SHOW, ewNoWait, ResultCode);
    end;
    Result := False;
  end;
  }
end;

// Mensagem de boas-vindas
procedure InitializeWizard();
begin
  WizardForm.WelcomeLabel2.Caption := 
    'Este assistente irá instalar o ' + '{#MyAppName}' + ' versão ' + '{#MyAppVersion}' + ' no seu computador.' + #13#10#13#10 +
    'Sistema de Gestão de Academias completo com controle de acesso, ' +
    'gerenciamento de alunos e dashboard administrativo.' + #13#10#13#10 +
    'Clique em Avançar para continuar ou Cancelar para sair da instalação.';
end;
