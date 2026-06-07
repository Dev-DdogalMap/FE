import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  ImagePlus,
  MoreVertical,
  Plus,
  SendHorizonal,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDirectChatMessages,
  getDirectChatRoom,
  leaveDirectChatRoom,
} from "@/features/chat/api/getTasteExperts";
import { connectDirectChatSocket } from "@/features/chat/api/directChatSocket";
import type { DirectChatMessage } from "@/features/chat/model/types";
import { useAuth } from "@/shared/auth/AuthContext";
import { ROUTES } from "@/shared/constants/routes";

const FALLBACK_LEVEL = "Lv.5 맛잘알";
const FALLBACK_SPECIALTY = "양식 전문";
const LEFT_PARTNER_LABEL = "대화 상대 없음";
const READ_DIRECT_CHAT_MARKERS_KEY = "ddogalmap.readDirectChatMarkers";

const formatMessageTime = (value: string) =>
  new Date(value).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });

const formatDateDivider = (value?: string) => {
  const date = value ? new Date(value) : new Date();
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
};

const getInitial = (name: string) => name.trim().charAt(0) || "?";

const setReadDirectChatMarker = (
  directChatRoomId: number,
  lastMessageAt?: string | null,
) => {
  if (!lastMessageAt) {
    return;
  }

  try {
    const rawValue = window.localStorage.getItem(
      READ_DIRECT_CHAT_MARKERS_KEY,
    );
    const markers = rawValue
      ? (JSON.parse(rawValue) as Record<string, string>)
      : {};

    markers[String(directChatRoomId)] = lastMessageAt;
    window.localStorage.setItem(
      READ_DIRECT_CHAT_MARKERS_KEY,
      JSON.stringify(markers),
    );
  } catch {
    window.localStorage.setItem(
      READ_DIRECT_CHAT_MARKERS_KEY,
      JSON.stringify({ [String(directChatRoomId)]: lastMessageAt }),
    );
  }
};

function ProfileAvatar({
  imageUrl,
  name,
  size,
}: {
  imageUrl?: string | null;
  name: string;
  size: "header" | "message";
}) {
  const sizeClass = size === "header" ? "h-11 w-11" : "h-9 w-9";

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`${sizeClass} shrink-0 rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center rounded-full bg-[#fff2ed] text-sm font-bold text-[#ff4b0b]`}
      aria-label={name}
    >
      {getInitial(name)}
    </div>
  );
}

