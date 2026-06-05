export type DongRegion = {
    regionId: number;
    legalCode: string;
    eupmyeondongName: string;
    latitude: number | null;
    longitude: number | null;
};

export type SigunguRegion = {
    sigunguName: string;
    dongs: DongRegion[];
};

export type SidoRegion = {
    sidoName: string;
    sigungus: SigunguRegion[];
};