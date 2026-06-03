//메세지 내용
export interface ChatMessage {
  senderId: number;
  content: string;
  sentAt: string;
  roomId: number;
  roomType: string;
  status: string;
}

//메세지 내용 목록 조회 응답
export interface ChatMessageResponse {
  chatMessageId: number;
  chatRoomId: number;
  senderId: number;
  senderNickname: string;
  senderProfileImage: string;
  senderLevel: number;
  status: string;
  content: string;
  createdAt: string;
}

//그룹 채팅방 정보
export interface ChatRoomInfoResponse {
  roomImage: string | null;
  roomName: string;
  participantCount: number;
  maxParticipantCount: number;
  category: string;
  region: string;
  members: MemberInfo[];
}

//멤버 정보
export interface MemberInfo {
  userId: number;
  userProfileImage: string | null;
}