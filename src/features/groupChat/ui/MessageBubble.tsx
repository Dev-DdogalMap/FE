import type { ChatMessage } from "../model/groupChatTypes";

interface MessageBubbleProps {
  message: ChatMessage;
  currentUserId: number;
}

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
            {message.createdAt}
          </span>

          <div
            className="
              max-w-[240px]
              rounded-2xl
              bg-orange-500
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
        alt={message.senderName}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />

      <div>
        {/* 이름 + 레벨 */}
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-sm">
            {message.senderName}
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
              rounded-2xl
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
            {message.createdAt}
          </span>
        </div>
      </div>
    </div>
  );
}