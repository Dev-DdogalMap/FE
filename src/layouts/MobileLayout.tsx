import { Outlet } from "react-router-dom";

import Header from "../widgets/Header";
import BottomNav from "../widgets/BottomNav";

export default function MobileLayout() {
  return (
    <div className="min-h-screen w-full bg-gray-100">
      <div className="relative mx-auto min-h-screen w-full max-w-[430px] bg-white">
        <Header />

        <main className="pb-16">
          <Outlet />
        </main>

        <BottomNav />
      </div>
    </div>
  );
}