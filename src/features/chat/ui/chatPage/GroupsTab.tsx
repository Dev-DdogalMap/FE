// GroupsTab.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquareMore } from "lucide-react";
import { getGroupChatRoomList, joinChatRoom } from "@/features/groupChat/api/groupChatApi";
import type { ChatRoomListThumbnailResponse } from "@/features/groupChat/model/groupChatTypes";
import type { ChatAuth } from "@/features/chat/model/types";
import { JoinConfirmModal } from "@/features/groupChat/ui/JoinConfirmModal";
import { JoinFailModal } from "@/features/groupChat/ui/JoinFailModal";
import { ROUTES } from "@/shared/constants/routes";

const formatRelativeTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays === 0) {
    return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  }
  if (diffDays === 1) return "어제";
  return `${diffDays}일 전`;
};

interface Props {
  chatAuth: ChatAuth;
}

export default function GroupsTab({ chatAuth }: Props) {
  const navigate = useNavigate();
  const [groupChats, setGroupChats] = useState<ChatRoomListThumbnailResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [joiningRoom, setJoiningRoom] = useState<ChatRoomListThumbnailResponse | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [joinFailed, setJoinFailed] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setPage(0);
    void getGroupChatRoomList({ page: 0, size: 20 }, chatAuth)
      .then((response) => {
        setGroupChats(response.chatRoomList);
        setHasNext(response.hasNext);
      })
      .catch((error) => {
        console.error(error);
        setGroupChats([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    void getGroupChatRoomList({ page: nextPage, size: 20 }, chatAuth)
      .then((response) => {
        setGroupChats((prev) => [...prev, ...response.chatRoomList]);
        setHasNext(response.hasNext);
      })
      .catch(console.error);
  };

  const handleJoinConfirm = async () => {
    if (!joiningRoom) return;
    setIsJoining(true);
    try {
      const response = await joinChatRoom(joiningRoom.roomId, chatAuth);
      setJoiningRoom(null);
      navigate(ROUTES.groupChatRoom(response.chatRoomId));
    } catch {
      setJoiningRoom(null);
      setJoinFailed(true);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <>
      {joiningRoom && (
        <JoinConfirmModal
          room={joiningRoom}
          onConfirm={handleJoinConfirm}
          onCancel={() => setJoiningRoom(null)}
          isLoading={isJoining}
        />
      )}
      {joinFailed && <JoinFailModal onClose={() => setJoinFailed(false)} />}

      <div className="space-y-3 px-1">
        <button
          type="button"
          onClick={() => navigate(ROUTES.createGroupChat)}
          className="flex w-full items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-[#FF6B00] py-4 text-sm font-semibold text-[#FF6B00]"
        >
          <span className="text-lg">+</span>
          그룹 채팅 만들기
        </button>

        {isLoading ? (
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
                onClick={() => setJoiningRoom(room)}
                className="flex w-full items-start gap-3 border-b border-gray-100 py-5 text-left"
              >
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl">
                  {room.roomImageUrl ? (
                    <img src={room.roomImageUrl} alt={room.roomName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                      <MessageSquareMore className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-l font-bold text-gray-900">{room.roomName}</p>
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
                <div className="pt-1 text-sm text-gray-400">
                  {room.latestMessageTime ? formatRelativeTime(room.latestMessageTime) : ""}
                </div>
              </button>
            ))}
            {hasNext && (
              <button type="button" onClick={handleLoadMore} className="w-full py-3 text-sm text-gray-400">
                더보기
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
}