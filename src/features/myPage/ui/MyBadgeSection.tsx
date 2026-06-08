import { useEffect, useState } from "react";
import { Medal } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getMyActivity } from "../api/myPageApi";
import type { ActivitySummaryResponse } from "../model/myPageTypes";
import { useAuth } from "@/shared/auth/AuthContext";
import { COLORS } from "@/shared/constants/colors";

const MyBadgeSection = () => {
  const navigate = useNavigate();
  const { accessToken, refreshAccessToken } = useAuth();

  const [data, setData] = useState<ActivitySummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyActivity = async () => {
      try {
        const result = await getMyActivity({
          accessToken,
          refreshAccessToken,
        });

        setData(result);
      } catch (error) {
        console.error("활동 현황 조회 실패", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyActivity();
  }, [accessToken, refreshAccessToken]);

  if (loading) {
    return (
      <section className="mt-6 px-6">
        <div className="rounded-3xl bg-white p-5 text-sm text-gray-400 shadow-sm">
          활동 현황을 불러오는 중이에요.
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="mt-6 px-6">
        <div className="rounded-3xl bg-white p-5 text-sm text-gray-400 shadow-sm">
          활동 현황을 불러오지 못했어요.
        </div>
      </section>
    );
  }

  const { level, badges } = data;
  const representativeBadge = badges.representativeBadge;
  const recentBadges = badges.recentBadges;
  const progressPercent = Math.min(Math.max(level.progressPercent, 0), 100);

  return (
    <section className="mt-6 px-6">
      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">활동 현황</h2>

          <button
            type="button"
            onClick={() => navigate("/mypage/activity")}
            className="text-sm font-medium text-gray-400"
          >
            전체 보기
          </button>
        </div>

        <div
          className="rounded-2xl p-4"
          style={{ backgroundColor: COLORS.PRIMARY_PALE }}
        >
          <div className="mb-4 flex items-center gap-3">
            <div
              className={`flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl shadow-sm ${
                representativeBadge ? "bg-white" : "bg-gray-100"
              }`}
            >
              {representativeBadge ? (
                <img
                  src={representativeBadge.iconImage}
                  alt={representativeBadge.name}
                  className="h-11 w-11 object-contain"
                />
              ) : (
                <Medal size={28} className="text-gray-400" />
              )}
            </div>

            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: COLORS.PRIMARY }}
              >
                대표 배지
              </p>

              <p className="text-lg font-bold text-gray-900">
                {representativeBadge?.name ?? "대표 배지 없음"}
              </p>
            </div>
          </div>

          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-gray-500">
                현재 맛집 레벨
              </p>

              <p className="text-base font-bold text-gray-900">
                Lv.{level.currentLevel} {level.currentLevelName}
              </p>
            </div>

            <p className="shrink-0 text-xs text-gray-500">
              다음 레벨까지 {level.remainingExpToNextLevel} EXP
            </p>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: COLORS.PRIMARY,
              }}
            />
          </div>

          <p className="mt-2 text-right text-xs text-gray-500">
            {level.currentExp} EXP
          </p>
        </div>

        <div className="mt-5">
          <p className="mb-3 text-sm font-semibold text-gray-700">
            최근 획득 배지
          </p>

          {recentBadges.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {recentBadges.map((badge) => (
                <div
                  key={badge.badgeId}
                  className="flex min-h-24 items-center justify-center rounded-2xl bg-gray-50 px-2 py-3"
                >
                  <img
                    src={badge.iconImage}
                    alt={badge.name}
                    className="h-20 w-20 object-contain"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-gray-50 px-4 py-6 text-center text-sm text-gray-400">
              아직 획득한 배지가 없어요.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyBadgeSection;