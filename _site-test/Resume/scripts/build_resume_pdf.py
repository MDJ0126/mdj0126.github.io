from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "pdf" / "문동준_이력서.pdf"
FONT = Path("C:/Windows/Fonts/malgun.ttf")
BOLD = Path("C:/Windows/Fonts/malgunbd.ttf")


def para(c, text, x, top, width, style):
    p = Paragraph(text, style)
    _, h = p.wrap(width, 1000)
    p.drawOn(c, x, top - h)
    return top - h


def build():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    pdfmetrics.registerFont(TTFont("Noto", str(FONT)))
    pdfmetrics.registerFont(TTFont("NotoBold", str(BOLD)))
    c = Canvas(str(OUT), pagesize=A4)
    c.setTitle("문동준 이력서")
    c.setAuthor("문동준")
    c.setSubject("게임 클라이언트 개발자 국문 이력서")
    w, h = A4
    paper, ink = HexColor("#F6F6F4"), HexColor("#111111")
    muted, accent, rule = HexColor("#666666"), HexColor("#2387A8"), HexColor("#C8C8C4")
    body = ParagraphStyle("body", fontName="Noto", fontSize=8.2, leading=12.4, textColor=ink)
    small = ParagraphStyle("small", fontName="Noto", fontSize=7.5, leading=11.2, textColor=ink)
    c.setFillColor(paper); c.rect(0, 0, w, h, fill=1, stroke=0)

    # Header
    c.setFillColor(ink); c.setFont("NotoBold", 24); c.drawString(38, h - 48, "문동준")
    c.setFont("NotoBold", 10); c.drawString(38, h - 70, "게임 클라이언트 개발자")
    c.setFillColor(muted); c.setFont("Noto", 7.7); c.drawString(38, h - 90, "ehdwns0126@naver.com")
    c.setFillColor(accent); c.setFont("NotoBold", 7.7); c.drawString(182, h - 90, "GitHub")
    c.linkURL("https://github.com/MDJ0126/", (182, h - 94, 218, h - 81), relative=0)
    c.drawString(232, h - 90, "기술 블로그")
    c.linkURL("https://moondongjun.tistory.com/", (232, h - 94, 288, h - 81), relative=0)
    c.setStrokeColor(ink); c.setLineWidth(1.2); c.line(38, h - 108, w - 38, h - 108)

    # Summary and key skills
    c.setFillColor(ink); c.setFont("NotoBold", 10); c.drawString(38, h - 136, "PROFILE")
    summary = (
        "Unity와 C# 기반 모바일 게임 클라이언트 개발자로 초기 개발, 글로벌 출시, 라이브 운영을 경험했습니다. "
        "아웃게임 아키텍처와 TCP 콘텐츠, 비동기 데이터 처리, Addressables 리소스 관리 및 플랫폼별 빌드·배포를 담당했습니다."
    )
    para(c, summary, 122, h - 130, w - 160, body)
    c.setFillColor(accent); c.setFont("NotoBold", 8); c.drawString(38, h - 174, "대표 기술")
    c.setFillColor(ink); c.setFont("Noto", 8); c.drawString(92, h - 174, "Unity · C# · UniTask · Async/Await · Addressables · Jenkins")
    c.setStrokeColor(rule); c.setLineWidth(.7); c.line(38, h - 194, w - 38, h - 194)

    # Experience
    c.setFillColor(ink); c.setFont("NotoBold", 10); c.drawString(38, h - 222, "EXPERIENCE")
    x = 122
    c.setFont("NotoBold", 13); c.drawString(x, h - 222, "주식회사 해긴")
    c.setFillColor(muted); c.setFont("Noto", 7.8); c.drawRightString(w - 38, h - 220, "2018.09 - 재직 중")
    c.setFillColor(ink); c.setFont("NotoBold", 8.2); c.drawString(x, h - 242, "게임 클라이언트 개발")

    projects = [
        ("라스트 헌터 K : 서울", "2023.12 - 2026.07", [
            "서버 통신과 데이터 로드를 병렬화하여 초기 로딩 약 20초 → 5초 단축",
            "UniTask·Async/Await 기반 비동기 병렬 역직렬화와 Dictionary 전환으로 데이터 처리 효율 개선",
            "Addressables 및 AAB + PAD 적용, 크래시 프리 유저 비율 90% → 98% 개선",
        ]),
        ("데미안 전기", "2020.08 - 2023.12", [
            "UI 전환·팝업·씬 관리를 포함한 아웃게임 공통 프레임워크 설계",
            "TCP 기반 길드 대항전과 주요 아웃게임 콘텐츠 개발, Jenkins 빌드·배포 운영",
        ]),
        ("오버독스", "2018.09 - 2020.08", [
            "Animation Event 리소스 사전 로딩으로 전투 중 프레임 스파이크 완화",
            "TCP 기반 채팅 시스템과 보상형 광고 기능 개발",
        ]),
    ]
    y = h - 270
    for title, period, bullets in projects:
        c.setFillColor(ink); c.setFont("NotoBold", 9); c.drawString(x, y, title)
        c.setFillColor(muted); c.setFont("Noto", 7.2); c.drawRightString(w - 38, y, period)
        y -= 16
        for text in bullets:
            c.setFillColor(accent); c.circle(x + 3, y + 3, 1.8, fill=1, stroke=0)
            y = para(c, text, x + 13, y + 8, w - x - 51, small) - 5
        y -= 5

    c.setStrokeColor(rule); c.line(38, y + 2, w - 38, y + 2)
    y -= 24

    # Education / certifications in two columns
    c.setFillColor(ink); c.setFont("NotoBold", 10); c.drawString(38, y, "EDUCATION")
    c.drawString(310, y, "CERTIFICATIONS")
    y1 = y - 22
    education = [
        ("김포대학교", "컴퓨터공학 · 2011.02 - 2017.02"),
        ("공항고등학교", "2008.02 - 2011.02"),
    ]
    for school, meta in education:
        c.setFont("NotoBold", 8.2); c.setFillColor(ink); c.drawString(38, y1, school)
        c.setFont("Noto", 7.2); c.setFillColor(muted); c.drawString(122, y1, meta)
        y1 -= 19
    y2 = y - 22
    certs = [
        ("정보처리기사", "2025.09"),
        ("정보처리산업기사", "2015.07"),
        ("MOS 2007 Master", "2015.01"),
    ]
    for cert, date in certs:
        c.setFont("NotoBold", 8.2); c.setFillColor(ink); c.drawString(310, y2, cert)
        c.setFont("Noto", 7.2); c.setFillColor(muted); c.drawRightString(w - 38, y2, date)
        y2 -= 19

    c.setStrokeColor(ink); c.setLineWidth(1); c.line(38, 35, w - 38, 35)
    c.setFillColor(muted); c.setFont("Noto", 7); c.drawString(38, 22, "문동준 · 게임 클라이언트 개발자")
    c.drawRightString(w - 38, 22, "1 / 1")
    c.showPage(); c.save()
    print(OUT)


if __name__ == "__main__":
    build()
