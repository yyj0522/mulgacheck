// src/data/survivalCards.ts

export type SurvivalCard = {
  id: string;
  category: "식당" | "교통" | "숙소" | "응급/기타";
  kor: string;
  local: string; // 현지어 (화면에 크게 보여줄 텍스트)
  pronounce: string; // 한글 발음
};

// 국가별 데이터 모음
export const SURVIVAL_DATA: Record<string, SurvivalCard[]> = {
  // 🇯🇵 일본 (도쿄, 오사카, 후쿠오카, 삿포로, 오키나와 등)
  "Japan": [
    { id: "jp-1", category: "식당", kor: "한국어 메뉴판 있나요?", local: "韓国語のメニューはありますか？", pronounce: "칸코쿠고 메뉴와 아리마스까?" },
    { id: "jp-2", category: "식당", kor: "이거 주세요", local: "これください", pronounce: "코레 쿠다사이" },
    { id: "jp-3", category: "식당", kor: "물 주세요", local: "お水ください", pronounce: "오미즈 쿠다사이" },
    { id: "jp-4", category: "식당", kor: "화장실 어디예요?", local: "トイレはどこですか？", pronounce: "토이레와 도코데스까?" },
    { id: "jp-5", category: "식당", kor: "추천해 주세요", local: "おすすめはありますか？", pronounce: "오스스메와 아리마스까?" },
    { id: "jp-6", category: "식당", kor: "계산해 주세요", local: "お会計お願いします", pronounce: "오카이케 오네가이시마스" },
    { id: "jp-7", category: "교통", kor: "여기 가주세요", local: "ここへ行ってください", pronounce: "코코에 잇떼 쿠다사이" },
    { id: "jp-8", category: "교통", kor: "얼마인가요?", local: "いくらですか？", pronounce: "이쿠라 데스까?" },
    { id: "jp-9", category: "교통", kor: "편의점이 어디예요?", local: "コンビニはどこですか？", pronounce: "콘비니와 도코데스까?" },
    { id: "jp-10", category: "숙소", kor: "체크인 할게요", local: "チェックインお願いします", pronounce: "쳇쿠인 오네가이시마스" },
    { id: "jp-11", category: "숙소", kor: "짐을 맡아주세요", local: "荷物を預かってください", pronounce: "니모츠오 아즈캇떼 쿠다사이" },
    { id: "jp-12", category: "응급/기타", kor: "도와주세요!", local: "助けてください！", pronounce: "타스케떼 쿠다사이!" },
    { id: "jp-13", category: "응급/기타", kor: "한국 대사관", local: "韓国大使館", pronounce: "칸코쿠 타이시칸" },
  ],

  // 🇻🇳 베트남 (다낭, 나트랑, 푸꾸옥, 하노이, 호치민)
  "Vietnam": [
    { id: "vn-1", category: "식당", kor: "고수 빼주세요 (필수)", local: "Đừng cho rau mùi", pronounce: "등 쪼 자우 무이" },
    { id: "vn-2", category: "식당", kor: "고수 따로 주세요", local: "Để riêng rau mùi nhé", pronounce: "데 리엥 자우 무이 녜" },
    { id: "vn-3", category: "식당", kor: "물 주세요", local: "Cho tôi nước", pronounce: "쪼 또이 느억" },
    { id: "vn-4", category: "식당", kor: "계산해 주세요", local: "Tính tiền nha", pronounce: "띵 띠엔 냐" },
    { id: "vn-5", category: "식당", kor: "화장실 어디예요?", local: "Nhà vệ sinh ở đâu?", pronounce: "냐 베 씽 어 더우?" },
    { id: "vn-6", category: "교통", kor: "여기 가주세요 (지도)", local: "Cho tôi đến địa chỉ này", pronounce: "쪼 또이 덴 디아 찌 나이" },
    { id: "vn-7", category: "응급/기타", kor: "깎아 주세요 (흥정)", local: "Bớt đi", pronounce: "벗 디" },
    { id: "vn-8", category: "응급/기타", kor: "너무 비싸요", local: "Đắt quá", pronounce: "닷 꽈" },
    { id: "vn-9", category: "숙소", kor: "체크아웃 할게요", local: "Tôi muốn trả phòng", pronounce: "또이 무온 짜 퐁" },
    { id: "vn-10", category: "응급/기타", kor: "도와주세요", local: "Cứu tôi với", pronounce: "끄우 또이 버이" },
  ],

  // 🇹🇭 태국 (방콕, 치앙마이, 푸켓)
  "Thailand": [
    { id: "th-1", category: "식당", kor: "고수 빼주세요", local: "ไม่ใส่ผักชี", pronounce: "마이 싸이 팍치" },
    { id: "th-2", category: "식당", kor: "덜 맵게 해주세요", local: "เผ็ดน้อย", pronounce: "펫 노이" },
    { id: "th-3", category: "식당", kor: "물 주세요", local: "ขอน้ำเปล่า", pronounce: "커 남 쁠라오" },
    { id: "th-4", category: "식당", kor: "계산해 주세요", local: "เก็บตังค์ด้วย", pronounce: "깹 땅 두아이" },
    { id: "th-5", category: "교통", kor: "화장실이 어디예요?", local: "ห้องน้ำอยู่ที่ไหน", pronounce: "홍남 유 티나이" },
    { id: "th-6", category: "응급/기타", kor: "깎아 주세요", local: "ลดหน่อยได้ไหม", pronounce: "롯 너이 다이 마이" },
    { id: "th-7", category: "교통", kor: "미터기 켜주세요 (택시)", local: "ช่วยกดมิเตอร์ด้วย", pronounce: "추아이 꼿 미터 두아이" },
    { id: "th-8", category: "응급/기타", kor: "감사합니다", local: "ขอบคุณครับ/ค่ะ", pronounce: "컵 쿤 크랍(카)" },
    { id: "th-9", category: "응급/기타", kor: "도와주세요", local: "ช่วยด้วย", pronounce: "추어이 두아이" },
    { id: "th-10", category: "숙소", kor: "짐 맡겨도 될까요?", local: "ฝากกระเป๋าได้ไหม", pronounce: "팍 끄라빠오 다이 마이" },
  ],

  // 🇹🇼 대만 (타이베이, 가오슝) - 중국어 번체
  "Taiwan": [
    { id: "tw-1", category: "식당", kor: "고수 빼주세요", local: "不要香菜", pronounce: "부 야오 샹차이" },
    { id: "tw-2", category: "식당", kor: "한국어 메뉴판 있나요?", local: "有韓文菜單嗎?", pronounce: "요우 한원 차이단 마?" },
    { id: "tw-3", category: "식당", kor: "물 주세요", local: "請給我水", pronounce: "칭 게이 워 슈이" },
    { id: "tw-4", category: "식당", kor: "계산해 주세요", local: "我要買單", pronounce: "워 야오 마이단" },
    { id: "tw-5", category: "식당", kor: "화장실 어디예요?", local: "洗手間在哪裡?", pronounce: "시셔우지엔 짜이 나리?" },
    { id: "tw-6", category: "교통", kor: "여기 가주세요", local: "請帶我到這裡", pronounce: "칭 따이 워 따오 쩌리" },
    { id: "tw-7", category: "교통", kor: "영수증 주세요", local: "請給我收據", pronounce: "칭 게이 워 쇼우쥐" },
    { id: "tw-8", category: "응급/기타", kor: "포장해 주세요", local: "我要外帶", pronounce: "워 야오 와이따이" },
    { id: "tw-9", category: "응급/기타", kor: "추천해 주세요", local: "請推薦一下", pronounce: "칭 투이지엔 이샤" },
    { id: "tw-10", category: "응급/기타", kor: "도와주세요", local: "請幫幫我", pronounce: "칭 빵빵 워" },
  ],

  // 🇺🇸/🇵🇭 영어권 (미국, 필리핀, 괌, 사이판, 싱가포르)
  "English": [
    { id: "en-1", category: "식당", kor: "고수 빼주세요", local: "No cilantro, please", pronounce: "노 실란트로 플리즈" },
    { id: "en-2", category: "식당", kor: "물 좀 주시겠어요?", local: "Can I have some water?", pronounce: "캔 아이 해브 썸 워터?" },
    { id: "en-3", category: "식당", kor: "추천 메뉴가 뭔가요?", local: "What do you recommend?", pronounce: "왓 두 유 레코멘드?" },
    { id: "en-4", category: "식당", kor: "계산서 주세요", local: "Check, please", pronounce: "첵 플리즈" },
    { id: "en-5", category: "식당", kor: "화장실이 어디예요?", local: "Where is the restroom?", pronounce: "웨어 이즈 더 레스트룸?" },
    { id: "en-6", category: "교통", kor: "여기 가주세요", local: "Please take me to this address", pronounce: "플리즈 테이크 미 투 디스 어드레스" },
    { id: "en-7", category: "응급/기타", kor: "깎아 주세요", local: "Can you give me a discount?", pronounce: "캔 유 기브 미 어 디스카운트?" },
    { id: "en-8", category: "응급/기타", kor: "소금 적게 넣어주세요", local: "Less salt, please", pronounce: "레스 솔트 플리즈" },
    { id: "en-9", category: "응급/기타", kor: "도와주세요!", local: "Help me!", pronounce: "헬프 미!" },
    { id: "en-10", category: "숙소", kor: "짐을 맡길 수 있나요?", local: "Can I leave my baggage?", pronounce: "캔 아이 리브 마이 배기지?" },
  ],
  
  // 🇪🇸 스페인 (바르셀로나, 마드리드)
  "Spain": [
    { id: "es-1", category: "식당", kor: "물 주세요", local: "Agua, por favor", pronounce: "아구아 뽀르 파보르" },
    { id: "es-2", category: "식당", kor: "계산서 주세요", local: "La cuenta, por favor", pronounce: "라 꾸엔따 뽀르 파보르" },
    { id: "es-3", category: "식당", kor: "화장실 어디예요?", local: "¿Dónde está el baño?", pronounce: "돈데 에스따 엘 바뇨?" },
    { id: "es-4", category: "식당", kor: "덜 짜게 해주세요", local: "Menos sal, por favor", pronounce: "메노스 살 뽀르 파보르" },
    { id: "es-5", category: "교통", kor: "여기 가주세요", local: "Lléveme aquí, por favor", pronounce: "예베메 아끼 뽀르 파보르" },
    { id: "es-6", category: "응급/기타", kor: "도와주세요", local: "Ayúdeme", pronounce: "아유데메" },
    { id: "es-7", category: "응급/기타", kor: "이거 얼마예요?", local: "¿Cuánto cuesta?", pronounce: "꾸안또 꾸에스따?" },
    { id: "es-8", category: "숙소", kor: "와이파이 비밀번호가 뭐예요?", local: "¿Cuál es la contraseña del WiFi?", pronounce: "꾸알 에스 라 꼰트라세냐 델 와이파이?" },
  ],

  // 🇫🇷 프랑스 (파리)
  "France": [
    { id: "fr-1", category: "식당", kor: "물 주세요", local: "De l'eau s'il vous plaît", pronounce: "들로 실 부 플레" },
    { id: "fr-2", category: "식당", kor: "계산서 주세요", local: "L'addition s'il vous plaît", pronounce: "라디시옹 실 부 플레" },
    { id: "fr-3", category: "식당", kor: "화장실 어디예요?", local: "Où sont les toilettes ?", pronounce: "우 쏭 레 뚜알렛?" },
    { id: "fr-4", category: "식당", kor: "영어 메뉴판 있나요?", local: "Avez-vous un menu en anglais ?", pronounce: "아베 부 엉 메뉴 엉 엉글레?" },
    { id: "fr-5", category: "교통", kor: "지하철역이 어디예요?", local: "Où est la station de métro ?", pronounce: "우 에 라 스타시옹 드 메트로?" },
    { id: "fr-6", category: "응급/기타", kor: "도와주세요", local: "Aidez-moi", pronounce: "에데 무아" },
    { id: "fr-7", category: "응급/기타", kor: "감사합니다", local: "Merci", pronounce: "메르시" },
    { id: "fr-8", category: "응급/기타", kor: "이거 주세요", local: "Je voudrais ça", pronounce: "쥬 부드레 싸" },
  ],
};

