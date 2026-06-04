interface Props {
  onLeave: () => void;
  onEdit: () => void;
}

export default function GroupInfoFooter({
  onLeave,
  onEdit,
}: Props) {
  return (
    <div className="absolute bottom-6 left-0 right-0 px-6">
      <div className="flex gap-4">
        <button
          onClick={onLeave}
          className="flex-1 h-14 rounded-2xl bg-gray-100 font-semibold"
        >
          나가기
        </button>

        <button
          onClick={onEdit}
          className="flex-1 h-14 rounded-2xl bg-orange-500 text-white font-semibold"
        >
          그룹 수정
        </button>
      </div>
    </div>
  );
}