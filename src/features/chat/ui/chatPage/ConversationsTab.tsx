// ConversationsTab.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, MessageSquareMore } from "lucide-react";
import { getDirectChatRoom, getDirectChats } from "@/features/chat/api/getTasteExperts";
import { connectDirectChatSocket } from "@/features/chat/api/directChatSocket";
import { connectGroupChatSocket } from "@/features/groupChat/api/connectGroupChatSocket";
import type { ChatAuth, DirectChatMessage, DirectChatRoomSummary } from "@/features/chat/model/types";
import { ROUTES } from "@/shared/constants/routes";
import type { ChatMessage } from "@/features/groupChat/model/groupChatTypes";

const READ_DIRECT_CHAT_MARKERS_KEY = "ddogalmap.readDirectChatMarkers";
const LEFT_PARTNER_LABEL = "대화 상대 없음";

const getReadDirectChatMarkers = () => {
    try {
        const rawValue = window.localStorage.getItem(READ_DIRECT_CHAT_MARKERS_KEY);
        return rawValue ? (JSON.parse(rawValue) as Record<string, string>) : {};
    } catch {
        return {};
    }
};

const setReadDirectChatMarker = (directChatRoomId: number, lastMessageAt?: string | null) => {
    if (!lastMessageAt) return;
    const markers = getReadDirectChatMarkers();
    markers[String(directChatRoomId)] = lastMessageAt;
    window.localStorage.setItem(READ_DIRECT_CHAT_MARKERS_KEY, JSON.stringify(markers));
};

const hasUnreadConversation = (conversation: DirectChatRoomSummary, currentUserId?: number) => {
    if (currentUserId != null && conversation.lastMessageSenderId === currentUserId) return false;
    if (!conversation.lastMessageAt) return conversation.unreadCount > 0;
    const markers = getReadDirectChatMarkers();
    const lastReadMessageAt = markers[String(conversation.directChatRoomId)];
    if (lastReadMessageAt) return lastReadMessageAt !== conversation.lastMessageAt;
    return conversation.unreadCount > 0;
};

const sortByLastMessage = (list: DirectChatRoomSummary[]) => {
    const sorted = [...list].sort((a, b) => {
        const aTime = a.lastMessageAt ?? a.createdAt;
        const bTime = b.lastMessageAt ?? b.createdAt;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
    });
    return sorted;
};

interface Props {
    chatAuth: ChatAuth | null;
    currentUserId?: number;
}

