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

//그룹 채팅방 생성 정보
export interface CreateGroupChatRequest {
  roomName: string;
  region: string;
  foodTypeId?: number;
  maxParticipantCount: number;
  imageKey: string;
}

export interface CreateGroupChatResponse {
    chatRoomId: number;
}

//그룹 채팅방 전체 목록 조회
export interface ChatRoomListResponse {
    hasNext: boolean;
    chatRoomList: ChatRoomListThumbnailResponse[];
}

export interface ChatRoomListThumbnailResponse {
    roomId: number;
    roomImageUrl: string;
    roomName: string;
    participantCount: number;
    maxParticipantCount: number;
    createdAt: string;
    latestMessageTime: string;
}

// 채팅방 참여 응답
export interface JoinChatRoomResponse {
    chatRoomId: number;
    isMember: boolean;
}

// presigned url 발급
export interface UrlDto {
    presignedUrl: string;
    imageKey: string;
}

//그룹 채팅방 정보 수정
export interface UpdateChatRoomRequest {
  roomName?: string;
  region?: string;
  foodTypeId?: number;
  maxParticipantCount?: number;
  imageKey?: string;
}

export interface UpdateChatRoomResponse {
  roomId: number;
}