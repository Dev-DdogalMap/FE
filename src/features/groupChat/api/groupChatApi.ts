import axios from "@/shared/api/axios";

import type { ChatMessageResponse } from "../model/groupChatTypes";

// Params 객체 - 확장성
interface GetGroupChatMessagesParams {
    roomId: number;
    size?: number;
}

/**
 * 그룹 채팅 메시지 조회
 * GET /chat-rooms/{roomId}/messages
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