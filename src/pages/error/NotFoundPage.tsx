import { useNavigate } from "react-router-dom";
import marker from "@/assets/images/marker.png";

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-[calc(100vh-64px-64px)] w-full flex-col items-center justify-center px-6 text-center">
            <div className="mb-6 flex h-28 w-28 shrink-0 items-center justify-center">
                <img
                    src={marker}
                    alt="또갈지도"
                    className="h-full w-full object-contain"
                    draggable={false}
                />
            </div>

        <h1 className="text-6xl font-bold text-orange-500">404</h1>

        <h2 className="mt-4 text-xl font-semibold">
            찾으시는 페이지를 찾을 수 없어요
        </h2>

        <p className="mt-2 text-sm text-gray-500">
            길을 잃으셨나요? 요청하신 페이지가 존재하지 않습니다.
        </p>

        <div className="mt-8 flex gap-3">
            <button
                onClick={() => navigate(-1)}
                className="rounded-xl border px-4 py-2 text-sm"
            >
                이전 페이지
            </button>

            <button
                onClick={() => navigate("/")}
                className="rounded-xl bg-orange-500 px-4 py-2 text-sm text-white"
            >
            홈으로 가기
            </button>
        </div>
        </div>
    );
}