import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import MemberManageHeader from "@/features/groupChat/ui/chatRoomMember/MemberManageHeader";
import MemberManageList from "@/features/groupChat/ui/chatRoomMember/MemberManageList";
import { useChatRoomMembers } from "@/features/groupChat/hooks/useChatRoomMembers";
import { useKickChatRoomMembers, useGrantChatRoomOwner } from "@/features/groupChat/hooks/useKickAndGrant";

export default function GroupChatMemberPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { members, loading } = useChatRoomMembers(Number(roomId));
  const { kick } = useKickChatRoomMembers();
  const { grant } = useGrantChatRoomOwner();

  const [kickUserIds, setKickUserIds] = useState<number[]>([]);
  const [grantUserIds, setGrantUserIds] = useState<number[]>([]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!members) {
    return (
      <div className="flex justify-center items-center h-screen">
        멤버 정보를 불러올 수 없습니다.
      </div>
    );
  }

  function handleToggleKick(userId: number) {
    setKickUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  }

  function handleToggleGrant(userId: number) {
    setGrantUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  }

  async function handleDone() {
    try {
      if (kickUserIds.length > 0) {
        await kick(Number(roomId), kickUserIds);
      }
      if (grantUserIds.length > 0) {
        await grant(Number(roomId), grantUserIds);
      }
      navigate(-1);
    } catch (e) {
      console.error("멤버 관리 실패", e);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <div className="relative mx-auto min-h-screen w-full max-w-[430px] bg-white">
        <div className="flex h-screen flex-col">
          <MemberManageHeader
            onBack={() => navigate(-1)}
            onDone={handleDone}
          />
          <div className="flex-1 overflow-y-auto">
            <MemberManageList
              members={members.members}
              participantCount={members.participantCount}
              maxParticipantCount={members.maxParticipantCount}
              kickUserIds={kickUserIds}
              grantUserIds={grantUserIds}
              onToggleKick={handleToggleKick}
              onToggleGrant={handleToggleGrant}
              currentUserRole={members.currentUserRole}
            />
          </div>
        </div>
      </div>
    </div>
  );
}