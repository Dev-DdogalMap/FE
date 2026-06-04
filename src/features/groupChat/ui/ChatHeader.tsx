import { ChevronLeft, SlidersHorizontal } from "lucide-react";

interface ChatHeaderProps {
  roomName: string;
  currentCount: number;
  maxCount: number;
  thumbnailUrl: string;
  onBack?: () => void;
  onMenuClick?: () => void;
}

export default function ChatHeader({
  roomName,
  currentCount,
  maxCount,
  thumbnailUrl,
  onBack,
  onMenuClick,
}: ChatHeaderProps) {
  return (
    <header
      className="
        sticky
        top-0
        z-10
        flex
        items-center
        justify-between
        h-16
        px-4
        bg-white
        border-b
        border-gray-200
      "
    >
      {/* 왼쪽 영역 */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onBack}
          className="flex-shrink-0"
        >
          <ChevronLeft size={24} />
        </button>

        <img
          src={thumbnailUrl}
          alt={roomName}
          className="w-10 h-10 rounded-full object-cover"
        />

        <div className="flex items-center gap-2 min-w-0">
          <h1
            className="
              font-semibold
              text-base
              truncate
            "
          >
            {roomName}
          </h1>

          <span
            className="
              px-2
              py-0.5
              rounded-full
              text-xs
              font-semibold
              bg-orange-100
              text-orange-500
              whitespace-nowrap
            "
          >
            {currentCount}/{maxCount}
          </span>
        </div>
      </div>

      {/* 오른쪽 메뉴 */}
      <button
        onClick={onMenuClick}
        className="flex-shrink-0"
      >
        <SlidersHorizontal size={22} />
      </button>
    </header>
  );
}