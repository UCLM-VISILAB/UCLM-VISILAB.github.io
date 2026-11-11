#!/usr/bin/env python3
"""
Generador de Códigos QR para la Audioguía ACUA
==============================================
Script independiente que genera hojas A4 con 2 tarjetas A5 rotadas distintas
por hoja (p. ej., Papel 1 con Slide 1 y 2, Papel 2 con Slide 3).

Uso:
    python3 generate_qr.py
"""

import os
import sys
from pathlib import Path
import qrcode
from PIL import Image, ImageDraw, ImageFont

# -----------------------------------------------------------------------------
# CONFIGURACIÓN Y ENLACES
# -----------------------------------------------------------------------------
LINKS = [
    {"id": "1", "label": "Parte 1",      "url": "https://uclm-visilab.github.io/#/etsii/1"},
    {"id": "2", "label": "Parte 2",      "url": "https://uclm-visilab.github.io/#/etsii/2"},
    {"id": "3", "label": "Parte 3",      "url": "https://uclm-visilab.github.io/#/etsii/3"}
]

# Paleta de Colores
DARK_BLUE = (31, 46, 69)        # #1F2E45
LIGHT_BG = (255, 255, 255)      # Blanco puro
PILL_BG = (241, 245, 249)       # #F1F5F9
CARD_BORDER = (226, 232, 240)   # #E2E8F0
MUTED_TEXT = (100, 116, 139)    # #64748B
HINT_TEXT = (148, 163, 184)     # #94A3B8
CUT_LINE_COLOR = (203, 213, 225) # #CBD5E1 (Línea de corte central)
WHITE = (255, 255, 255)

# Dimensiones en Proporción Exacta A4 (210 x 297 mm -> 840 x 1188 px)
A4_WIDTH = 840
A4_HEIGHT = 1188

CARD_WIDTH = A4_WIDTH
CARD_HEIGHT = A4_HEIGHT
QR_SIZE = 580
LOGO_SIZE = 84


def get_system_font(size: int, bold: bool = False):
    """Busca fuentes sans-serif disponibles en el sistema con fallback seguro."""
    candidate_paths = [
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
        '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf',
        '/usr/share/fonts/truetype/ubuntu/Ubuntu-B.ttf' if bold else '/usr/share/fonts/truetype/ubuntu/Ubuntu-R.ttf',
        '/System/Library/Fonts/SFCompact-Bold.otf' if bold else '/System/Library/Fonts/SFCompact-Regular.otf',
        '/Library/Fonts/Arial Bold.ttf' if bold else '/Library/Fonts/Arial.ttf',
        'C:/Windows/Fonts/arialbd.ttf' if bold else 'C:/Windows/Fonts/arial.ttf',
        'C:/Windows/Fonts/segoeuib.ttf' if bold else 'C:/Windows/Fonts/segoeui.ttf',
    ]
    for path in candidate_paths:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    return ImageFont.load_default()


def load_corner_logo(logo_path: Path, size: int = LOGO_SIZE) -> Image.Image:
    """Carga y procesa el logo con esquinas redondeadas y antialiasing."""
    if not logo_path.exists():
        return None
    try:
        raw_logo = Image.open(logo_path).convert('RGBA')
        thumb = raw_logo.resize((size, size), Image.Resampling.LANCZOS)
        
        mask = Image.new('L', (size, size), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.rounded_rectangle([0, 0, size, size], radius=16, fill=255)
        
        logo = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        logo.paste(thumb, (0, 0), mask)
        
        outline_draw = ImageDraw.Draw(logo)
        outline_draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=16, outline=(226, 232, 240, 200), width=1)
        
        return logo
    except Exception as e:
        print(f"Aviso: no se pudo cargar el logo {logo_path}: {e}")
        return None


