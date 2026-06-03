// hooks/useGroupChatSocket.ts
import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { useAuth } from "@/shared/auth/AuthContext";

const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL;

export function useGroupChatSocket(roomId: number, onMessage: (data: any) => void) {
    const clientRef = useRef<Client | null>(null);
    const { accessToken } = useAuth();

    useEffect(() => {
        if (!accessToken) return; // 토큰 없으면 연결 안 함

        const client = new Client({
            brokerURL: `${WS_BASE_URL}/ws-chat`,
            //헤더에 토큰 필요! 쿠키에서 가져올 수 없음
            connectHeaders: {
                Authorization: `Bearer ${accessToken}`,
            },
            onConnect: () => {
                console.log("소켓 연결 성공!");
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
            onDisconnect: () => {
                console.log("소켓 연결 해제");
            },
        });

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
        };
    }, [roomId, accessToken]);  //의존성 배열 -> 세팅되면 자동으로 연결 시도

    const sendMessage = (content: string) => {
        if (!clientRef.current?.connected) {
            console.warn("소켓 연결 중...");
            return;
        }

        clientRef.current.publish({
            destination: "/pub/chats/group/messages",
            body: JSON.stringify({
                roomId,
                roomType: "GROUP",
                content,
            }),
        });
    }

    return { sendMessage };
}