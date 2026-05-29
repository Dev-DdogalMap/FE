import { createBrowserRouter } from "react-router-dom";

import MobileLayout from "@/layouts/MobileLayout";

import MapPage from "@/pages/map/MapPage";
import SearchPage from "@/pages/search/SearchPage";

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
      }
    ],
  },
]);