def draw_phone_icon(size: int = 40, color: tuple = WHITE) -> Image.Image:
    """Dibuja un icono vectorial de smartphone ultra nítido con antialiasing."""
    scale = 4
    w, h = size * scale, size * scale
    icon = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(icon)
    
    pw = int(w * 0.58)
    ph = int(h * 0.90)
    px = (w - pw) // 2
    py = (h - ph) // 2
    radius = int(pw * 0.22)
    border_w = max(4, int(pw * 0.08))
    
    d.rounded_rectangle([px, py, px + pw, py + ph], radius=radius, outline=color, width=border_w)
    
    sw = pw - border_w * 3
    sh = int(ph * 0.70)
    sx = (w - sw) // 2
    sy = py + int(ph * 0.12)
    s_radius = max(2, int(radius * 0.4))
    d.rounded_rectangle([sx, sy, sx + sw, sy + sh], radius=s_radius, outline=color, width=max(2, border_w // 2))
    
    notch_w = int(pw * 0.28)
    notch_y = py + int(ph * 0.06)
    d.line([(w // 2 - notch_w // 2, notch_y), (w // 2 + notch_w // 2, notch_y)], fill=color, width=max(3, border_w // 2))
    
    bar_w = int(pw * 0.24)
    bar_y = py + ph - int(ph * 0.07)
    d.line([(w // 2 - bar_w // 2, bar_y), (w // 2 + bar_w // 2, bar_y)], fill=color, width=max(3, border_w // 2))
    
    return icon.resize((size, size), Image.Resampling.LANCZOS)


def generate_qr_image(url: str, qr_size: int = QR_SIZE, with_center_badge: bool = True) -> Image.Image:
    """Genera el código QR en azul oscuro desaturado con alta corrección de errores."""
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=16,
        border=2
    )
    qr.add_data(url)
    qr.make(fit=True)
    
    qr_img = qr.make_image(fill_color=DARK_BLUE, back_color='white').convert('RGBA')
    qr_resized = qr_img.resize((qr_size, qr_size), Image.Resampling.LANCZOS)
    
    if with_center_badge:
        badge_size = int(qr_size * 0.165)
        badge = Image.new('RGBA', (badge_size, badge_size), (0, 0, 0, 0))
        bd = ImageDraw.Draw(badge)
        bd.rounded_rectangle(
            [2, 2, badge_size - 2, badge_size - 2], 
            radius=int(badge_size * 0.25), 
            fill=WHITE, 
            outline=DARK_BLUE, 
            width=3
        )
        phone_icon = draw_phone_icon(size=int(badge_size * 0.50), color=DARK_BLUE)
        badge.paste(
            phone_icon, 
            ((badge_size - phone_icon.width) // 2, (badge_size - phone_icon.height) // 2), 
            phone_icon
        )
        qr_resized.paste(
            badge, 
            ((qr_size - badge_size) // 2, (qr_size - badge_size) // 2), 
            badge
        )
        
    return qr_resized


def generate_placard_card(slide_item: dict, logo_img: Image.Image = None) -> Image.Image:
    """Genera una tarjeta individual en proporción estándar."""
    card = Image.new('RGB', (CARD_WIDTH, CARD_HEIGHT), LIGHT_BG)
    draw = ImageDraw.Draw(card)
    
    # Borde redondeado exterior
    draw.rounded_rectangle(
        [24, 24, CARD_WIDTH - 24, CARD_HEIGHT - 24], 
        radius=36, 
        outline=CARD_BORDER, 
        width=2
    )
    
    # 1. Logo en la esquina superior derecha
    if logo_img:
        logo_x = CARD_WIDTH - 38 - logo_img.width
        logo_y = 38
        card.paste(logo_img, (logo_x, logo_y), logo_img)
    
    # 2. Cabecera
    label = slide_item.get("label")
    if label:
        font_badge = get_system_font(21, bold=True)
        bbox = draw.textbbox((0, 0), label, font=font_badge)
        bw, bh = bbox[2] - bbox[0], bbox[3] - bbox[1]
        pill_w = bw + 48
        pill_h = 40
        pill_x = (CARD_WIDTH - pill_w) // 2
        pill_y = 90
        draw.rounded_rectangle([pill_x, pill_y, pill_x + pill_w, pill_y + pill_h], radius=pill_h // 2, fill=PILL_BG)
        draw.text((pill_x + 24, pill_y + (pill_h - bh) // 2 - 2), label, fill=DARK_BLUE, font=font_badge)
        
        font_sub = get_system_font(14, bold=True)
        sub_text = 'A U D I O G U Í A   •   E T S I I'
        sbox = draw.textbbox((0, 0), sub_text, font=font_sub)
        sw = sbox[2] - sbox[0]
        draw.text(((CARD_WIDTH - sw) // 2, 146), sub_text, fill=MUTED_TEXT, font=font_sub)
    else:
        font_main = get_system_font(34, bold=True)
        main_text = 'AUDIOGUÍA'
        mbox = draw.textbbox((0, 0), main_text, font=font_main)
        mw = mbox[2] - mbox[0]
        draw.text(((CARD_WIDTH - mw) // 2, 95), main_text, fill=DARK_BLUE, font=font_main)
        
        font_sub = get_system_font(18, bold=True)
        sub_text = 'E T S I I'
        sbox = draw.textbbox((0, 0), sub_text, font=font_sub)
        sw = sbox[2] - sbox[0]
        draw.text(((CARD_WIDTH - sw) // 2, 144), sub_text, fill=MUTED_TEXT, font=font_sub)
    
    # 3. Código QR central
    qr_img = generate_qr_image(slide_item["url"], qr_size=QR_SIZE, with_center_badge=True)
    qr_x = (CARD_WIDTH - QR_SIZE) // 2
    qr_y = 215
    card.paste(qr_img, (qr_x, qr_y))
    
    # 4. Botón "Escanéame"
    btn_w = 420
    btn_h = 76
    btn_x = (CARD_WIDTH - btn_w) // 2
    btn_y = 845
    draw.rounded_rectangle([btn_x, btn_y, btn_x + btn_w, btn_y + btn_h], radius=btn_h // 2, fill=DARK_BLUE)
    
    phone_icon = draw_phone_icon(size=36, color=WHITE)
    font_btn = get_system_font(28, bold=True)
    btn_text = 'Escanéame'
    tbox = draw.textbbox((0, 0), btn_text, font=font_btn)
    tw, th = tbox[2] - tbox[0], tbox[3] - tbox[1]
    
    gap = 16
    content_w = phone_icon.width + gap + tw
    start_x = btn_x + (btn_w - content_w) // 2
    icon_y = btn_y + (btn_h - phone_icon.height) // 2
    card.paste(phone_icon, (start_x, icon_y), phone_icon)
    
    text_x = start_x + phone_icon.width + gap
    text_y = btn_y + (btn_h - th) // 2 - 2
    draw.text((text_x, text_y), btn_text, fill=WHITE, font=font_btn)
    
    # 5. Enlace textual
    font_link = get_system_font(18, bold=False)
    link_text = slide_item["url"]
    lbox = draw.textbbox((0, 0), link_text, font=font_link)
    lw = lbox[2] - lbox[0]
    draw.text(((CARD_WIDTH - lw) // 2, 955), link_text, fill=MUTED_TEXT, font=font_link)
    
    # 6. Indicación adicional
    font_hint = get_system_font(14, bold=False)
    hint_text = 'Apunta con la cámara de tu móvil para acceder al audio'
    hbox = draw.textbbox((0, 0), hint_text, font=font_hint)
    hw = hbox[2] - hbox[0]
    draw.text(((CARD_WIDTH - hw) // 2, 995), hint_text, fill=HINT_TEXT, font=font_hint)
    
    return card


def create_dual_a5_sheet(card_top: Image.Image, card_bottom: Image.Image = None, draw_cut_line: bool = True) -> Image.Image:
    """
    Escala y rota las tarjetas para colocarlas en una hoja A4 vertical
    (cada una ocupando un bloque A5 horizontal de 840 x 594 px).
    Si card_bottom es None, la mitad inferior queda en blanco.
    """
    a5_w = A4_WIDTH                  # 840 px
    a5_h = A4_HEIGHT // 2            # 594 px

    def prepare_a5(card: Image.Image) -> Image.Image:
        resized = card.resize((a5_h, a5_w), Image.Resampling.LANCZOS)
        return resized.transpose(Image.Transpose.ROTATE_90)

    sheet = Image.new('RGB', (A4_WIDTH, A4_HEIGHT), LIGHT_BG)

    if card_top is not None:
        sheet.paste(prepare_a5(card_top), (0, 0))

    if card_bottom is not None:
        sheet.paste(prepare_a5(card_bottom), (0, a5_h))

    # Línea discontinua para corte central
    if draw_cut_line:
        draw = ImageDraw.Draw(sheet)
        dash_len = 12
        space_len = 8
        y = a5_h
        for x in range(0, A4_WIDTH, dash_len + space_len):
            draw.line([(x, y), (min(x + dash_len, A4_WIDTH), y)], fill=CUT_LINE_COLOR, width=1)

    return sheet


def main():
    base_dir = Path(__file__).resolve().parent
    output_dir = base_dir / "QR"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    logo_path = base_dir / "logo.jpg"
    logo_img = load_corner_logo(logo_path)
    
    print("=" * 65)
    print("📱 Generador de Hojas de Impresión A4 (2x A5 distintos por hoja)")
    print(f"📁 Carpeta de salida: {output_dir}")
    print(f"📐 Hoja A4: {A4_WIDTH} x {A4_HEIGHT} px (Bloques A5 de {A4_WIDTH} x {A4_HEIGHT // 2} px)")
    print(f"🖼️ Logotipo en esquina: {'Encontrado (' + str(logo_path) + ')' if logo_img else 'No encontrado'}")
    print(f"🎨 Color principal: Azul Oscuro Desaturado #{DARK_BLUE[0]:02X}{DARK_BLUE[1]:02X}{DARK_BLUE[2]:02X}")
    print("=" * 65)
    
    # 1. Generar todas las tarjetas base individuales y los códigos limpios
    cards = []
    for item in LINKS:
        slide_id = item["id"]
        card = generate_placard_card(item, logo_img=logo_img)
        cards.append((item, card))
        
        # QR cuadrado limpio individual
        qr_square = generate_qr_image(item["url"], qr_size=600, with_center_badge=True)
        square_filename = f"slide_{slide_id}_qr_clean.png"
        qr_square.save(output_dir / square_filename, format="PNG", dpi=(300, 300))

    # 2. Agrupar en hojas A4 de dos en dos
    sheet_num = 1
    for i in range(0, len(cards), 2):
        top_item, top_card = cards[i]
        
        if i + 1 < len(cards):
            bottom_item, bottom_card = cards[i + 1]
            pair_name = f"slides_{top_item['id']}_and_{bottom_item['id']}"
            desc = f"Slide {top_item['id']} + Slide {bottom_item['id']}"
        else:
            bottom_card = None
            pair_name = f"slide_{top_item['id']}_only"
            desc = f"Slide {top_item['id']} (mitad inferior vacía)"
            
        sheet_filename = f"hoja_impresion_{sheet_num}_{pair_name}.png"
        sheet_path = output_dir / sheet_filename
        
        dual_sheet = create_dual_a5_sheet(top_card, bottom_card, draw_cut_line=True)
        dual_sheet.save(sheet_path, format="PNG", dpi=(300, 300))
        
        print(f"  ✓ Papel {sheet_num}: {sheet_filename} ({desc})")
        sheet_num += 1
        
    print("=" * 65)
    print(f"🎉 ¡Éxito! Hojas de impresión A4 generadas en:\n   {output_dir}")
    print("=" * 65)


if __name__ == "__main__":
    main()