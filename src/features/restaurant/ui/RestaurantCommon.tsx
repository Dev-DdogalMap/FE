import {
    ArrowLeft, MapPin, Share2, Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TagProps {
    text: string;
}

const Tag = ({ text }: TagProps) => {
    return (
        <div className="px-4 py-2 rounded-xl bg-green-50 text-green-700 text-sm font-medium">
            {text}
        </div>
    );
};

const RestaurantCommon = () => {
    const navigate = useNavigate();

    return (
        <section>
            {/* IMAGE */}
            <div className="relative">
                <img
                    src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop"
                    alt="restaurant"
                    className="w-full h-[180px] object-cover"
                />

                {/* TOP BUTTONS */}
                <div className="absolute top-6 left-4">
                    <button
                        onClick={() => navigate(-1)}
                        aria-label="뒤로 가기"
                        className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center" >

                        <ArrowLeft color="white" />
                    </button>
                </div>

                <div className="absolute top-6 right-4 flex gap-3">
                    <button
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({ title: '성수동 스테이크 하우스', url: window.location.href });
                            }
                        }}
                        aria-label="공유하기"
                        className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center"
                    >
                        <Share2 color="white" size={20} />
                    </button>
                </div>
            </div>

            {/* CONTENT */}
            <div className="bg-white rounded-t-[32px] -mt-6 relative z-10 px-6 pt-8">
                {/* TITLE */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-[1.6em] font-bold leading-tight">
                            성수동 스테이크 하우스
                        </h1>

                        {/* LOCAL BADGE */}
                        <div className="inline-flex items-center gap-2 mt-4 px-3 py-1 rounded-full bg-orange-50 text-[#ff6b00] font-semibold text-sm">
                            ⭐ 성수 로컬 추천
                        </div>

                        {/* CATEGORY */}
                        <div className="flex items-center gap-2 mt-5 text-gray-500">
                            <span>양식</span>
                            <span>·</span>
                            <span>스테이크</span>
                        </div>

                        {/* LOCATION */}
                        <div className="flex items-center gap-2 mt-4 text-gray-500">
                            <MapPin size={18} />
                            <span>성수동1가</span>
                            <span>·</span>
                            <span>120m</span>
                        </div>
                    </div>

                    {/* SCORE */}
                    <div className="text-right">
                        <div className="text-[56px] font-bold text-[#ff6b00] leading-none">
                            98%
                        </div>

                        <div className="text-sm font-semibold mt-2">
                            맛집 지수
                        </div>
                    </div>
                </div>

                {/* TAGS */}
                <div className="flex flex-wrap gap-3 mt-8">
                    <Tag text="혼밥 가능" />
                    <Tag text="분위기 좋음" />
                    <Tag text="위생 인증" />
                </div>

                {/* STATS */}
                <div className="flex flex-wrap items-center gap-6 mt-8 text-gray-700">
                    <div className="flex items-center gap-2">
                        <Star
                            fill="#ff8a00"
                            color="#ff8a00"
                            size={20}
                        />

                        <span className="font-semibold">4.6</span>

                        <span>(312)</span>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default RestaurantCommon;