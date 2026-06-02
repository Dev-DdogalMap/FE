import MessageList from "@/features/groupChat/ui/MessageList";
import MessageInput from "@/features/groupChat/ui/MessageInput";
import ChatHeader from "@/features/groupChat/ui/ChatHeader";
import { useNavigate } from "react-router-dom";
import { useGroupChat } from "@/features/groupChat/hooks/useGroupChat";
import { useAuth } from "@/shared/auth/AuthContext";


export default function ChatRoomPage() {
  const navigate = useNavigate();
  const { messages, loading } = useGroupChat();
  const { user } = useAuth();

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <div className="relative mx-auto min-h-screen w-full max-w-[430px] bg-white">
        <div className="flex h-screen flex-col">
          <ChatHeader
            roomName="성수동 양식 맛집 탐방"
            currentCount={10}
            maxCount={10}
            thumbnailUrl="/restaurant.jpg"
            onBack={() => navigate(-1)}
            onMenuClick={() => console.log("메뉴 클릭")}
          />

          <div className="min-h-0 flex-1 overflow-y-auto bg-[#F7F7F7]">
            <MessageList messages={messages} currentUserId={user?.userId ?? -1} />
          </div>

          <MessageInput
            onSendMessage={(content) => {
              console.log(content);
            }}
          />
        </div>
      </div>
    </div>
  );
}