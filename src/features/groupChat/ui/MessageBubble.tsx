import type { ChatMessageResponse } from "../model/groupChatTypes";

interface MessageBubbleProps {
  message: ChatMessageResponse;
  currentUserId: number;
}

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false });
};

export default function MessageBubble({
    message,
    currentUserId,
}: MessageBubbleProps) {
  const isMine = message.senderId === currentUserId;

  //내 메세지
  if (isMine) {
    return (
      <div className="flex justify-end mb-6">
        <div className="flex items-end gap-2">
          <span className="text-sm text-gray-400">
            {formatTime(message.createdAt)}
          </span>

          <div
            className="
              max-w-[240px]
              rounded-xl
              bg-[#FF6B00]
              px-4
              py-2
              text-white
              text-sm
              break-words
            "
          >
            {message.content}
          </div>
        </div>
      </div>
    );
  }

  //상대 메세지
  return (
    <div className="flex gap-3 mb-6">
      {/* 프로필 */}
      <img
        src={message.senderProfileImage}
        alt={message.senderNickname}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />

      <div>
        {/* 이름 + 레벨 */}
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-sm">
            {message.senderNickname}
          </span>

          <span className="font-bold text-orange-500 text-sm">
            Lv.{message.senderLevel}
          </span>
        </div>

        {/* 메시지 + 시간 */}
        <div className="flex items-end gap-2">
          <div
            className="
              max-w-[240px]
              rounded-xl
              bg-white
              px-4
              py-2
              shadow-sm
              break-words
            "
          >
            <p className="text-sm font-medium">
              {message.content}
            </p>
          </div>

          <span className="text-sm text-gray-400">
            {formatTime(message.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}