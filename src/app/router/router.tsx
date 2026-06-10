import { createBrowserRouter } from "react-router-dom";

import MobileLayout from "@/layouts/MobileLayout";

import LoginPage from "@/pages/auth/LoginPage";
import OAuthSuccessPage from "@/pages/auth/OAuthSuccessPage";
import BookmarkMapPage from "@/pages/bookmark/BookmarkMapPage";
import BookmarkPage from "@/pages/bookmark/BookmarkPage";
//import ChatPage from "@/pages/chat/ChatPage";
import DirectChatPage from "@/pages/chat/DirectChatPage";
import CreateGroupChatPage from "@/pages/groupChat/CreateGroupChatPage";
import GroupChatRoomPage from "@/pages/groupChat/GroupChatRoomPage";
import GroupInfoPage from "@/pages/groupChat/GroupInfoPage";
import MapPage from "@/pages/map/MapPage";
import MyNeighborhoodVerificationPage from "@/pages/myPage/MyNeighborhoodVerificationPage";
import MyPage from "@/pages/myPage/MyPage";
import MySettingsPage from "@/pages/myPage/MySettingsPage";
import PrivacyPage from "@/pages/policy/PrivacyPage";
import TermsPage from "@/pages/policy/TermsPage";
import RestaurantPage from "@/pages/restaurant/RestaurantPage";
import VisitVerificationPage from "@/pages/restaurant/VisitVerificationPage";
import SearchPage from "@/pages/search/SearchPage";

import ChatPageRefactoring from "@/pages/chat/ChatPage";
import GroupChatMemberPage from "@/pages/groupChat/GroupChatMemberPage";

import NotFoundPage from "@/pages/error/NotFoundPage.tsx";
import ReviewPage from "@/pages/review/ReviewPage";
import MyActivityPage from "@/pages/myPage/MyActivityPage";
import MyReviewManagement from "@/features/myPage/ui/MyReviewManagement.tsx";
import AboutPage from "@/pages/myPage/AboutPage";
// import RequireAuth from "@/shared/auth/RequireAuth";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/oauth/success",
    element: <OAuthSuccessPage />,
  },
  {
    path: "/terms",
    element: <TermsPage />,
  },
  {
    path: "/privacy",
    element: <PrivacyPage />,
  },
  {
    element: <MobileLayout />,
    children: [
      {
        path: "/",
        element: <MapPage />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
      {
        path: "/restaurants/:restaurantId",
        element: <RestaurantPage />,
      },
      {
        path: "/restaurants/:restaurantId/visit",
        element: <VisitVerificationPage />,
      },
      {
        path: "/bookmark",
        element: <BookmarkPage />,
      },
      {
        path: "/bookmark-map/:bookmarkCategoryId",
        element: <BookmarkMapPage />,
      },
      {
        path: "/chat",
        element: <ChatPageRefactoring />,
      },
      {
        path: "/chat/direct/:directChatRoomId",
        element: <DirectChatPage />,
      },
      {
        path: "/chat/groups/create",
        element: <CreateGroupChatPage />,
      },
      {
        path: "/mypage",
        element:
          <MyPage />,
      },
      {
        path: "/mypage/neighborhood-verification",
        element: <MyNeighborhoodVerificationPage />,
      },
      {
        path: "/mypage/activity",
        element: <MyActivityPage />,
      },
      {
        path: "/mypage/settings",
        element: <MySettingsPage />,
      },
      {
        path: "/chat/group/room/:roomId",
        element: <GroupChatRoomPage />,
      },
      {
        path: "/chat/group/info/:roomId",
        element: <GroupInfoPage />,
      },
      {
        path: "/chat-rooms/:roomId/members",
        element: <GroupChatMemberPage />
      },
      // {
      //   element: <RequireAuth />,
      //   children: [
      //     {
      //       path: "/mypage",
      //       element: <MyPage />,
      //     },
      // },
      {
        path: "/review",
        element: <ReviewPage />,
      },

        // 마이페이지 내 리뷰 목록 페이지
      {
        path: "/mypage/reviews",
        element: <MyReviewManagement />,
      },

      {
        path: "/review/write/:visitVerificationId",
        element: <ReviewPage />,
      },
      {
        path: "/mypage/about",
        element: <AboutPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />
      },
    ],
  },
]);
