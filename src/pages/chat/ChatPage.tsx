import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, MessageSquareMore } from "lucide-react";

import {
  createDirectChat,
  getDirectChats,
  getTasteExperts,
} from "@/features/chat/api/getTasteExperts";
import { connectDirectChatSocket } from "@/features/chat/api/directChatSocket";
import type {
  ChatTabKey,
  DirectChatMessage,
  DirectChatRoomSummary,
  TasteExpert,
  TasteExpertFilters,
} from "@/features/chat/model/types";
import ChatFilters from "@/features/chat/ui/ChatFilters";
import ChatTabs from "@/features/chat/ui/ChatTabs";
import TasteExpertList from "@/features/chat/ui/TasteExpertList";
import { getGroupChatRoomList } from "@/features/groupChat/api/groupChatApi";
import type { ChatRoomListThumbnailResponse } from "@/features/groupChat/model/groupChatTypes";
import { getFoodTypes } from "@/features/restaurant/api/restaurantApi";
import { ROUTES } from "@/shared/constants/routes";
import { useAuth } from "@/shared/auth/AuthContext";

const defaultFilters: TasteExpertFilters = {
  keyword: "",
  region: "성수동",
  category: "양식",
  minLevel: 5,
  sort: "EXPERTISE",
  page: 0,
  size: 20,
};

const READ_DIRECT_CHAT_MARKERS_KEY = "ddogalmap.readDirectChatMarkers";

const getReadDirectChatMarkers = () => {
  try {
    const rawValue = window.localStorage.getItem(
      READ_DIRECT_CHAT_MARKERS_KEY,
    );
    return rawValue
      ? (JSON.parse(rawValue) as Record<string, string>)
      : {};
  } catch {
    return {};
  }
};

const setReadDirectChatMarker = (
  directChatRoomId: number,
  lastMessageAt?: string | null,
) => {
  if (!lastMessageAt) {
    return;
  }

  const markers = getReadDirectChatMarkers();
  markers[String(directChatRoomId)] = lastMessageAt;
  window.localStorage.setItem(
    READ_DIRECT_CHAT_MARKERS_KEY,
    JSON.stringify(markers),
  );
};

const hasUnreadConversation = (conversation: DirectChatRoomSummary) => {
  if (!conversation.lastMessageAt) {
    return conversation.unreadCount > 0;
  }

  const markers = getReadDirectChatMarkers();
  const lastReadMessageAt = markers[String(conversation.directChatRoomId)];

  if (lastReadMessageAt) {
    return lastReadMessageAt !== conversation.lastMessageAt;
  }

  return conversation.unreadCount > 0;
};

const formatRelativeTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (diffDays === 1) {
    return "어제";
  }

  return `${diffDays}일 전`;
};

