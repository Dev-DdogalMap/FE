import { BadgeCheck } from "lucide-react";

import type { TasteExpert } from "@/features/chat/model/types";

interface TasteExpertCardProps {
  expert: TasteExpert;
  onChatClick: (userId: number) => void;
}

export default function TasteExpertCard({
  expert,
  onChatClick,
}: TasteExpertCardProps) {
  return (
    <article className="flex min-h-[98px] items-center gap-3 bg-white px-1 py-4">
      <div className="shrink-0">
        {expert.profileImageUrl ? (
          <img
            src={expert.profileImageUrl}
            alt={expert.nickname}
            className="h-14 w-14 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fff1ea] text-base font-bold text-[#ff4b0b]">
            {expert.nickname.slice(0, 1)}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-[15px] font-semibold text-gray-900">
            {expert.nickname}
          </p>
          {expert.isCertified && (
            <BadgeCheck className="h-4 w-4 shrink-0 fill-[#ff4b0b] text-[#ff4b0b]" />
          )}
        </div>
        <p className="mt-1 text-[13px] text-gray-500">
          Lv.{expert.tasteLevel} 맛잘알 · {expert.specialty}
        </p>
        <p className="mt-1 text-[13px] text-gray-400">
          후기 {expert.reviewCount.toLocaleString()}개
        </p>
      </div>

      <button
        type="button"
        onClick={() => onChatClick(expert.userId)}
        className="shrink-0 rounded-[10px] border border-[#ff4b0b] bg-white px-3 py-2 text-sm font-bold text-[#ff4b0b]"
      >
        채팅하기
      </button>
    </article>
  );
}
