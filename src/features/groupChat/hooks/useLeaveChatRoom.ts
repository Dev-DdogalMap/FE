import { leaveChatRoom } from "../api/groupChatApi";
import { useAuth } from "@/shared/auth/AuthContext";

export function useLeaveChatRoom() {
  const { accessToken, refreshAccessToken } = useAuth();
  const chatAuth = { accessToken, refreshAccessToken };

  const leave = async (roomId: number) => {
    return leaveChatRoom(roomId, chatAuth);
  };

  return { leave };
}