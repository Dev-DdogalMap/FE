// JoinFailModal.tsx
import { createPortal } from "react-dom";

interface Props {
  onClose: () => void;
}

export function JoinFailModal({ onClose }: Props) {
  return createPortal(
    <div className="fixed inset-0 z-10000 flex items-center justify-center bg-black/40">
      <div className="w-80 rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="text-base font-bold text-gray-900">참여 불가</h2>
        <p className="mt-2 text-sm text-gray-500">
          채팅방 참여에 실패했습니다.
          <br />
          정원이 초과되었거나 참여할 수 없는 방입니다.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-gray-100 py-2.5 text-sm font-semibold text-gray-700"
        >
          확인
        </button>
      </div>
    </div>,
    document.body
  );
}