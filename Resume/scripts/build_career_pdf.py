from pathlib import Path

from PIL import Image
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf" / "문동준_경력기술서_가로형.pdf"
FONT = Path("C:/Windows/Fonts/malgun.ttf")
BOLD_FONT = Path("C:/Windows/Fonts/malgunbd.ttf")

PROJECTS = [
    {
        "title": "라스트 헌터 K : 서울",
        "icon": "lasthunterk.jpg",
        "period": "2023.12 - 2026.07",
        "release": "2026년 4월 출시",
        "genre": "헌팅 액션",
        "team": "총 20명 / 클라이언트 4명",
        "overview": "Unity 기반 모바일 헌팅 액션 게임. 초기 개발부터 글로벌 출시, 라이브 유지보수까지 참여했습니다.",
        "role_name": "클라이언트 코어·시스템 개발",
        "status": "초기 개발 · 글로벌 출시 · 라이브 운영",
        "tech": "Unity · C# · Addressables · uGUI · URP · SVN · Jenkins",
        "image": ROOT / "assets" / "img" / "post" / "lastHunterK_1.jpg",
        "achievements": [
            "<b>초기 로딩 병목 개선</b><br/>서버 통신과 데이터 로드가 순차 처리되던 구조를 병렬화하여 실제 서비스 초기 로딩을 약 20초에서 5초로 단축했습니다.",
            "<b>데이터 처리 구조 최적화</b><br/>반복 탐색이 많은 List를 Dictionary로 전환하고 UniTask·Async/Await 기반으로 데이터 역직렬화를 비동기 병렬 처리하여 탐색·로드 효율을 높였습니다.",
            "<b>리소스 배포 체계 전환</b><br/>Addressables 도입과 AAB + PAD 마이그레이션을 담당하고, 로드·해제를 추적하는 관리 툴을 제작했습니다.",
            "<b>라이브 안정성 개선</b><br/>로그캣과 디버깅으로 NullReference, 리소스 및 씬 전환 크래시를 분석해 크래시 프리 유저 비율을 90%에서 98%로 개선했습니다.",
        ],
    },
    {
        "title": "데미안 전기",
        "icon": "demiansaga.jpg",
        "period": "2020.08 - 2023.12",
        "release": "2023년 4월 출시",
        "genre": "수집형 RPG",
        "team": "총 20명 / 클라이언트 4명",
        "overview": "Unity 기반 모바일 수집형 RPG. 아웃게임 시스템 전반과 일부 인게임 콘텐츠를 개발했습니다.",
        "role_name": "아웃게임 프레임워크·콘텐츠 개발",
        "status": "초기 개발 · 글로벌 출시 · 라이브 운영",
        "tech": "Unity · C# · NGUI · URP · SVN · Jenkins",
        "image": ROOT / "assets" / "img" / "post" / "demian_saga_1.jpg",
        "achievements": [
            "<b>아웃게임 구조 표준화</b><br/>UI 콘텐츠 전환, 팝업, 씬 관리를 공통 프레임워크로 설계해 콘텐츠별 화면 흐름과 상태 관리 방식을 표준화했습니다.",
            "<b>주요 콘텐츠 개발</b><br/>TCP 기반 길드 대항전과 멤버십·상점·이벤트·퀘스트·인벤토리 등 주요 콘텐츠를 구현했습니다.",
            "<b>배포 정책 변화 대응</b><br/>Google Play 정책 변경에 맞춰 APK + OBB 배포 구조를 AAB + PAD 기반으로 마이그레이션했습니다.",
            "<b>운영 효율 개선</b><br/>프리팹·몬스터 생성 내부 툴을 개발하고 Jenkins 기반 CI/CD 빌드·배포를 운영했습니다.",
        ],
    },
    {
        "title": "오버독스",
        "icon": "overdox.jpg",
        "period": "2018.09 - 2020.08",
        "release": "2019년 11월 출시",
        "genre": "MOBA",
        "team": "총 20명 / 클라이언트 3명",
        "overview": "Unity 기반 모바일 MOBA. 아웃게임 콘텐츠와 실시간 통신 기능을 개발했습니다.",
        "role_name": "클라이언트 콘텐츠 개발",
        "status": "초기 개발 · 글로벌 출시 · 라이브 운영",
        "tech": "Unity · C# · NGUI · SVN · Jenkins",
        "image": ROOT / "assets" / "img" / "post" / "overdox_1.jpg",
        "achievements": [
            "<b>인게임 프리징 완화</b><br/>Animation Event에서 호출되는 이펙트·사운드를 사전 수집·로딩(Preload)하여 동적 로드로 인한 프레임 스파이크를 완화하고 전투 쾌적성을 높였습니다.",
            "<b>TCP 기반 채팅 시스템 구현</b><br/>TCP 통신 기반 채팅 시스템을 개발하며 메시지 송수신과 연결 상태 처리 구조를 구축했습니다.",
            "<b>수익화 기능 개발</b><br/>광고 API를 연동해 보상형 광고 기능과 보상 지급 흐름을 구현했습니다.",
            "<b>라이브 콘텐츠 운영</b><br/>알림·장비·도감·출석·가챠·상점·퀘스트 등 콘텐츠를 개발하고 출시 후 유지보수를 담당했습니다.",
        ],
    },
]


def draw_cover_image(c, path, x, y, w, h):
    converted = ROOT / "tmp" / "pdfs" / f"{path.stem}_rgb.jpg"
    converted.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(path) as source:
        source.convert("RGB").save(converted, "JPEG", quality=92)
    img = ImageReader(str(converted))
    iw, ih = img.getSize()
    scale = max(w / iw, h / ih)
    sw, sh = iw * scale, ih * scale
    c.saveState()
    c.drawImage(img, x, y, w, h, preserveAspectRatio=False)
    c.setStrokeColor(HexColor("#DDE2EC"))
    c.roundRect(x, y, w, h, 8, fill=0, stroke=1)
    c.restoreState()


def paragraph(c, text, x, y_top, width, style):
    p = Paragraph(text, style)
    _, h = p.wrap(width, 1000)
    p.drawOn(c, x, y_top - h)
    return y_top - h


def bullets(c, items, x, y, width, style, dot_color):
    for item in items:
        c.setFillColor(dot_color)
        c.circle(x + 3, y - 7, 2.3, fill=1, stroke=0)
        y = paragraph(c, item, x + 14, y, width - 14, style) - 8
    return y


def build():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    pdfmetrics.registerFont(TTFont("Noto", str(FONT)))
    pdfmetrics.registerFont(TTFont("NotoBold", str(BOLD_FONT)))
    page_size = landscape(A4)
    c = Canvas(str(OUT), pagesize=page_size)
    W, H = page_size
    paper, ink, muted = HexColor("#F6F6F4"), HexColor("#111111"), HexColor("#626262")
    accent, rule = HexColor("#2387A8"), HexColor("#C8C8C4")
    body = ParagraphStyle("body", fontName="Noto", fontSize=9.4, leading=14.5, textColor=ink)
    summary_style = ParagraphStyle("summary", fontName="Noto", fontSize=10.7, leading=17, textColor=ink)
    achievement = ParagraphStyle("achievement", fontName="Noto", fontSize=9.5, leading=14.7, textColor=ink)

    def background():
        c.setFillColor(paper); c.rect(0, 0, W, H, fill=1, stroke=0)

    def page_footer(page_no):
        c.setStrokeColor(ink); c.setLineWidth(1.1); c.line(42, 40, W - 42, 40)
        c.setFont("Noto", 7.5); c.setFillColor(muted)
        c.drawString(42, 25, "문동준 · 게임 클라이언트 개발자")
        c.drawRightString(W - 42, 25, f"{page_no} / {len(PROJECTS) + 1}")

    def numbered_label(number, label, x, y):
        c.setStrokeColor(accent); c.setLineWidth(1); c.circle(x + 6, y + 4, 6, fill=0, stroke=1)
        c.setFillColor(accent); c.setFont("NotoBold", 7); c.drawCentredString(x + 6, y + 1.5, str(number))
        c.setFillColor(ink); c.setFont("NotoBold", 9); c.drawString(x + 20, y, label)

    # Profile page
    background()
    c.setFillColor(ink); c.setFont("NotoBold", 25); c.drawString(42, H - 58, "문동준")
    c.setFont("NotoBold", 10); c.drawString(42, H - 80, "게임 클라이언트 개발자")
    c.setFont("Noto", 8.5); c.setFillColor(muted)
    c.drawString(42, H - 100, "ehdwns0126@naver.com")
    c.setStrokeColor(ink); c.setLineWidth(1.4); c.line(42, H - 118, W - 42, H - 118)

    numbered_label(1, "SUMMARY", 42, H - 151)
    summary = (
        "Unity와 C#을 기반으로 모바일 게임의 초기 개발부터 글로벌 출시, 라이브 운영까지 경험했습니다.<br/>"
        "아웃게임 아키텍처, TCP 기반 실시간 콘텐츠, Addressables 리소스 관리와 멀티 스토어 빌드·배포를 담당했습니다.<br/>"
        "서비스 환경의 로딩 병목과 데이터 처리 문제를 분석하고 구조 개선으로 연결하는 데 강점이 있습니다."
    )
    paragraph(c, summary, 166, H - 145, W - 208, summary_style)

    c.setStrokeColor(rule); c.setLineWidth(.7); c.line(42, H - 224, W - 42, H - 224)
    numbered_label(2, "TECH STACK", 42, H - 257)
    stacks = [
        ("Language & Engine", "C# · Unity"),
        ("UI & Rendering", "uGUI · NGUI · URP"),
        ("Network & Data", "TCP 통신 · 직렬화/역직렬화 · 병렬 데이터 로드"),
        ("Resource", "Addressables · AAB · PAD · APK / OBB"),
        ("Build & Release", "Jenkins CI/CD · Android · iOS · Galaxy Store · 원스토어"),
        ("Collaboration", "SVN · Unity Enterprise · Unity Korea 기술 협업"),
    ]
    x0, y0 = 166, H - 254
    for i, (label, value) in enumerate(stacks):
        row, col = divmod(i, 2); x = x0 + col * 320; y = y0 - row * 70
        c.setFont("NotoBold", 9); c.setFillColor(ink); c.drawString(x, y, label)
        c.setStrokeColor(accent); c.setLineWidth(2); c.line(x, y - 8, x + 26, y - 8)
        paragraph(c, value, x, y - 18, 286, body)
    page_footer(1); c.showPage()

    # One project per page
    for page_no, p in enumerate(PROJECTS, 2):
        background()
        c.setFillColor(ink); c.setFont("NotoBold", 8.5); c.drawString(42, H - 38, "CAREER & PROJECT")
        c.setFont("NotoBold", 23); c.drawString(42, H - 70, p["title"])
        c.setFont("Noto", 9); c.setFillColor(muted); c.drawRightString(W - 42, H - 65, p["period"])
        c.setStrokeColor(ink); c.setLineWidth(1.4); c.line(42, H - 88, W - 42, H - 88)

        numbered_label(1, "PROJECT PROFILE", 42, H - 122)
        meta_x = 166
        c.setFont("NotoBold", 10); c.setFillColor(ink); c.drawString(meta_x, H - 121, f"{p['genre']}  |  {p['role_name']}")
        c.setFont("Noto", 8.7); c.setFillColor(muted); c.drawRightString(W - 42, H - 121, p["release"])
        meta_style = ParagraphStyle("meta", fontName="Noto", fontSize=8.8, leading=13, textColor=ink)
        paragraph(c, p["overview"], meta_x, H - 139, W - meta_x - 42, meta_style)
        c.setFont("NotoBold", 8.2); c.setFillColor(ink)
        c.drawString(meta_x, H - 174, "서비스 단계")
        c.setFont("Noto", 8.2); c.drawString(meta_x + 72, H - 174, p["status"])
        c.setFont("NotoBold", 8.2); c.drawString(meta_x, H - 191, "팀 구성")
        c.setFont("Noto", 8.2); c.drawString(meta_x + 72, H - 191, p["team"])
        c.setFont("NotoBold", 8.2); c.drawString(meta_x, H - 208, "사용 기술")
        c.setFont("Noto", 8.2); c.drawString(meta_x + 72, H - 208, p["tech"])

        c.setStrokeColor(rule); c.setLineWidth(.7); c.line(42, H - 232, W - 42, H - 232)
        numbered_label(2, "KEY CONTRIBUTIONS", 42, H - 264)
        y = H - 258
        for item in p["achievements"]:
            c.setFillColor(ink); c.setFont("NotoBold", 10); c.drawString(214, y - 2, "◆")
            y = paragraph(c, item, 234, y + 2, W - 276, achievement) - 17

        page_footer(page_no); c.showPage()
    c.save()
    print(OUT)


if __name__ == "__main__":
    build()
