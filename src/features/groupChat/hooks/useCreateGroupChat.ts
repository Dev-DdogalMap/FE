import { createGroupChat, getPresignedUrl } from "../api/groupChatApi";
import { useAuth } from "@/shared/auth/AuthContext";

// useCreateGroupChat.ts
export function useCreateGroupChat() {
  const { accessToken, refreshAccessToken } = useAuth();
  const chatAuth = { accessToken, refreshAccessToken };

  const create = async (data: any) => {
    let imageKey: string | null = null;

    //입력 데이터에 이미지 파일이 있으면
    if (data.imageFile) {
      // 1. presigned URL 발급
      const { presignedUrl, imageKey: key } = await getPresignedUrl(data.imageFile.name, chatAuth);

      // 2. S3 업로드
      await fetch(presignedUrl, {
        method: "PUT",
        body: data.imageFile
      });

      imageKey = key;
    }

    const { imageFile, ...rest } = data; // imageFile 제거
    // 3. 채팅방 생성
    return createGroupChat({ ...data, imageKey }, chatAuth);
  };

  return { create };
}