// JoinConfirmModal.tsx
import type { ChatRoomListThumbnailResponse } from "../model/groupChatTypes";
import { createPortal } from "react-dom";  //부모 레이아웃 안나오게 하기 위함

interface Props {
  room: ChatRoomListThumbnailResponse;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function JoinConfirmModal({ room, onConfirm, onCancel, isLoading }: Props) {
  return createPortal(
    <div className="fixed inset-0 z-10000 flex items-center justify-center bg-black/40">
      <div className="w-80 rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="text-base font-bold text-gray-900">{room.roomName}</h2>
        <p className="mt-2 text-sm text-gray-500">
          이 채팅방에 참여하시겠습니까?
          <br />
          ({room.participantCount}/{room.maxParticipantCount}명 참여 중)
        </p>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm text-gray-500"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 rounded-xl bg-[#FF6B00] py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isLoading ? "참여 중..." : "참여"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}