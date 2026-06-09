import { useEffect, useState } from "react";
import { useAuth } from "@/shared/auth/AuthContext";
import { getFoodTypes } from "../api/groupChatApi";
import type { FoodTypeResponse } from "../model/groupChatTypes";

export function useFoodTypes() {
  const { accessToken, refreshAccessToken } = useAuth();
  const [foodTypes, setFoodTypes] = useState<FoodTypeResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFoodTypes() {
      try {
        const data = await getFoodTypes({ accessToken, refreshAccessToken });
        setFoodTypes(data);
      } finally {
        setLoading(false);
      }
    }

    loadFoodTypes();
  }, []);

  return { foodTypes, loading };
}