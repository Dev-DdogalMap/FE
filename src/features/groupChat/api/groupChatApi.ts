import { authFetch } from "@/shared/api/authFetch"; // 경로 맞게 수정
import type {
  ChatMessageResponse,
  ChatRoomInfoResponse,
  CreateGroupChatRequest,
  CreateGroupChatResponse,
  ChatRoomListResponse,
  JoinChatRoomResponse,
  UrlDto,
  UpdateChatRoomRequest,
  UpdateChatRoomResponse
} from "../model/groupChatTypes";

interface AuthParams {
  accessToken: string | null;
  refreshAccessToken: () => Promise<string | null>;
}

interface GetGroupChatMessagesParams {
  roomId: number;
  size?: number;
}

interface GetGroupChatRoomListParams {
  page?: number;
  size?: number;
}

/**
 * 그룹 채팅 메시지 조회
 * GET /api/chat-rooms/{roomId}/messages
 */
export async function getGroupChatMessages(
  { roomId, size }: GetGroupChatMessagesParams,
  { accessToken, refreshAccessToken }: AuthParams,
) {
  const response = await authFetch({
    path: `/api/chat-rooms/${roomId}/messages${size ? `?size=${size}` : ""}`,
    accessToken,
    refreshAccessToken,
  });
  return response.json() as Promise<ChatMessageResponse[]>;
}

/**
 * 그룹 채팅방 정보 조회
 * GET /api/chat-rooms/{roomId}
 */
export async function getGroupChatRoomInfo(
  roomId: number,
  { accessToken, refreshAccessToken }: AuthParams,
) {
  const response = await authFetch({
    path: `/api/chat-rooms/${roomId}`,
    accessToken,
    refreshAccessToken,
  });
  return response.json() as Promise<ChatRoomInfoResponse>;
}

/**
 * 그룹 채팅방 생성
 * POST /api/chat-rooms
 */
export async function createGroupChat(
  request: CreateGroupChatRequest,
  { accessToken, refreshAccessToken }: AuthParams,
) {
  const response = await authFetch({
    path: "/api/chat-rooms",
    accessToken,
    refreshAccessToken,
    options: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    },
  });
  return response.json() as Promise<CreateGroupChatResponse>;
}

/**
 * 그룹 채팅방 전체 목록 조회
 * GET /api/chat-rooms
 */
export async function getGroupChatRoomList(
  { page, size }: GetGroupChatRoomListParams,
  { accessToken, refreshAccessToken }: AuthParams,
) {
  const params = new URLSearchParams();
  if (page !== undefined) params.set("page", String(page));
  if (size !== undefined) params.set("size", String(size));

  const response = await authFetch({
    path: `/api/chat-rooms?${params.toString()}`,
    accessToken,
    refreshAccessToken,
  });
  return response.json() as Promise<ChatRoomListResponse>;
}

/**
 * 채팅방 참여
 * POST /api/chat-rooms/{roomId}/join
 */
export async function joinChatRoom(
  roomId: number,
  { accessToken, refreshAccessToken }: AuthParams,
) {
  const response = await authFetch({
    path: `/api/chat-rooms/${roomId}/join`,
    accessToken,
    refreshAccessToken,
    options: {
      method: "POST",
    },
  });
  return response.json() as Promise<JoinChatRoomResponse>;
}

/**
 * presigned url 발급
 * GET /api/chat-rooms/presigned-url
 */
export async function getPresignedUrl(
  imageFileName: string,
  { accessToken, refreshAccessToken }: AuthParams,
) {
  const response = await authFetch({
    path: `/api/chat-rooms/presigned-url?imageFileName=${encodeURIComponent(imageFileName)}`,
    accessToken,
    refreshAccessToken,
  });
  return response.json() as Promise<UrlDto>;
}

/**
 * 그룹 채팅방 수정
 * PATCH /api/chat-rooms/{roomId}
 */
export async function updateGroupChatRoom(
  roomId: number,
  request: UpdateChatRoomRequest,
  { accessToken, refreshAccessToken }: AuthParams,
) {
  const response = await authFetch({
    path: `/api/chat-rooms/${roomId}`,
    accessToken,
    refreshAccessToken,
    options: {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    },
  });
  return response.json() as Promise<UpdateChatRoomResponse>;
}