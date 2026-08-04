"use strict";

/**
 * State object for caching API responses
 * @type {Object}
 */
const ghibliState = {
  films: null,
  lastFetch: null,
  cacheDuration: 5 * 60 * 1000, // 5 minutes
};

/**
 * Fetches all Studio Ghibli films from the API
 * Implements caching to avoid repeated API calls
 * @returns {Promise<Array>} Array of film objects
 * @throws {Error} If the API request fails
 */
export async function getGhibliFilms() {
  // Return cached films if they exist and are fresh
  if (
    ghibliState.films &&
    ghibliState.lastFetch &&
    Date.now() - ghibliState.lastFetch < ghibliState.cacheDuration
  ) {
    console.log("📦 Returning cached films");
    return ghibliState.films;
  }

  try {
    console.log("🌐 Fetching films from Ghibli API...");
    const response = await fetch("https://ghibliapi.vercel.app/films");

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const films = await response.json();
    console.log(`✅ Successfully fetched ${films.length} films from API`);

    // Clean up film data - ensure image URLs are valid
    const cleanedFilms = films.map((film) => ({
      ...film,
      // Ensure image URL is valid
      image: film.image && film.image.startsWith("http") ? film.image : null,
      // Clean other fields
      title: film.title || "Unknown Title",
      director: film.director || "Unknown Director",
      release_date: film.release_date || "Unknown",
      rt_score: film.rt_score || "0",
    }));

    // Cache the results
    ghibliState.films = cleanedFilms;
    ghibliState.lastFetch = Date.now();

    console.log("💾 Films cached successfully");
    return cleanedFilms;
  } catch (error) {
    console.error(" Failed to fetch Ghibli films:", error);
    throw new Error(
      "Unable to load Studio Ghibli films. Please check your internet connection and try again."
    );
  }
}

/**
 * Searches for films and returns suggestions based on query
 * @param {Array} films - Array of film objects
 * @param {string} query - Search query string
 * @param {number} limit - Maximum number of suggestions to return
 * @returns {Array} Array of suggested film objects
 */
export function getSearchSuggestions(films, query, limit = 3) {
  if (!query || !films || !Array.isArray(films) || films.length === 0) {
    return [];
  }

  const queryLower = query.toLowerCase().trim();
  const suggestions = [];

  // Exact title matches (highest priority)
  const exactTitleMatches = films.filter(
    (film) => film.title && film.title.toLowerCase() === queryLower
  );

  // Partial title matches
  const partialTitleMatches = films.filter(
    (film) =>
      film.title &&
      film.title.toLowerCase().includes(queryLower) &&
      !exactTitleMatches.includes(film)
  );

  // Original title matches
  const originalTitleMatches = films.filter(
    (film) =>
      film.original_title &&
      film.original_title.toLowerCase().includes(queryLower) &&
      !exactTitleMatches.includes(film) &&
      !partialTitleMatches.includes(film)
  );

  // Description matches (lowest priority)
  const descriptionMatches = films.filter(
    (film) =>
      film.description &&
      film.description.toLowerCase().includes(queryLower) &&
      !exactTitleMatches.includes(film) &&
      !partialTitleMatches.includes(film) &&
      !originalTitleMatches.includes(film)
  );

  suggestions.push(
    ...exactTitleMatches,
    ...partialTitleMatches,
    ...originalTitleMatches,
    ...descriptionMatches
  );

  // Return limited results
  return suggestions.slice(0, limit);
}

/**
 * Filters films based on search query
 * @param {Array} films - Array of film objects
 * @param {string} searchQuery - Search query string
 * @returns {Array} Filtered array of films
 */
export function filterFilms(films, searchQuery) {
  if (!films || !Array.isArray(films)) {
    return [];
  }

  if (!searchQuery || searchQuery.trim() === "") {
    return films;
  }

  const query = searchQuery.toLowerCase().trim();

  return films.filter((film) => {
    if (!film) return false;

    const inTitle = film.title && film.title.toLowerCase().includes(query);
    const inOriginal =
      film.original_title && film.original_title.toLowerCase().includes(query);
    const inDescription =
      film.description && film.description.toLowerCase().includes(query);

    return inTitle || inOriginal || inDescription;
  });
}

/**
 * Gets unique directors from films array
 * @param {Array} films - Array of film objects
 * @returns {Array} Array of unique director names
 */
export function getUniqueDirectors(films) {
  if (!films || !Array.isArray(films)) {
    return [];
  }

  const directors = new Set();
  films.forEach((film) => {
    if (film.director && film.director.trim() !== "") {
      directors.add(film.director);
    }
  });

  return Array.from(directors).sort();
}

/**
 * Gets cache information
 * @returns {Object} Cache status object
 */
export function getCacheInfo() {
  return {
    hasCache: !!ghibliState.films,
    lastFetch: ghibliState.lastFetch,
    filmCount: ghibliState.films ? ghibliState.films.length : 0,
    isFresh:
      ghibliState.films &&
      ghibliState.lastFetch &&
      Date.now() - ghibliState.lastFetch < ghibliState.cacheDuration,
    cacheDuration: ghibliState.cacheDuration,
  };
}

/**
 * Clears the API cache
 */
export function clearCache() {
  ghibliState.films = null;
  ghibliState.lastFetch = null;
  console.log("🗑️ API cache cleared");
}

/**
 * Gets a film by its ID
 * @param {string} filmId - Film ID
 * @returns {Promise<Object>} Film object
 */
export async function getFilmById(filmId) {
  if (!filmId) {
    throw new Error("Film ID is required");
  }

  try {
    const response = await fetch(
      `https://ghibliapi.vercel.app/films/${filmId}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Film with ID ${filmId} not found`);
      }
      throw new Error(`API responded with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch film ${filmId}:`, error);
    throw error;
  }
}
