import { createBrowserRouter } from "react-router-dom";

import MobileLayout from "@/layouts/MobileLayout";

import LoginPage from "@/pages/auth/LoginPage";
import OAuthSuccessPage from "@/pages/auth/OAuthSuccessPage";
import ChatPage from "@/pages/chat/ChatPage";
//import CreateGroupChatPage from "@/pages/chat/CreateGroupChatPage";
import DirectChatPage from "@/pages/chat/DirectChatPage";
import GroupChatPage from "@/pages/chat/GroupChatPage";
import MapPage from "@/pages/map/MapPage";
import PrivacyPage from "@/pages/policy/PrivacyPage";
import TermsPage from "@/pages/policy/TermsPage";
import RestaurantPage from "@/pages/restaurant/RestaurantPage";
import VisitVerificationPage from "@/pages/restaurant/VisitVerificationPage";
import SearchPage from "@/pages/search/SearchPage";
//import NotFoundPage from "@/pages/error/NotFoundPage";
import GroupChatRoomPage from "@/pages/groupChat/GroupChatRoomPage";
import CreateGroupChatPage from "@/pages/groupChat/CreateGroupChatPage";
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
    path: "/chat/group/room/:roomId",  //채팅화면에서는 헤더, 푸터 안보임
    element: <GroupChatRoomPage />,
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
        path: "/chat",
        element: <ChatPage />,
      },
      {
        path: "/chat/direct/:userId",
        element: <DirectChatPage />,
      },
      {
        path: "/chat/groups",
        element: <GroupChatPage />,
      },
      {
        path: "/chat/groups/create",
        element: <CreateGroupChatPage />,
      },
      {
        path: "/chat/groups/:groupId",
        element: <GroupChatPage />,
      }
      // {
      //   element: <RequireAuth />,
      //   children: [
      //     {
      //       path: "/my",
      //       element: <MyPage />,
      //     },
      //     {
      //       path: "/chat",
      //       element: <ChatPage />,
      //     },
      //   ],
      // },
    ],
  },
]);
