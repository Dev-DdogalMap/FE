import { useState } from "react";
import { createGroupChat } from "../api/groupChatApi";
import type { CreateGroupChatRequest } from "../model/groupChatTypes";
import { useAuth } from "@/shared/auth/AuthContext";

export const useCreateGroupChat = () => {
  const [loading, setLoading] = useState(false);
  const { accessToken, refreshAccessToken } = useAuth();

  const create = async (data: CreateGroupChatRequest) => {
    try {
      setLoading(true);

      const response = await createGroupChat(data, { accessToken, refreshAccessToken });

      return response;
    } finally {
      setLoading(false);
    }
  };

  return {
    create,
    loading,
  };
};