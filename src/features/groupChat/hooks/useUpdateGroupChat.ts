import { getPresignedUrl, updateGroupChatRoom } from "../api/groupChatApi";
import { useAuth } from "@/shared/auth/AuthContext";

export function useUpdateGroupChat() {
    const { accessToken, refreshAccessToken } = useAuth();
    const chatAuth = { accessToken, refreshAccessToken };

    const update = async (roomId: number, data: any) => {
        let imageKey: string | null = null;

        if (data.imageFile) {
            const { presignedUrl, imageKey: key } = await getPresignedUrl(data.imageFile.name, chatAuth);
            const uploadResponse = await fetch(presignedUrl, {
                method: "PUT",
                body: data.imageFile,
            });
            if (!uploadResponse.ok) throw new Error("이미지 업로드에 실패했습니다.");
            imageKey = key;
        }

        const { imageFile, ...rest } = data;

        // imageFile 없으면 imageKey 필드 자체를 제거
        const payload = data.imageFile
            ? { ...rest, imageKey }
            : { ...rest }; // imageKey 미포함 → 서버에서 기존 이미지 유지

        return updateGroupChatRoom(roomId, payload, chatAuth);
    };

    return { update };
}