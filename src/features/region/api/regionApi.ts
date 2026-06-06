import axios from "@/shared/api/axios";
import type { SidoRegion } from "../model/regionTypes";

export const getRegionTree = async () => {
    const { data } = await axios.get<SidoRegion[]>("/api/regions/tree");
    return data;
};

