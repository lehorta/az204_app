# 🎨 Guia de Personalização Visual do Instalador

O instalador do Gym.Net foi configurado para aceitar imagens personalizadas. Siga os passos abaixo:

## 📋 Imagens Necessárias

### 1️⃣ **icon.ico** (32x32 px) - Ícone Principal
Será exibido na barra de tarefas do instalador e no Menu Iniciar.

**Como criar:**
- Use o programa **Paint** do Windows
- Deseje > Novo > 32x32 pixels
- Crie ou importar um ícone da academia (haltere, pessoas se exercitando, etc)
- Salve como: `icon.ico`

**Alternativa online:** https://convertio.co/ (PNG → ICO)

---

### 2️⃣ **wizard-image.bmp** (164x386 px) - Imagem Lateral do Assistente
Será exibida na lateral esquerda do assistente de instalação (tela mais importante visualmente).

**Recomendações:**
- Imagem com tema de academia (haltere, academia, pessoas se exercitando)
- Usar cores que combinem com sua marca (azul, verde, laranja, etc)
- A imagem ocupa a lateral esquerda das telas de instalação

**Como criar:**
1. Use **Photoshop**, **GIMP** (gratuito) ou **Canva Pro** (online)
2. Crie uma imagem 164×386 pixels em formato PNG ou JPG
3. Adicione:
   - Ícone/foto de academia
   - Algumas telas do sistema (prints)
   - Gradiente de cores
   - Texto motivacional opcional (ex: "Bem-vindo ao Gym.Net")

4. Exporte como **BMP** ou converta depois em: https://convertio.co/ (PNG/JPG → BMP)

---

### 3️⃣ **wizard-small-image.bmp** (55x55 px) - Ícone do Topo
Pequeno icon exibido no topo das telas.

**Dicas:**
- Use o mesmo ícone de brand da academia
- Mantenha legibilidade mesmo em tamanho pequeno
- Pode ser uma versão reduzida do `icon.ico`

---

## 🛠️ Passos para Adicionar as Imagens

### Opção 1: Usando Ferramentas Online (Mais Fácil)

1. **Baixe screenshots** de telas do seu sistema Gym.Net
2. Acesse **Canva** (https://canva.com) ou **Design Online**
3. Crie designs personalizados:
   - Wizard image: 164×386 px
   - Small image: 55×55 px
   - Icon: 32×32 px
4. Exporte como **PNG** e converta para **BMP**
5. Coloque os arquivos nesta pasta

### Opção 2: Usando GIMP (Gratuito)

```
1. Download GIMP: https://www.gimp.org/
2. Crie novo documento com dimensões corretas
3. Importe screenshots da aplicação
4. Crie layout profissional
5. Salve como BMP
```

### Opção 3: Converter Imagens Prontas

Se você já tem imagens PNG/JPG:

1. Acesse: https://convertio.co/ ou https://image.online-convert.com/
2. Faça upload das imagens
3. Converta para **BMP**
4. Salve nesta pasta

---

## 📁 Estrutura Correta

```
installer-images/
├── icon.ico                 (32×32 px)
├── wizard-image.bmp         (164×386 px)
├── wizard-small-image.bmp   (55×55 px)
└── PERSONALIZAR-INSTALADOR.md (este arquivo)
```

---

## ✅ Verificando a Configuração

O arquivo `installer.iss` já está configurado para procurar essas imagens.

Se você colocar as imagens na pasta correta e executar:
```powershell
.\build-installer.ps1
```

O instalador será gerado com sua personalização visual!

---

## 🎯 Exemplos de Conteúdo para as Imagens

### Wizard Image (164×386 px):
```
┌─────────────────┐
│   Logo/Ícone    │ (topo, 40 px)
├─────────────────┤
│  Screenshots    │
│  da tela de     │ (centro, 200 px)
│  Login, dash    │
│  e acadêmicos   │
├─────────────────┤
│ "Gestor de      │
│  Academias"     │ (rodapé, 100 px)
│ com gradiente   │
└─────────────────┘
```

### Icon (32×32 px):
- Haltere
- Letra "G" estilizada
- Ícone de academia

### Small Image (55×55 px):
- Mesma coisa, apenas maior

---

## 🚀 Compilando o Instalador com as Imagens

Após adicionar as imagens, compile:

```powershell
# Navegue até a pasta do projeto
cd "d:\ghr\Gym.net\Gym.Net"

# Execute o script de build
.\build-installer.ps1
```

O novo instalador estará em: `installer-output\GymNet-Setup-1.0.0.exe`

---

## 💡 Dicas Profissionais

1. **Use cores consistentes** com a identidade visual da academia
2. **Adicione telas reais** do sistema (prints) para mostrar funcionalidades
3. **Fonts legíveis** mesmo em tamanhos pequenos
4. **Evite textos muito longos** nas imagens pequenas
5. **Use PNG com fundo transparente** e depois converta para BMP
6. **Teste em máquinas reais** - o visual pode variar ligeiramente

---

## ❓ Problemas Comuns

**P: O instalador não vê as imagens?**
R: Verifique se:
- Os nomes dos arquivos estão EXATAMENTE como esperado
- Os arquivos estão em formato BMP
- O caminho é `installer-images\` (relativo ao projeto)

**P: A imagem está distorcida?**
R: Confirme as dimensões exatas:
- wizard-image: **164×386** (não 164×350)
- wizard-small-image: **55×55** (exato)
- icon: **32×32** (exato)

**P: Como converter múltiplas imagens rapidamente?**
R: Use o **ImageMagick** (CLI):
```
magick convert input.png -resize 164x386 wizard-image.bmp
```

---

Aproveite a customização! 🎨🏋️
