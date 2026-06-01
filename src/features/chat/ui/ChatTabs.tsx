import type { ChatTabKey } from "@/features/chat/model/types";

interface ChatTabsProps {
  activeTab: ChatTabKey;
  onChange: (tab: ChatTabKey) => void;
}

const tabs: { key: ChatTabKey; label: string }[] = [
  { key: "recommended", label: "추천 맛잘알" },
  { key: "conversations", label: "내 대화" },
  { key: "groups", label: "그룹 채팅" },
];

export default function ChatTabs({
  activeTab,
  onChange,
}: ChatTabsProps) {
  return (
    <div className="flex border-b border-gray-200">
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`relative flex-1 pb-3 pt-1 text-sm font-semibold transition ${
              isActive ? "text-[#ff4b0b]" : "text-gray-400"
            }`}
          >
            <span className="mx-auto">{tab.label}</span>
            {isActive && (
              <span className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-[#ff4b0b]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
