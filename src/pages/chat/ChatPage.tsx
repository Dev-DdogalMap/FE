import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  MessageSquareMore,
} from "lucide-react";

import {
  createDirectChat,
  getDirectChats,
  getTasteExperts,
} from "@/features/chat/api/getTasteExperts";
import { getGroupChatRoomList } from "@/features/groupChat/api/groupChatApi"; // 경로 맞게 수정

import type {
  ChatTabKey,
  DirectChatRoomSummary,
  TasteExpert,
  TasteExpertFilters,
} from "@/features/chat/model/types";
import type {
  ChatRoomListThumbnailResponse,
} from "@/features/groupChat/model/groupChatTypes"; // 경로 맞게 수정
import ChatFilters from "@/features/chat/ui/ChatFilters";
import ChatTabs from "@/features/chat/ui/ChatTabs";
import TasteExpertList from "@/features/chat/ui/TasteExpertList";
import { ROUTES } from "@/shared/constants/routes";

const defaultFilters: TasteExpertFilters = {
  keyword: "",
  region: "성수동",
  category: "양식",
  minLevel: 5,
  sort: "EXPERTISE",
  page: 0,
  size: 20,
};

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (diffDays === 1) {
    return "어제";
  } else {
    return `${diffDays}일 전`;
  }
}

