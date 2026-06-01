import type { TasteExpert } from "@/features/chat/model/types";
import TasteExpertCard from "@/features/chat/ui/TasteExpertCard";

interface TasteExpertListProps {
  experts: TasteExpert[];
  onChatClick: (userId: number) => void;
}

export default function TasteExpertList({
  experts,
  onChatClick,
}: TasteExpertListProps) {
  if (experts.length === 0) {
    return (
      <div className="bg-white px-4 py-12 text-center text-sm text-gray-500">
        검색 조건에 맞는 맛잘알이 아직 없습니다.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 rounded-none bg-white">
      {experts.map((expert) => (
        <TasteExpertCard
          key={expert.userId}
          expert={expert}
          onChatClick={onChatClick}
        />
      ))}
    </div>
  );
}
