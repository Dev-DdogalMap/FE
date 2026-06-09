import { useNavigate, useParams } from "react-router-dom";
import MemberManageHeader from "@/features/groupChat/ui/chatRoomMember/MemberManageHeader";
import MemberManageList from "@/features/groupChat/ui/chatRoomMember/MemberManageList";
import { useChatRoomMembers } from "@/features/groupChat/hooks/useChatRoomMembers";

export default function GroupChatMemberPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const { members, loading } = useChatRoomMembers(Number(roomId));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!members) {  //||error
    return (
      <div className="flex justify-center items-center h-screen">
        멤버 정보를 불러올 수 없습니다.
      </div>
    );
  }

  function handleKick(userId: number) {
    console.log("kick", userId);
  }

  function handleGrantOwner(userId: number) {
    console.log("grantOwner", userId);
  }

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <div className="relative mx-auto min-h-screen w-full max-w-[430px] bg-white">
        <div className="flex h-screen flex-col">
          <MemberManageHeader
            onBack={() => navigate(-1)}
            onDone={() => navigate(-1)}
          />
          <div className="flex-1 overflow-y-auto">
            <MemberManageList
              members={members.members}
              participantCount={members.participantCount}
              maxParticipantCount={members.maxParticipantCount}
              onKick={handleKick}
              onGrantOwner={handleGrantOwner}
              currentUserRole={members.currentUserRole}
            />
          </div>
        </div>
      </div>
    </div>
  );
}