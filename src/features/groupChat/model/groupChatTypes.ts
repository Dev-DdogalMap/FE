//메세지 내용
export interface ChatMessage {
  messageId: number;
  senderId: number;
  senderName: string;
  senderLevel: number;
  senderProfileImage: string;
  content: string;
  createdAt: string;
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