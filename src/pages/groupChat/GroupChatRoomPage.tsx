import type { ChatMessage } from "@/features/groupChat/model/groupChatTypes";
import MessageBubble from "@/features/groupChat/ui/MessageBubble";
import MessageList from "@/features/groupChat/ui/MessageList";
import MessageInput from "@/features/groupChat/ui/MessageInput";
import ChatHeader from "@/features/groupChat/ui/ChatHeader";
import { useNavigate } from "react-router-dom";

export default function ChatRoomPage() {
  const navigate = useNavigate();

  const messages = [
    {
      messageId: 1,
      senderId: 1,
      senderName: "녹차라떼",
      senderLevel: 4,
      senderProfileImage: "/profile.png",
      content: "파스타도 꼭 드셔보세요!",
      createdAt: "13:05",
    },
    {
      messageId: 2,
      senderId: 2,
      senderName: "누렁이",
      senderLevel: 2,
      senderProfileImage: "/profile.png",
      content: "오 좋은데요",
      createdAt: "13:06",
    },
  ];

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
            <MessageList messages={messages} currentUserId={2} />
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