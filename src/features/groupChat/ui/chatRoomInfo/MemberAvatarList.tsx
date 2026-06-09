import { useNavigate } from "react-router-dom";
import type { MemberInfo } from "../../model/groupChatTypes";
import { ChevronRight } from "lucide-react";

interface Props {
  members: MemberInfo[];
  roomId: number;
}

export default function MemberAvatarList({
  members, roomId
}: Props) {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-between mb-4"
      onClick={() => navigate(`/chat-rooms/${roomId}/members`)}>
        <h3 className="font-bold text-sm">
          멤버 관리
        </h3>

        <ChevronRight />
      </div>

      <div className="flex gap-3 overflow-x-auto">
        {members.map((member) => (
          <img
            key={member.userId}
            src={member.userProfileImage?? ""}
            className="w-14 h-14 rounded-full object-cover"
          />
        ))}
      </div>
    </div>
  );
}