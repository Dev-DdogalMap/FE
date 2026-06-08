// ConfirmModal.tsx
interface Props {
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isError?: boolean;
}

export default function ConfirmModal({
  message,
  confirmLabel = "확인",
  cancelLabel = "취소",
  onConfirm,
  onCancel,
  isError = false,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="mx-4 w-full max-w-[320px] rounded-2xl bg-white px-6 py-7 shadow-xl">
        <p className="text-center text-sm font-medium text-gray-800 leading-relaxed">
          {message}
        </p>
        <div className="mt-6 flex gap-2">
          {!isError && (
            <button
              onClick={onCancel}
              className="flex-1 h-11 rounded-xl border border-gray-200 text-sm text-gray-500 font-medium"
            >
              {cancelLabel}
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`flex-1 h-11 rounded-xl text-sm font-semibold text-white ${
              isError ? "bg-gray-400" : "bg-orange-500"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}