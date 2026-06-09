import { createBrowserRouter } from "react-router-dom";

import MobileLayout from "@/layouts/MobileLayout";

import LoginPage from "@/pages/auth/LoginPage";
import OAuthSuccessPage from "@/pages/auth/OAuthSuccessPage";
import BookmarkPage from "@/pages/bookmark/BookmarkPage";
//import ChatPage from "@/pages/chat/ChatPage";
import DirectChatPage from "@/pages/chat/DirectChatPage";
import CreateGroupChatPage from "@/pages/groupChat/CreateGroupChatPage";
import GroupChatRoomPage from "@/pages/groupChat/GroupChatRoomPage";
import GroupInfoPage from "@/pages/groupChat/GroupInfoPage";
import MapPage from "@/pages/map/MapPage";
import MyNeighborhoodVerificationPage from "@/pages/myPage/MyNeighborhoodVerificationPage";
import MyPage from "@/pages/myPage/MyPage";
import PrivacyPage from "@/pages/policy/PrivacyPage";
import TermsPage from "@/pages/policy/TermsPage";
import RestaurantPage from "@/pages/restaurant/RestaurantPage";
import VisitVerificationPage from "@/pages/restaurant/VisitVerificationPage";
import SearchPage from "@/pages/search/SearchPage";

import ChatPageRefactoring from "@/pages/chat/ChatPage";

import NotFoundPage from "@/pages/error/NotFoundPage.tsx";
import ReviewPage from "@/pages/review/ReviewPage";
import MyActivityPage from "@/pages/myPage/MyActivityPage";
import MyReviewManagement from "@/pages/myPage/reviews/MyReviewManagement.tsx";
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
        path: "/chat/group/room/:roomId",
        element: <GroupChatRoomPage />,
      },
      {
        path: "/chat/group/info/:roomId",
        element: <GroupInfoPage />,
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

        // 마이페이지 내 리뷰 목록 페이지 테스트
      {
        path: "/mypage/reviews",
        element: <MyReviewManagement />,
      },

      {
        path: "*",
        element: <NotFoundPage />
      },
    ],
  },
]);
