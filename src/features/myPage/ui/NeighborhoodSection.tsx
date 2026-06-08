import { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/shared/auth/AuthContext";

import { toast } from "sonner";
import { getMyRegion } from "../api/myPageApi";
import type { MyNeighborhoodResponse } from "../model/myPageTypes";

const MyNeighborhoodSection = () => {
  const navigate = useNavigate();
  const { isLoading, accessToken, refreshAccessToken } = useAuth();

  const [regionInfo, setRegionInfo] = useState<MyNeighborhoodResponse | null>(null);
  const [isFetching, setIsFetching] = useState(true); 
  
  const isVerified = regionInfo?.verified ?? false;

  useEffect(() => {
    // AuthContext 로딩 중이면 대기
    if (isLoading) return;

    // 로그인 안 된 상태면 fetch 안 함
    if (!accessToken) {
      setRegionInfo(null);
      setIsFetching(false);
      return;
    }

    const fetchRegion = async () => {
      try {
        setIsFetching(true);
        const result = await getMyRegion({
          accessToken,
          refreshAccessToken,
        });
        setRegionInfo(result);
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchRegion();
  }, [isLoading, accessToken]);

  const visitPath = `/mypage/neighborhood-verification`;

  const handleVerify = () => {
    if (isLoading) {
      toast.info("로그인 상태 확인 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    navigate(visitPath);
  };

  // 로딩 중일 때 표시할 텍스트
  const renderRegionText = () => {
    if (isLoading || isFetching) {
      return (
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-orange-500" />
          <span className="text-gray-400">불러오는 중...</span>
        </span>
      );
    }
    
    if (isVerified) {
      return regionInfo?.eupmyeondongName;
    }
    
    return "동네 미인증";
  };

  return (
    <section className="mb-6">
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
              <FaMapMarkerAlt className="text-orange-500" />
            </div>

            <div>
              <p className="text-xs text-gray-400">나의 동네</p>
              <p className="font-semibold text-gray-900">
                {renderRegionText()}
              </p>
            </div>
          </div>

          <button
            onClick={handleVerify}
            disabled={isLoading || isFetching} // ←로딩 중 비활성화
            className="rounded-lg cursor-pointer border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading || isFetching
              ? "확인 중..."
              : isVerified
                ? "재인증"
                : "인증하기"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default MyNeighborhoodSection;