from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from lxml import etree

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "tmp" / "resume_download_4107.docx"
OUT = ROOT / "assets" / "documents" / "문동준_이력서.docx"
PHOTO = ROOT / "tmp" / "resume-profile.png"
NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}


def set_text(nodes, index, value):
    nodes[index].text = value


with ZipFile(SRC) as zin:
    entries = {item.filename: zin.read(item.filename) for item in zin.infolist()}

root = etree.fromstring(entries["word/document.xml"])
texts = root.xpath(".//w:t", namespaces=NS)

values = {
    2: "문동준", 4: "MOON DONG", 5: "-", 6: "JUN", 10: "직무", 11: ":게임 클라이언트 개발", 12: "",
    13: "문동준", 15: "MOON DONG", 16: "-", 17: "JUN", 21: "직무", 22: ":게임 클라이언트 개발", 23: "",
    24: "", 25: "", 26: "", 27: "", 28: "", 29: "", 30: "", 31: "",
    32: "ehdwns0126@naver.com", 33: "   ", 34: "GitHub  github.com/MDJ0126", 35: "", 36: "기술 블로그  moondongjun.tistory.com",
    37: "", 38: "", 39: "", 40: "", 41: "", 42: "", 43: "", 44: "",
    45: "ehdwns0126@naver.com", 46: "   ", 47: "GitHub  github.com/MDJ0126", 48: "", 49: "기술 블로그  moondongjun.tistory.com",
    53: "2018.09-현재", 54: "㈜", 55: "해긴", 56: "클라이언트 개발", 57: " / ", 58: "게임개발", 59: "Unity·C#", 60: " 기반 모바일 게임", 61: ", ", 62: "글로벌 출시", 63: " 및 라이브 서비스",
    64: "대표 기술 ", 65: "CORE TECH", 66: "Unity", 67: " · ", 68: "C#", 69: "UniTask · Async/Await", 70: "비동기 처리", 71: "Addressables", 72: "리소스 관리", 73: "Jenkins CI/CD", 74: " · TCP 통신", 75: "", 76: "", 77: "", 78: "",
    79: "엔진", 80: "비동기", 81: "리소스", 82: "", 83: "자동화", 84: "통신", 85: "", 86: "", 87: "", 88: "", 89: "", 90: "",
    94: "2008.02-2011.02", 95: "공항고등학교 졸업", 96: "", 97: "",
    98: "2011.02-2017.02", 99: "김포대학교", 100: " 졸업", 101: "", 102: "컴퓨터공학",
    103: "", 104: "", 105: "", 106: "", 107: "", 108: "", 109: "", 110: "",
    122: "Unity / C#", 123: "상", 124: "", 125: "", 126: "2025.09", 127: "정보처리기사",
    128: "UniTask / Async", 129: "상", 130: "", 131: "", 132: "2015.07", 133: "정보처리산업기사",
    134: "Addressables", 135: "상", 136: "", 137: "", 138: "2015.01", 139: "MOS 2007 Master",
    140: "Jenkins / TCP", 141: "상", 142: "", 143: "", 144: "", 145: "",
    148: "", 149: "라스트 헌터 K : 서울 ", 150: "(", 151: "2023.12-2026.07", 152: "", 153: "", 154: ")",
    155: "클라이언트 코어·시스템 개발", 156: "- 초기 로딩 구조를 병렬화하여 약 20초에서 5초로 단축", 157: "- UniTask·Async/Await 기반 병렬 역직렬화 및 Dictionary 전환", 158: "- Addressables와 AAB + PAD 적용", 159: "라이브 안정성 개선", 160: "- 크래시 프리 사용자 비율 90%에서 98%로 개선", 161: "- Android·iOS 및 주요 앱 마켓 배포", 162: "- Jenkins 기반 빌드·배포 운영", 163: "",
    164: "", 165: "데미안 전기 ", 166: "(", 167: "2020.08-2023.12", 168: "", 169: "", 170: ")",
    171: "아웃게임 공통 프레임워크 설계", 172: "- UI 전환·팝업·씬 관리 구조 표준화", 173: "- TCP 기반 길드 대전 및 주요 콘텐츠 개발", 174: "- Jenkins 빌드·배포 파이프라인 운영", 175: "배포 체계 전환", 176: "- APK + OBB에서 AAB + PAD로 마이그레이션", 177: "- Android·iOS 라이브 서비스 대응", 178: "", 179: "",
    180: "", 181: "오버독스 ", 182: "(", 183: "2018.09-2020.08", 184: "", 185: "", 186: ")",
    187: "인게임 성능 및 콘텐츠 개발", 188: "- Animation Event 리소스 사전 로딩으로 순간 프리징 완화", 189: "- 동적 로드에 따른 전투 중 프레임 스파이크 개선", 190: "- TCP 기반 채팅 시스템 개발", 191: "서비스 기능 개발", 192: "- 보상형 광고 기능 개발", 193: "- 실시간 PVP MOBA 라이브 대응", 194: "", 195: "",
}
for idx, value in values.items():
    set_text(texts, idx, value)

# Remove the self-introduction portion while retaining the section properties.
body = root.find("w:body", NS)
cut = None
for i, child in enumerate(list(body)):
    content = "".join(child.xpath(".//w:t/text()", namespaces=NS))
    if "자기소개서" in content:
        cut = i
        break
if cut is not None:
    for child in list(body)[cut:]:
        if child.tag != f"{{{NS['w']}}}sectPr":
            body.remove(child)

entries["word/document.xml"] = etree.tostring(root, xml_declaration=True, encoding="UTF-8", standalone="yes")
photo = PHOTO.read_bytes()
for media in ("word/media/image1.png", "word/media/image2.png"):
    if media in entries:
        entries[media] = photo

OUT.parent.mkdir(parents=True, exist_ok=True)
with ZipFile(OUT, "w", ZIP_DEFLATED) as zout:
    for name, data in entries.items():
        zout.writestr(name, data)
print(OUT)
