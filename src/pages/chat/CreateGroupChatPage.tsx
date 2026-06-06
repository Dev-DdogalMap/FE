// import { ImagePlus } from "lucide-react";

// const categories = [
//   "양식",
//   "한식",
//   "카페",
//   "술집",
//   "전체",
// ] as const;

// export default function CreateGroupChatPage() {
//   return (
//     <div className="min-h-[calc(100vh-64px-64px)] bg-[#fffaf7] px-4 pb-8 pt-4">
//       <div className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-[0_12px_35px_rgba(17,24,39,0.05)]">
//         <h1 className="text-xl font-semibold text-gray-900">
//           그룹 채팅 만들기
//         </h1>

//         <div className="mt-6 space-y-5">
//           <div className="rounded-3xl border border-dashed border-[#ffb699] bg-[#fff7f3] px-4 py-8 text-center">
//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#ff4b0b]">
//               <ImagePlus className="h-6 w-6" />
//             </div>
//             <p className="mt-3 text-sm font-medium text-gray-700">
//               그룹 사진 추가
//             </p>
//           </div>

//           <label className="block">
//             <span className="mb-2 block text-sm font-semibold text-gray-700">
//               그룹명
//             </span>
//             <input
//               placeholder="예: 성수동 브런치 원정대"
//               className="w-full rounded-2xl border border-gray-200 bg-[#fffaf7] px-4 py-3 text-sm outline-none"
//             />
//           </label>

//           <div>
//             <span className="mb-2 block text-sm font-semibold text-gray-700">
//               카테고리
//             </span>
//             <div className="flex flex-wrap gap-2">
//               {categories.map((category, index) => (
//                 <button
//                   key={category}
//                   type="button"
//                   className={`rounded-full px-4 py-2 text-sm font-medium ${
//                     index === 0
//                       ? "bg-[#ff4b0b] text-white"
//                       : "border border-gray-200 bg-white text-gray-600"
//                   }`}
//                 >
//                   {category}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <label className="block">
//             <span className="mb-2 block text-sm font-semibold text-gray-700">
//               지역
//             </span>
//             <input
//               value="성수동"
//               readOnly
//               className="w-full rounded-2xl border border-gray-200 bg-[#fffaf7] px-4 py-3 text-sm outline-none"
//             />
//           </label>

//           <label className="block">
//             <span className="mb-2 block text-sm font-semibold text-gray-700">
//               그룹 소개
//             </span>
//             <textarea
//               placeholder="모임 소개와 분위기를 적어주세요."
//               rows={5}
//               className="w-full resize-none rounded-2xl border border-gray-200 bg-[#fffaf7] px-4 py-3 text-sm outline-none"
//             />
//           </label>

//           <div>
//             <span className="mb-2 block text-sm font-semibold text-gray-700">
//               공개 설정
//             </span>
//             <div className="grid grid-cols-2 gap-3">
//               <label className="flex items-center gap-2 rounded-2xl border border-[#ffceb9] bg-[#fff7f3] px-4 py-3 text-sm font-medium text-[#ff4b0b]">
//                 <input type="radio" name="visibility" defaultChecked />
//                 공개
//               </label>
//               <label className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-600">
//                 <input type="radio" name="visibility" />
//                 비공개
//               </label>
//             </div>
//           </div>

//           <div className="rounded-2xl border border-gray-200 bg-[#fffaf7] px-4 py-3">
//             <p className="text-sm font-semibold text-gray-700">
//               최대 인원
//             </p>
//             <p className="mt-1 text-sm text-gray-500">10명 고정</p>
//           </div>

//           <button
//             type="button"
//             className="w-full rounded-2xl bg-[#ff4b0b] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(255,75,11,0.25)]"
//           >
//             그룹 만들기
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
