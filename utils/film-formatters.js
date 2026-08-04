"use strict";

// Create HTML for film card
export function createFilmCardHTML(film) {
  if (!film) return "";

  const posterHTML = film.image
    ? `<img src="${clean(film.image)}" alt="${clean(
        film.title
      )}" class="film-poster">`
    : `<div class="film-poster-fallback">${getIcon(film.title)}</div>`;

  return `
        <article class="film-card" data-film-id="${film.id}">
            <div class="film-poster-container">${posterHTML}</div>
            <div class="film-content">
                <h3 class="film-card-title">${clean(film.title)}</h3>
                <div class="film-original-title">${clean(
                  film.original_title
                )}</div>
                <div class="film-meta">
                    <span class="film-year">${clean(film.release_date)}</span>
                    <span class="film-score">${film.rt_score}%</span>
                </div>
                <p class="film-director">${clean(film.director)}</p>
                <p class="film-description">${clean(
                  shorten(film.description, 150)
                )}</p>
                <div class="film-footer">
                    <span class="film-runtime">${film.running_time} min</span>
                    <span class="film-producer">${clean(film.producer)}</span>
                </div>
            </div>
        </article>
    `;
}

// Create HTML for search suggestions
export function createSuggestionsHTML(suggestions) {
  if (!suggestions || suggestions.length === 0) return "";

  return suggestions
    .map(
      (film) => `
        <div class="suggestion-item" data-film-title="${clean(film.title)}">
            <span class="suggestion-icon">${getIcon(film.title)}</span>
            <div class="suggestion-text">
                <span class="suggestion-title">${clean(film.title)}</span>
                <span class="suggestion-year">${clean(film.release_date)}</span>
            </div>
        </div>
    `
    )
    .join("");
}

// Shorten text with ellipsis
function shorten(text, length) {
  if (!text) return "";
  return text.length > length ? text.substring(0, length) + "..." : text;
}

// Get emoji icon based on film title
function getIcon(title) {
  if (!title) return "🎬";

  const icons = {
    totoro: "🌳",
    spirited: "🐉",
    howl: "🏰",
    mononoke: "🐺",
    chihiro: "🏮",
    kiki: "🧹",
  };

  const lower = title.toLowerCase();
  for (const [key, icon] of Object.entries(icons)) {
    if (lower.includes(key)) return icon;
  }

  return "🎬";
}

function clean(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
