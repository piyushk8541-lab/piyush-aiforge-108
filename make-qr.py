import qrcode
from qrcode.constants import ERROR_CORRECT_M
from PIL import Image, ImageDraw

def make_qr(url, out, fill="#1e1b4b", box=18, border=3):
    qr = qrcode.QRCode(error_correction=ERROR_CORRECT_M, box_size=box, border=border)
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color=fill, back_color="white").convert("RGBA")
    # pad a bit more around the raw qr for the card look
    pad = int(box * 2.2)
    W, H = img.size
    card_w, card_h = W + pad * 2, H + pad * 2
    card = Image.new("RGBA", (card_w, card_h), (0, 0, 0, 0))
    d = ImageDraw.Draw(card)
    r = int(box * 1.6)
    d.rounded_rectangle([0, 0, card_w - 1, card_h - 1], radius=r, fill="white")
    card.paste(img, (pad, pad), img)
    card.save(out)
    print("saved", out, card.size)

make_qr("https://premkumar-technicians.vercel.app/", "assets/qr-prem-technicians.png", fill="#4f46e5")
make_qr("https://wa.me/919234610543", "assets/qr-whatsapp.png", fill="#0f766e")
