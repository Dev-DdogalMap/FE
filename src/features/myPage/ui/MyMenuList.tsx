import { ChevronRight, CircleHelp, Edit3, Settings, UserX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/auth/AuthContext";

const MyMenuList = () => {
  const navigate = useNavigate();
  const { withdraw } = useAuth();

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
    <section className="mx-6 mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <button
        type="button"
        className="flex w-full items-center justify-between border-b border-gray-100 px-5 py-5 text-left"
      >
        <div className="flex items-center gap-3">
          <Edit3 size={20} className="text-gray-500" />
          <span className="text-base font-bold text-gray-800">작성한 후기</span>
        </div>
        <ChevronRight size={22} className="text-gray-400" />
      </button>

      <button
        type="button"
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
        className="flex w-full items-center justify-between px-5 py-5 text-left"
      >
        <div className="flex items-center gap-3">
          <Settings size={20} className="text-gray-500" />
          <span className="text-base font-bold text-gray-800">Settings</span>
        </div>
        <ChevronRight size={22} className="text-gray-400" />
      </button>
    </section>
  );
};

export default MyMenuList;