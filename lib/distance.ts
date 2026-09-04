/**
 * Menghitung jarak antara dua koordinat menggunakan rumus Haversine
 * @returns Jarak dalam kilometer
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius bumi dalam km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Pembulatan 1 desimal
}

/**
 * Mendapatkan koordinat sekolah dari environment variable
 */
export function getSchoolCoordinates() {
  const lat = parseFloat(process.env.NEXT_PUBLIC_SCHOOL_LAT || "0");
  const lng = parseFloat(process.env.NEXT_PUBLIC_SCHOOL_LNG || "0");
  return { lat, lng };
}