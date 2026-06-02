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
