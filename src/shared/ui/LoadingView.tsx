import type { ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { COLORS } from "@/shared/constants/colors";

type LoadingViewProps = {
    title?: string;
    description?: string;
    icon?: ReactNode;
    heightClassName?: string;
};

export default function LoadingView({
    title = "데이터를 불러오는 중이에요",
    description = "잠시만 기다려주세요",
    icon,
    heightClassName = "h-full",
}: LoadingViewProps) {
    return (
        <div
        className={`flex ${heightClassName} w-full flex-col items-center justify-center bg-gradient-to-b from-[#FFF3E8] to-white px-6`}
        >
        <div className="mb-10 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
            {icon ?? (
            <LoaderCircle
                size={36}
                color={COLORS.PRIMARY}
                className="animate-spin"
            />
            )}
        </div>

        <h2 className="text-xl font-bold text-gray-900">
            {title}
        </h2>

        <p className="mt-3 whitespace-pre-line text-center text-sm leading-6 text-gray-500">
            {description}
        </p>
        </div>
    );
}