// import { useEffect, useState } from "react";
// import { useAuth } from "@/shared/auth/AuthContext";
// import {
//   getGroupChatMessages,
//   getGroupChatRoomInfo,
// } from "../api/groupChatApi";

// import type {
//   ChatMessageResponse,
//   ChatRoomInfoResponse,
// } from "../model/groupChatTypes";

// export function useGroupChat(roomId: number) {
//   const { accessToken, refreshAccessToken } = useAuth();
//   const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
//   const [roomInfo, setRoomInfo] =
//     useState<ChatRoomInfoResponse | null>(null);

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function loadChatData() {
//       if (!roomId) return;

//       try {
//         const [messageData, roomInfoData] = await Promise.all([  //Promise.all = 두 API 동시 호출
//           getGroupChatMessages({ roomId, size: 50,}, { accessToken, refreshAccessToken }),
//           getGroupChatRoomInfo(roomId, { accessToken, refreshAccessToken }),
//         ]);

//         setMessages(messageData);
//         setRoomInfo(roomInfoData);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadChatData();
//   }, [roomId]);

//   return {
//     roomId,
//     messages,
//     setMessages,
//     roomInfo,
//     loading,
//   };
// }