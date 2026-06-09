import { useEffect, useState } from "react";
import { useAuth } from "@/shared/auth/AuthContext";
import { getChatRoomMembers } from "../api/groupChatApi";
import type { ChatRoomMembersResponse } from "../model/groupChatTypes";

export function useChatRoomMembers(roomId: number) {
  const { accessToken, refreshAccessToken } = useAuth();
  const [members, setMembers] = useState<ChatRoomMembersResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMembers() {
      if (!roomId) return;
      try {
        const data = await getChatRoomMembers(roomId, {
          accessToken,
          refreshAccessToken,
        });
        setMembers(data);
      } finally {
        setLoading(false);
      }
    }

    loadMembers();
  }, [roomId]);

  return {
    members,
    loading,
  };
}