export default function ChatPage() {
  const navigate = useNavigate();
  const { user, accessToken, refreshAccessToken } = useAuth();
  const chatAuth = useMemo(
    () => ({ accessToken, refreshAccessToken }),
    [accessToken, refreshAccessToken],
  );

  const [activeTab, setActiveTab] =
    useState<ChatTabKey>("recommended");
  const [filters, setFilters] =
    useState<TasteExpertFilters>(defaultFilters);
  const [experts, setExperts] = useState<TasteExpert[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<
    DirectChatRoomSummary[]
  >([]);
  const [isConversationLoading, setIsConversationLoading] =
    useState(false);
  const [unreadRoomIds, setUnreadRoomIds] = useState<Set<number>>(
    () => new Set(),
  );
  const [groupChats, setGroupChats] = useState<
    ChatRoomListThumbnailResponse[]
  >([]);
  const [isGroupLoading, setIsGroupLoading] = useState(false);
  const [groupPage, setGroupPage] = useState(0);
  const [hasNextGroup, setHasNextGroup] = useState(false);

  const conversationRoomIdList = useMemo(
    () =>
      conversations
        .map((conversation) => conversation.directChatRoomId)
        .sort((a, b) => a - b),
    [conversations],
  );
  const conversationRoomIds = conversationRoomIdList.join(",");

  useEffect(() => {
    void getFoodTypes()
      .then((foodTypes) => {
        setCategoryOptions(foodTypes.map((foodType) => foodType.type));
      })
      .catch((error) => {
        console.error(error);
        setCategoryOptions([]);
      });
  }, []);

  useEffect(() => {
    if (activeTab !== "recommended") {
      return;
    }

    setIsLoading(true);
    void getTasteExperts(filters, chatAuth)
      .then((response) => {
        setExperts(response.content);
      })
      .catch((error) => {
        console.error(error);
        setExperts([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [activeTab, filters, chatAuth]);

  useEffect(() => {
    if (activeTab !== "conversations") {
      return;
    }

    setIsConversationLoading(true);
    void getDirectChats(chatAuth)
      .then((response) => {
        setConversations(response);
        setUnreadRoomIds((prev) => {
          const next = new Set(prev);
          response.forEach((conversation) => {
            if (hasUnreadConversation(conversation)) {
              next.add(conversation.directChatRoomId);
            }
          });
          return next;
        });
      })
      .catch((error) => {
        console.error(error);
        setConversations([]);
      })
      .finally(() => {
        setIsConversationLoading(false);
      });
  }, [activeTab, chatAuth]);

  useEffect(() => {
    if (
      activeTab !== "conversations" ||
      !accessToken ||
      conversationRoomIdList.length === 0
    ) {
      return;
    }

    const handleMessage = (receivedMessage: DirectChatMessage) => {
      setConversations((prev) => {
        const updated = prev.map((conversation) => {
          if (
            conversation.directChatRoomId !==
            receivedMessage.directChatRoomId
          ) {
            return conversation;
          }

          return {
            ...conversation,
            lastMessage: receivedMessage.message,
            lastMessageAt: receivedMessage.createdAt,
          };
        });

        return updated.sort((a, b) => {
          const aTime = a.lastMessageAt ?? a.createdAt;
          const bTime = b.lastMessageAt ?? b.createdAt;
          return (
            new Date(bTime).getTime() - new Date(aTime).getTime()
          );
        });
      });

      if (receivedMessage.senderId === user?.userId) {
        setReadDirectChatMarker(
          receivedMessage.directChatRoomId,
          receivedMessage.createdAt,
        );
        setUnreadRoomIds((prev) => {
          const next = new Set(prev);
          next.delete(receivedMessage.directChatRoomId);
          return next;
        });
        return;
      }

      setUnreadRoomIds((prev) => {
        const next = new Set(prev);
        next.add(receivedMessage.directChatRoomId);
        return next;
      });
    };

    const sockets = conversationRoomIdList.map((directChatRoomId) =>
      connectDirectChatSocket({
        directChatRoomId,
        accessToken,
        onMessage: handleMessage,
        onError: (errorMessage) => {
          console.error(errorMessage);
        },
      }),
    );

    return () => {
      sockets.forEach((socket) => socket.disconnect());
    };
  }, [accessToken, activeTab, conversationRoomIds, user?.userId]);

  useEffect(() => {
    if (activeTab !== "groups") {
      return;
    }

    setIsGroupLoading(true);
    setGroupPage(0);
    void getGroupChatRoomList({ page: 0, size: 20 }, { accessToken, refreshAccessToken})
      .then((response) => {
        setGroupChats(response.chatRoomList);
        setHasNextGroup(response.hasNext);
      })
      .catch((error) => {
        console.error(error);
        setGroupChats([]);
      })
      .finally(() => {
        setIsGroupLoading(false);
      });
  }, [activeTab]);

  const handleLoadMore = () => {
    const nextPage = groupPage + 1;
    setGroupPage(nextPage);
    void getGroupChatRoomList({ page: nextPage, size: 20 }, { accessToken, refreshAccessToken })
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
      const room = await createDirectChat(userId, chatAuth);
      navigate(ROUTES.directChat(room.directChatRoomId));
    } catch (error) {
      console.error(error);
      alert("채팅방 생성에 실패했습니다.");
    }
  };

  const handleOpenDirectChat = (conversation: DirectChatRoomSummary) => {
    setReadDirectChatMarker(
      conversation.directChatRoomId,
      conversation.lastMessageAt,
    );
    setUnreadRoomIds((prev) => {
      const next = new Set(prev);
      next.delete(conversation.directChatRoomId);
      return next;
    });
    navigate(ROUTES.directChat(conversation.directChatRoomId));
  };

  return (
    <div className="min-h-[calc(100vh-64px-64px)] bg-[#fafafa] px-4 pb-24 pt-4">
      <div className="space-y-4">
        <ChatFilters
          keyword={filters.keyword}
          region={filters.region}
          category={filters.category}
          categoryOptions={categoryOptions}
          minLevel={filters.minLevel}
          onKeywordChange={(value) =>
            setFilters((prev) => ({ ...prev, keyword: value, page: 0 }))
          }
          onRegionChange={(value) =>
            setFilters((prev) => ({ ...prev, region: value, page: 0 }))
          }
          onCategoryChange={(value) =>
            setFilters((prev) => ({ ...prev, category: value, page: 0 }))
          }
          onMinLevelChange={(value) =>
            setFilters((prev) => ({ ...prev, minLevel: value, page: 0 }))
          }
        />

        <div className="bg-white">
          <ChatTabs activeTab={activeTab} onChange={handleTabChange} />

          <div className="py-3">
            {activeTab === "recommended" && (
              <>
                <div className="flex items-center justify-between px-1 pb-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      추천 맛잘알
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {filters.region} · {filters.category} · 레벨{" "}
                      {filters.minLevel} 이상 기준
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
                  <TasteExpertList
                    experts={experts}
                    onChatClick={handleCreateDirectChat}
                  />
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
                      onClick={() => handleOpenDirectChat(conversation)}
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
                        {unreadRoomIds.has(conversation.directChatRoomId) && (
                          <span
                            aria-label="새 메시지"
                            className="h-2 w-2 rounded-full bg-red-500"
                          />
                        )}
                        <span>
                          {conversation.lastMessageAt
                            ? new Date(
                                conversation.lastMessageAt,
                              ).toLocaleTimeString("ko-KR", {
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

            {activeTab === "groups" && (
              <div className="space-y-3 px-1">
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.createGroupChat)}
                  className="flex w-full items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-[#FF6B00] py-4 text-sm font-semibold text-[#FF6B00]"
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
                        onClick={() =>
                          navigate(ROUTES.groupChatRoom(room.roomId))
                        }
                        className="flex w-full items-start gap-3 border-b border-gray-100 py-5 text-left"
                      >
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

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-lg font-bold text-gray-900">
                              {room.roomName}
                            </p>
                            <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-sm font-semibold text-[#ff6b2c]">
                              {room.participantCount}/
                              {room.maxParticipantCount}
                            </span>
                          </div>

                          <p className="mt-2 text-sm text-gray-500">
                            개설일{" "}
                            {new Date(room.createdAt).toLocaleDateString(
                              "ko-KR",
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              },
                            )}
                          </p>
                        </div>

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
