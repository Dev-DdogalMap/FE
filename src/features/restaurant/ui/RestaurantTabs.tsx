interface Props {
  activeTab: string;
  reviewCount: number;
  onChange: (tab: string) => void;
}

const RestaurantTabs = ({
  activeTab,
  reviewCount,
  onChange,
}: Props) => {
  return (
    <div className="sticky top-0 z-20 bg-white" role="tablist">
      <div className="flex">

        <button
          role="tab"
          aria-selected={activeTab === "info"}
          aria-controls="info-panel"
          onClick={() => onChange("info")}
          className={`flex-1 py-4 text-sm font-semibold transition ${activeTab === "info"
            ? "text-[#ff6b00] border-b-2 border-[#ff6b00]"
            : "text-gray-400"
            }`}
        >
          정보
        </button>

        <button
          role="tab"
          aria-selected={activeTab === "review"}
          aria-controls="review-panel"
          onClick={() => onChange("review")}
          className={`flex-1 py-4 text-sm font-semibold transition ${activeTab === "review"
            ? "text-[#ff6b00] border-b-2 border-[#ff6b00]"
            : "text-gray-400"
            }`}
        >
          후기 ({reviewCount ?? 0})
        </button>
      </div>
    </div>
  );
};

export default RestaurantTabs;