import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFoodTypes } from "../hooks/useFoodTypes";

interface Props {
    onSubmit: (data: {
        roomName: string;
        region: string;
        foodTypeId?: number;
        imageFile?: File | null;
        maxParticipantCount: number;
    }) => void;
}

export default function CreateGroupChatForm({
    onSubmit,
}: Props) {
    const navigate = useNavigate();
    const fileRef = useRef<HTMLInputElement>(null);
    const { foodTypes, loading: categoriesLoading } = useFoodTypes();

    const [roomName, setRoomName] = useState("");
    const [region, setRegion] = useState("");
    const [foodTypeId, setFoodTypeId] = useState<number>();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [maxParticipantCount, setMaxParticipantCount] = useState(10);

    const handleCreate = () => {
        onSubmit({
            roomName,
            region,
            foodTypeId,
            imageFile,
            maxParticipantCount
        });
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-md mx-auto px-6 pb-10">
                {/* 백 버튼 */}
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1 py-4 -ml-1.5 text-gray-600"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                </div>

                {/* 제목 영역 */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-xl font-bold mb-3">
                            미니 단체 톡방 만들기
                        </h1>

                        <p className="text-sm text-gray-700 font-medium">
                            동네 맛집 정보를 자유롭게 나눠보세요!
                        </p>

                        <p className="text-sm text-gray-700 font-medium">
                            최대 10명까지 참여할 수 있어요.
                        </p>
                    </div>

                    {/* 이미지 업로드 */}
                    <div
                        onClick={() => fileRef.current?.click()}
                        className="w-25 h-25 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden"
                    >
                        {imageFile ? (
                            <img
                                src={URL.createObjectURL(imageFile)}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-3xl font-light">+</span>
                        )}
                    </div>

                    <input
                        ref={fileRef}
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) =>
                            setImageFile(e.target.files?.[0] ?? null)
                        }
                    />
                </div>

                {/* 방 이름 */}
                <div className="mb-6">
                    <label className="block font-bold text-l mb-3">
                        톡방 이름
                    </label>

                    <div className="relative">
                        <input
                            maxLength={20}
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            placeholder="톡방 이름을 입력해주세요"
                            className="text-sm w-full h-16 rounded-xl border border-gray-200 px-4 outline-none"
                        />

                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                            {roomName.length}/20
                        </span>
                    </div>
                </div>

                {/* 지역 */}
                <div className="mb-6">
                    <label className="block font-bold text-l mb-3">
                        지역
                    </label>

                    <input
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        placeholder="지역을 입력해주세요"
                        className="text-sm w-full h-16 rounded-xl border border-gray-200 px-4 outline-none"
                    />
                </div>

                {/* 카테고리 */}
                <div className="mb-8">
                    <label className="block font-bold text-l mb-3">
                        카테고리 선택
                    </label>

                    <select
                        disabled={categoriesLoading}
                        value={foodTypeId ?? ""}
                        onChange={(e) =>
                            setFoodTypeId(
                                e.target.value
                                    ? Number(e.target.value)
                                    : undefined
                            )
                        }
                        className="text-sm w-full h-16 rounded-xl border border-gray-200 px-4 outline-none"
                    >
                        <option value="">
                            음식 종류를 선택해주세요
                        </option>

                        {foodTypes.map((category) => (
                            <option
                                key={category.foodTypeId}
                                value={category.foodTypeId}
                            >
                                {category.type}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 인원 */}
                <div className="mb-8">
                    <label className="block font-bold text-l mb-3">
                        참여 인원
                    </label>

                    <div className="border border-gray-200 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-lg font-bold">
                                1/{maxParticipantCount}명
                            </span>

                            <select
                                value={maxParticipantCount}
                                onChange={(e) =>
                                    setMaxParticipantCount(Number(e.target.value))
                                }
                                className="
                                    h-11
                                    px-4
                                    text-sm
                                    border
                                    border-gray-200
                                    rounded-xl
                                    outline-none
                                    focus:border-gray-300
                                    bg-white
                                    "
                            >
                                {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
                                    <option key={count} value={count}>
                                        {count}명
                                    </option>
                                ))}
                            </select>
                        </div>

                        <p className="text-sm text-gray-500">
                            방장은 자동으로 포함됩니다.
                        </p>
                    </div>
                </div>

                {/* 안내 */}
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 mb-8">
                    <div className="flex items-center gap-2 mb-3">
                        <span>💡</span>

                        <span className="font-bold text-l">
                            미니 단체 톡방 안내
                        </span>
                    </div>

                    <ul className="text-sm text-gray-700 space-y-2">
                        <li>• 최대 10명까지 참여할 수 있어요.</li>
                        <li>• 누구나 자유롭게 참여하고 나갈 수 있어요.</li>
                        <li>
                            • 들어가는 시점부터 채팅 이력을 볼 수 있어요.
                        </li>
                    </ul>
                </div>

                {/* 생성 버튼 */}
                <button
                    onClick={handleCreate}
                    className="w-full h-16 rounded-xl text-white text-l font-bold bg-[#FF6B00]"
                >
                    톡방 만들기
                </button>
            </div>
        </div>
    );
}