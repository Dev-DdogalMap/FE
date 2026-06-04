import { useState } from "react";
import { Plus, Smile, ArrowUp } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export default function MessageInput({
  onSendMessage,
  disabled = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    onSendMessage(trimmedMessage);
    setMessage("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {  //한글 입력 시 조합 기다려야함
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-3 border-t border-gray-200 bg-white px-4 py-3 h-[70px]">
      {/* + 버튼 */}
      <button
        type="button"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50"
      >
        <Plus size={24} />
      </button>

      {/* 입력 영역 */}
      <div className="flex flex-1 items-center rounded-full border border-gray-200 bg-white px-4">
        <input
          type="text"
          value={message}
          disabled={disabled}
          placeholder="메시지 입력..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="h-10 flex-1 bg-transparent outline-none placeholder:text-gray-400"
        />

        <button
          type="button"
          className="ml-2 flex h-8 w-8 items-center justify-center"
        >
          <Smile size={24} />
        </button>
      </div>

      {/* 전송 버튼 */}
      <button
        type="button"
        disabled={disabled}
        onClick={handleSend}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FF6B00] text-white transition hover:bg-orange-600"
      >
        <ArrowUp size={22} />
      </button>
    </div>
  );
}
