import { useEffect, useState } from "react";
import { CircleUserRound, Mail } from "lucide-react";

import { useAuth } from "@/shared/auth/AuthContext";

import { getMyProfile } from "../api/myPageApi";
import type { MyProfileResponse } from "../model/myPageTypes";

const MyProfileSection = () => {
  const { isLoading, accessToken, refreshAccessToken } = useAuth();

  const [profile, setProfile] = useState<MyProfileResponse | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (isLoading || !accessToken) return;

    let isMounted = true;

    const fetchProfile = async () => {
      setIsFetching(true);

      try {
        const result = await getMyProfile({
          accessToken,
          refreshAccessToken,
        });

        if (!isMounted) return;
        setProfile(result);
      } catch (error) {
        if (!isMounted) return;

        console.error("프로필 조회 실패", error);
        setProfile(null);
      } finally {
        if (isMounted) {
          setIsFetching(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [isLoading, accessToken, refreshAccessToken]);

  const nickname = profile?.nickname ?? "사용자";
  const email = profile?.email ?? "-";

  return (
    <section className="mx-6 mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="p-5">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 overflow-hidden rounded-3xl border border-gray-100 bg-gray-50 shadow-sm">
            {profile?.profileImageUrl ? (
              <img
                src={profile.profileImageUrl}
                alt="프로필 이미지"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <CircleUserRound
                  size={42}
                  className="text-gray-300"
                  strokeWidth={1.8}
                />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-400">내 프로필</p>

            <h2 className="mt-1 truncate text-2xl font-extrabold text-gray-900">
              {isFetching ? "불러오는 중..." : nickname}
            </h2>

            <div className="mt-2 flex items-center gap-2">
              <Mail size={14} className="shrink-0 text-gray-400" />

              <span className="truncate text-sm text-gray-500">
                {isFetching ? "-" : email}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyProfileSection;