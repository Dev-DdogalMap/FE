import { authFetch } from "@/shared/api/authFetch";

type WithdrawParams = {
  accessToken: string | null;
  refreshAccessToken: () => Promise<string | null>;
};

export async function withdrawUser({
  accessToken,
  refreshAccessToken,
}: WithdrawParams) {
  const response = await authFetch({
    path: "/api/users/me",
    accessToken,
    refreshAccessToken,
    options: {
      method: "DELETE",
    },
  });

  if (!response.ok) {
    throw new Error("회원탈퇴에 실패했습니다.");
  }
}