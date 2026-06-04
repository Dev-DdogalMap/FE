import { useNavigate } from "react-router-dom";

import CreateGroupChatForm from "@/features/groupChat/ui/CreateGroupChatForm";
import { useCreateGroupChat } from "@/features/groupChat/hooks/useCreateGroupChat";

export default function CreateGroupChatPage() {
  const navigate = useNavigate();
  const { create } = useCreateGroupChat();

  const handleSubmit = async (data: any) => {
    const response = await create(data);
    navigate(`/chat/group/room/${response.chatRoomId}`);
  };

  return (
    <CreateGroupChatForm onSubmit={handleSubmit} />
  );
}