export default function DirectChatPage() {
  const navigate = useNavigate();
  const { user, accessToken, refreshAccessToken } = useAuth();
  const chatAuth = useMemo(
    () => ({ accessToken, refreshAccessToken }),
    [accessToken, refreshAccessToken],
  );
  const { directChatRoomId } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<DirectChatMessage[]>([]);
  const [title, setTitle] = useState("대화");
  const [targetProfileImageUrl, setTargetProfileImageUrl] = useState<
    string | null
  >(null);
  const [hasPartnerLeft, setHasPartnerLeft] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSocketReady, setIsSocketReady] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const socketRef = useRef<ReturnType<typeof connectDirectChatSocket> | null>(
    null,
  );
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const roomId = Number(directChatRoomId);

  useEffect(() => {
    if (!roomId || Number.isNaN(roomId)) {
      return;
    }

    setIsLoading(true);
    void Promise.all([
      getDirectChatRoom(roomId, chatAuth),
      getDirectChatMessages(roomId, chatAuth),
    ])
      .then(([room, initialMessages]) => {
        setTitle(room.targetNickname);
        setTargetProfileImageUrl(room.targetProfileImageUrl ?? null);
        setHasPartnerLeft(room.targetNickname === LEFT_PARTNER_LABEL);
        setMessages(initialMessages);
        const latestMessage = [...initialMessages].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime(),
        )[0];
        setReadDirectChatMarker(roomId, latestMessage?.createdAt);
      })
      .catch((error) => {
        console.error(error);
        alert("채팅방 정보를 불러오지 못했습니다.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [chatAuth, roomId]);

  useEffect(() => {
    if (!roomId || Number.isNaN(roomId) || !accessToken) {
      return;
    }

    const socket = connectDirectChatSocket({
      directChatRoomId: roomId,
      accessToken,
      onConnected: () => {
        setIsSocketReady(true);
      },
      onMessage: (receivedMessage) => {
        setMessages((prev) => {
          if (
            prev.some((item) => item.messageId === receivedMessage.messageId)
          ) {
            return prev;
          }
          return [...prev, receivedMessage];
        });
        setReadDirectChatMarker(roomId, receivedMessage.createdAt);

        if (receivedMessage.senderId !== user?.userId) {
          void getDirectChatRoom(roomId, chatAuth)
            .then((room) => {
              setTitle(room.targetNickname);
              setTargetProfileImageUrl(room.targetProfileImageUrl ?? null);
              setHasPartnerLeft(room.targetNickname === LEFT_PARTNER_LABEL);
            })
            .catch((error) => {
              console.error(error);
            });
        }
      },
      onRoomEvent: (event) => {
        if (
          event.eventType === "DIRECT_CHAT_ROOM_LEFT" &&
          event.userId !== user?.userId
        ) {
          setTitle(LEFT_PARTNER_LABEL);
          setTargetProfileImageUrl(null);
          setHasPartnerLeft(true);
        }
      },
      onError: (errorMessage) => {
        console.error(errorMessage);
      },
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsSocketReady(false);
    };
  }, [accessToken, chatAuth, roomId, user?.userId]);

  const sortedMessages = useMemo(
    () =>
      [...messages].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime(),
      ),
    [messages],
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sortedMessages.length, isLoading]);

  const handleSend = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    if (!socketRef.current || !isSocketReady) {
      alert("실시간 채팅 연결이 아직 완료되지 않았습니다.");
      return;
    }

    try {
      socketRef.current.sendMessage(trimmedMessage);
      setMessage("");
    } catch (error) {
      console.error(error);
      alert("메시지 전송에 실패했습니다.");
    }
  };

  const handleLeaveRoom = async () => {
    if (!roomId || Number.isNaN(roomId) || isLeaving) {
      return;
    }

    const shouldLeave = window.confirm(
      "이 채팅방을 나가시겠습니까? 내 채팅 목록에서 사라지고, 상대방에게는 대화 상대 없음으로 표시됩니다.",
    );

    if (!shouldLeave) {
      setIsMenuOpen(false);
      return;
    }

    try {
      setIsLeaving(true);
      await leaveDirectChatRoom(roomId, chatAuth);
      socketRef.current?.disconnect();
      socketRef.current = null;
      navigate(ROUTES.chat, { replace: true });
    } catch (error) {
      console.error(error);
      alert("채팅방 나가기에 실패했습니다.");
    } finally {
      setIsLeaving(false);
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100dvh-64px)] max-w-[430px] flex-col overflow-hidden bg-white">
      <div className="z-20 flex h-[72px] shrink-0 items-center gap-3 border-b border-[#eeeeee] bg-white px-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-700"
          aria-label="뒤로가기"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <ProfileAvatar
          imageUrl={targetProfileImageUrl}
          name={title}
          size="header"
        />
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-1.5">
            <p className="truncate text-[15px] font-bold text-[#222222]">
              {title}
            </p>
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#ff4b0b] text-white">
              <Check className="h-2.5 w-2.5" />
            </span>
          </div>
          <div className="mt-1 flex min-w-0 items-center gap-1.5 text-[11px] font-medium text-gray-500">
            {hasPartnerLeft ? (
              <span>상대방이 채팅방을 나갔습니다</span>
            ) : (
              <>
                <span>{FALLBACK_LEVEL}</span>
                <span>·</span>
                <span>{FALLBACK_SPECIALTY}</span>
                <span>·</span>
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isSocketReady ? "bg-[#18c964]" : "bg-gray-300"
                  }`}
                />
                <span>{isSocketReady ? "온라인" : "연결 중"}</span>
              </>
            )}
          </div>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-600"
            aria-label="채팅방 설정"
            aria-expanded={isMenuOpen}
          >
            <MoreVertical className="h-5 w-5" />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 top-11 z-30 w-36 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 text-sm shadow-lg">
              <button
                type="button"
                onClick={handleLeaveRoom}
                disabled={isLeaving}
                className="w-full px-4 py-3 text-left font-medium text-red-500 disabled:opacity-50"
              >
                {isLeaving ? "나가는 중" : "방 나가기"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-white px-4 py-5">
        {isLoading ? (
          <div className="py-12 text-center text-sm text-gray-500">
            대화를 불러오는 중입니다.
          </div>
        ) : sortedMessages.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">
            아직 메시지가 없습니다. 첫 메시지를 보내보세요.
          </div>
        ) : (
          <>
            <div className="mb-5 text-center text-xs font-medium text-gray-400">
              {formatDateDivider(sortedMessages[0]?.createdAt)}
            </div>
            {sortedMessages.map((item) => {
              const isMine = item.senderId === user?.userId;
              const messageTime = formatMessageTime(item.createdAt);

              return (
                <div
                  key={item.messageId}
                  className={`mb-4 flex ${
                    isMine ? "justify-end" : "justify-start"
                  }`}
                >
                  {isMine ? (
                    <div className="flex max-w-[70%] flex-col items-end">
                      <div className="rounded-[18px] bg-[#ff4b0b] px-3.5 py-3 text-sm leading-5 text-white">
                        {item.message}
                      </div>
                      <p className="mt-1 text-[11px] text-gray-400">
                        {messageTime} ✓
                      </p>
                    </div>
                  ) : (
                    <div className="flex max-w-[86%] items-start gap-2.5">
                      <ProfileAvatar
                        imageUrl={targetProfileImageUrl}
                        name={item.senderNickname || title}
                        size="message"
                      />
                      <div className="min-w-0">
                        <p className="mb-1 text-xs font-semibold text-[#333333]">
                          {item.senderNickname || title}
                        </p>
                        <div className="flex items-end gap-1.5">
                          <div className="max-w-[260px] rounded-2xl border border-[#eeeeee] bg-white px-3.5 py-3 text-sm leading-5 text-[#222222]">
                            {item.message}
                          </div>
                          <span className="shrink-0 text-[11px] text-gray-400">
                            {messageTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="z-20 flex h-[72px] shrink-0 items-center gap-2 border-t border-[#eeeeee] bg-white px-4 py-2.5">
        <button
          type="button"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#eeeeee] bg-white text-gray-500"
          aria-label="첨부"
        >
          <Plus className="h-5 w-5" />
        </button>
        <div className="flex h-11 flex-1 items-center gap-2 rounded-full border border-[#eeeeee] bg-white px-4">
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault();
                handleSend();
              }
            }}
            placeholder="메시지를 입력하세요"
            className="min-w-0 flex-1 bg-transparent text-sm text-[#222222] outline-none placeholder:text-gray-400"
          />
          <ImagePlus className="h-5 w-5 shrink-0 text-gray-400" />
        </div>
        <button
          type="button"
          onClick={handleSend}
          disabled={!isSocketReady}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ff4b0b] text-white disabled:opacity-50"
          aria-label="전송"
        >
          <SendHorizonal className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
