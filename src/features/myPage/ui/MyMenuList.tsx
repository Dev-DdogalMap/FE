import {
  ChevronRight,
  CircleHelp,
  Edit3,
  Settings,
  UserX,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { useState } from "react";
import { useAuth } from "@/shared/auth/AuthContext";

const MyMenuList = () => {
  const navigate = useNavigate();
  const { withdraw } = useAuth();

  const [isCustomerCenterOpen, setIsCustomerCenterOpen] = useState(false);

  const handleWithdraw = async () => {
    const ok = window.confirm(
      "정말 회원탈퇴 하시겠습니까?\n탈퇴 후 다시 로그인하면 새 계정으로 가입됩니다."
    );

    if (!ok) return;

    try {
      await withdraw();

      alert("회원탈퇴가 완료되었습니다.");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);
      alert("회원탈퇴에 실패했습니다.");
    }
  };

  return (
    <>
      <section className="mx-6 mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <button
          type="button"
          className="flex w-full items-center justify-between border-b border-gray-100 px-5 py-5 text-left"
        >
          <div className="flex items-center gap-3">
            <Edit3 size={20} className="text-gray-500" />
            <span className="text-base font-bold text-gray-800">
              작성한 후기
            </span>
          </div>
          <ChevronRight size={22} className="text-gray-400" />
        </button>

        <button
          type="button"
          onClick={() => setIsCustomerCenterOpen(true)}
          className="flex w-full items-center justify-between border-b border-gray-100 px-5 py-5 text-left"
        >
          <div className="flex items-center gap-3">
            <CircleHelp size={20} className="text-gray-500" />
            <span className="text-base font-bold text-gray-800">고객센터</span>
          </div>
          <ChevronRight size={22} className="text-gray-400" />
        </button>

        <button
          type="button"
          onClick={handleWithdraw}
          className="flex w-full items-center justify-between border-b border-gray-100 px-5 py-5 text-left"
        >
          <div className="flex items-center gap-3">
            <UserX size={20} className="text-gray-500" />
            <span className="text-base font-bold text-gray-800">회원탈퇴</span>
          </div>
          <ChevronRight size={22} className="text-gray-400" />
        </button>

        <button
          type="button"
          onClick={() => navigate("/mypage/settings")}
          className="flex w-full items-center justify-between px-5 py-5 text-left"
        >
          <div className="flex items-center gap-3">
            <Settings size={20} className="text-gray-500" />
            <span className="text-base font-bold text-gray-800">Settings</span>
          </div>
          <ChevronRight size={22} className="text-gray-400" />
        </button>
      </section>

      {isCustomerCenterOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/35 px-6"
            onClick={() => setIsCustomerCenterOpen(false)}
          >
            <section
              className="w-full max-w-[340px] rounded-3xl bg-white p-6 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-gray-900">
                  고객센터
                </h2>

                <button
                  type="button"
                  onClick={() => setIsCustomerCenterOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-gray-100 text-gray-500"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="mt-4 text-sm leading-6 text-gray-600">
                문의/신고 기능은 준비 중입니다.
                <br />
                급한 문의는 관리자에게 문의해주세요.
                (viviammm@naver.com)
              </p>

              <button
                type="button"
                onClick={() => setIsCustomerCenterOpen(false)}
                className="mt-5 h-12 w-full rounded-2xl bg-orange-500 text-base font-extrabold text-white"
              >
                확인
              </button>
            </section>
          </div>,
          document.body
        )}
    </>
  );
};

export default MyMenuList;
