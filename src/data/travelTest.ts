export type TestType = "BUDGET" | "FLEX" | "FOODIE" | "VIBE";

export const TEST_QUESTIONS = [
  {
    id: 1,
    question: "여행 계획을 짤 때 나는?",
    answers: [
      { text: "분 단위로 엑셀 정리! 계획은 생명이다.", type: "BUDGET" },
      { text: "비행기 표만 끊고 일단 출발~", type: "FLEX" },
    ],
  },
  {
    id: 2,
    question: "숙소를 고를 때 가장 중요한 건?",
    answers: [
      { text: "잠만 자면 됨! 저렴하고 위치 좋은 곳.", type: "BUDGET" },
      { text: "뷰가 예뻐야 하고 수영장 필수!", type: "VIBE" },
    ],
  },
  {
    id: 3,
    question: "여행지에서 식사는?",
    answers: [
      { text: "현지인 맛집 줄 서서라도 먹는다.", type: "FOODIE" },
      { text: "분위기 좋은 곳에서 여유롭게.", type: "FLEX" },
    ],
  },
  {
    id: 4,
    question: "이동할 때 나는?",
    answers: [
      { text: "현지 버스나 지하철로 알뜰하게!", type: "BUDGET" },
      { text: "편하게 택시나 우버 부르자.", type: "FLEX" },
    ],
  },
  {
    id: 5,
    question: "여행 중 돌발상황 발생! 비가 온다면?",
    answers: [
      { text: "실내 맛집이나 카페 투어로 변경!", type: "FOODIE" },
      { text: "호텔에서 빗소리 들으며 힐링한다.", type: "VIBE" },
    ],
  },
  {
    id: 6,
    question: "남는 건 사진뿐! 사진 촬영은?",
    answers: [
      { text: "인생샷 건질 때까지 백 장 찍는다.", type: "VIBE" },
      { text: "눈으로 담고 맛있는 거나 먹으러 가자.", type: "FOODIE" },
    ],
  },
  {
    id: 7,
    question: "마지막 날, 공금이 조금 남았다면?",
    answers: [
      { text: "면세점에서 나를 위한 선물을 산다.", type: "FLEX" },
      { text: "마지막 만찬! 비싼 거 먹으러 간다.", type: "FOODIE" },
    ],
  },
];

export const TEST_RESULTS = {
  BUDGET: {
    title: "알뜰살뜰 가성비 헌터",
    desc: "내 사전에 바가지는 없다! 최소 비용으로 최대 효율을 뽑아내는 당신은 여행계의 스마트 컨슈머입니다.",
    recommends: ["Vietnam", "Thailand", "Philippines"],
    color: "from-emerald-500 to-teal-600",
  },
  FLEX: {
    title: "여유만만 힐링 귀차니스트",
    desc: "관광지 찍고 턴? NO! 호캉스와 마사지, 택시 이동으로 편안함을 추구하는 진정한 휴식러입니다.",
    recommends: ["Guam", "United States", "Singapore"],
    color: "from-indigo-500 to-purple-600",
  },
  FOODIE: {
    title: "미식 본능 돼지런한 탐험가",
    desc: "하루 5끼는 기본! 여행의 목적은 오직 '맛'에 있다고 믿는 당신은 진정한 미식가입니다.",
    recommends: ["Japan", "Taiwan", "Hong Kong"],
    color: "from-orange-400 to-red-500",
  },
  VIBE: {
    title: "감성 충만 인스타 정복자",
    desc: "남는 건 사진뿐! 예쁜 풍경과 분위기 있는 카페를 찾아다니는 당신은 감성 여행자입니다.",
    recommends: ["France", "Spain", "Italy"],
    color: "from-pink-500 to-rose-500",
  },
};