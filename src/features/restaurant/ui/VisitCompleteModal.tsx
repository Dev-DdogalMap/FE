import { createPortal } from "react-dom";

type Props = {
  restaurantName: string;
  onReviewClick: () => void;
  onLaterClick: () => void;
  onClose: () => void;
};

const VisitCompleteModal = ({
  restaurantName,
  onReviewClick,
  onLaterClick,
  onClose,
}: Props) => {
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-6">
      <div className="relative w-full max-w-[360px] rounded-[28px] bg-white px-6 pb-7 pt-10 text-center shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-2xl text-gray-500"
          aria-label="닫기"
        >
          ×
        </button>

        <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-3xl bg-orange-50 text-7xl">
          🏠
        </div>

        <h2 className="mt-7 text-2xl font-extrabold text-gray-900">
          방문 인증 완료!
        </h2>

        <p className="mt-3 text-base font-semibold text-gray-600">
          {restaurantName}
        </p>

        <p className="mt-2 text-sm font-medium text-gray-500">
          좋은 맛집 경험을 기록해보세요.
        </p>

        <button
          type="button"
          onClick={onReviewClick}
          className="mt-8 h-14 w-full rounded-2xl bg-[#ff6b00] text-lg font-bold text-white"
        >
          후기 작성하기
        </button>

        <button
          type="button"
          onClick={onLaterClick}
          className="mt-3 h-14 w-full rounded-2xl border border-gray-200 bg-white text-lg font-bold text-gray-800"
        >
          나중에 할게요
        </button>
      </div>
    </div>,
    document.body,
  );
};

export default VisitCompleteModal;