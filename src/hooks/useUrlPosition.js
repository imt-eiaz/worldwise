import { useSearchParams } from "react-router-dom";

export function useUrlPosition() {
  const [searchPharams] = useSearchParams();
  const lat = searchPharams.get("lat");
  const lng = searchPharams.get("lng");

  return [lat, lng];
}
