import { useEffect, useState } from "react";

interface Coords {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export const useGeoLocation = () => {
  const [location, setLocation] = useState<Coords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const onSuccess = (position: GeolocationPosition) => {
    setLocation(position.coords);
    setLoading(false);
  };

  const onError = (error: GeolocationPositionError) => {
    console.error("Geolocation error:", error.message);
    setError(error.message);
    setLoading(false);
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported.");
      setError("Geolocation is not supported.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }, []);

  return { location, error, loading };
};
