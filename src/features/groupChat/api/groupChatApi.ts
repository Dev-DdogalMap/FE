import axios from "@/shared/api/axios";

import type { ChatMessageResponse, ChatRoomInfoResponse, CreateGroupChatRequest, CreateGroupChatResponse, ChatRoomListResponse } from "../model/groupChatTypes";

// Params 객체 - 확장성
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
export async function getGroupChatMessages({
    roomId,
    size,
}: GetGroupChatMessagesParams) {
    const { data } = await axios.get<ChatMessageResponse[]>(
        `/api/chat-rooms/${roomId}/messages`,
        {
            params: {
                size,
            },
        },
    );

    return data;
}

/**
 * 그룹 채팅방 정보 조회
 * GET /api/chat-rooms/{roomId}
 */
export async function getGroupChatRoomInfo(
    roomId:number) {
    const { data } = await axios.get<ChatRoomInfoResponse>(
        `/api/chat-rooms/${roomId}`
    );

    return data;
}

/**
 * 그룹 채팅방 생성
 * POST /api/chat-rooms
 */
export async function createGroupChat(
    request: CreateGroupChatRequest,
) {
    const { data } = await axios.post<CreateGroupChatResponse>(
        "/api/chat-rooms",
        request,
    );

    return data;
}

/**
 * 그룹 채팅방 전체 목록 조회
 * GET /api/chat-rooms
 */
export async function getGroupChatRoomList({
    page,
    size,
}: GetGroupChatRoomListParams) {
    const { data } = await axios.get<ChatRoomListResponse>(
        "/api/chat-rooms",
        {
            params: {
                page,
                size,
            },
        },
    );
    return data;
}