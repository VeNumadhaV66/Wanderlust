module.exports = async function geocode(location, country) {
  try {
    const query = new URLSearchParams({
      q: `${location}, ${country}`,
      format: "json",
      limit: "1",
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${query}`,
      {
        // Nominatim asks every app to identify itself
        headers: { "User-Agent": "Wanderlust-student-project/1.0" },
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!response.ok) {
      return null;
    }

    const results = await response.json();

    if (results.length === 0) {
      return null;
    }

    return {
      type: "Point",
      coordinates: [Number(results[0].lon), Number(results[0].lat)],
    };
  } catch (err) {
    // a failed lookup must never stop a listing from being saved
    console.log("Geocoding failed:", err.message);
    return null;
  }
};