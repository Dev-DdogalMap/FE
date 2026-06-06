// import { useMemo, useState } from "react";
// import { ChevronRight, Plus, Users } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// import { mockGroupChats } from "@/features/chat/model/mockTasteExperts";
// import type { ChatTabKey } from "@/features/chat/model/types";
// import ChatTabs from "@/features/chat/ui/ChatTabs";
// import { ROUTES } from "@/shared/constants/routes";

// export default function GroupChatPage() {
//   const navigate = useNavigate();
//   const [keyword, setKeyword] = useState("");
//   const activeTab = useMemo<ChatTabKey>(() => "groups", []);

//   const filteredGroups = mockGroupChats.filter((group) => {
//     const lowerKeyword = keyword.trim().toLowerCase();
//     if (!lowerKeyword) {
//       return true;
//     }

//     return (
//       group.name.toLowerCase().includes(lowerKeyword) ||
//       group.lastMessage.toLowerCase().includes(lowerKeyword)
//     );
//   });

//   return (
//     <div className="min-h-[calc(100vh-64px-64px)] bg-[#fffaf7] px-4 pb-8 pt-4">
//       <div className="space-y-4">
//         <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
//           <input
//             value={keyword}
//             onChange={(event) => setKeyword(event.target.value)}
//             placeholder="맛집명 또는 맛잘알 검색"
//             className="w-full px-4 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
//           />
//         </div>

//         <div className="rounded-[28px] border border-gray-200 bg-white px-4 pt-4 shadow-[0_12px_35px_rgba(17,24,39,0.05)]">
//           <ChatTabs
//             activeTab={activeTab}
//             onChange={(tab) => {
//               if (tab === "recommended" || tab === "conversations") {
//                 navigate(ROUTES.chat);
//               }
//             }}
//           />

//           <div className="py-4">
//             <button
//               type="button"
//               onClick={() => navigate(ROUTES.createGroupChat)}
//               className="mb-4 flex w-full items-center justify-center gap-2 rounded-3xl bg-[#ff4b0b] px-4 py-4 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(255,75,11,0.25)]"
//             >
//               <Plus className="h-5 w-5" />+ 그룹 채팅 만들기
//             </button>

//             <div className="space-y-3">
//               {filteredGroups.map((group) => (
//                 <button
//                   key={group.groupId}
//                   type="button"
//                   onClick={() =>
//                     navigate(ROUTES.groupChatRoom(group.groupId))
//                   }
//                   className="flex w-full items-center gap-3 rounded-3xl border border-gray-200 bg-[#fffaf7] px-4 py-4 text-left"
//                 >
//                   <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-white text-[#ff4b0b] shadow-sm">
//                     <Users className="h-5 w-5" />
//                   </div>
//                   <div className="min-w-0 flex-1">
//                     <p className="truncate text-sm font-semibold text-gray-900">
//                       {group.name}
//                     </p>
//                     <p className="mt-1 text-xs text-gray-500">
//                       {group.currentMembers}/{group.maxMembers} ·{" "}
//                       {group.lastMessage}
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-xs text-gray-400">
//                       {group.lastMessageTime}
//                     </p>
//                     <ChevronRight className="ml-auto mt-2 h-4 w-4 text-gray-400" />
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
