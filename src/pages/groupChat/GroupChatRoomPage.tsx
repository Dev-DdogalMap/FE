import MessageList from "@/features/groupChat/ui/MessageList";
import MessageInput from "@/features/groupChat/ui/MessageInput";
import ChatHeader from "@/features/groupChat/ui/ChatHeader";
import { useNavigate } from "react-router-dom";
import { useGroupChat } from "@/features/groupChat/hooks/useGroupChat";
import { useAuth } from "@/shared/auth/AuthContext";
import { useGroupChatSocket } from "@/features/groupChat/hooks/useGroupChatSocket";
import { useParams } from "react-router-dom";
import type { ChatMessageResponse } from "@/features/groupChat/model/groupChatTypes";


export default function ChatRoomPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();  //문자열로 반환
  const { messages, setMessages, loading } = useGroupChat(Number(roomId));  //숫자로 바꾸기
  const { user } = useAuth();
  const { sendMessage } = useGroupChatSocket(Number(roomId), (data) => {
    const newMessage: ChatMessageResponse = {
      chatMessageId: Date.now(),  // 임시 id
      chatRoomId: data.roomId,
      senderId: data.senderId,
      senderNickname: data.senderNickname ?? "",
      senderProfileImage: data.senderProfileImage ?? "",
      senderLevel: data.senderLevel,
      status: data.status,
      content: data.content,
      createdAt: data.sentAt,  // sentAt → createdAt으로 매핑
    };
    console.log("소켓 메시지:", data); // 형식 확인
    setMessages((prev) => [...prev, newMessage]); // 새 메시지 오면 목록에 추가
  });

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
            onSendMessage={sendMessage}
          />
        </div>
      </div>
    </div>
  );
}