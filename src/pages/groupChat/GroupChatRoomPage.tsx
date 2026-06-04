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
  //const { messages, setMessages, loading } = useGroupChat(Number(roomId));  //숫자로 바꾸기
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
  const {
    messages,
    roomInfo,
    loading,
    setMessages,
  } = useGroupChat(Number(roomId));

  function handleMenuClick() {
    navigate(`/chat/group/info/${roomId}`);
  }

  //데이터 로딩 전 화면
  if (loading || !roomInfo) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-white">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />

        <h2 className="text-lg font-semibold text-gray-800">
          채팅방 입장 중
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          잠시만 기다려 주세요
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 64px)" }}>
      <div className="flex-shrink-0">
        <ChatHeader
          roomName={roomInfo?.roomName}
          currentCount={roomInfo?.participantCount}
          maxCount={roomInfo?.maxParticipantCount}
          thumbnailUrl={roomInfo?.roomImage ?? ""}
          onBack={() => navigate(-1)}
          onMenuClick={handleMenuClick}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-[#F7F7F7]">
        <MessageList messages={messages} currentUserId={user?.userId ?? -1} />
      </div>

      <div className="flex-shrink-0">
        <MessageInput onSendMessage={sendMessage} />
      </div>
    </div>
  );
}