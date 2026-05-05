# Como Configurar o Endereço da API

**Após a instalação do Gym.Net**, você pode alterar o endereço da API backend editando o arquivo de configuração.

## 📍 Localização do Arquivo

Após instalar o aplicativo, o arquivo de configuração estará em:

```
C:\Users\SEU_USUARIO\AppData\Local\Gym.Net\wwwroot\api-config.json
```

Ou de forma mais rápida, digite no Windows Explorer:
```
%LOCALAPPDATA%\Gym.Net\wwwroot\api-config.json
```

## ✏️ Como Editar

1. **Abra o Notepad** (não precisa ser como Administrador)
   - Pressione a tecla Windows
   - Digite "Notepad"
   - Abra o Notepad

2. **Abra o arquivo**
   - No Notepad, vá em Arquivo → Abrir
   - Cole este caminho na barra de endereço: `%LOCALAPPDATA%\Gym.Net\wwwroot\`
   - Selecione o arquivo: `api-config.json`

3. **Edite a URL**
   ```json
   {
     "apiBaseUrl": "https://seu-novo-servidor.com/api",
     "timeout": 10000
   }
   ```
   
4. **Salve o arquivo**
   - Pressione Ctrl+S ou vá em Arquivo → Salvar

5. **Reinicie o aplicativo**
   - Feche completamente o Gym.Net
   - Abra novamente

## 🔧 Exemplos de Configuração

### API em Servidor Local
```json
{
  "apiBaseUrl": "http://localhost:5001/api",
  "timeout": 10000
}
```

### API em Servidor Remoto
```json
{
  "apiBaseUrl": "https://api.minhaacademia.com.br/api",
  "timeout": 10000
}
```

### API com Ngrok
```json
{
  "apiBaseUrl": "https://abc123.ngrok-free.app/api",
  "timeout": 10000
}
```

## ⚠️ Observações Importantes

- **Formato JSON**: Mantenha as aspas duplas e vírgulas no lugar correto
- **Barra final**: Não adicione `/` no final da URL
- **HTTPS vs HTTP**: Use `https://` para conexões seguras
- **Timeout**: Valor em milissegundos (10000 = 10 segundos)
- **Reiniciar**: Sempre reinicie o aplicativo após editar o arquivo

## 🆘 Em Caso de Erro

Se o aplicativo não funcionar após a edição:

1. Verifique se o JSON está correto (sem erros de sintaxe)
2. Use uma ferramenta online para validar JSON: https://jsonlint.com
3. Em último caso, restaure o arquivo original:

**Arquivo Original:**
```json
{
  "apiBaseUrl": "https://f12f-138-185-96-36.ngrok-free.app/api",
  "timeout": 10000
}
```

## 💡 Dicas

- **Backup**: Antes de editar, faça uma cópia do arquivo original
- **Editor Alternativo**: Você pode usar VS Code, Notepad++ ou qualquer editor de texto
- **Acesso Rápido**: Digite `%LOCALAPPDATA%\Gym.Net\wwwroot\` no Windows Explorer
- **Sem Admin**: Não precisa de permissões de administrador para editar
- **Verificar URL**: Teste a URL da API no navegador adicionando `/status` no final

---

**Versão:** 1.0.0  
**Última Atualização:** Fevereiro 2026
