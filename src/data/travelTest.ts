export type MbtiType = 
  | "ISTJ" | "ISFJ" | "INFJ" | "INTJ"
  | "ISTP" | "ISFP" | "INFP" | "INTP"
  | "ESTP" | "ESFP" | "ENFP" | "ENTP"
  | "ESTJ" | "ESFJ" | "ENFJ" | "ENTJ";

export const TEST_QUESTIONS = [
  {
    id: 1,
    question: "오랜만에 떠나는 해외여행! 비행기에 탔을 때 나는?",
    answers: [
      { text: "옆 사람과 스몰토크 시작, 여행지 꿀팁을 공유한다.", type: "E" },
      { text: "이어폰 꽂고 창밖을 보며 혼자만의 여행 감성에 젖는다.", type: "I" },
    ],
  },
  {
    id: 2,
    question: "숙소에 도착해서 짐을 풀고 난 뒤, 저녁 일정은?",
    answers: [
      { text: "게스트하우스 파티나 유명한 펍에 가서 새로운 사람들과 어울린다.", type: "E" },
      { text: "조용한 현지 식당에서 맛있는 걸 먹거나 숙소에서 쉰다.", type: "I" },
    ],
  },
  {
    id: 3,
    question: "여행 중 길을 잃어버렸다! 이때 나의 행동은?",
    answers: [
      { text: "지나가던 현지인에게 바로 말을 걸어 길을 물어본다.", type: "E" },
      { text: "구글 맵을 켜고 혼자서 어떻게든 길을 찾아본다.", type: "I" },
    ],
  },
  {
    id: 4,
    question: "여행지를 고를 때 나에게 더 중요한 것은?",
    answers: [
      { text: "맛있는 음식, 멋진 풍경, 편안한 숙소 등 오감 만족이 중요해.", type: "S" },
      { text: "이 도시가 가진 역사, 분위기, 그리고 내가 느낄 감정이 중요해.", type: "N" },
    ],
  },
  {
    id: 5,
    question: "여행지에서 기념품을 고를 때 나는?",
    answers: [
      { text: "실용적이고 예쁜 것! 당장 쓸 수 있거나 먹을 수 있는 것.", type: "S" },
      { text: "이 물건에 담긴 의미가 중요해! 나중에 추억을 떠올릴 수 있는 것.", type: "N" },
    ],
  },
  {
    id: 6,
    question: "유명한 관광지에 도착했다. 나의 감상 포인트는?",
    answers: [
      { text: "우와 엄청 크다! 색깔이 진짜 예쁘네. 사진 찍자!", type: "S" },
      { text: "옛날 사람들은 이걸 어떻게 만들었을까? 웅장함에 압도된다...", type: "N" },
    ],
  },
  {
    id: 7,
    question: "친구가 여행 중에 배탈이 났다고 한다. 나의 첫 마디는?",
    answers: [
      { text: "약국 어디 있는지 찾아볼게! 오늘 먹은 게 잘못됐나?", type: "T" },
      { text: "아이고 많이 아파? ㅠㅠ 내일 일정은 취소하고 좀 쉬자.", type: "F" },
    ],
  },
  {
    id: 8,
    question: "친구가 '나 여기 너무 와보고 싶었어!'라며 별로인 식당을 가자고 한다.",
    answers: [
      { text: "리뷰 보니까 별점 2점인데? 다른 맛집 가는 게 낫지 않아?", type: "T" },
      { text: "그래? 네가 오고 싶었다면 가보자! 맛없어도 추억이지.", type: "F" },
    ],
  },
  {
    id: 9,
    question: "여행이 끝난 후 친구들에게 여행 후기를 말할 때?",
    answers: [
      { text: "숙소는 얼마였고, 교통편은 이게 좋았고, 여기가 가성비 최고야.", type: "T" },
      { text: "거기 분위기가 진짜 미쳤어... 낭만 그 자체였어 ㅠㅠ", type: "F" },
    ],
  },
  {
    id: 10,
    question: "여행 떠나기 전날, 나의 짐 싸기 스타일은?",
    answers: [
      { text: "체크리스트를 보며 필요한 물건을 빠짐없이 챙겼는지 확인한다.", type: "J" },
      { text: "일단 캐리어 펼쳐놓고 눈에 보이는 대로 담는다. 여권만 있으면 돼!", type: "P" },
    ],
  },
  {
    id: 11,
    question: "여행 계획을 짤 때 나는?",
    answers: [
      { text: "분 단위, 동선 단위로 엑셀 정리! 예약은 미리미리.", type: "J" },
      { text: "대충 큰 틀만 잡고, 세부 일정은 가서 기분 내키는 대로!", type: "P" },
    ],
  },
  {
    id: 12,
    question: "맛집을 찾아가는 나의 방식은?",
    answers: [
      { text: "미리 검색해 둔 평점 4.5 이상의 검증된 맛집만 간다.", type: "J" },
      { text: "걷다가 분위기 좋아 보이는 곳이 있으면 즉흥적으로 들어간다.", type: "P" },
    ],
  },
];

