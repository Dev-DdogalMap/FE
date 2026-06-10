import MessageBubble from "./MessageBubble";
import type { ChatMessageResponse } from "@/features/groupChat/model/groupChatTypes";
import { useEffect, useRef } from "react";

interface MessageListProps {
  messages: ChatMessageResponse[];
  currentUserId: number;
  hasNext: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
}

export default function MessageList({
  messages,
  currentUserId,
  hasNext,
  loadingMore,
  onLoadMore,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeight = useRef<number>(0);

  // 최초 진입시 맨 아래로
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, []);

  // 새 메시지 수신시 맨 아래로
  // (단, 이전 메시지 로드시엔 스크롤 유지해야 하므로 조건 분기)
  const prevMessageCount = useRef(0);
  useEffect(() => {
    const isNewMessage = messages.length === prevMessageCount.current + 1;
    if (isNewMessage) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMessageCount.current = messages.length;
  }, [messages]);

  // 이전 메시지 로드 후 스크롤 위치 유지
  useEffect(() => {
    if (loadingMore) {
      prevScrollHeight.current = containerRef.current?.scrollHeight ?? 0;
    } else {
      const newScrollHeight = containerRef.current?.scrollHeight ?? 0;
      const diff = newScrollHeight - prevScrollHeight.current;
      containerRef.current?.scrollBy({ top: diff });
    }
  }, [loadingMore]);

  // 스크롤 최상단 감지
  function handleScroll() {
    if (!containerRef.current) return;
    if (containerRef.current.scrollTop < 50 && hasNext && !loadingMore) {
      onLoadMore();
    }
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col p-4 overflow-y-auto h-full"
      onScroll={handleScroll}
    >
      {/* 로딩 스피너 */}
      {loadingMore && (
        <div className="flex justify-center py-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-orange-500" />
        </div>
      )}

      {/* 더 이상 메시지 없을 때 */}
      {!hasNext && (
        <p className="text-center text-xs text-gray-400 py-2">
          첫 번째 메시지입니다
        </p>
      )}

      <div ref={topRef} />

      {messages.map((message) => (
        <MessageBubble
          key={message.chatMessageId}
          message={message}
          currentUserId={currentUserId}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}