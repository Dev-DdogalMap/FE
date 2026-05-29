import { createBrowserRouter } from "react-router-dom";

import MobileLayout from "@/layouts/MobileLayout";

import MapPage from "@/pages/map/MapPage";
import SearchPage from "@/pages/search/SearchPage";
import LoginPage from "@/pages/auth/LoginPage";
import OAuthSuccessPage from "@/pages/auth/OAuthSuccessPage";
import TermsPage from "@/pages/policy/TermsPage";
import PrivacyPage from "@/pages/policy/PrivacyPage";
//import RequireAuth from "@/shared/auth/RequireAuth";

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
      //{
        //element: <RequireAuth />,
        //children: [
          // 로그인 필요한 페이지는 여기에 추가
          // {
          //   path: "/my",
          //   element: <MyPage />,
          // },
          // {
          //   path: "/chat",
          //   element: <ChatPage />,
          // },
        //],
      //},
    ],
  },
]);