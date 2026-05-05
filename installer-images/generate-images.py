#!/usr/bin/env python3
"""
Gerador Automático de Imagens do Instalador SisBurpee
Redimensiona e converte imagens para os formatos esperados pelo Inno Setup
"""

import os
import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont, ImageFilter
except ImportError:
    print("❌ Erro: Pillow não está instalado")
    print("   Execute: pip install pillow")
    sys.exit(1)


def criar_icon_padrao(caminho_saida):
    """Cria um ícone padrão (32x32) se não existir imagem personalizada"""
    print("📦 Criando ícone padrão (32x32)...")
    
    # Criar imagem com gradiente azul
    img = Image.new('RGB', (32, 32), color=(30, 58, 138))
    
    # Adicionar um "G" para Gym
    draw = ImageDraw.Draw(img)
    # Usar fonte padrão (pode não ter disponível)
    try:
        font = ImageFont.truetype("arial.ttf", 20)
    except:
        font = ImageFont.load_default()
    
    # Desenhar "G" branco no centro
    draw.text((8, 4), "G", fill=(255, 255, 255), font=font)
    
    # Salvar como ICO
    img.save(caminho_saida, format='ICO', sizes=[(32, 32)])
    print(f"   ✅ Salvo em: {caminho_saida}")


def criar_wizard_image_padrao(caminho_saida):
    """Cria imagem de assistente padrão (164x386)"""
    print("🎨 Criando imagem do assistente (164x386)...")
    
    # Criar imagem com gradiente azul para branco (de cima para baixo)
    img = Image.new('RGB', (164, 386), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    # Criar gradiente
    for y in range(386):
        # Gradiente de azul (30, 58, 138) no topo para branco no topo
        blue = int(30 * (1 - y / 386))
        green = int(58 * (1 - y / 386))
        red = int(138 * (1 - y / 386))
        
        draw.line([(0, y), (164, y)], fill=(255 - red, 255 - green, 255 - blue))
    
    # Salvar como BMP
    img.save(caminho_saida, format='BMP')
    print(f"   ✅ Salvo em: {caminho_saida}")


def criar_small_image_padrao(caminho_saida):
    """Cria ícone pequeno padrão (55x55)"""
    print("🔷 Criando ícone pequeno (55x55)...")
    
    img = Image.new('RGB', (55, 55), color=(30, 58, 138))
    
    # Adicionar um "G" para Gym
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("arial.ttf", 30)
    except:
        font = ImageFont.load_default()
    
    # Desenhar "G" branco
    draw.text((12, 10), "G", fill=(255, 255, 255), font=font)
    
    # Salvar como BMP
    img.save(caminho_saida, format='BMP')
    print(f"   ✅ Salvo em: {caminho_saida}")


def converter_imagem(caminho_entrada, caminho_saida, tamanho, formato='BMP'):
    """Converte e redimensiona uma imagem"""
    print(f"🔄 Convertendo {Path(caminho_entrada).name}...")
    
    try:
        img = Image.open(caminho_entrada)
        
        # Redimensionar mantendo proporção
        img.thumbnail(tamanho, Image.Resampling.LANCZOS)
        
        # Criar nova imagem com tamanho exato (preenchendo espaço vazio)
        nova_img = Image.new('RGB', tamanho, color=(255, 255, 255))
        offset = ((tamanho[0] - img.width) // 2, (tamanho[1] - img.height) // 2)
        nova_img.paste(img, offset)
        
        # Salvar no formato esperado
        nova_img.save(caminho_saida, format=formato)
        print(f"   ✅ Salvo em: {caminho_saida}")
        return True
        
    except Exception as e:
        print(f"   ❌ Erro: {e}")
        return False


def main():
    """Função principal"""
    script_dir = Path(__file__).parent.absolute()
    output_dir = script_dir  # Salva na mesma pasta do script
    
    print("=" * 60)
    print("  Gerador de Imagens do Instalador Gym.Net")
    print("=" * 60)
    print()
    
    # Criar diretório se não existir
    output_dir.mkdir(exist_ok=True)
    
    icon_path = output_dir / "icon.ico"
    wizard_path = output_dir / "wizard-image.bmp"
    small_path = output_dir / "wizard-small-image.bmp"
    
    print("📂 Pasta output:", output_dir)
    print()
    
    # Verificar se há imagens personalizadas para converter
    print("🔍 Procurando imagens personalizadas...")
    
    imagens_encontradas = False
    for arquivo in output_dir.glob("*"):
        if arquivo.suffix.lower() in ['.png', '.jpg', '.jpeg'] and arquivo.name != 'PERSONALIZAR-INSTALADOR.md':
            print(f"   Encontrado: {arquivo.name}")
            imagens_encontradas = True
    
    if imagens_encontradas:
        print()
        print("⚠️  Imagens personalizadas detectadas!")
        print()
        print("Para converter suas imagens:")
        print("1. Coloque suas imagens PNG/JPG nesta pasta")
        print("2. Execute este script novamente")
        print()
        opcao = input("Deseja criar imagens padrão mesmo assim? (s/n): ").lower()
        if opcao != 's':
            return
    
    print()
    print("Criando imagens...")
    print()
    
    # Criar imagens padrão se não existirem
    if not icon_path.exists():
        criar_icon_padrao(icon_path)
    else:
        print(f"⏭️  {icon_path.name} já existe")
    
    if not wizard_path.exists():
        criar_wizard_image_padrao(wizard_path)
    else:
        print(f"⏭️  {wizard_path.name} já existe")
    
    if not small_path.exists():
        criar_small_image_padrao(small_path)
    else:
        print(f"⏭️  {small_path.name} já existe")
    
    print()
    print("=" * 60)
    print("✅ Concluído!")
    print()
    print("📝 Próximos passos:")
    print("   1. Personalize as imagens criadas (use Canva, GIMP, Photoshop)")
    print("   2. Mantenha os nomes e dimensões exatos:")
    print("      - icon.ico (32×32)")
    print("      - wizard-image.bmp (164×386)")
    print("      - wizard-small-image.bmp (55×55)")
    print("   3. Execute o build-installer.ps1 para gerar o instalador")
    print()
    print("📖 Leia PERSONALIZAR-INSTALADOR.md para mais detalhes")
    print("=" * 60)


if __name__ == "__main__":
    main()
