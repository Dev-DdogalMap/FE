import { useEffect, useState } from "react";
import { getGroupChatMessages } from "../api/groupChatApi";
import type { ChatMessageResponse } from "../model/groupChatTypes";

export function useGroupChat(roomId: number) {
  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMessages() {
      if (!roomId) return;

      try {
        const data = await getGroupChatMessages({
          roomId: Number(roomId),
          size: 50,
        });

        setMessages(data);
      } finally {
        setLoading(false);
      }
    }

    loadMessages();
  }, [roomId]);

  return {
    roomId: Number(roomId),
    messages,
    setMessages,
    loading,
  };
}