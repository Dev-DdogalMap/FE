// ChatPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createDirectChat } from "@/features/chat/api/getTasteExperts";
import { getFoodTypes } from "@/features/restaurant/api/restaurantApi";
import type { ChatTabKey, TasteExpertFilters } from "@/features/chat/model/types";
import ChatFilters from "@/features/chat/ui/ChatFilters";
import ChatTabs from "@/features/chat/ui/ChatTabs";
import { ROUTES } from "@/shared/constants/routes";
import { useAuth } from "@/shared/auth/AuthContext";
import RecommendedTab from "../../features/chat/ui/chatPage/RecommendedTab";
import ConversationsTab from "../../features/chat/ui/chatPage/ConversationsTab";
import GroupsTab from "../../features/chat/ui/chatPage/GroupsTab";

const defaultFilters: TasteExpertFilters = {
  keyword: "",
  category: "전체",
  minLevel: 5,
  sort: "EXPERTISE",
  page: 0,
  size: 20,
};

export default function ChatPageRefactoring() {
  const navigate = useNavigate();
  const { user, accessToken, refreshAccessToken } = useAuth();
  const chatAuth = useMemo(
    () => ({ accessToken, refreshAccessToken }),
    [accessToken, refreshAccessToken],
  );

  const [activeTab, setActiveTab] = useState<ChatTabKey>("recommended");
  const [filters, setFilters] = useState<TasteExpertFilters>(defaultFilters);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);

  useEffect(() => {
    void getFoodTypes()
      .then((foodTypes) => setCategoryOptions(foodTypes.map((f) => f.type)))
      .catch((error) => {
        console.error(error);
        setCategoryOptions([]);
      });
  }, []);

  const handleCreateDirectChat = async (userId: number) => {
    try {
      const room = await createDirectChat(userId, chatAuth);
      navigate(ROUTES.directChat(room.directChatRoomId));
    } catch (error) {
      console.error(error);
      alert("채팅방 생성에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px-64px)] bg-[#fafafa] px-4 pb-24 pt-4">
      <div className="space-y-4">
        <ChatFilters
          keyword={filters.keyword}
          category={filters.category}
          categoryOptions={categoryOptions}
          minLevel={filters.minLevel}
          onKeywordChange={(value) =>
            setFilters((prev) => ({ ...prev, keyword: value, page: 0 }))
          }
          onCategoryChange={(value) =>
            setFilters((prev) => ({ ...prev, category: value, page: 0 }))
          }
          onMinLevelChange={(value) =>
            setFilters((prev) => ({ ...prev, minLevel: value, page: 0 }))
          }
        />

        <div className="bg-white">
          <ChatTabs activeTab={activeTab} onChange={setActiveTab} />

          <div className="py-3">
            {activeTab === "recommended" && (
              <>
                <div className="flex items-center justify-between px-1 pb-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">추천 맛잘알</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {filters.category} · 레벨 {filters.minLevel} 이상 기준
                    </p>
                  </div>
                  <p className="text-xs font-medium text-gray-400">
                    {filters.sort === "EXPERTISE" ? "전문성순" : filters.sort}
                  </p>
                </div>
                <RecommendedTab
                  filters={filters}
                  chatAuth={chatAuth}
                  onChatClick={handleCreateDirectChat}
                />
              </>
            )}

            {activeTab === "conversations" && (
              <ConversationsTab
                chatAuth={chatAuth}
                currentUserId={user?.userId}
              />
            )}

            {activeTab === "groups" && (
              <GroupsTab chatAuth={chatAuth} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}