import { ArrowLeft } from "lucide-react";

interface Props {
  onBack: () => void;
}

export default function GroupInfoHeader({
  onBack,
}: Props) {
  return (
    <div className="relative flex items-center justify-center py-4">
      <button
        onClick={onBack}
        className="absolute left-4"
      >
        <ArrowLeft size={24} />
      </button>

      <h1 className="text-xl font-bold">
        그룹 정보
      </h1>
    </div>
  );
}