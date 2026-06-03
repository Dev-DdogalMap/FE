import { createBrowserRouter } from "react-router-dom";

import MobileLayout from "@/layouts/MobileLayout";

import LoginPage from "@/pages/auth/LoginPage";
import OAuthSuccessPage from "@/pages/auth/OAuthSuccessPage";
import BookmarkPage from "@/pages/bookmark/BookmarkPage";
import ChatPage from "@/pages/chat/ChatPage";
import CreateGroupChatPage from "@/pages/chat/CreateGroupChatPage";
import DirectChatPage from "@/pages/chat/DirectChatPage";
import GroupChatPage from "@/pages/chat/GroupChatPage";
import RequireAuth from "@/shared/auth/RequireAuth";
import MapPage from "@/pages/map/MapPage";
import MyPage from "@/pages/myPage/MyPage";
import PrivacyPage from "@/pages/policy/PrivacyPage";
import TermsPage from "@/pages/policy/TermsPage";
import RestaurantPage from "@/pages/restaurant/RestaurantPage";
import SearchPage from "@/pages/search/SearchPage";
import NotFoundPage from "@/pages/error/NotFoundPage";
import GroupChatRoomPage from "@/pages/groupChat/GroupChatRoomPage";

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
    path: "/chat/group/room/:roomId",
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
        element: <RequireAuth />,
        children: [
          {
            path: "/chat",
            element: <ChatPage />,
          },
          {
            path: "/chat/direct/:directChatRoomId",
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
          },
        ],
      },
      {
        path: "/bookmark",
        element: <BookmarkPage />,
      },
      {
        path: "/mypage",
        element: <MyPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
