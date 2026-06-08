import type {
  DirectChatMessage,
  DirectChatRoomSummary,
  TasteExpert,
  TasteExpertFilters,
  TasteExpertListResponse,
} from "@/features/chat/model/types";
import { authFetch } from "@/shared/api/authFetch";

export type ChatAuth = {
  accessToken: string | null;
  refreshAccessToken: () => Promise<string | null>;
};

type TasteExpertApiItem = {
  userId: number;
  nickname: string;
  profileImageUrl?: string | null;
  region?: string | null;
  level: number;
  levelName: string;
  exp: number;
  reviewCount: number;
  visitVerificationCount: number;
  ratingAverage: number;
  specialty?: string | null;
  isCertified: boolean;
};

type TasteExpertApiResponse = {
  content: TasteExpertApiItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

const categoryFromSpecialty = (specialty?: string | null) => {
  if (!specialty) {
    return "양식";
  }
  if (specialty.includes("카페")) {
    return "카페";
  }
  if (specialty.includes("술")) {
    return "술집";
  }
  if (specialty.includes("한식")) {
    return "한식";
  }
  return "양식";
};

const mapExpert = (item: TasteExpertApiItem): TasteExpert => {
  const category = categoryFromSpecialty(item.specialty);
  return {
    userId: item.userId,
    nickname: item.nickname,
    tasteLevel: item.level,
    levelName: item.levelName,
    specialty: item.specialty ?? `${category} 전문`,
    rating: item.ratingAverage,
    reviewCount: item.reviewCount,
    visitVerificationCount: item.visitVerificationCount,
    exp: item.exp,
    region: item.region ?? "지역 정보 준비중",
    category,
    isCertified: item.isCertified,
    profileImageUrl: item.profileImageUrl ?? undefined,
  };
};

export async function getTasteExperts(
  filters: TasteExpertFilters,
  auth: ChatAuth,
): Promise<TasteExpertListResponse> {
  const params = new URLSearchParams({
    page: String(filters.page),
    size: String(filters.size),
    sort: filters.sort,
  });

  if (filters.keyword.trim()) {
    params.set("keyword", filters.keyword.trim());
  }
  if (filters.minLevel > 0) {
    params.set("minLevel", String(filters.minLevel));
  }

  const response = await authFetch({
    path: `/api/taste-experts?${params.toString()}`,
    accessToken: auth.accessToken,
    refreshAccessToken: auth.refreshAccessToken,
    options: {
      method: "GET",
    },
  });

  if (!response.ok) {
    throw new Error("맛잘알 목록을 불러오지 못했습니다.");
  }

  const data = (await response.json()) as TasteExpertApiResponse;
  const mapped = data.content.map(mapExpert);
  const filteredByCategory =
    filters.category === "전체"
      ? mapped
      : mapped.filter((expert) => expert.category === filters.category);

  return {
    content: filteredByCategory,
    page: data.page,
    size: data.size,
    totalElements:
      filters.category === "전체"
        ? data.totalElements
        : filteredByCategory.length,
    totalPages:
      filters.category === "전체"
        ? data.totalPages
        : Math.max(1, Math.ceil(filteredByCategory.length / data.size)),
  };
}

export async function createDirectChat(targetUserId: number, auth: ChatAuth) {
  const response = await authFetch({
    path: "/api/direct-chats",
    accessToken: auth.accessToken,
    refreshAccessToken: auth.refreshAccessToken,
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ targetUserId }),
    },
  });

  if (!response.ok) {
    throw new Error("채팅방 생성에 실패했습니다.");
  }

  return (await response.json()) as DirectChatRoomSummary;
}

// 내 대화 목록 조회
export async function getDirectChats(auth: ChatAuth) {
  const response = await authFetch({
    path: "/api/direct-chats",
    accessToken: auth.accessToken,
    refreshAccessToken: auth.refreshAccessToken,
    options: {
      method: "GET",
    },
  });

  if (!response.ok) {
    throw new Error("내 대화 목록을 불러오지 못했습니다.");
  }

  return (await response.json()) as DirectChatRoomSummary[];
}

export async function getDirectChatRoom(
  directChatRoomId: number,
  auth: ChatAuth,
) {
  const response = await authFetch({
    path: `/api/direct-chats/${directChatRoomId}`,
    accessToken: auth.accessToken,
    refreshAccessToken: auth.refreshAccessToken,
    options: {
      method: "GET",
    },
  });

  if (!response.ok) {
    throw new Error("채팅방 정보를 불러오지 못했습니다.");
  }

  return (await response.json()) as DirectChatRoomSummary;
}

export async function getDirectChatMessages(
  directChatRoomId: number,
  auth: ChatAuth,
) {
  const response = await authFetch({
    path: `/api/direct-chats/${directChatRoomId}/messages`,
    accessToken: auth.accessToken,
    refreshAccessToken: auth.refreshAccessToken,
    options: {
      method: "GET",
    },
  });

  if (!response.ok) {
    throw new Error("채팅 메시지를 불러오지 못했습니다.");
  }

  return (await response.json()) as DirectChatMessage[];
}

export async function leaveDirectChatRoom(
  directChatRoomId: number,
  auth: ChatAuth,
) {
  const response = await authFetch({
    path: `/api/direct-chats/${directChatRoomId}/leave`,
    accessToken: auth.accessToken,
    refreshAccessToken: auth.refreshAccessToken,
    options: {
      method: "DELETE",
    },
  });

  if (!response.ok) {
    throw new Error("채팅방 나가기에 실패했습니다.");
  }
}

export async function saveDirectChatMessage(
  directChatRoomId: number,
  message: string,
  auth: ChatAuth,
) {
  const response = await authFetch({
    path: `/api/direct-chats/${directChatRoomId}/messages`,
    accessToken: auth.accessToken,
    refreshAccessToken: auth.refreshAccessToken,
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
      }),
    },
  });

  if (!response.ok) {
    throw new Error("채팅 메시지 저장에 실패했습니다.");
  }

  return (await response.json()) as DirectChatMessage;
}
