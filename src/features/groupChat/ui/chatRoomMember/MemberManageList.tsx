import type { MemberDetailInfo, ChatRoomMemberRole } from "../../model/groupChatTypes";

interface Props {
  members: MemberDetailInfo[];
  participantCount: number;
  maxParticipantCount: number;
  kickUserIds: number[];
  grantUserIds: number[];
  onToggleKick: (userId: number) => void;
  onToggleGrant: (userId: number) => void;
  currentUserRole: ChatRoomMemberRole;
}

export default function MemberManageList({
  members,
  participantCount,
  maxParticipantCount,
  kickUserIds,
  grantUserIds,
  onToggleKick,
  onToggleGrant,
  currentUserRole,
}: Props) {
  return (
    <div className="px-5 pt-4">
      <p className="text-sm font-semibold mb-4">
        현재 멤버{" "}
        <span className="text-orange-500">
          {participantCount}/{maxParticipantCount}
        </span>
      </p>
      <ul className="flex flex-col gap-4">
        {[...members]
          .sort((a) => (a.userRole === "OWNER" ? -1 : 1))
          .map((member) => {
            const isKickSelected = kickUserIds.includes(member.userId);
            const isGrantSelected = grantUserIds.includes(member.userId);

            return (
              <li key={member.userId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={member.userProfileImage}
                    alt={member.userName}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {member.userName}{" "}
                    <span className="text-orange-500 font-semibold">
                      Lv.{member.userLevel}
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {member.userRole === "OWNER" ? (
                    <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
                      방장
                    </span>
                  ) : currentUserRole === "OWNER" ? (
                    <>
                      <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                        멤버
                      </span>
                      <button
                        onClick={() => onToggleGrant(member.userId)}
                        className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                          isGrantSelected
                            ? "text-white bg-blue-500"
                            : "text-blue-500 bg-blue-50"
                        }`}
                      >
                        방장 부여
                      </button>
                      <button
                        onClick={() => onToggleKick(member.userId)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                          isKickSelected ? "bg-red-500" : "bg-gray-100"
                        }`}
                      >
                        <svg
                          className={`w-3.5 h-3.5 ${isKickSelected ? "text-white" : "text-gray-500"}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                      멤버
                    </span>
                  )}
                </div>
              </li>
            );
          })}
      </ul>
      <p className="text-xs text-gray-400 text-center mt-10">
        그룹은 최대 {maxParticipantCount}명까지 참여 가능합니다.
      </p>
    </div>
  );
}