import { useRef, useState } from "react";
import { useUpdateGroupChat } from "@/features/groupChat/hooks/useUpdateGroupChat";

const FOOD_TYPE_OPTIONS = [
  { id: 1, label: "한식" },
  { id: 2, label: "중식" },
  { id: 3, label: "일식" },
  { id: 4, label: "양식" },
  { id: 5, label: "분식" },
  { id: 6, label: "기타" },
];

function categoryToFoodTypeId(category: string): number {
  return FOOD_TYPE_OPTIONS.find((opt) => opt.label === category)?.id ?? 1;
}

interface Props {
  roomId: number;
  defaultValues: {
    roomName: string;
    region: string;
    maxParticipantCount: number;
    category: string;   // 조회 응답의 String 카테고리
    roomImage: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export default function GroupEditForm({
  roomId,
  defaultValues,
  onSuccess
}: Props) {
  const { update } = useUpdateGroupChat();

  const [roomName, setRoomName] = useState(defaultValues.roomName);
  const [region, setRegion] = useState(defaultValues.region);
  const [maxParticipantCount, setMaxParticipantCount] = useState(defaultValues.maxParticipantCount);
  const [foodTypeId, setFoodTypeId] = useState<number>(
    categoryToFoodTypeId(defaultValues.category)  // String → id 변환
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(defaultValues.roomImage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      await update(roomId, {
        roomName,
        region,
        maxParticipantCount,
        foodTypeId,   // Long 타입 id만 전송
        imageFile,
      });
      onSuccess();
    } catch (err) {
      setError("수정에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-5 flex flex-col gap-6 pb-32">
      {/* 프로필 이미지 */}
      <div className="flex flex-col items-center mt-2">
        <div
          className="relative w-20 h-20 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <img
            src={imagePreview}
            alt="방 이미지"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2.414a2 2 0 01.586-1.414z"
              />
            </svg>
          </div>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
      </div>

      {/* 방 이름 */}
      <div>
        <label className="text-sm font-bold block mb-2">방 이름</label>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="text-sm h-12 w-full border border-gray-200 rounded-xl px-4 focus:outline-none focus:border-orange-400"
        />
      </div>

      {/* 최대 인원 */}
      <div>
        <label className="text-sm font-bold block mb-2">최대 인원</label>
        <input
          type="number"
          min={1}
          value={maxParticipantCount}
          onChange={(e) => setMaxParticipantCount(Number(e.target.value))}
          className="text-sm h-12 w-full border border-gray-200 rounded-xl px-4 focus:outline-none focus:border-orange-400"
        />
      </div>

      {/* 지역 */}
      <div>
        <label className="text-sm font-bold block mb-2">지역</label>
        <input
          type="text"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="text-sm h-12 w-full border border-gray-200 rounded-xl px-4 focus:outline-none focus:border-orange-400"
        />
      </div>

      {/* 음식 카테고리 */}
      <div>
        <label className="text-sm font-bold block mb-2">카테고리</label>
        <select
          value={foodTypeId}
          onChange={(e) => setFoodTypeId(Number(e.target.value))}
          className="text-sm h-12 w-full border border-gray-200 rounded-xl px-4 focus:outline-none focus:border-orange-400 bg-white"
        >
          {FOOD_TYPE_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      {/* 페이지에서 트리거하는 숨김 submit 버튼 */}
      <button id="group-edit-submit" className="hidden" onClick={handleSubmit} disabled={loading} />
    </div>
  );
}