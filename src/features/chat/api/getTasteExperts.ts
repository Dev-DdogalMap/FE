import type {
  DirectChatMessage,
  DirectChatRoomSummary,
  TasteExpert,
  TasteExpertFilters,
  TasteExpertListResponse,
} from "@/features/chat/model/types";
import { API_BASE_URL } from "@/shared/config/api";
import { getStoredAccessToken } from "@/shared/auth/token";

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

const buildHeaders = () => {
  const token = getStoredAccessToken();
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : undefined;
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
): Promise<TasteExpertListResponse> {
  const params = new URLSearchParams({
    page: String(filters.page),
    size: String(filters.size),
    sort: filters.sort,
  });
//   const keyword = filters.keyword.trim().toLowerCase();

//   const filtered = mockTasteExperts.filter((expert) => {
//     const matchesKeyword =
//       keyword.length === 0 ||
//       expert.nickname.toLowerCase().includes(keyword) ||
//       expert.specialty.toLowerCase().includes(keyword);


//     const matchesRegion =
//       filters.region === "전체" || expert.region === filters.region;
//     const matchesCategory =
//       filters.category === "전체" || expert.category === filters.category;
//     const matchesLevel = expert.tasteLevel >= filters.minLevel;

//     return (
//       matchesKeyword &&
//       matchesRegion &&
//       matchesCategory &&
//       matchesLevel
//     );
//   });

  if (filters.keyword.trim()) {
    params.set("keyword", filters.keyword.trim());
  }
  if (filters.region !== "전체") {
    params.set("region", filters.region);
  }
  if (filters.minLevel > 0) {
    params.set("minLevel", String(filters.minLevel));
  }

  const response = await fetch(
    `${API_BASE_URL}/api/taste-experts?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
      headers: buildHeaders(),
    },
  );

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

export async function createDirectChat(targetUserId: number) {
  const response = await fetch(`${API_BASE_URL}/api/direct-chats`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...buildHeaders(),
    },
    body: JSON.stringify({ targetUserId }),
  });

  if (!response.ok) {
    throw new Error("채팅방 생성에 실패했습니다.");
  }

  return (await response.json()) as DirectChatRoomSummary;
}

export async function getDirectChats() {
  const response = await fetch(`${API_BASE_URL}/api/direct-chats`, {
    method: "GET",
    credentials: "include",
    headers: buildHeaders(),
  });

  if (!response.ok) {
    throw new Error("내 대화 목록을 불러오지 못했습니다.");
  }

  return (await response.json()) as DirectChatRoomSummary[];
}

export async function getDirectChatRoom(directChatRoomId: number) {
  const response = await fetch(
    `${API_BASE_URL}/api/direct-chats/${directChatRoomId}`,
    {
      method: "GET",
      credentials: "include",
      headers: buildHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error("채팅방 정보를 불러오지 못했습니다.");
  }

  return (await response.json()) as DirectChatRoomSummary;
}

export async function getDirectChatMessages(directChatRoomId: number) {
  const response = await fetch(
    `${API_BASE_URL}/api/direct-chats/${directChatRoomId}/messages`,
    {
      method: "GET",
      credentials: "include",
      headers: buildHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error("채팅 메시지를 불러오지 못했습니다.");
  }

  return (await response.json()) as DirectChatMessage[];
}

export async function saveDirectChatMessage(
  directChatRoomId: number,
  message: string,
) {
  const response = await fetch(
    `${API_BASE_URL}/api/direct-chats/${directChatRoomId}/messages`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...buildHeaders(),
      },
      body: JSON.stringify({
        messageType: "TEXT",
        message,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("채팅 메시지 저장에 실패했습니다.");
  }

  return (await response.json()) as DirectChatMessage;
}
