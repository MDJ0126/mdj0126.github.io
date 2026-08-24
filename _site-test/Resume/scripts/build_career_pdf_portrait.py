from pathlib import Path

from PIL import Image, ImageDraw
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import Paragraph

from build_career_pdf import PROJECTS


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf" / "문동준_경력기술서.pdf"
FONT = Path("C:/Windows/Fonts/malgun.ttf")
BOLD = Path("C:/Windows/Fonts/malgunbd.ttf")
PROFILE = ROOT / "assets" / "img" / "picture" / "profile.png"


def draw_paragraph(c, text, x, top, width, style):
    p = Paragraph(text, style)
    _, height = p.wrap(width, 1000)
    p.drawOn(c, x, top - height)
    return top - height


def make_profile_image():
    target = ROOT / "tmp" / "pdfs" / "profile_circle.jpg"
    target.parent.mkdir(parents=True, exist_ok=True)
    size = 360
    with Image.open(PROFILE) as source:
        source = source.convert("RGB")
        side = min(source.size)
        left = (source.width - side) // 2
        top = (source.height - side) // 2
        source = source.crop((left, top, left + side, top + side)).resize((304, 304))
        canvas = Image.new("RGB", (size, size), "#F6F6F4")
        ImageDraw.Draw(canvas).ellipse((0, 0, size - 1, size - 1), fill="#2387A8")
        face = Image.new("RGB", (size, size), "#F6F6F4")
        face.paste(source, (28, 28))
        mask = Image.new("L", (size, size), 0)
        ImageDraw.Draw(mask).ellipse((28, 28, size - 28, size - 28), fill=255)
        canvas.paste(face, (0, 0), mask)
        canvas.save(target, "JPEG", quality=92)
    return target


def make_rounded_icon(path):
    target = ROOT / "tmp" / "pdfs" / f"{path.stem}_rounded.jpg"
    target.parent.mkdir(parents=True, exist_ok=True)
    size = 256
    with Image.open(path) as source:
        source = source.convert("RGB").resize((size, size))
        canvas = Image.new("RGB", (size, size), "#FFFFFF")
        mask = Image.new("L", (size, size), 0)
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, size - 1, size - 1), radius=42, fill=255)
        canvas.paste(source, (0, 0), mask)
        canvas.save(target, "JPEG", quality=94)
    return target


