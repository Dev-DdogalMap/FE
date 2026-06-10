import { useEffect, useState } from "react";

import { useAuth } from "@/shared/auth/AuthContext";

import { getMyStats } from "../api/myPageApi";
import type { MyStatsResponse } from "../model/myPageTypes";

const MyStatsSection = () => {
  const { isLoading, accessToken, refreshAccessToken } = useAuth();

  const [stats, setStats] = useState<MyStatsResponse | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    if (!accessToken) {
      setStats(null);
      setIsFetching(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setIsFetching(true);

        const result = await getMyStats({
          accessToken,
          refreshAccessToken,
        });

        setStats(result);
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchStats();
  }, [isLoading, accessToken, refreshAccessToken]);

  return (
    <section className="mx-6 mt-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="grid grid-cols-4 divide-x divide-gray-100 py-5">
        <div className="flex flex-col items-center">
          <span className="text-sm font-bold text-gray-800">방문 인증</span>
          <div className="mt-3 flex items-baseline gap-1">
            <strong className="text-3xl font-extrabold text-orange-500">
              {isFetching ? "-" : (stats?.visitCount ?? 0)}
            </strong>
            <span className="text-sm font-semibold text-gray-700">회</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-sm font-bold text-gray-800">작성한 후기</span>
          <div className="mt-3 flex items-baseline gap-1">
            <strong className="text-3xl font-extrabold text-gray-900">
              {isFetching ? "-" : (stats?.reviewCount ?? 0)}
            </strong>
            <span className="text-sm font-semibold text-gray-700">개</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-sm font-bold text-gray-800">북마크</span>
          <div className="mt-3 flex items-baseline gap-1">
            <strong className="text-3xl font-extrabold text-gray-900">
              {isFetching ? "-" : (stats?.bookmarkCount ?? 0)}
            </strong>
            <span className="text-sm font-semibold text-gray-700">개</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-sm font-bold text-gray-800">채팅방</span>
          <div className="mt-3 flex items-baseline gap-1">
            <strong className="text-3xl font-extrabold text-gray-900">
              {isFetching ? "-" : (stats?.chatRoomCount ?? 0)}
            </strong>
            <span className="text-sm font-semibold text-gray-700">개</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyStatsSection;