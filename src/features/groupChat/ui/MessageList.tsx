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
  const containerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeight = useRef<number>(0);
  const prevMessageCount = useRef(0);
  const isInitialLoad = useRef(true);

  // 최초 진입시 맨 아래로
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, []);

  // 이전 메시지 로드 시작 전 스크롤 높이 저장
  useEffect(() => {
    if (loadingMore) {
      prevScrollHeight.current = containerRef.current?.scrollHeight ?? 0;
    }
  }, [loadingMore]);

  // messages 변경 시 처리
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const currentCount = messages.length;

    if (isInitialLoad.current) {
      // 최초 로드는 위에서 처리하므로 스킵
      isInitialLoad.current = false;
    } else if (currentCount > prevMessageCount.current + 1) {
      // 이전 메시지 로드된 경우 → 스크롤 위치 보정
      const newScrollHeight = container.scrollHeight;
      const diff = newScrollHeight - prevScrollHeight.current;
      container.scrollTop = diff;
    } else if (currentCount === prevMessageCount.current + 1) {
      // 새 메시지 수신된 경우 → 맨 아래로
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    prevMessageCount.current = currentCount;
  }, [messages]);

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
      {loadingMore && (
        <div className="flex justify-center py-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-orange-500" />
        </div>
      )}

      {!hasNext && (
        <p className="text-center text-xs text-gray-400 py-2">
          첫 번째 메시지입니다
        </p>
      )}

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