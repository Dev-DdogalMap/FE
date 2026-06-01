import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ImagePlus,
  SendHorizonal,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const mockMessages = [
  {
    id: 1,
    sender: "expert",
    content: "안녕하세요! 성수동 양식 맛집 찾으시나요?",
    time: "오후 1:10",
  },
  {
    id: 2,
    sender: "me",
    content: "네, 파스타 맛집 추천 받고 싶어요.",
    time: "오후 1:12",
  },
  {
    id: 3,
    sender: "expert",
    content: "파스타는 이 근처 골목 안쪽 작은 다이닝이 정말 좋아요.",
    time: "오후 1:13",
  },
];

export default function DirectChatPage() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [message, setMessage] = useState("");

  const title = useMemo(
    () => `맛잘알 ${userId ?? ""}`,
    [userId],
  );

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
            1:1 채팅방 기본 UI
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-3 px-4 py-4">
        {mockMessages.map((item) => {
          const isMine = item.sender === "me";
          return (
            <div
              key={item.id}
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
                <p>{item.content}</p>
                <p
                  className={`mt-1 text-[11px] ${
                    isMine ? "text-orange-100" : "text-gray-400"
                  }`}
                >
                  {item.time}
                </p>
              </div>
            </div>
          );
        })}
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
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff4b0b] text-white"
          >
            <SendHorizonal className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
