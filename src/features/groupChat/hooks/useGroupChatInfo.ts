import { useEffect, useState } from "react";
import { getGroupChatRoomInfo } from "../api/groupChatApi";
import type { ChatRoomInfoResponse } from "../model/groupChatTypes";
import { useAuth } from "@/shared/auth/AuthContext";

export function useGroupChatInfo(roomId: number) {
  const { accessToken, refreshAccessToken } = useAuth();
  const [roomInfo, setRoomInfo] =
    useState<ChatRoomInfoResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRoomInfo();
  }, [roomId]);

  async function loadRoomInfo() {
    try {
      setLoading(true);

      const data = await getGroupChatRoomInfo(roomId, { accessToken, refreshAccessToken });

      setRoomInfo(data);
    } catch (err) {
      setError("그룹 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return {
    roomInfo,
    loading,
    error,
    refetch: loadRoomInfo
  };
}