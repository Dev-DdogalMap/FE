import { useEffect, useState } from "react";
import {
  getGroupChatMessages,
  getGroupChatRoomInfo,
} from "../api/groupChatApi";

import type {
  ChatMessageResponse,
  ChatRoomInfoResponse,
} from "../model/groupChatTypes";

export function useGroupChat(roomId: number) {
  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [roomInfo, setRoomInfo] =
    useState<ChatRoomInfoResponse | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChatData() {
      if (!roomId) return;

      try {
        const [messageData, roomInfoData] = await Promise.all([  //Promise.all = 두 API 동시 호출
          getGroupChatMessages({
            roomId,
            size: 50,
          }),
          getGroupChatRoomInfo(roomId),
        ]);

        setMessages(messageData);
        setRoomInfo(roomInfoData);
      } finally {
        setLoading(false);
      }
    }

    loadChatData();
  }, [roomId]);

  return {
    roomId,
    messages,
    setMessages,
    roomInfo,
    loading,
  };
}