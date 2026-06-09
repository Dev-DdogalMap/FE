import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  getMyActivityDetail,
  updateRepresentativeBadge,
} from "@/features/myPage/api/myPageApi";
import type { ActivityDetailResponse } from "@/features/myPage/model/myPageTypes";
import ActivityLevelCard from "@/features/myPage/ui/activity/ActivityLevelCard";
import BadgeGrid from "@/features/myPage/ui/activity/BadgeGrid";
import BadgeSelectModal from "@/features/myPage/ui/activity/BadgeSelectModal";
import LevelHistoryList from "@/features/myPage/ui/activity/LevelHistoryList";
import RepresentativeBadgeCard from "@/features/myPage/ui/activity/RepresentativeBadgeCard";
import { useAuth } from "@/shared/auth/AuthContext";
import ErrorView from "@/shared/ui/ErrorView";
import LoadingView from "@/shared/ui/LoadingView";

const MyActivityPage = () => {
  const navigate = useNavigate();
  const { accessToken, refreshAccessToken } = useAuth();

  const [data, setData] = useState<ActivityDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [badgeModalOpen, setBadgeModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchMyActivityDetail = async () => {
            try {
                setLoading(true);
                setError(false);

                const result = await getMyActivityDetail({
                    accessToken,
                    refreshAccessToken,
                });

                if (!isMounted) return;

                setData(result);
            } catch (error) {
                if (!isMounted) return;

                console.error("활동 상세 조회 실패", error);
                setError(true);
                setData(null);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
    };

    fetchMyActivityDetail();

    return () => {
        isMounted = false;
    };
    }, [accessToken, refreshAccessToken]);

  const handleChangeRepresentativeBadge = async (badgeId: number) => {
    if (!data) return;

    if (data.representativeBadge?.badgeId === badgeId) {
      setBadgeModalOpen(false);
      return;
    }

    try {
      setSubmitting(true);

      const updatedBadge = await updateRepresentativeBadge(
        { badgeId },
        {
          accessToken,
          refreshAccessToken,
        },
      );

      setData((prev) =>
        prev
          ? {
              ...prev,
              representativeBadge: updatedBadge,
            }
          : prev,
      );

      toast.success("대표 배지가 변경되었어요");
      setBadgeModalOpen(false);
    } catch (error) {
      console.error("대표 배지 변경 실패", error);
      toast.error("대표 배지 변경에 실패했어요");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <LoadingView
        title="활동 내역을 불러오는 중이에요"
        description="잠시만 기다려주세요"
        heightClassName="min-h-[70vh]"
      />
    );
  }

  if (error || !data) {
    return (
      <ErrorView
        title="활동 내역을 불러오지 못했어요"
        description="잠시 후 다시 시도해주세요"
        heightClassName="min-h-[70vh]"
      />
    );
  }

  const acquiredBadges = data.badges.filter((badge) => badge.acquired);

  return (
    <>
      <div className="min-h-screen bg-white pb-10">
        <div className="px-6 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-1 text-sm font-medium text-gray-500 active:scale-[0.98]"
            aria-label="뒤로가기"
          >
            <ArrowLeft size={18} />
            뒤로가기
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">활동 내역</h1>
            <p className="mt-1 text-sm text-gray-400">
              레벨, 배지, 경험치 기록을 확인해요
            </p>
          </div>
        </div>

        <div className="space-y-4 px-6 py-5">
          <ActivityLevelCard level={data.level} />

          <RepresentativeBadgeCard
            badge={data.representativeBadge}
            onChangeClick={() => setBadgeModalOpen(true)}
          />

          <BadgeGrid badges={data.badges} />

          <LevelHistoryList histories={data.levelHistories} />
        </div>
      </div>

      <BadgeSelectModal
        open={badgeModalOpen}
        badges={acquiredBadges}
        selectedBadgeId={data.representativeBadge?.badgeId}
        submitting={submitting}
        onClose={() => setBadgeModalOpen(false)}
        onSelect={handleChangeRepresentativeBadge}
      />
    </>
  );
};

export default MyActivityPage;