import { NavLink } from "react-router-dom";

import HomeIcon from "@/shared/ui/HomeIcon";
import SearchIcon from "@/shared/ui/SearchIcon";
import BookmarkIcon from "@/shared/ui/BookmarkIcon";
import ChatIcon from "@/shared/ui/ChatIcon";
import UserIcon from "@/shared/ui/UserIcon";
import { COLORS } from "@/shared/constants/colors";

const menus = [
  {
    path: "/",
    label: "홈",
    icon: HomeIcon,
  },
  {
    path: "/search",
    label: "검색",
    icon: SearchIcon,
  },
  {
    path: "/bookmark",
    label: "나의 맛집",
    icon: BookmarkIcon,
  },
  {
    path: "/chat",
    label: "채팅",
    icon: ChatIcon,
  },
  {
    path: "/mypage",
    label: "마이",
    icon: UserIcon,
  },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-50 h-16 w-full max-w-[430px] -translate-x-1/2 border-t border-gray-100 bg-white">
      <div className="flex h-full items-center justify-around">
        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <NavLink
              key={menu.path}
              to={menu.path}
              end={menu.path === "/"}
            >
              {({ isActive }) => (
                <div
                  style={{
                    color: isActive ? COLORS.PRIMARY : "#9CA3AF",
                  }}
                  className="flex flex-col items-center"
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs">
                    {menu.label}
                  </span>
                </div>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}