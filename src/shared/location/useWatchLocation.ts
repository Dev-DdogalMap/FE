import { useEffect, useState } from "react";

type CurrentLocation = {
  lat: number;
  lng: number;
  accuracy: number;
};

export function useWatchLocation() {
  const [location, setLocation] = useState<CurrentLocation | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setErrorMessage("현재 브라우저에서는 위치 기능을 지원하지 않습니다.");
      setLoading(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
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
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return {
    location,
    loading,
    errorMessage,
  };
}