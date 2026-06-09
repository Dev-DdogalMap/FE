interface Props {
  onBack: () => void;
  onDone: () => void;
}

export default function MemberManageHeader({ onBack, onDone }: Props) {
  return (
    <div className="flex items-center justify-between px-5 h-14">
      <button onClick={onBack}>
        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <span className="text-base font-semibold text-gray-900">멤버 관리</span>
      <button onClick={onDone} className="text-sm font-semibold text-orange-500">
        완료
      </button>
    </div>
  );
}