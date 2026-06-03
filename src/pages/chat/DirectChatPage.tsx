import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ImagePlus,
  SendHorizonal,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDirectChatMessages,
  getDirectChatRoom,
} from "@/features/chat/api/getTasteExperts";
import { connectDirectChatSocket } from "@/features/chat/api/directChatSocket";
import type { DirectChatMessage } from "@/features/chat/model/types";
import { useAuth } from "@/shared/auth/AuthContext";
import { getStoredAccessToken } from "@/shared/auth/token";

export default function DirectChatPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { directChatRoomId } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<DirectChatMessage[]>([]);
  const [title, setTitle] = useState("대화");
  const [isLoading, setIsLoading] = useState(true);
  const [isSocketReady, setIsSocketReady] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const socketRef = useRef<ReturnType<typeof connectDirectChatSocket> | null>(
    null,
  );
  const roomId = Number(directChatRoomId);

  useEffect(() => {
    if (!roomId || Number.isNaN(roomId)) {
      return;
    }

    setIsLoading(true);
    void Promise.all([
      getDirectChatRoom(roomId),
      getDirectChatMessages(roomId),
    ])
      .then(([room, initialMessages]) => {
        setTitle(room.targetNickname);
        setMessages(initialMessages);
      })
      .catch((error) => {
        console.error(error);
        alert("채팅방 정보를 불러오지 못했습니다.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [roomId]);

  useEffect(() => {
    const accessToken = getStoredAccessToken();
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
  }, [roomId]);

  const sortedMessages = useMemo(
    () =>
      [...messages].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime(),
      ),
    [messages],
  );

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      return;
    }

    if (!socketRef.current || !isSocketReady) {
      alert("실시간 채팅 연결이 아직 완료되지 않았습니다.");
      return;
    }

    try {
      setIsSending(true);
      socketRef.current.sendMessage(trimmedMessage);
      setMessage("");
    } catch (error) {
      console.error(error);
      alert("메시지 전송에 실패했습니다.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px-64px)] flex-col bg-[#fffaf7]">
      <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {title}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {isSocketReady ? "실시간 연결됨" : "실시간 연결 중"}
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-3 px-4 py-4">
        {isLoading ? (
          <div className="py-12 text-center text-sm text-gray-500">
            대화를 불러오는 중입니다.
          </div>
        ) : sortedMessages.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">
            아직 메시지가 없습니다. 첫 메시지를 보내보세요.
          </div>
        ) : (
          sortedMessages.map((item) => {
          const isMine = item.senderId === user?.userId;
          return (
            <div
              key={item.messageId}
              className={`flex ${
                isMine ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[78%] rounded-[24px] px-4 py-3 text-sm leading-6 ${
                  isMine
                    ? "bg-[#ff4b0b] text-white"
                    : "border border-gray-200 bg-white text-gray-700"
                }`}
              >
                {!isMine && (
                  <p className="mb-1 text-[11px] font-semibold text-gray-400">
                    {item.senderNickname}
                  </p>
                )}
                <p>{item.message}</p>
                <p
                  className={`mt-1 text-[11px] ${
                    isMine ? "text-orange-100" : "text-gray-400"
                  }`}
                >
                  {new Date(item.createdAt).toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })
        )}
      </div>

      <div className="border-t border-gray-200 bg-white px-4 py-4">
        <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-[#fffaf7] px-3 py-2">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#ff4b0b]"
          >
            <ImagePlus className="h-5 w-5" />
          </button>
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="메시지를 입력하세요"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={isSending}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff4b0b] text-white"
          >
            <SendHorizonal className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
