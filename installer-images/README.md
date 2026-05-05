# 🎨 Imagens do Instalador Gym.Net

Pasta para armazenar as imagens personalizadas do instalador.

## 📋 Arquivos Necessários

| Arquivo | Tamanho | Descrição |
|---------|---------|-----------|
| `icon.ico` | 32×32 px | Ícone principal (Menu Iniciar, barra de tarefas) |
| `wizard-image.bmp` | 164×386 px | Imagem grande (lateral do assistente de instalação) |
| `wizard-small-image.bmp` | 55×55 px | Ícone pequeno (topo do assistente) |

## 🚀 Como Começar

### Opção 1: Gerar Imagens Padrão (Rápido)

Se você tiver **Python** instalado:

```powershell
# Windows PowerShell
python generate-images.py
```

Isso criará imagens padrão com tema azul da academia.

### Opção 2: Personalizar Manualmente

1. Abra **Canva** (https://canva.com) ou GIMP (gratuito)
2. Crie designs com:
   - Logo/ícone da academia
   - Screenshots da aplicação Gym.Net
   - Cores da marca
3. Exporte para PNG/JPG
4. Converta para **BMP** em: https://convertio.co/

### Opção 3: Usar Paint do Windows

```
1. Menu Iniciar > Paint
2. Arquivo > Novo > 164 × 386 pixels
3. Desenhe/importe imagens
4. Arquivo > Salvar Como > BMP
5. Salve como wizard-image.bmp
```

## ✅ Checklist

- [ ] `icon.ico` colocado nesta pasta
- [ ] `wizard-image.bmp` colocado nesta pasta
- [ ] `wizard-small-image.bmp` colocado nesta pasta
- [ ] Arquivos em formato BMP (exceto .ico)
- [ ] Nomes exatamente como acima (case-sensitive em alguns casos)

## 🔧 Próximos Passos

Após adicionar as imagens, compile o instalador:

```powershell
cd ..  # Voltar para a pasta do projeto
.\build-installer.ps1
```

O instalador personalizado será gerado em: `installer-output\GymNet-Setup-1.0.0.exe`

## 📚 Documentação Completa

Para mais detalhes, leia: **PERSONALIZAR-INSTALADOR.md**

---

💡 **Dica:** Reuse screenshots reais da seu sistema Gym.Net no wizard-image.bmp para mostrar funcionalidades!
