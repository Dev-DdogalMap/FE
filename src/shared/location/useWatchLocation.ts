import { useEffect, useRef, useState } from "react";

type CurrentLocation = {
  lat: number;
  lng: number;
  accuracy: number;
};

const MIN_UPDATE_DISTANCE_METER = 10;

const getDistanceMeter = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) => {
  const EARTH_RADIUS_METER = 6371000;
  const toRad = (value: number) => (value * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_METER * c;
};

type UseWatchLocationProps = {
  enabled?: boolean;
};

export function useWatchLocation({
  enabled = true,
}: UseWatchLocationProps = {}) {
  const [location, setLocation] = useState<CurrentLocation | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const lastLocationRef = useRef<CurrentLocation | null>(null);

  useEffect(() => {
    if (!enabled) return; 

    if (!navigator.geolocation) {
      setErrorMessage("현재 브라우저에서는 위치 기능을 지원하지 않습니다.");
      setLoading(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const nextLocation: CurrentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };

        const prevLocation = lastLocationRef.current;

        if (prevLocation) {
          const movedMeter = getDistanceMeter(
            prevLocation.lat,
            prevLocation.lng,
            nextLocation.lat,
            nextLocation.lng,
          );

          if (movedMeter < MIN_UPDATE_DISTANCE_METER) {
            setLoading(false);
            return;
          }
        }

        lastLocationRef.current = nextLocation;
        setLocation(nextLocation);
        setErrorMessage(null);
        setLoading(false);
      },
      (error) => {
        console.error(error);

        if (error.code === error.PERMISSION_DENIED) {
          setErrorMessage("위치 권한을 허용해야 현재 위치를 표시할 수 있습니다.");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setErrorMessage("현재 위치 정보를 사용할 수 없습니다.");
        } else if (error.code === error.TIMEOUT) {
          setErrorMessage("현재 위치 요청 시간이 초과되었습니다.");
        } else {
          setErrorMessage("현재 위치를 가져오지 못했습니다.");
        }

        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 3000,
      },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [enabled]);

  return {
    location,
    loading,
    errorMessage,
  };
}