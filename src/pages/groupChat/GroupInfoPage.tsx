import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import GroupInfoHeader from "@/features/groupChat/ui/chatRoomInfo/GroupInfoHeader";
import GroupInfoCard from "@/features/groupChat/ui/chatRoomInfo/GroupInfoCard";
import MemberAvatarList from "@/features/groupChat/ui/chatRoomInfo/MemberAvatarList";
import GroupInfoFooter from "@/features/groupChat/ui/chatRoomInfo/GroupInfoFooter";

import { useGroupChatInfo } from "@/features/groupChat/hooks/useGroupChatInfo";
import GroupEditForm from "./GroupEditFormPage";
import { useLeaveChatRoom } from "@/features/groupChat/hooks/useLeaveChatRoom";
import ConfirmModal from "@/features/groupChat/ui/ConfirmModal";

export default function GroupInfoPage() {
    const navigate = useNavigate();
    const { roomId } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const { leave } = useLeaveChatRoom();
    const [modal, setModal] = useState<"confirm" | "error" | null>(null);

    const {
        roomInfo,
        loading,
        error,
        refetch
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

    //나가기 버튼 동작
    async function handleLeaveConfirm() {
        try {
            await leave(Number(roomId));
            setModal(null);
            navigate("/chat", { state: { tab: "conversations" } });
        } catch (err) {
            setModal("error"); // confirm 닫지 않고 바로 error로 전환
        }
    }

    return (
        <div className="min-h-screen w-full bg-gray-100">
            {/* 나가기 확인 모달 */}
            {modal === "confirm" && (
                <ConfirmModal
                    message="그룹에서 나가시겠습니까?"
                    confirmLabel="나가기"
                    cancelLabel="취소"
                    onConfirm={handleLeaveConfirm}
                    onCancel={() => setModal(null)}
                />
            )}
            {modal === "error" && (
                <ConfirmModal
                    message="나가기에 실패했습니다.&#10;다시 시도해주세요."
                    confirmLabel="확인"
                    onConfirm={() => setModal(null)}
                    onCancel={() => setModal(null)}
                    isError
                />
            )}

            <div className="relative mx-auto min-h-screen w-full max-w-[430px] bg-white">
                <div className="flex h-screen flex-col">
                    <GroupInfoHeader
                        onBack={() => navigate(-1)}
                    />

                    {isEditing ? (
                        /* ── 수정 모드 ── */
                        <>
                            <div className="flex-1 overflow-y-auto">
                                <GroupEditForm
                                    roomId={Number(roomId)}
                                    defaultValues={{
                                        roomName: roomInfo.roomName,
                                        region: roomInfo.region,
                                        maxParticipantCount: roomInfo.maxParticipantCount,
                                        category: roomInfo.category,
                                        roomImage: roomInfo.roomImage ?? "",
                                    }}
                                    onSuccess={() => {
                                        refetch();           // 데이터 다시 fetch
                                        setIsEditing(false);
                                    }}
                                    onCancel={() => setIsEditing(false)}
                                />
                            </div>
                            {/* 확인 버튼 — 폼 내부 submit 트리거 */}
                            <div className="px-5 pb-8 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => {
                                        // GroupEditForm 내부 handleSubmit을 ref로 올릴 수도 있지만
                                        // 단순하게 form submit 이벤트로 올리는 방식
                                        document.getElementById("group-edit-submit")?.click();
                                    }}
                                    className="w-full h-12 bg-orange-500 text-white rounded-xl font-semibold text-sm"
                                >
                                    확인
                                </button>
                            </div>
                        </>
                    ) : (
                        /* ── 조회 모드 ── */
                        <>
                            <div className="px-5 flex-1 overflow-y-auto">
                                <GroupInfoCard
                                    roomImage={roomInfo.roomImage ?? ""}
                                    roomName={roomInfo.roomName}
                                    participantCount={roomInfo.participantCount}
                                    maxParticipantCount={roomInfo.maxParticipantCount}
                                />
                                <div className="mt-10">
                                    <label className="text-sm font-bold block mb-2">카테고리</label>
                                    <div className="text-sm h-12 border border-gray-200 rounded-xl px-4 flex items-center">
                                        {roomInfo.category}
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <label className="text-sm font-bold block mb-2">지역</label>
                                    <div className="text-sm h-12 border border-gray-200 rounded-xl px-4 flex items-center">
                                        {roomInfo.region}
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <MemberAvatarList members={roomInfo.members} roomId={Number(roomId)}/>
                                </div>
                            </div>
                            <GroupInfoFooter
                                onEdit={() => setIsEditing(true)}
                                onLeave={() => setModal("confirm")}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}