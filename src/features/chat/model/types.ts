export type TasteExpertSort =
  | "EXPERTISE"
  | "REVIEW_COUNT"
  | "VISIT_COUNT"
  | "RATING"
  | "RECENT";

export type ChatTabKey = "recommended" | "conversations" | "groups";

export interface TasteExpertFilters {
  keyword: string;
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
  levelName?: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  visitVerificationCount?: number;
  exp?: number;
  region: string;
  category: string;
  isCertified: boolean;
  profileImageUrl?: string;
}

export interface DirectChatRoomSummary {
  directChatRoomId: number;
  targetUserId: number;
  targetNickname: string;
  targetProfileImageUrl?: string | null;
  targetLevel?: number | null;
  targetLevelName?: string | null;
  targetSpecialty?: string | null;
  targetCertified?: boolean | null;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  unreadCount: number;
  createdAt: string;
  chatType: "DIRECT" | "GROUP";
}

export interface DirectChatMessage {
  messageId: number;
  directChatRoomId: number;
  senderId: number;
  senderNickname: string;
  status: "SENT";
  message: string;
  createdAt: string;
}

export interface DirectChatRoomEvent {
  eventType: "DIRECT_CHAT_ROOM_LEFT";
  directChatRoomId: number;
  userId: number;
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

export type ChatAuth = {
  accessToken: string | null;
  refreshAccessToken: () => Promise<string | null>;
};
