const LOCATION_API_URL = "http://localhost:5291/api/Location";

export async function getLocationName(lat: number, lon: number): Promise<string> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.display_name || `${lat}, ${lon}`;
}

export async function getCurrentLocation(accountId: number) {
  const res = await fetch(`${LOCATION_API_URL}/${accountId}`);
  if (!res.ok) return null;
  return await res.json();
} 