def build():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    pdfmetrics.registerFont(TTFont("Noto", str(FONT)))
    pdfmetrics.registerFont(TTFont("NotoBold", str(BOLD)))
    c = Canvas(str(OUT), pagesize=A4)
    c.setTitle("문동준 경력기술서")
    c.setAuthor("문동준")
    c.setSubject("게임 클라이언트 개발자 경력기술서")
    width, height = A4
    paper, ink = HexColor("#F6F6F4"), HexColor("#111111")
    muted, accent, rule = HexColor("#626262"), HexColor("#2387A8"), HexColor("#C8C8C4")
    body = ParagraphStyle("body", fontName="Noto", fontSize=8.3, leading=12.5, textColor=ink)
    small = ParagraphStyle("small", fontName="Noto", fontSize=7.7, leading=11.5, textColor=ink)
    summary = ParagraphStyle("summary", fontName="Noto", fontSize=8.8, leading=13.8, textColor=ink)

    def background():
        c.setFillColor(paper); c.rect(0, 0, width, height, fill=1, stroke=0)

    def footer(page):
        c.setStrokeColor(ink); c.setLineWidth(1); c.line(38, 35, width - 38, 35)
        c.setFillColor(muted); c.setFont("Noto", 7)
        c.drawString(38, 22, "문동준 · 게임 클라이언트 개발자")
        c.drawRightString(width - 38, 22, f"{page} / 2")

    def section_label(number, title, y):
        c.setStrokeColor(accent); c.setLineWidth(1); c.circle(44, y + 3, 6, fill=0, stroke=1)
        c.setFillColor(accent); c.setFont("NotoBold", 7); c.drawCentredString(44, y + .5, str(number))
        c.setFillColor(ink); c.setFont("NotoBold", 9); c.drawString(58, y, title)

    def project(project, top, number, compact=False, show_section=False):
        main_x = 150
        title_x = main_x + 34
        if show_section:
            c.setFillColor(ink); c.setFont("NotoBold", 8.5)
            c.drawString(38, top, "경력 & 프로젝트")
        icon_path = ROOT / "assets" / "img" / "icon" / project["icon"]
        rounded_icon = make_rounded_icon(icon_path)
        c.setFillColor(HexColor("#FFFFFF")); c.roundRect(main_x, top - 7, 26, 26, 4, fill=1, stroke=0)
        c.drawImage(ImageReader(str(rounded_icon)), main_x + 1, top - 6, 24, 24, preserveAspectRatio=False)
        c.setFillColor(ink); c.setFont("NotoBold", 15 if not compact else 13)
        c.drawString(title_x, top, project["title"])
        c.setFillColor(muted); c.setFont("Noto", 7.8)
        c.drawRightString(width - 38, top + 2, project["period"])
        c.setStrokeColor(ink); c.setLineWidth(1); c.line(main_x, top - 12, width - 38, top - 12)

        c.setFont("NotoBold", 8.3); c.setFillColor(ink)
        c.drawString(main_x, top - 34, f"{project['genre']}  |  {project['role_name']}")
        c.setFillColor(muted); c.setFont("Noto", 7.3)
        c.drawRightString(width - 38, top - 34, project["release"])
        y = draw_paragraph(c, project["overview"], main_x, top - 48, width - main_x - 38, small) - 8
        c.setFont("NotoBold", 7.5); c.setFillColor(accent); c.drawString(main_x, y, "서비스 단계")
        c.setFont("Noto", 7.5); c.setFillColor(ink); c.drawString(main_x + 56, y, project["status"])
        y -= 17
        c.setFont("NotoBold", 7.5); c.setFillColor(accent); c.drawString(main_x, y, "팀 구성")
        c.setFont("Noto", 7.5); c.setFillColor(ink); c.drawString(main_x + 56, y, project["team"])
        y -= 17
        c.setFont("NotoBold", 7.5); c.setFillColor(accent); c.drawString(main_x, y, "사용 기술")
        c.setFont("Noto", 7.5); c.setFillColor(ink); c.drawString(main_x + 56, y, project["tech"])
        y -= 23
        for item in project["achievements"][:3 if compact else 4]:
            c.setFillColor(accent); c.circle(main_x + 6, y - 3.2, 2.2, fill=1, stroke=0)
            y = draw_paragraph(c, item, main_x + 17, y + 2, width - main_x - 55, body) - (8 if compact else 10)
        return y

    # Page 1: profile + strongest/latest project
    background()
    c.setFillColor(ink); c.setFont("NotoBold", 22); c.drawString(38, height - 48, "문동준")
    c.setFont("NotoBold", 9.5); c.drawString(38, height - 68, "게임 클라이언트 개발자")
    c.setFillColor(muted); c.setFont("Noto", 7.8); c.drawString(38, height - 86, "ehdwns0126@naver.com")
    c.setFillColor(accent); c.setFont("NotoBold", 7.8)
    c.drawString(184, height - 86, "GitHub")
    c.linkURL("https://github.com/MDJ0126/", (184, height - 90, 218, height - 78), relative=0)
    c.drawString(230, height - 86, "기술 블로그")
    c.linkURL("https://moondongjun.tistory.com/", (230, height - 90, 282, height - 78), relative=0)
    c.setFillColor(accent); c.setFont("NotoBold", 7.8); c.drawString(38, height - 105, "대표 기술")
    c.setFillColor(ink); c.setFont("Noto", 7.8)
    c.drawString(86, height - 105, "Unity · C# · UniTask · Async/Await · Addressables · Jenkins")
    intro = [
        "Unity와 C# 기반 모바일 게임의 초기 개발부터 글로벌 출시, 라이브 운영까지 경험",
        "MVC·CBD 기반 아키텍처 설계와 TCP 통신·Addressables 활용",
        "Jenkins 기반 Android·iOS 및 Galaxy Store·원스토어 빌드·배포 경험",
    ]
    y = height - 130
    for i, text in enumerate(intro, 1):
        c.setStrokeColor(accent); c.circle(44, y + 3, 6, fill=0, stroke=1)
        c.setFillColor(accent); c.setFont("NotoBold", 7); c.drawCentredString(44, y + .5, str(i))
        draw_paragraph(c, text, 58, y + 8, width - 96, small)
        y -= 22
    c.setStrokeColor(ink); c.setLineWidth(1.2); c.line(38, height - 198, width - 38, height - 198)
    project(PROJECTS[0], height - 233, 1, compact=False, show_section=True)
    footer(1); c.showPage()

    # Page 2: remaining projects
    background()
    c.setFillColor(ink); c.setFont("NotoBold", 8.5); c.drawString(38, height - 36, "CAREER & PROJECT")
    c.setStrokeColor(ink); c.setLineWidth(1.2); c.line(38, height - 52, width - 38, height - 52)
    y = project(PROJECTS[1], height - 84, 1, compact=True, show_section=True)
    c.setStrokeColor(rule); c.setLineWidth(.7); c.line(38, y - 4, width - 38, y - 4)
    project(PROJECTS[2], y - 35, 2, compact=True, show_section=False)
    footer(2); c.showPage()
    c.save()
    print(OUT)


if __name__ == "__main__":
    build()
