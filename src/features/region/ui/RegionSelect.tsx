import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { getRegionTree } from "../api/regionApi";
import type { DongRegion, SidoRegion } from "../model/regionTypes";

type Props = {
    selectedRegionId?: number;
    selectedRegionName?: string;
    onChange: (regionName: string, dong?: DongRegion) => void;
};

const DISPLAY_ALL = "전체";
const PLACEHOLDER = "지역 선택";

const isBlank = (value?: string | null) => !value || value.trim() === "";

const getDisplayName = (value?: string | null) => {
    return isBlank(value) ? DISPLAY_ALL : value;
};

const getFullRegionName = (...names: Array<string | undefined | null>) => {
    return names.filter((name) => !isBlank(name)).join(" ");
};

export default function RegionSelect({
    selectedRegionId,
    selectedRegionName = PLACEHOLDER,
    onChange,
}: Props) {
    const [regions, setRegions] = useState<SidoRegion[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSido, setSelectedSido] = useState("");
    const [selectedSigungu, setSelectedSigungu] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchRegions = async () => {
            setLoading(true);
            setErrorMessage("");

            try {
                const data = await getRegionTree();
                setRegions(data);
            } catch (error) {
                console.error("지역 목록 조회 실패", error);
                setErrorMessage("지역 목록을 불러오지 못했어요.");
            }finally {
                setLoading(false);
            }
        };

        fetchRegions();
    }, []);

    const sigungus = useMemo(() => {
        return regions.find((region) => region.sidoName === selectedSido)?.sigungus ?? [];
    }, [regions, selectedSido]);

    const dongs = useMemo(() => {
        return sigungus.find((region) => region.sigunguName === selectedSigungu)?.dongs ?? [];
    }, [sigungus, selectedSigungu]);

    const emitRegionChange = (
        sidoName: string,
        sigunguName?: string,
        dong?: DongRegion,
    ) => {
        const regionName = getFullRegionName(
        sidoName,
        sigunguName,
        dong?.eupmyeondongName,
        );

        onChange(regionName, dong);
    };

    return (
        <div className="relative min-w-0 flex-1">
        <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex h-[48px] w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-700 shadow-sm"
        >
            <span
            className={
                selectedRegionName !== PLACEHOLDER
                ? "truncate font-medium"
                : "truncate text-gray-400"
            }
            >
            {selectedRegionName}
            </span>

            <ChevronDown
            size={16}
            className={isOpen ? "shrink-0 rotate-180 transition" : "shrink-0 transition"}
            />
        </button>

        {isOpen && (
            <div className="absolute left-0 top-12 z-30 w-[calc(100vw-32px)] max-w-[398px] rounded-2xl border border-gray-200 bg-white p-3 shadow-lg">
                {loading && (
                    <div className="mb-2 rounded-xl bg-gray-50 px-3 py-2 text-xs text-gray-500">
                        지역 목록을 불러오는 중이에요.
                    </div>
                )}

                {errorMessage && (
                    <div className="mb-2 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-500">
                        {errorMessage}
                    </div>
                )}
                
                <div className="mb-2 grid grid-cols-[0.9fr_1fr_1fr] gap-2 px-1 text-xs font-semibold text-gray-400">
                    <span>시도</span>
                    <span>시군구</span>
                    <span>동</span>
                </div>

                {!loading && !errorMessage && (
                <div className="grid grid-cols-[0.9fr_1fr_1fr] gap-2">
                    <div className="max-h-56 overflow-y-auto">
                    <button
                        type="button"
                        onClick={() => {
                        setSelectedSido("");
                        setSelectedSigungu("");
                        onChange("");
                        setIsOpen(false);
                        }}
                        className={`w-full truncate rounded-xl px-3 py-2 text-left text-sm ${
                        !selectedSido
                            ? "bg-[#FFF3E8] font-semibold text-[#FF6B00]"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                        전체
                    </button>

                    {regions.map((region) => (
                        <button
                        key={region.sidoName}
                        type="button"
                        onClick={() => {
                            setSelectedSido(region.sidoName);
                            setSelectedSigungu("");
                            emitRegionChange(region.sidoName);
                        }}
                        className={`w-full truncate rounded-xl px-3 py-2 text-left text-sm ${
                            selectedSido === region.sidoName
                            ? "bg-[#FFF3E8] font-semibold text-[#FF6B00]"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        >
                        {region.sidoName}
                        </button>
                    ))}
                    </div>

                    <div className="max-h-56 overflow-y-auto">
                    {sigungus.map((region) => (
                        <button
                        key={`${selectedSido}-${region.sigunguName || DISPLAY_ALL}`}
                        type="button"
                        onClick={() => {
                            setSelectedSigungu(region.sigunguName);
                            emitRegionChange(selectedSido, region.sigunguName);
                        }}
                        className={`w-full truncate rounded-xl px-3 py-2 text-left text-sm ${
                            selectedSigungu === region.sigunguName
                            ? "bg-[#FFF3E8] font-semibold text-[#FF6B00]"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        >
                        {getDisplayName(region.sigunguName)}
                        </button>
                    ))}
                    </div>

                    <div className="max-h-56 overflow-y-auto">
                    {dongs.map((dong) => (
                        <button
                        key={
                            dong.regionId ??
                            `${selectedSido}-${selectedSigungu}-${dong.eupmyeondongName || DISPLAY_ALL}`
                        }
                        type="button"
                        onClick={() => {
                            emitRegionChange(selectedSido, selectedSigungu, dong);
                            setIsOpen(false);
                        }}
                        className={`w-full truncate rounded-xl px-3 py-2 text-left text-sm ${
                            selectedRegionId === dong.regionId
                            ? "bg-[#FFF3E8] font-semibold text-[#FF6B00]"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        >
                        {getDisplayName(dong.eupmyeondongName)}
                        </button>
                    ))}
                    </div>
                </div>
                )}
            </div>
        )}
        </div>
    );
}