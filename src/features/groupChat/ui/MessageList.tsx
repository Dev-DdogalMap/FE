import MessageBubble from "./MessageBubble";
import type { ChatMessage } from "@/features/groupChat/model/groupChatTypes";

interface MessageListProps {
  messages: ChatMessage[];
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
          message={message}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}