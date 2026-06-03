import { forwardRef } from "react";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import RestaurantPreviewCard from "@/features/restaurant/ui/RestaurantPreviewCard";
import type { RestaurantPreview } from "@/features/restaurant/model/restaurantTypes";

type Props = {
    restaurant: RestaurantPreview;
    onClose: () => void;
};

const RestaurantPreviewBottomSheet = forwardRef<HTMLDivElement, Props>(
    ({ restaurant, onClose }, ref) => {

        const navigate = useNavigate();
        
        return (
            <motion.div
                ref={ref}
                drag="y"
                dragDirectionLock
                dragConstraints={{ top: 0, bottom: 120 }}
                dragElastic={0.15}
                onDragEnd={(_, info) => {
                if (info.offset.y > 80) {
                onClose();
                }
                }}
                initial={{ y: 120, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 120, opacity: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
                className="absolute bottom-5 left-4 right-4 z-30 rounded-[28px] bg-white px-4 pb-5 pt-3 shadow-[0_8px_30px_rgba(0,0,0,0.15)]"
            >
            <div className="relative mb-4 cursor-grab active:cursor-grabbing">
                <div className="flex justify-center">
                <div className="h-1 w-14 rounded-full bg-gray-200" />
                </div>
            </div>
            

            <div className="mb-4 flex items-center justify-between">
                <h2 className="truncate text-lg font-bold text-gray-900">
                    맛집 정보
                </h2>

                <button
                    type="button"
                    className="flex items-center gap-1 text-sm font-medium text-gray-400"
                    onClick={() =>
                        navigate(`/restaurants/${restaurant.restaurantId}`)
                    }
                >
                상세보기
                <ChevronRight size={16} />
                </button>
            </div>

            <RestaurantPreviewCard restaurant={restaurant} />
            </motion.div>
        );
    }
);

export default RestaurantPreviewBottomSheet;