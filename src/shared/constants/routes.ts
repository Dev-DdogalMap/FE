export const ROUTES = {
  home: "/",
  search: "/search",
  chat: "/chat",
  directChat: (directChatRoomId: number | string) =>
    `/chat/direct/${directChatRoomId}`,
  groupChats: "/chat/groups",
  createGroupChat: "/chat/groups/create",
  groupChatRoom: (groupId: number | string) => `/chat/groups/${groupId}`,
} as const;