export default function ConversationsTab({ chatAuth, currentUserId }: Props) {
    const navigate = useNavigate();
    const [conversations, setConversations] = useState<DirectChatRoomSummary[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [unreadRoomIds, setUnreadRoomIds] = useState<Set<string>>(() => new Set());

    // 대화 목록 조회
    useEffect(() => {
        setIsLoading(true);
        if (!chatAuth) {
            setIsLoading(false);
            return;
        }
        void getDirectChats(chatAuth)
            .then((response) => {
                setConversations(sortByLastMessage(response));
                setUnreadRoomIds(() => {
                    const next = new Set<string>();
                    response.forEach((conversation) => {
                        if (conversation.chatType === "GROUP") return;
                        if (hasUnreadConversation(conversation, currentUserId)) {
                            next.add(`DIRECT-${conversation.directChatRoomId}`);
                        }
                    });
                    return next;
                });
            })
            .catch((error) => {
                console.error(error);
                setConversations([]);
            })
            .finally(() => setIsLoading(false));
    }, [chatAuth, currentUserId]);

    // 1:1 채팅 소켓 연결
    const directRoomIds = useMemo(
        () =>
            conversations
                .filter((c) => c.chatType === "DIRECT")
                .map((c) => c.directChatRoomId)
                .sort((a, b) => a - b),
        [conversations],
    );
    const directRoomIdsKey = directRoomIds.join(",");

    useEffect(() => {
        if (!chatAuth?.accessToken || directRoomIds.length === 0) return;
        const accessToken = chatAuth.accessToken;  // 추가

        const handleDirectMessage = (receivedMessage: DirectChatMessage) => {
            setConversations((prev) => {
                const updated = prev.map((c) => {
                    if (c.directChatRoomId !== receivedMessage.directChatRoomId || c.chatType !== "DIRECT") return c;
                    return {
                        ...c,
                        lastMessage: receivedMessage.message,
                        lastMessageAt: receivedMessage.createdAt,
                        lastMessageSenderId: receivedMessage.senderId,
                    };
                });
                return sortByLastMessage(updated);
            });

            if (receivedMessage.senderId === currentUserId) {
                setReadDirectChatMarker(receivedMessage.directChatRoomId, receivedMessage.createdAt);
                setUnreadRoomIds((prev) => {
                    const next = new Set(prev);
                    next.delete(`DIRECT-${receivedMessage.directChatRoomId}`);
                    return next;
                });
                return;
            }

            void getDirectChatRoom(receivedMessage.directChatRoomId, chatAuth)
                .then((room) => {
                    setConversations((prev) => {
                        const updated = prev.map((c) => {
                            if (c.directChatRoomId !== receivedMessage.directChatRoomId || c.chatType !== "DIRECT") return c;
                            return {
                                ...c,
                                targetNickname: room.targetNickname,
                                targetProfileImageUrl: room.targetProfileImageUrl,
                            };
                        });
                        return sortByLastMessage(updated);
                    });
                })
                .catch((error) => console.error(error));

            setUnreadRoomIds((prev) => {
                const next = new Set(prev);
                next.add(`DIRECT-${receivedMessage.directChatRoomId}`);
                return next;
            });
        };

        const sockets = directRoomIds.map((directChatRoomId) =>
            connectDirectChatSocket({
                directChatRoomId,
                accessToken: accessToken,
                onMessage: handleDirectMessage,
                onRoomEvent: (event) => {
                    if (event.eventType !== "DIRECT_CHAT_ROOM_LEFT" || event.userId === currentUserId) return;
                    setConversations((prev) =>
                        prev.map((c) => {
                            if (c.directChatRoomId !== event.directChatRoomId || c.chatType !== "DIRECT") return c;
                            return {
                                ...c,
                                targetNickname: LEFT_PARTNER_LABEL,
                                targetProfileImageUrl: null,
                            };
                        }),
                    );
                },
                onError: (errorMessage) => console.error(errorMessage),
            }),
        );

        return () => sockets.forEach((socket) => socket.disconnect());
    }, [chatAuth, chatAuth?.accessToken, directRoomIdsKey, currentUserId]);

    // 그룹 채팅 소켓 연결
    const groupRoomIds = useMemo(
        () =>
            conversations
                .filter((c) => c.chatType === "GROUP")
                .map((c) => c.directChatRoomId)
                .sort((a, b) => a - b),
        [conversations],
    );
    const groupRoomIdsKey = groupRoomIds.join(",");

    useEffect(() => {
        if (!chatAuth?.accessToken || groupRoomIds.length === 0) return;
        const accessToken = chatAuth.accessToken;

        const sockets = groupRoomIds.map((roomId) =>
            connectGroupChatSocket({
                roomId,
                accessToken,
                onMessage: (data: ChatMessage) => {
                    setConversations((prev) => {
                        const updated = prev.map((c) => {
                            if (c.directChatRoomId !== roomId || c.chatType !== "GROUP") return c;
                            return {
                                ...c,
                                lastMessage: data.content,
                                lastMessageAt: data.sentAt,
                                lastMessageSenderId: data.senderId,
                            };
                        });
                        return sortByLastMessage(updated);  // 맨 위로 올라감
                    });

                    // 내가 보낸 메시지면 빨간점 제거, 아니면 추가
                    if (data.senderId === currentUserId) {
                        setUnreadRoomIds((prev) => {
                            const next = new Set(prev);
                            next.delete(`GROUP-${roomId}`);
                            return next;
                        });
                    } else {
                        setUnreadRoomIds((prev) => {
                            const next = new Set(prev);
                            next.add(`GROUP-${roomId}`);
                            return next;
                        });
                    }
                },
            }),
        );

        return () => sockets.forEach((socket) => socket.disconnect());
    }, [chatAuth?.accessToken, groupRoomIdsKey, currentUserId]);

    const handleOpenChat = (conversation: DirectChatRoomSummary) => {
        if (conversation.chatType === "GROUP") {
            setUnreadRoomIds((prev) => {  // 추가
                const next = new Set(prev);
                next.delete(`GROUP-${conversation.directChatRoomId}`);
                return next;
            });
            navigate(ROUTES.groupChatRoom(conversation.directChatRoomId));
            return;
        }
        setReadDirectChatMarker(conversation.directChatRoomId, conversation.lastMessageAt);
        setUnreadRoomIds((prev) => {
            const next = new Set(prev);
            next.delete(`DIRECT-${conversation.directChatRoomId}`);
            return next;
        });
        navigate(ROUTES.directChat(conversation.directChatRoomId));
    };

    if (isLoading) {
        return (
            <div className="bg-white px-4 py-12 text-center text-sm text-gray-500">
                대화 목록을 불러오는 중입니다.
            </div>
        );
    }

    if (conversations.length === 0) {
        return (
            <div className="bg-white px-4 py-12 text-center text-sm text-gray-500">
                아직 시작한 대화가 없습니다.
            </div>
        );
    }

    return (
        <div className="space-y-3 px-1">
            {conversations.map((conversation) => (
                <button
                    key={`${conversation.chatType}-${conversation.directChatRoomId}`}
                    type="button"
                    onClick={() => handleOpenChat(conversation)}
                    className="flex w-full items-center gap-3 rounded-3xl border border-gray-200 bg-[#fffaf7] px-4 py-4 text-left"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#ff4b0b] shadow-sm">
                        {conversation.targetProfileImageUrl ? (
                            <img
                                src={conversation.targetProfileImageUrl}
                                alt={conversation.targetNickname ?? ""}
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
                        {unreadRoomIds.has(`${conversation.chatType}-${conversation.directChatRoomId}`) && (
                            <span aria-label="새 메시지" className="h-2 w-2 rounded-full bg-red-500" />
                        )}
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
            ))}
        </div>
    );
}
