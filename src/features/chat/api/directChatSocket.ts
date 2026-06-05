import type { DirectChatMessage } from "@/features/chat/model/types";
import { WS_BASE_URL } from "@/shared/config/api";

type SocketOptions = {
  directChatRoomId: number;
  accessToken: string;
  onMessage: (message: DirectChatMessage) => void;
  onConnected?: () => void;
  onError?: (message: string) => void;
};

type StompFrame = {
  command: string;
  headers: Record<string, string>;
  body: string;
};

const parseFrame = (rawFrame: string): StompFrame | null => {
  const cleaned = rawFrame.replace(/\u0000/g, "").trimEnd();
  if (!cleaned) {
    return null;
  }

  const [headerSection, ...bodyParts] = cleaned.split("\n\n");
  const lines = headerSection.split("\n");
  const command = lines[0];
  const headers = lines.slice(1).reduce<Record<string, string>>(
    (acc, line) => {
      const separatorIndex = line.indexOf(":");
      if (separatorIndex < 0) {
        return acc;
      }
      const key = line.slice(0, separatorIndex);
      const value = line.slice(separatorIndex + 1);
      acc[key] = value;
      return acc;
    },
    {},
  );

  return {
    command,
    headers,
    body: bodyParts.join("\n\n"),
  };
};

export function connectDirectChatSocket({
  directChatRoomId,
  accessToken,
  onMessage,
  onConnected,
  onError,
}: SocketOptions) {
  const socket = new WebSocket(`${WS_BASE_URL}/ws-chat`);
  let connected = false;
  const subscriptionId = `direct-chat-${directChatRoomId}-${Date.now()}`;

  const sendFrame = (
    command: string,
    headers: Record<string, string> = {},
    body = "",
  ) => {
    const frame = [
      command,
      ...Object.entries(headers).map(([key, value]) => `${key}:${value}`),
      "",
      body,
    ].join("\n");

    socket.send(`${frame}\u0000`);
  };

  socket.addEventListener("open", () => {
    sendFrame("CONNECT", {
      "accept-version": "1.2",
      host: window.location.hostname,
      Authorization: `Bearer ${accessToken}`,
    });
  });

  socket.addEventListener("message", (event) => {
    const payload = String(event.data);
    const frames = payload.split("\u0000");

    for (const rawFrame of frames) {
      const frame = parseFrame(rawFrame);
      if (!frame) {
        continue;
      }

      if (frame.command === "CONNECTED") {
        connected = true;
        sendFrame("SUBSCRIBE", {
          id: subscriptionId,
          destination: `/topic/direct-chats/${directChatRoomId}`,
        });
        onConnected?.();
        continue;
      }

      if (frame.command === "MESSAGE") {
        try {
          onMessage(JSON.parse(frame.body) as DirectChatMessage);
        } catch (error) {
          console.error(error);
        }
        continue;
      }

      if (frame.command === "ERROR") {
        onError?.(frame.headers.message ?? frame.body ?? "웹소켓 오류가 발생했습니다.");
      }
    }
  });

  socket.addEventListener("error", () => {
    onError?.("웹소켓 연결 중 오류가 발생했습니다.");
  });

  const sendMessage = (message: string) => {
    if (!connected) {
      throw new Error("웹소켓 연결이 아직 완료되지 않았습니다.");
    }

    sendFrame(
      "SEND",
      {
        destination: `/app/direct-chats/${directChatRoomId}/messages`,
        "content-type": "application/json",
      },
      JSON.stringify({
        message,
      }),
    );
  };

  const disconnect = () => {
    if (socket.readyState === WebSocket.OPEN) {
      if (connected) {
        sendFrame("DISCONNECT");
      }
      socket.close();
    }
  };

  return {
    sendMessage,
    disconnect,
  };
}
