import { kickChatRoomMembers, grantChatRoomOwner } from "../api/groupChatApi";
import { useAuth } from "@/shared/auth/AuthContext";

export function useKickChatRoomMembers() {
  const { accessToken, refreshAccessToken } = useAuth();
  const chatAuth = { accessToken, refreshAccessToken };

  const kick = async (roomId: number, kickedUserIds: number[]) => {
    return kickChatRoomMembers(roomId, kickedUserIds, chatAuth);
  };

  return { kick };
}

export function useGrantChatRoomOwner() {
  const { accessToken, refreshAccessToken } = useAuth();
  const chatAuth = { accessToken, refreshAccessToken };

  const grant = async (roomId: number, grantedUserIds: number[]) => {
    return grantChatRoomOwner(roomId, grantedUserIds, chatAuth);
  };

  return { grant };
}