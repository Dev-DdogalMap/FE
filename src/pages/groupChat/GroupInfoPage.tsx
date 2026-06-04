import { useNavigate, useParams } from "react-router-dom";

import GroupInfoHeader from "@/features/groupChat/ui/chatRoomInfo/GroupInfoHeader";
import GroupInfoCard from "@/features/groupChat/ui/chatRoomInfo/GroupInfoCard";
import MemberAvatarList from "@/features/groupChat/ui/chatRoomInfo/MemberAvatarList";
import GroupInfoFooter from "@/features/groupChat/ui/chatRoomInfo/GroupInfoFooter";

import { useGroupChatInfo } from "@/features/groupChat/hooks/useGroupChatInfo";

export default function GroupInfoPage() {
    const navigate = useNavigate();

    const { roomId } = useParams();

    const {
        roomInfo,
        loading,
        error,
    } = useGroupChatInfo(Number(roomId));

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !roomInfo) {
        return (
            <div className="flex justify-center items-center h-screen">
                그룹 정보를 불러올 수 없습니다.
            </div>
        );
    }

    function handleEdit() {
        navigate(`/group-chat/${roomId}/edit`);
    }

    function handleLeave() {
        console.log("그룹 나가기");
    }

    return (
        <div className="min-h-screen w-full bg-gray-100">
            <div className="relative mx-auto min-h-screen w-full max-w-[430px] bg-white">
                <div className="flex h-screen flex-col">
                    <GroupInfoHeader
                        onBack={() => navigate(-1)}
                    />

                    <div className="px-5">
                        <GroupInfoCard
                            roomImage={roomInfo.roomImage ?? ""}
                            roomName={roomInfo.roomName}
                            participantCount={roomInfo.participantCount}
                            maxParticipantCount={
                                roomInfo.maxParticipantCount
                            }
                        />

                        <div className="mt-10">
                            <label className="text-sm font-bold block mb-2">
                                카테고리
                            </label>

                            <div className="text-sm h-12 border border-gray-200 rounded-xl px-4 flex items-center">
                                {roomInfo.category}
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="text-sm font-bold block mb-2">
                                지역
                            </label>

                            <div className="text-sm h-12 border border-gray-200 rounded-xl px-4 flex items-center">
                                {roomInfo.region}
                            </div>
                        </div>

                        <div className="mt-8">
                            <MemberAvatarList
                                members={roomInfo.members}
                            />
                        </div>
                    </div>

                    <GroupInfoFooter
                        onEdit={handleEdit}
                        onLeave={handleLeave}
                    />
                </div>
            </div>
        </div>
    );
}