// RecommendedTab.tsx
import { useEffect, useState } from "react";
import type { TasteExpert, TasteExpertFilters } from "@/features/chat/model/types";
import TasteExpertList from "@/features/chat/ui/TasteExpertList";
import { getTasteExperts } from "@/features/chat/api/getTasteExperts";
import type { ChatAuth } from "@/features/chat/model/types";

interface Props {
  filters: TasteExpertFilters;
  chatAuth: ChatAuth;
  onChatClick: (userId: number) => void;
}

export default function RecommendedTab({ filters, chatAuth, onChatClick }: Props) {
  const [experts, setExperts] = useState<TasteExpert[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    void getTasteExperts(filters, chatAuth)
      .then((response) => setExperts(response.content))
      .catch((error) => {
        console.error(error);
        setExperts([]);
      })
      .finally(() => setIsLoading(false));
  }, [filters, chatAuth]);

  if (isLoading) {
    return (
      <div className="bg-white px-4 py-12 text-center text-sm text-gray-500">
        맛잘알 목록을 불러오는 중입니다.
      </div>
    );
  }

  return <TasteExpertList experts={experts} onChatClick={onChatClick} />;
}