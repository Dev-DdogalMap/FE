interface Props {
  activeTab: string;
  onChange: (tab: string) => void;
}

const RestaurantTabs = ({
  activeTab,
  onChange,
}: Props) => {
  return (
    <div className="sticky top-0 z-20 bg-white border-b">
      <div className="flex">
        <button
          onClick={() => onChange("score")}
          className={`flex-1 py-4 text-sm font-semibold transition ${
            activeTab === "score"
              ? "text-[#ff6b00] border-b-2 border-[#ff6b00]"
              : "text-gray-400"
          }`}
        >
          맛집지수
        </button>

        <button
          onClick={() => onChange("info")}
          className={`flex-1 py-4 text-sm font-semibold transition ${
            activeTab === "info"
              ? "text-[#ff6b00] border-b-2 border-[#ff6b00]"
              : "text-gray-400"
          }`}
        >
          정보
        </button>

        <button
          onClick={() => onChange("review")}
          className={`flex-1 py-4 text-sm font-semibold transition ${
            activeTab === "review"
              ? "text-[#ff6b00] border-b-2 border-[#ff6b00]"
              : "text-gray-400"
          }`}
        >
          후기 312
        </button>
      </div>
    </div>
  );
};

export default RestaurantTabs;