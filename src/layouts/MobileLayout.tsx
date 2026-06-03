import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "../widgets/BottomNav";
import Header from "../widgets/Header";

export default function MobileLayout() {
  const location = useLocation();


  const hideBottomNav =
    location.pathname.startsWith("/restaurants") ||
    location.pathname.startsWith("/chat/direct") ||
    location.pathname.startsWith("/chat/groups/create");

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <div className="relative mx-auto min-h-screen w-full max-w-[430px] bg-white">
        <Header />
        <main
          className={
            hideBottomNav
              ? ""
              : "pb-16"
          }
        >
          <Outlet />
        </main>

        {!hideBottomNav && <BottomNav />}
      </div>
    </div>
  );
}
