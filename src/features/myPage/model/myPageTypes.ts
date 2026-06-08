export type MyNeighborhoodResponse = {
  eupmyeondongName: string;
  verified: boolean;
  verifiedAt: string | null;
};


export type MyNeighborhoodVerificationRequest = {
  latitude: number;
  longitude: number;
  accuracy: number;
};

export type MyNeighborhoodVerificationResponse = {
  eupmyeondongName: string;
  verified: boolean;
  verifiedAt: string | null;
};

export type Badge = {
  badgeId: number;
  name: string;
  iconImage: string;
};

export type LevelInfo = {
  currentLevel: number;
  currentLevelName: string;
  currentExp: number;
  remainingExpToNextLevel: number;
  progressPercent: number;
};

export type BadgeInfo = {
  representativeBadge: Badge | null;
  recentBadges: Badge[];
};

export type ActivitySummaryResponse = {
  level: LevelInfo;
  badges: BadgeInfo;
};

export type BadgeDetail = Badge & {
  acquired: boolean;
  acquiredAt: string | null;
  remainingCount: number;
};

export type LevelHistory = {
  historyId: number;
  activityType: string;
  activityName: string;
  expAmount: number;
  level: number;
  levelName: string;
  createdAt: string;
};

export type ActivityDetailResponse = {
  level: LevelInfo;
  representativeBadge: Badge | null;
  badges: BadgeDetail[];
  levelHistories: LevelHistory[];
};

export type UpdateRepresentativeBadgeRequest = {
  badgeId: number;
};

export type RepresentativeBadgeResponse = {
  badgeId: number;
  name: string;
  iconImage: string;
};