import {
  CheckCircle,
  ChevronRight,
  HelpCircle,
  Settings,
  UserRoundX,
  type LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type MenuItem = {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
};

const menuItems: MenuItem[] = [
  {
    id: "reviews",
    label: "작성한 후기",
    path: "/my/reviews",
    icon: CheckCircle,
  },
  {
    id: "support",
    label: "고객센터",
    path: "/support",
    icon: HelpCircle,
  },
  {
    id: "withdraw",
    label: "회원탈퇴",
    path: "/withdraw",
    icon: UserRoundX,
  },
  {
    id: "settings",
    label: "Settings",
    path: "/mypage/settings",
    icon: Settings,
  },
];

const MyMenuList = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-[430px] px-4">
      <div className="w-full overflow-hidden rounded-2xl bg-white">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isLastItem = index === menuItems.length - 1;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.path)}
              className={`flex min-h-[64px] w-full cursor-pointer items-center justify-between px-4 text-left transition-colors hover:bg-[#fafafa] ${
                isLastItem ? "" : "border-b border-[#f0f0f0]"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon size={22} strokeWidth={2} className="text-gray-500" />
                <span className="text-base font-medium text-[#222]">
                  {item.label}
                </span>
              </span>

              <ChevronRight size={20} strokeWidth={2} className="text-[#999]" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MyMenuList;
