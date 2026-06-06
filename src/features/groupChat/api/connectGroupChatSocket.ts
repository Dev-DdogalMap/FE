// @/features/groupChat/api/connectGroupChatSocket.ts
import { Client } from "@stomp/stompjs";

const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL;

export function connectGroupChatSocket({
  roomId,
  accessToken,
  onMessage,
}: {
  roomId: number;
  accessToken: string;
  onMessage: (data: any) => void;
}) {
  const client = new Client({
    brokerURL: `${WS_BASE_URL}/ws-chat`,
    connectHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
    onConnect: () => {
      client.subscribe(`/sub/chats/group/${roomId}`, (message) => {
        const data = JSON.parse(message.body);
        onMessage(data);
      });
    },
    onStompError: (frame) => {
      console.error("STOMP 에러:", frame);
    },
    onWebSocketError: (event) => {
      console.error("WebSocket 에러:", event);
    },
  });

  client.activate();
  return { disconnect: () => client.deactivate() };
}