import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { getChatPreference, updateChatPreference } from "@/features/myPage/api/myPageApi";
import { useAuth } from "@/shared/auth/AuthContext";

const MySettingsPage = () => {
  const navigate = useNavigate();
  const { accessToken, refreshAccessToken, isLoading } = useAuth();

  const [chatEnabled, setChatEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!accessToken) {
      setLoading(false);
      toast.error("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    getChatPreference({ accessToken, refreshAccessToken })
      .then((response) => {
        setChatEnabled(response.chatEnabled);
      })
      .catch((error) => {
        console.error(error);
        toast.error("채팅 설정을 불러오지 못했습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [accessToken, isLoading, navigate, refreshAccessToken]);

  const handleToggle = async () => {
    if (saving || loading) return;

    const nextValue = !chatEnabled;
    setChatEnabled(nextValue);
    setSaving(true);

    try {
      const response = await updateChatPreference(
        { chatEnabled: nextValue },
        { accessToken, refreshAccessToken },
      );

      setChatEnabled(response.chatEnabled);
      toast.success(response.chatEnabled ? "채팅 수신을 허용했습니다." : "채팅 수신을 거부했습니다.");
    } catch (error) {
      console.error(error);
      setChatEnabled(!nextValue);
      toast.error("채팅 설정 변경에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-screen-sm flex-col gap-6 p-4">
      <div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 text-sm font-medium text-gray-500"
        >
          뒤로가기
        </button>

        <h1 className="text-xl font-bold text-gray-900">설정</h1>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-gray-900">채팅 설정</p>
            <p className="mt-1 text-sm text-gray-500">
              {chatEnabled ? "다른 사용자가 나에게 1:1 대화를 걸 수 있습니다." : "내 프로필이 맛잘알 목록에 표시되지 않습니다."}
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={chatEnabled}
            disabled={loading || saving}
            onClick={handleToggle}
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-50 ${
              chatEnabled ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                chatEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </section>

      {loading && (
        <p className="text-sm text-gray-500">설정을 불러오는 중...</p>
      )}
    </div>
  );
};

export default MySettingsPage;
