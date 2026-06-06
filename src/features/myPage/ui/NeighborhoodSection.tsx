import { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/shared/auth/AuthContext";

import { toast } from "sonner";
import { getMyRegion } from "../api/myPageApi";
import type { MyNeighborhoodResponse } from "../model/myPageTypes";

const MyNeighborhoodSection = () => {
  const navigate = useNavigate();

const {isLoading, accessToken, refreshAccessToken } = useAuth();

  const [regionInfo, setRegionInfo] =
    useState<MyNeighborhoodResponse | null>(null);

  const isVerified = regionInfo?.verified ?? false;

  useEffect(() => {
    const fetchRegion = async () => {
      try {
        const result = await getMyRegion({
          accessToken,
          refreshAccessToken,
        });

        setRegionInfo(result);
      } catch (error) {
        console.error(error);
      }
    };

    if (accessToken) {
      fetchRegion();
    }
  }, [
    accessToken,
    refreshAccessToken,
  ]);

  const visitPath = `/mypage/neighborhood-verification`;

  const handleVerify = () => {
    if (isLoading) {
      toast.info("로그인 상태 확인 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    navigate(visitPath);
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
              <p className="text-xs text-gray-400">
                나의 동네
              </p>

              <p className="font-semibold text-gray-900">
                {isVerified
                  ? regionInfo?.eupmyeondongName
                  : "동네 미인증"}
              </p>
            </div>
          </div>

          <button
             onClick={handleVerify}
            className="rounded-lg cursor-pointer border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
          >
            {isVerified ? "재인증" : "인증하기"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default MyNeighborhoodSection;