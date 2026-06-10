import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/shared/auth/AuthContext";
import { getGroupChatMessages, getGroupChatRoomInfo } from "../api/groupChatApi";
import type {
  ChatMessageResponse,
  ChatRoomInfoResponse,
  //ChatMessageCursorResponse,
} from "../model/groupChatTypes";

export function useGroupChat2(roomId: number) {
  const { accessToken, refreshAccessToken } = useAuth();
  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [roomInfo, setRoomInfo] = useState<ChatRoomInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const nextCursorRef = useRef<number | null>(null); // 리렌더 없이 커서 관리

  useEffect(() => {
    async function loadChatData() {
      if (!roomId) return;
      try {
        const [messageData, roomInfoData] = await Promise.all([
          getGroupChatMessages(
            { roomId, size: 50, cursorId: null },
            { accessToken, refreshAccessToken }
          ),
          getGroupChatRoomInfo(roomId, { accessToken, refreshAccessToken }),
        ]);
        setMessages(messageData.messages);
        setHasNext(messageData.hasNext);
        nextCursorRef.current = messageData.nextCursor;
        setRoomInfo(roomInfoData);
      } finally {
        setLoading(false);
      }
    }
    loadChatData();
  }, [roomId]);

  async function loadMore() {
    if (!hasNext || loadingMore || nextCursorRef.current === null) return;
    setLoadingMore(true);
    try {
      const data = await getGroupChatMessages(
        { roomId, size: 50, cursorId: nextCursorRef.current },
        { accessToken, refreshAccessToken }
      );
      setMessages((prev) => [...data.messages, ...prev]); // 앞에 붙이기
      setHasNext(data.hasNext);
      nextCursorRef.current = data.nextCursor;
    } finally {
      setLoadingMore(false);
    }
  }

  return {
    roomId,
    messages,
    setMessages,
    roomInfo,
    loading,
    loadingMore,
    hasNext,
    loadMore,
  };
}