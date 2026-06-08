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
    <>
      <div>MyMenuList</div>

      <p className="pl-6 text-gray-600">작성한 후기</p>
      <p className="pl-6 text-gray-600">고객센터</p>

      <button
        type="button"
        onClick={handleWithdraw}
        className="block pl-6 text-left text-gray-600"
      >
        회원탈퇴
      </button>

      <p className="pl-6 text-gray-600">Settings</p>
    </>
  );
};

export default MyMenuList;