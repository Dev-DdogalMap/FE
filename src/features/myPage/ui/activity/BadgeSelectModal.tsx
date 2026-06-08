import { Check, X } from "lucide-react";

import type { BadgeDetail } from "../../model/myPageTypes";
import { COLORS } from "@/shared/constants/colors";

type BadgeSelectModalProps = {
  open: boolean;
  badges: BadgeDetail[];
  selectedBadgeId?: number;
  submitting: boolean;
  onClose: () => void;
  onSelect: (badgeId: number) => void;
};

const BadgeSelectModal = ({
  open,
  badges,
  selectedBadgeId,
  submitting,
  onClose,
  onSelect,
}: BadgeSelectModalProps) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 px-5"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[390px] rounded-3xl bg-white px-5 pb-6 pt-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              대표 배지 선택
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              획득한 배지만 대표 배지로 설정할 수 있어요.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="모달 닫기"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition active:scale-95"
          >
            <X size={18} />
          </button>
        </div>

        {badges.length > 0 ? (
          <div className="grid max-h-[420px] grid-cols-3 gap-3 overflow-y-auto pr-1">
            {badges.map((badge) => {
              const selected = badge.badgeId === selectedBadgeId;

              return (
                <button
                  key={badge.badgeId}
                  type="button"
                  disabled={submitting}
                  onClick={() => onSelect(badge.badgeId)}
                  className={`relative flex min-h-[120px] flex-col items-center justify-center rounded-2xl border px-2 py-3 transition active:scale-95 disabled:opacity-60 ${
                    selected
                      ? "border-orange-300 bg-orange-50"
                      : "border-gray-100 bg-gray-50"
                  }`}
                >
                  {selected && (
                    <div
                      className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-white"
                      style={{ backgroundColor: COLORS.PRIMARY }}
                    >
                      <Check size={13} strokeWidth={3} />
                    </div>
                  )}

                  <img
                    src={badge.iconImage}
                    alt={badge.name}
                    className="h-20 w-20 object-contain"
                  />

                  {selected && (
                    <p
                      className="mt-2 text-[10px] font-semibold"
                      style={{ color: COLORS.PRIMARY }}
                    >
                      현재 대표
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl bg-gray-50 px-4 py-10 text-center">
            <p className="text-sm font-semibold text-gray-500">
              아직 획득한 배지가 없어요.
            </p>

            <p className="mt-1 text-xs text-gray-400">
              활동을 완료하면 배지를 획득할 수 있어요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgeSelectModal;