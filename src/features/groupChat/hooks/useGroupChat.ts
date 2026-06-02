import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getGroupChatMessages } from "../api/groupChatApi";
import type { ChatMessageResponse } from "../model/groupChatTypes";

export function useGroupChat() {
  const { roomId } = useParams();

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
    loading,
  };
}