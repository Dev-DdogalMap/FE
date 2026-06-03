import type { ReactNode } from "react";
import { TriangleAlert } from "lucide-react";

type ErrorViewProps = {
    title?: string;
    description?: string;
    icon?: ReactNode;
    heightClassName?: string;
};

export default function ErrorView({
    title = "문제가 발생했어요",
    description = "잠시 후 다시 시도해주세요",
    icon,
    heightClassName = "h-full",
}: ErrorViewProps) {
    return (
        <div
        className={`flex ${heightClassName} w-full flex-col items-center justify-center bg-gradient-to-b from-[#FFF3E8] to-white px-6`}
        >
        <div className="mb-10 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
            {icon ?? (
            <TriangleAlert
                size={36}
                className="text-[#FF6B00]"
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