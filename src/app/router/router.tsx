import { createBrowserRouter } from "react-router-dom";

import MobileLayout from "@/layouts/MobileLayout";

import MapPage from "@/pages/map/MapPage";
import SearchPage from "@/pages/search/SearchPage";

import ReviewPage from "@/pages/review/ReviewPage";

export const router = createBrowserRouter([
  {
    element: <MobileLayout />,
    children: [
      {
        path: "/",
        element: <MapPage />,
      },
      {
        path: "/search",
        element: <SearchPage />
      },
      {
        path: "/review/write",
        element: <ReviewPage/>
      }
    ],
  },
]);