export const TEST_RESULTS: Record<string, {
  title: string;
  desc: string;
  recommends: string[];
  color: string;
  best: string;
  worst: string;
  image: string; 
}> = {
  ISTJ: {
    title: "걸어 다니는 엑셀, 프로 계획러",
    desc: "당신의 여행에 '대충'이란 없습니다. 분 단위로 쪼개진 엑셀 계획표가 있어야 마음이 놓이는 당신! 항공권, 숙소, 맛집 예약은 물론 동선 시뮬레이션까지 완벽하게 끝내야 직성이 풀립니다. 여행지에서의 돌발 상황은 당신에게 스트레스일 뿐입니다. 남들은 피곤하다고 할지 몰라도, 당신 덕분에 동행인들은 편안하고 알찬 여행을 즐길 수 있습니다. 효율적이고 낭비 없는 여행을 추구하며, 가성비와 검증된 정보를 중요하게 생각합니다.",
    recommends: ["Germany", "Singapore", "Japan"],
    color: "from-slate-500 to-gray-600",
    best: "ESFP",
    worst: "ENFP",
    image: "/images/mbti/istj.png",
  },
  ISFJ: {
    title: "다정함 풀장착, 배려왕 수호천사",
    desc: "본인이 가고 싶은 곳보다 동행인이 좋아하는 곳을 먼저 생각하는 평화주의자입니다. '나는 아무거나 다 좋아~'라는 말을 입에 달고 살지만, 사실은 꼼꼼하게 알아보고 준비해 온 것들이 많습니다. 갈등을 싫어해서 의견 충돌이 생기면 웬만하면 양보하는 편입니다. 감성적이고 아기자기한 여행지를 선호하며, 화려한 파티보다는 소중한 사람들과 도란도란 이야기 나누는 시간을 더 사랑합니다. 짐을 쌀 때 비상약부터 밴드까지 챙기는 보부상이기도 합니다.",
    recommends: ["Taiwan", "Vietnam", "Austria"],
    color: "from-teal-400 to-emerald-500",
    best: "ESTP",
    worst: "ENTP",
    image: "/images/mbti/isfj.png",
  },
  INFJ: {
    title: "깊은 통찰력, 낭만적인 사색가",
    desc: "단순히 먹고 노는 여행보다는, 그 장소의 의미와 분위기를 깊이 느끼는 여행을 선호합니다. 사람이 너무 붐비는 유명 관광지보다는 조용하고 고즈넉한 소도시나 박물관, 미술관을 좋아합니다. 겉으로는 조용해 보이지만 머릿속으로는 끊임없이 여행지의 역사와 문화를 탐구하고 있습니다. 계획을 세우는 것을 좋아하지만, 현지에서 마주친 뜻밖의 풍경이나 감동적인 순간에 더 큰 의미를 부여하기도 합니다. 혼자만의 시간을 가질 수 있는 힐링 여행이 잘 어울립니다.",
    recommends: ["Kyoto", "Switzerland", "Iceland"],
    color: "from-violet-500 to-purple-600",
    best: "ENFP",
    worst: "ESTP",
    image: "/images/mbti/infj.png",
  },
  INTJ: {
    title: "지적 호기심 가득, 고독한 전략가",
    desc: "여행은 단순한 휴식이 아니라 지식의 확장이라고 생각합니다. 남들이 다 가는 뻔한 코스보다는 내가 관심 있는 분야를 깊게 파고드는 테마 여행을 선호합니다. 박물관, 유적지, 서점 등을 돌아다니며 지적 유희를 즐기는 것을 좋아합니다. 동선은 최적화되어 있어야 하며, 비효율적인 줄 서기나 의미 없는 쇼핑을 극도로 싫어합니다. 혼자 여행하는 것을 두려워하지 않으며, 오히려 방해받지 않고 사색할 수 있는 시간을 즐깁니다.",
    recommends: ["United Kingdom", "Italy", "Washington D.C."],
    color: "from-indigo-600 to-blue-800",
    best: "ENFP",
    worst: "ESFP",
    image: "/images/mbti/intj.png",
  },
  ISTP: {
    title: "최소 노력 최대 효율, 쿨한 탐험가",
    desc: "귀찮은 건 딱 질색! 짐은 최소한으로, 일정은 널널하게. 하지만 막상 여행지에 도착하면 누구보다 잘 적응하고 즐기는 타입입니다. 계획을 짜느라 스트레스받기보다는, 그냥 가서 부딪혀보는 것을 선호합니다. 액티비티나 체험 활동에 관심이 많으며, 남들 눈치 안 보고 내가 하고 싶은 대로 행동합니다. 감성적인 카페 투어보다는 맛있는 거 먹고 편하게 쉬는 게 최고라고 생각합니다. 돌발 상황이 발생しても '어쩔 수 없지' 하고 쿨하게 넘기는 멘탈 갑입니다.",
    recommends: ["Mongolia", "New Zealand", "Laos"],
    color: "from-blue-500 to-cyan-600",
    best: "ESFJ",
    worst: "ENFJ",
    image: "/images/mbti/istp.png",
  },
  ISFP: {
    title: "침대 밖은 위험해, 감성 집순이 여행러",
    desc: "여행지에서도 늦잠은 필수! 빡빡한 일정보다는 발길 닿는 대로 천천히 걷고, 예쁜 풍경을 눈에 담는 것을 좋아합니다. 감수성이 풍부해서 노을이 지는 하늘이나 길가에 핀 꽃만 봐도 행복해합니다. 맛집보다는 분위기 깡패인 카페를 찾아다니며 인생샷을 남기는 것이 여행의 목적입니다. 겉으로는 순둥순둥해 보이지만 은근히 호불호가 있어서, 마음에 안 드는 곳은 가기 싫어합니다. 숙소 인테리어나 뷰를 중요하게 생각하는 편입니다.",
    recommends: ["Bali", "Paris", "Jeju Island"],
    color: "from-pink-400 to-rose-400",
    best: "ESTJ",
    worst: "ENTJ",
    image: "/images/mbti/isfp.png",
  },
  INFP: {
    title: "꿈꾸는 몽상가, 낭만 수집가",
    desc: "현실을 떠나 영화 속 주인공이 된 듯한 기분을 느끼고 싶어 합니다. 남들이 다 가는 핫플레이스보다는 나만의 감성을 채울 수 있는 숨겨진 명소를 찾아다닙니다. 서점, 골동품 가게, 로컬 시장 등을 좋아하며, 여행지에서 만난 사람들과의 소소한 대화나 우연한 사건에 큰 의미를 둡니다. 계획을 세우긴 하지만 기분에 따라 언제든 바뀔 수 있습니다. 여행이 끝나고 나서도 사진과 일기를 보며 오랫동안 추억에 잠기곤 합니다.",
    recommends: ["Prague", "Portugal", "Chiang Mai"],
    color: "from-green-400 to-teal-400",
    best: "ENFJ",
    worst: "ESTJ",
    image: "/images/mbti/infp.png",
  },
  INTP: {
    title: "남들과는 다르게, 마이웨이 힙스터",
    desc: "관광객들로 붐비는 뻔한 여행지는 거들떠보지도 않습니다. '여기 한국인 없는 곳이래'라는 말에 귀가 솔깃해집니다. 혼자만의 시간을 중요하게 생각해서 패키지 여행보다는 자유 여행을 선호합니다. 유명한 랜드마크 앞에서 인증샷을 찍는 것보다, 뒷골목을 헤매다가 발견한 기이한 가게에 더 흥미를 느낍니다. 계획 없이 떠나는 것을 즐기지만, 막상 관심 있는 분야(역사, 과학, 서브컬처 등)에 대해서는 논문 수준으로 파고들기도 합니다.",
    recommends: ["Egypt", "India", "Akihabara"],
    color: "from-purple-500 to-indigo-500",
    best: "ENTJ",
    worst: "ESFJ",
    image: "/images/mbti/intp.png",
  },
  ESTP: {
    title: "스릴을 즐기는 야생마, 액티비티 중독자",
    desc: "가만히 앉아 있는 여행은 고문입니다. 스카이다이빙, 서핑, 클라이밍 등 몸을 쓰는 액티비티를 즐겨야 직성이 풀립니다. 즉흥적이고 대범해서 계획에 없던 곳으로 갑자기 떠나거나, 현지에서 처음 만난 사람들과 어울려 노는 것도 주저하지 않습니다. 맛집도 웨이팅 긴 곳보다는 눈에 보이는 로컬 식당에 들어가서 도전해보는 편입니다. 가성비보다는 지금 당장의 즐거움과 짜릿함(FLEX)을 추구합니다.",
    recommends: ["Las Vegas", "Gold Coast", "Cebu"],
    color: "from-red-500 to-orange-500",
    best: "ISFJ",
    worst: "INFJ",
    image: "/images/mbti/estp.png",
  },
  ESFP: {
    title: "흥 부자 파티 피플, 핵인싸 여행러",
    desc: "여행의 목적은 오직 즐거움! 화려한 조명, 신나는 음악, 맛있는 술이 있는 곳이라면 어디든 달려갑니다. 친화력이 좋아서 게스트하우스 파티나 클럽에서 외국인 친구를 사귀는 것도 식은 죽 먹기입니다. 예쁜 옷을 챙겨 입고 핫플레이스에서 인생샷을 건지는 것도 놓칠 수 없습니다. 계획 짜는 건 귀찮아하지만, 막상 놀 때는 누구보다 열정적입니다. 혼자 가는 여행보다는 친구들과 왁자지껄하게 떠나는 여행을 선호합니다.",
    recommends: ["Ibiza", "Bangkok", "Cancun"],
    color: "from-yellow-400 to-orange-500",
    best: "ISTJ",
    worst: "INTJ",
    image: "/images/mbti/esfp.png",
  },
  ENFP: {
    title: "세상은 넓고 친구는 많다! 긍정 에너자이저",
    desc: "매 순간이 설렘과 호기심으로 가득 차 있습니다. '가보면 어떻게든 되겠지!'라는 긍정적인 마인드로 무계획 여행을 즐깁니다. 현지인들과 스스럼없이 대화하고, 길을 잃어도 '이것도 추억이야!'라며 웃어넘깁니다. 새로운 경험을 하는 것을 좋아해서 특이한 체험이나 로컬 축제에 참여하는 것을 선호합니다. 감정 기복이 있어서 텐션이 높았다가 급격히 방전되기도 하니, 중간중간 휴식 타임이 필요합니다.",
    recommends: ["Barcelona", "Boracay", "Rio de Janeiro"],
    color: "from-orange-400 to-amber-500",
    best: "INTJ",
    worst: "ISTJ",
    image: "/images/mbti/enfp.png",
  },
  ENTP: {
    title: "무계획이 계획, 즉흥적인 모험가",
    desc: "남들이 다 가는 뻔한 코스는 거부한다! 지도 한 장 들고 발길 닿는 대로 떠나는 것을 즐깁니다. 호기심이 많고 도전 정신이 강해서 위험해 보이는 곳이나 낯선 문화도 거리낌 없이 받아들입니다. 여행지에서 생긴 돌발 상황을 게임 퀘스트처럼 즐기며, 임기응변 능력이 뛰어납니다. 동행인과 토론하는 것을 좋아해서 밤새도록 술을 마시며 이야기꽃을 피우기도 합니다. 틀에 박힌 패키지 여행은 질색입니다.",
    recommends: ["Turkey", "Morocco", "Mexico"],
    color: "from-red-600 to-rose-600",
    best: "INFJ",
    worst: "ISFJ",
    image: "/images/mbti/entp.png",
  },
  ESTJ: {
    title: "내가 바로 인간 가이드, 리더십 끝판왕",
    desc: "여행은 곧 프로젝트! 출발 전부터 완벽한 일정표와 예산안을 수립하고, 현지에서는 가이드처럼 일행을 통솔합니다. '여기서 10분 더 지체하면 다음 버스 놓쳐요'라며 시간을 칼같이 지킵니다. 맛집 검색부터 예약, 길 찾기, 총무 역할까지 도맡아 하는 든든한 리더입니다. 비효율적인 것을 못 견뎌서 우왕좌왕하는 꼴을 못 봅니다. 가끔은 너무 빡빡한 일정 때문에 동행인들이 힘들어할 수도 있으니 여유를 가지는 것이 좋습니다.",
    recommends: ["London", "New York", "Hong Kong"],
    color: "from-blue-700 to-indigo-800",
    best: "ISFP",
    worst: "INFP",
    image: "/images/mbti/estj.png",
  },
  ESFJ: {
    title: "리액션 부자, 다정다감 프로 수발러",
    desc: "나의 즐거움보다 함께 간 사람들의 행복이 더 중요합니다. 친구가 '여기 가고 싶어'라고 하면 내 취향이 아니어도 흔쾌히 같이 가줍니다. 사진도 열정적으로 찍어주고, 맛집 웨이팅도 군말 없이 함께해주는 최고의 여행 메이트입니다. 준비성이 철저해서 보조배터리, 물티슈, 간식 등을 바리바리 챙겨 다니며 일행을 챙깁니다. 하지만 상대방의 반응에 예민해서, 친구가 즐거워 보이지 않으면 눈치를 보며 시무룩해지기도 합니다.",
    recommends: ["Guam", "Da Nang", "Osaka"],
    color: "from-sky-400 to-blue-500",
    best: "ISTP",
    worst: "INTP",
    image: "/images/mbti/esfj.png",
  },
  ENFJ: {
    title: "모두가 행복해야 해, 분위기 메이커",
    desc: "여행 그룹의 정신적 지주이자 분위기 메이커입니다. 누구 하나 소외되지 않도록 세심하게 배려하며, 긍정적인 말로 일행의 기분을 북돋아 줍니다. 여행지의 문화와 사람들에게 관심이 많아서 현지인들과 깊은 대화를 나누는 것을 좋아합니다. 계획을 세울 때도 모두의 의견을 반영하려고 노력합니다. 감수성이 풍부해서 아름다운 풍경을 보면 눈물을 글썽이기도 합니다. 체력이 방전되어도 분위기를 망치지 않으려 애쓰는 편입니다.",
    recommends: ["Florence", "Hawaii", "Canada"],
    color: "from-green-500 to-emerald-600",
    best: "INFP",
    worst: "ISTP",
    image: "/images/mbti/enfj.png",
  },
  ENTJ: {
    title: "목표는 세계 정복, 야망 넘치는 여행가",
    desc: "여행도 일종의 성취라고 생각합니다. '에펠탑 앞에서 인증샷 찍기', '미슐랭 3스타 식당 가기' 등 명확한 목표를 세우고 이를 하나씩 클리어하는 데서 희열을 느낍니다. 결단력이 빠르고 추진력이 좋아서 우물쭈물하는 시간 낭비를 용납하지 않습니다. 럭셔리하고 수준 높은 서비스를 즐기는 것을 선호하며, 돈을 쓸 때는 확실하게 씁니다. 동행인이 내 계획에 잘 따라주지 않으면 답답해할 수 있습니다.",
    recommends: ["Dubai", "Shanghai", "Monaco"],
    color: "from-slate-800 to-black",
    best: "INTP",
    worst: "ISFP",
    image: "/images/mbti/entj.png",
  },
};