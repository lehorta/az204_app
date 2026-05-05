# 🌐 Tutoriais: Ferramentas Online para Criar Imagens

Você pode criar as imagens personalizadas **GRATUITAMENTE** usando ferramentas online, sem instalar nada!

---

## 🎨 Opção 1: Canva (Recomendado)

**Site:** https://canva.com (grátis)

### Passo a Passo:

#### Para **wizard-image.bmp** (164×386 px):

1. Acesse **Canva.com**
2. Clique em **"Create a design"**
3. Selecione **"Custom size"**
4. Digite: **164 × 386** pixels
5. **Design:**
   - Fundo: Gradiente azul → branco (ou cores da academia)
   - Adicione logo/ícone da academia (busque "gym" no banco de imagens)
   - Importe screenshots da aplicação
   - Adicione texto: "Gym.Net" ou "Gestor de Academias"
6. **Baixar:** Download > PNG
7. **Converter:** Vá para https://convertio.co/ e converta PNG → BMP

#### Para **wizard-small-image.bmp** (55×55 px):

1. Repita acima, mas custom size: **55 × 55**
2. Apenas ícone/logo (será pequeno)
3. Baixe como PNG e converta para BMP

#### Para **icon.ico** (32×32 px):

1. Custom size: **32 × 32** pixels
2. Design simples (ícone da academia)
3. Baixe como PNG
4. Vá para: https://convertio.co/ e converta PNG → ICO

---

## 🖌️ Opção 2: Photopea (Photoshop Online Grátis)

**Site:** https://www.photopea.com (100% grátis)

### Vantagens:
- Interface similar ao Photoshop
- Não precisa de instalação
- Suporta PSD do Photoshop

### Passo a Passo:

1. Abra https://www.photopea.com
2. **File > New Document**
3. Tamanho: Digite **164 x 386** (para wizard-image)
4. Design conforme desejar
5. **File > Export As > BMP**
6. Salve na pasta `installer-images`

---

## 🖼️ Opção 3: Pixlr (Editor Online)

**Site:** https://pixlr.com (grátis)

1. **Pixlr Editor**
2. **File > New**
3. Dimensões: **164 x 386**
4. Design
5. **File > Save > Download**
6. Escolha **BMP** como formato

---

## 🖥️ Opção 4: Paint.NET (Gratuito, Não Online)

Se preferir desktop leve:

1. Download: https://www.getpaint.net
2. **File > New** 
3. Define tamanho (164×386)
4. Design
5. **File > Export As** > **BMP**

---

## 📸 Opção 5: Usar Screenshots Reais + Ferramenta de Colagem

### Como fazer um **wizard-image** profissional:

1. **Capture screenshots** do seu Gym.Net:
   - Tela de login
   - Dashboard
   - Tela de gerenciamento de alunos

2. **Abra Canva** e crie design 164×386:
   - Fundo gradiente (azul ou verde)
   - Cole prints lado a lado
   - Adicione logo
   - Adicione texto descritivo

3. **Resultado:** Imagem profissional mostrando funcionalidades reais

---

## 🔄 Conversão de Formatos

**PNG/JPG → BMP:**

1. https://convertio.co/
2. https://image.online-convert.com/
3. https://ilovepdf.com/convert (versátil)

**PNG → ICO:**

1. https://convertio.co/
2. https://icoconvert.com/ (especializado)

---

## 📋 Checklist Final

- [ ] Criei/baixei as 3 imagens
- [ ] Convertidas para formatos corretos:
  - `icon.ico` ← PNG/JPG
  - `wizard-image.bmp` ← PNG/JPG
  - `wizard-small-image.bmp` ← PNG/JPG
- [ ] Dimensões corretas:
  - icon: **32×32** px
  - wizard-image: **164×386** px
  - wizard-small: **55×55** px
- [ ] Nomes salvos corretamente
- [ ] Pasta: `d:\ghr\Gym.net\Gym.Net\installer-images\`

---

## 💡 Dicas de Design Profissional

### Cores Recomendadas (Academia/Fitness):
- **Azul**: `#1E3A8A` (profissional)
- **Verde**: `#16A34A` (saúde)
- **Laranja**: `#EA580C` (energia)
- **Vermelho**: `#DC2626` (energia/ação)

### O que Incluir:

**wizard-image (164×386):**
```
┌─────────────────────────┐
│   Logo/Icon             │ ← 40 px top
├─────────────────────────┤
│  Screenshot 1            │
│  (Tela Login)           │
│                         │ ← 160 px middle
│  Screenshot 2            │
│  (Dashboard)            │
├─────────────────────────┤
│ "Gym.Net"               │
│ Versão 1.0.0            │ ← 60 px bottom
│ Gestor de Academias     │
└─────────────────────────┘
```

**icon/small-image (32×32 ou 55×55):**
- Haltere
- Letra "G" estilizada
- Silhueta de pessoa se exercitando

---

## 🚀 Depois de Pronto

1. Salve as imagens em: `d:\ghr\Gym.net\Gym.Net\installer-images\`
2. Execute: `.\build-installer.ps1`
3. Seu instalador personalizado estará em: `installer-output\GymNet-Setup-1.0.0.exe`

---

**Perguntas?** Leia `PERSONALIZAR-INSTALADOR.md` para documentação completa!
