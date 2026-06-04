import logo from "@/assets/images/logo.png";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "@/shared/config/api";

export default function LoginPage() {

  const handleKakaoLogin = () => {
  if (!sessionStorage.getItem("redirectAfterLogin")) {
    sessionStorage.setItem("redirectAfterLogin", "/");
  }

  window.location.href = `${API_BASE_URL}/api/auth/kakao/login`;
};

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-white px-8">
        <main className="flex flex-1 flex-col items-center justify-center">
          <section className="w-full text-center">
            <Link to="/" aria-label="홈으로 이동" className="inline-block">
                <img
                    src={logo}
                    alt="또갈지도"
                    className="mx-auto h-12 w-auto"
                />
            </Link>

            <p className="mt-4 text-[15px] font-medium tracking-[-0.04em] text-gray-600">
              동네 맛집, 믿고 <span className="font-bold text-[#FF6B00]">또</span> 가는 지도
            </p>

            <div className="relative mx-auto mt-10 h-[310px] w-full max-w-[350px] overflow-hidden rounded-[32px] bg-gradient-to-b from-[#FFF7ED] to-white">
              <div className="absolute left-1/2 top-8 h-28 w-28 -translate-x-1/2 rounded-full bg-[#FF7A00] opacity-15 blur-2xl" />

              <div className="absolute left-1/2 top-10 flex h-28 w-28 -translate-x-1/2 items-center justify-center rounded-full bg-[#FF7A00] shadow-xl shadow-orange-200">
                <div className="h-10 w-10 rounded-full bg-white" />
              </div>

              <div className="absolute left-1/2 top-[122px] h-28 w-16 -translate-x-1/2 rounded-b-full bg-[#FF7A00]" />

              <div className="absolute bottom-0 left-1/2 h-[145px] w-[300px] -translate-x-1/2 rounded-t-[42px] bg-[#F6E7CC]" />

              <div className="absolute bottom-8 left-1/2 grid h-[110px] w-[260px] -translate-x-1/2 grid-cols-3 gap-2 rounded-[26px] bg-[#FFF4DE] p-3 shadow-inner">
                <div className="rounded-2xl bg-white" />
                <div className="rounded-2xl bg-[#DDEECD]" />
                <div className="rounded-2xl bg-white" />
                <div className="rounded-2xl bg-[#F9DFAF]" />
                <div className="rounded-2xl bg-white" />
                <div className="rounded-2xl bg-[#DDEECD]" />
              </div>

              <div className="absolute bottom-8 left-2 flex h-24 w-24 items-center justify-center rounded-full bg-[#3B2415] shadow-lg">
                <span className="text-[52px]">🍲</span>
              </div>

              <div className="absolute bottom-4 right-0 flex h-28 w-28 items-center justify-center rounded-full bg-[#FFF3D7] shadow-lg">
                <span className="text-[58px]">🍛</span>
              </div>

              <div className="absolute bottom-0 left-1/2 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-lg">
                <span className="text-[42px]">☕</span>
              </div>

              <div className="absolute left-5 top-[118px] text-[32px]">🏠</div>
              <div className="absolute right-5 top-[118px] text-[32px]">🏢</div>
              <div className="absolute right-8 top-8 text-[28px]">🧡</div>
            </div>

            <h1 className="mt-9 text-[25px] font-extrabold leading-tight tracking-[-0.05em] text-gray-900">
              우리 동네 <span className="text-[#FF6B00]">찐맛집</span>을 찾아보세요
            </h1>

            <p className="mt-5 text-[14px] leading-[1.7] tracking-[-0.04em] text-gray-500">
              실제 거주 인증한 주민들의 리뷰로
              <br />
              믿을 수 있는 동네 맛집을 추천해드려요.
            </p>

            <button
                type="button"
                onClick={handleKakaoLogin}
                className="mt-8 flex h-[54px] w-full items-center justify-center rounded-[10px] bg-[#FFE500] text-[16px] font-extrabold tracking-[-0.04em] text-[#1F1400] shadow-sm active:scale-[0.98]"
                >
                <span className="mr-3 text-[20px]">💬</span>
                카카오로 시작하기
            </button>

            <p className="mt-4 text-center text-[11px] leading-5 tracking-[-0.03em] text-gray-400">
                카카오로 시작하면 또갈지도의{" "}
                <Link
                    to="/terms"
                    className="font-semibold text-gray-500 underline underline-offset-2"
                >
                    이용약관
                </Link>
                과{" "}
                <Link
                    to="/privacy"
                    className="font-semibold text-gray-500 underline underline-offset-2"
                >
                    개인정보처리방침
                </Link>
                에 동의한 것으로 간주됩니다.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
