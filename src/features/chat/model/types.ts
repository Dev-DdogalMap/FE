export type TasteExpertSort = "EXPERTISE" | "RATING" | "REVIEWS";

export type ChatTabKey = "recommended" | "conversations" | "groups";

export interface TasteExpertFilters {
  keyword: string;
  region: string;
  category: string;
  minLevel: number;
  sort: TasteExpertSort;
  page: number;
  size: number;
}

export interface TasteExpert {
  userId: number;
  nickname: string;
  tasteLevel: number;
  specialty: string;
  rating: number;
  reviewCount: number;
  region: string;
  category: string;
  isCertified: boolean;
  profileImageUrl?: string;
}

export interface GroupChatSummary {
  groupId: number;
  name: string;
  category: string;
  region: string;
  currentMembers: number;
  maxMembers: number;
  lastMessage: string;
  lastMessageTime: string;
  imageUrl?: string;
}

export interface TasteExpertListResponse {
  content: TasteExpert[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
