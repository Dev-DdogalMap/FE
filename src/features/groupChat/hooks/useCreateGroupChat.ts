import { useState } from "react";
import { createGroupChat } from "../api/groupChatApi";
import type { CreateGroupChatRequest } from "../model/groupChatTypes";

export const useCreateGroupChat = () => {
  const [loading, setLoading] = useState(false);

  const create = async (data: CreateGroupChatRequest) => {
    try {
      setLoading(true);

      const response = await createGroupChat(data);

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