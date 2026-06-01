export const ROUTES = {
  home: "/",
  search: "/search",
  chat: "/chat",
  directChat: (userId: number | string) => `/chat/direct/${userId}`,
  groupChats: "/chat/groups",
  createGroupChat: "/chat/groups/create",
  groupChatRoom: (groupId: number | string) => `/chat/groups/${groupId}`,
} as const;
