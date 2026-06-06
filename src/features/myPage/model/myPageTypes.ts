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