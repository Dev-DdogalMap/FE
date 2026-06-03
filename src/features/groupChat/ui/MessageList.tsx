import MessageBubble from "./MessageBubble";
import type { ChatMessageResponse } from "@/features/groupChat/model/groupChatTypes";
import { useEffect, useRef } from "react";

interface MessageListProps {
  messages: ChatMessageResponse[];
  currentUserId: number;
}

export default function MessageList({
  messages,
  currentUserId,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, [messages]); // 메시지 추가될 때마다 스크롤 내려감

  return (
    <div className="flex flex-col p-4 overflow-y-auto">
      {messages.map((message) => (
        <MessageBubble
          key={message.chatMessageId}
          message={message}
          currentUserId={currentUserId}
        />
      ))}
      <div ref={bottomRef} /> {/* 스크롤 앵커 */}
    </div>
  );
}