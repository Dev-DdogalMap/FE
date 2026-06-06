import { createBrowserRouter } from "react-router-dom";

import MobileLayout from "@/layouts/MobileLayout";

import LoginPage from "@/pages/auth/LoginPage";
import OAuthSuccessPage from "@/pages/auth/OAuthSuccessPage";
import BookmarkPage from "@/pages/bookmark/BookmarkPage";
//import ChatPage from "@/pages/chat/ChatPage";
import DirectChatPage from "@/pages/chat/DirectChatPage";
import MapPage from "@/pages/map/MapPage";
import MyPage from "@/pages/myPage/MyPage";
import PrivacyPage from "@/pages/policy/PrivacyPage";
import TermsPage from "@/pages/policy/TermsPage";
import RestaurantPage from "@/pages/restaurant/RestaurantPage";
import VisitVerificationPage from "@/pages/restaurant/VisitVerificationPage";
import SearchPage from "@/pages/search/SearchPage";
//import NotFoundPage from "@/pages/error/NotFoundPage";
import GroupChatRoomPage from "@/pages/groupChat/GroupChatRoomPage";
import CreateGroupChatPage from "@/pages/groupChat/CreateGroupChatPage";
import GroupInfoPage from "@/pages/groupChat/GroupInfoPage";
import ChatPageRefactoring from "@/pages/chat/ChatPage";

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
    ],
  },
]);
