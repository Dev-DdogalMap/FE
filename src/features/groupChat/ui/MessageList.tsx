import MessageBubble from "./MessageBubble";
import type { ChatMessageResponse } from "@/features/groupChat/model/groupChatTypes";

interface MessageListProps {
  messages: ChatMessageResponse[];
  currentUserId: number;
}

export default function MessageList({
  messages,
  currentUserId,
}: MessageListProps) {

  return (
    <div className="flex flex-col p-4 overflow-y-auto">
      {messages.map((message) => (
        <MessageBubble
          key={message.chatMessageId}
          message={message}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}