import MyBadgeSection from "@/features/myPage/ui/MyBadgeSection";
import MyMenuList from "@/features/myPage/ui/MyMenuList";
import MyProfileSection from "@/features/myPage/ui/MyProfileSection";
import MyStatsSection from "@/features/myPage/ui/MyStatsSection";
import MyNeighborhoodSection from "@/features/myPage/ui/NeighborhoodSection";

const MyPage = () => {


  return (
    <div className="pb-16">
      <MyProfileSection />
      <MyStatsSection />
      <MyNeighborhoodSection />
      <MyBadgeSection />
      <MyMenuList />
    </div>
  );
};

export default MyPage;