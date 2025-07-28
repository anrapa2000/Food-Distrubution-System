// Reverse geocoding utility using OpenStreetMap Nominatim API
export const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`
    );
    const data = await response.json();
    
    if (data.address) {
      const city = data.address.city || data.address.town || data.address.village || data.address.county || 'Unknown';
      const state = data.address.state || '';
      return `${city}, ${state}`.trim();
    }
    
    return 'Unknown Location';
  } catch (error) {
    console.error('Geocoding error:', error);
    return 'Unknown Location';
  }
};

// Cache for geocoding results to avoid repeated API calls
const geocodeCache = new Map<string, string>();

export const getCachedGeocode = async (lat: number, lon: number): Promise<string> => {
  const key = `${lat},${lon}`;
  
  if (geocodeCache.has(key)) {
    return geocodeCache.get(key)!;
  }
  
  const result = await reverseGeocode(lat, lon);
  geocodeCache.set(key, result);
  return result;
}; 