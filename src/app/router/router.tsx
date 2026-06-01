import { createBrowserRouter } from "react-router-dom";

import MobileLayout from "@/layouts/MobileLayout";

import MapPage from "@/pages/map/MapPage";
import SearchPage from "@/pages/search/SearchPage";
import LoginPage from "@/pages/auth/LoginPage";
import OAuthSuccessPage from "@/pages/auth/OAuthSuccessPage";
import TermsPage from "@/pages/policy/TermsPage";
import PrivacyPage from "@/pages/policy/PrivacyPage";
import RestaurantPage from "@/pages/restaurant/RestaurantPage";
import ChatPage from "@/pages/chat/ChatPage";
import DirectChatPage from "@/pages/chat/DirectChatPage";
import GroupChatPage from "@/pages/chat/GroupChatPage";
import CreateGroupChatPage from "@/pages/chat/CreateGroupChatPage";
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
        path: "/restaurants",
        element: <RestaurantPage />,
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
      },
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
