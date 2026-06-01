import type {
  GroupChatSummary,
  TasteExpert,
} from "@/features/chat/model/types";

const avatar = (bg: string, fg: string, label: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
      <rect width="96" height="96" rx="48" fill="${bg}"/>
      <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="${fg}">${label}</text>
    </svg>`,
  )}`;

export const mockTasteExperts: TasteExpert[] = [
  {
    userId: 1,
    nickname: "미식가 김민지",
    tasteLevel: 5,
    specialty: "양식 전문",
    rating: 4.8,
    reviewCount: 1867,
    region: "성수동",
    category: "양식",
    isCertified: true,
    profileImageUrl: avatar("#FFE2D5", "#FF4B0B", "김"),
  },
  {
    userId: 2,
    nickname: "맛탐험가 이준호",
    tasteLevel: 5,
    specialty: "스테이크 전문",
    rating: 4.9,
    reviewCount: 231,
    region: "성수동",
    category: "양식",
    isCertified: true,
    profileImageUrl: avatar("#FBE7D4", "#C96A12", "이"),
  },
  {
    userId: 3,
    nickname: "양식러 박서연",
    tasteLevel: 5,
    specialty: "파스타 전문",
    rating: 4.7,
    reviewCount: 1597,
    region: "성수동",
    category: "양식",
    isCertified: true,
    profileImageUrl: avatar("#FFF1C9", "#B78200", "박"),
  },
  {
    userId: 4,
    nickname: "브런치헌터 최도윤",
    tasteLevel: 6,
    specialty: "브런치 전문",
    rating: 4.9,
    reviewCount: 843,
    region: "성수동",
    category: "양식",
    isCertified: true,
  },
  {
    userId: 5,
    nickname: "카페곁들인 정하늘",
    tasteLevel: 4,
    specialty: "디저트 전문",
    rating: 4.6,
    reviewCount: 512,
    region: "성수동",
    category: "카페",
    isCertified: false,
  },
];

export const mockGroupChats: GroupChatSummary[] = [
  {
    groupId: 101,
    name: "성수동 맛집 탐방 모임",
    category: "양식",
    region: "성수동",
    currentMembers: 10,
    maxMembers: 10,
    lastMessage: "미식가 김민지: 여기 꼭 가보세요!",
    lastMessageTime: "오후 2:10",
  },
  {
    groupId: 102,
    name: "주말 브런치 같이 먹어요",
    category: "양식",
    region: "성수동",
    currentMembers: 6,
    maxMembers: 10,
    lastMessage: "양식러 박서연: 브런치 맛집 추천해요~",
    lastMessageTime: "오전 11:24",
  },
  {
    groupId: 103,
    name: "퇴근 후 와인 한 잔",
    category: "술집",
    region: "성수동",
    currentMembers: 4,
    maxMembers: 10,
    lastMessage: "맛탐험가 이준호: 금요일 저녁 어떠세요?",
    lastMessageTime: "어제",
  },
];