export const getSurvivalCountry = (countryName: string): string => {
  const map: Record<string, string> = {
    // 일본
    "Japan": "Japan", "Osaka": "Japan", "Tokyo": "Japan", "Fukuoka": "Japan", "Sapporo": "Japan", "Okinawa": "Japan",
    // 베트남
    "Vietnam": "Vietnam", "Da Nang": "Vietnam", "Nha Trang": "Vietnam", "Phu Quoc": "Vietnam", "Hanoi": "Vietnam", "Ho Chi Minh": "Vietnam",
    // 태국
    "Thailand": "Thailand", "Bangkok": "Thailand", "Chiang Mai": "Thailand", "Phuket": "Thailand",
    // 대만
    "Taiwan": "Taiwan", "Taipei": "Taiwan", "Kaohsiung": "Taiwan",
    // 영어권 (필리핀, 미국, 괌, 싱가포르 등)
    "Philippines": "English", "Cebu": "English", "Boracay": "English", "Manila": "English",
    "United States": "English", "Guam": "English", "Hawaii": "English", "Saipan": "English",
    "Singapore": "English", "Malaysia": "English",
    // 유럽
    "Spain": "Spain", "Barcelona": "Spain", "Madrid": "Spain",
    "France": "France", "Paris": "France", "Nice": "France",
  };

  return map[countryName] || "English"; // 없으면 기본 영어
};