export default function ChatPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ChatTabKey>("recommended");
  const [filters, setFilters] = useState<TasteExpertFilters>(defaultFilters);
  const [experts, setExperts] = useState<TasteExpert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<DirectChatRoomSummary[]>([]);
  const [isConversationLoading, setIsConversationLoading] = useState(false);

  // 그룹 채팅 상태
  const [groupChats, setGroupChats] = useState<ChatRoomListThumbnailResponse[]>([]);
  const [isGroupLoading, setIsGroupLoading] = useState(false);
  const [groupPage, setGroupPage] = useState(0);
  const [hasNextGroup, setHasNextGroup] = useState(false);

  useEffect(() => {
    if (activeTab !== "recommended") return;
    setIsLoading(true);
    void getTasteExperts(filters)
      .then((response) => setExperts(response.content))
      .catch((error) => {
        console.error(error);
        setExperts([]);
      })
      .finally(() => setIsLoading(false));
  }, [activeTab, filters]);

  useEffect(() => {
    if (activeTab !== "conversations") return;
    setIsConversationLoading(true);
    void getDirectChats()
      .then((response) => setConversations(response))
      .catch((error) => {
        console.error(error);
        setConversations([]);
      })
      .finally(() => setIsConversationLoading(false));
  }, [activeTab]);

  // 그룹 채팅 탭 진입 시 초기 조회
  useEffect(() => {
    if (activeTab !== "groups") return;
    setIsGroupLoading(true);
    setGroupPage(0);
    void getGroupChatRoomList({ page: 0, size: 20 })
      .then((response) => {
        setGroupChats(response.chatRoomList);
        setHasNextGroup(response.hasNext);
      })
      .catch(() => setGroupChats([]))
      .finally(() => setIsGroupLoading(false));
  }, [activeTab]);

  // 무한스크롤 - 다음 페이지 로드
  const handleLoadMore = () => {
    const nextPage = groupPage + 1;
    setGroupPage(nextPage);
    void getGroupChatRoomList({ page: nextPage, size: 20 })
      .then((response) => {
        setGroupChats((prev) => [...prev, ...response.chatRoomList]);
        setHasNextGroup(response.hasNext);
      })
      .catch(console.error);
  };

  const handleTabChange = (tab: ChatTabKey) => {
    setActiveTab(tab);
  };

  const handleCreateDirectChat = async (userId: number) => {
    try {
      const room = await createDirectChat(userId);
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
          region={filters.region}
          category={filters.category}
          minLevel={filters.minLevel}
          onKeywordChange={(value) => setFilters((prev) => ({ ...prev, keyword: value, page: 0 }))}
          onRegionChange={(value) => setFilters((prev) => ({ ...prev, region: value, page: 0 }))}
          onCategoryChange={(value) => setFilters((prev) => ({ ...prev, category: value, page: 0 }))}
          onMinLevelChange={(value) => setFilters((prev) => ({ ...prev, minLevel: value, page: 0 }))}
        />

        <div className="bg-white">
          <ChatTabs activeTab={activeTab} onChange={handleTabChange} />

          <div className="py-3">
            {activeTab === "recommended" && (
              <>
                <div className="flex items-center justify-between px-1 pb-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">추천 맛잘알</p>
                    <p className="mt-1 text-xs text-gray-500">
                      성수동 · 양식 · 레벨 {filters.minLevel} 이상 기준
                    </p>
                  </div>
                  <p className="text-xs font-medium text-gray-400">
                    {filters.sort === "EXPERTISE" ? "전문성순" : filters.sort}
                  </p>
                </div>
                {isLoading ? (
                  <div className="bg-white px-4 py-12 text-center text-sm text-gray-500">
                    맛잘알 목록을 불러오는 중입니다.
                  </div>
                ) : (
                  <TasteExpertList experts={experts} onChatClick={handleCreateDirectChat} />
                )}
              </>
            )}

            {activeTab === "conversations" && (
              <div className="space-y-3 px-1">
                {isConversationLoading ? (
                  <div className="bg-white px-4 py-12 text-center text-sm text-gray-500">
                    대화 목록을 불러오는 중입니다.
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="bg-white px-4 py-12 text-center text-sm text-gray-500">
                    아직 시작한 대화가 없습니다.
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <button
                      key={conversation.directChatRoomId}
                      type="button"
                      onClick={() => navigate(ROUTES.directChat(conversation.directChatRoomId))}
                      className="flex w-full items-center gap-3 rounded-3xl border border-gray-200 bg-[#fffaf7] px-4 py-4 text-left"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#ff4b0b] shadow-sm">
                        {conversation.targetProfileImageUrl ? (
                          <img
                            src={conversation.targetProfileImageUrl}
                            alt={conversation.targetNickname}
                            className="h-12 w-12 rounded-2xl object-cover"
                          />
                        ) : (
                          <MessageSquareMore className="h-5 w-5" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {conversation.targetNickname}
                        </p>
                        <p className="mt-1 truncate text-sm text-gray-500">
                          {conversation.lastMessage ?? "대화를 시작해보세요."}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>
                          {conversation.lastMessageAt
                            ? new Date(conversation.lastMessageAt).toLocaleTimeString("ko-KR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                            : ""}
                        </span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}

            {/* 그룹 채팅 목록 */}
            {activeTab === "groups" && (
              <div className="space-y-3 px-1">
                {/* 그룹 채팅 만들기 버튼 */}
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.createGroupChat)}
                  className="flex w-full items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-[#ff4b0b] py-4 text-sm font-semibold text-[#ff4b0b]"
                >
                  <span className="text-lg">+</span>
                  그룹 채팅 만들기
                </button>

                {isGroupLoading ? (
                  <div className="bg-white px-4 py-12 text-center text-sm text-gray-500">
                    그룹 채팅방 목록을 불러오는 중입니다.
                  </div>
                ) : groupChats.length === 0 ? (
                  <div className="bg-white px-4 py-12 text-center text-sm text-gray-500">
                    아직 그룹 채팅방이 없습니다.
                  </div>
                ) : (
                  <>
                    {groupChats.map((room) => (
                      <button
                        key={room.roomId}
                        type="button"
                        onClick={() => navigate(ROUTES.groupChatRoom(room.roomId))}
                        className="flex w-full items-start gap-3 border-b border-gray-100 py-5 text-left"
                      >
                        {/* 썸네일 */}
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl">
                          {room.roomImageUrl ? (
                            <img
                              src={room.roomImageUrl}
                              alt={room.roomName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-100">
                              <MessageSquareMore className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* 정보 */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-l font-bold text-gray-900">
                              {room.roomName}
                            </p>

                            <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-sm font-semibold text-[#ff6b2c]">
                              {room.participantCount}/{room.maxParticipantCount}
                            </span>
                          </div>

                          <p className="mt-2 text-sm text-gray-500">
                            개설일{" "}
                            {new Date(room.createdAt).toLocaleDateString("ko-KR", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })}
                          </p>
                        </div>

                        {/* 시간 */}
                        <div className="pt-1 text-sm text-gray-400">
                          {room.latestMessageTime
                            ? formatRelativeTime(room.latestMessageTime)
                            : ""}
                        </div>
                      </button>
                    ))}

                    {hasNextGroup && (
                      <button
                        type="button"
                        onClick={handleLoadMore}
                        className="w-full py-3 text-sm text-gray-400"
                      >
                        더보기
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}