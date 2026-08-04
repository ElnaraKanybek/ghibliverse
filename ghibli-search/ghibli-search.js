"use strict";

import {
  getGhibliFilms,
  getSearchSuggestions,
} from "../services/ghibli-api.js";
import {
  createFilmCardHTML,
  createSuggestionsHTML,
} from "../utils/film-formatters.js";

// Main app controller
class GhibliSearchApp {
  constructor() {
    this.films = [];
    this.filteredFilms = [];
    this.searchQuery = "";
    this.isLoading = true;
    this.searchTimeout = null;

    this.cacheElements();
    this.setupEvents();
    this.init();
  }

  // Cache jQuery elements
  cacheElements() {
    this.$searchInput = $("#searchInput");
    this.$searchButton = $("#searchButton");
    this.$suggestions = $("#suggestions");
    this.$filmsContainer = $("#filmsContainer");
    this.$loading = $("#loading");
    this.$noResults = $("#noResults");
  }

  // Event delegation setup
  setupEvents() {
    this.$searchInput.on("input", this.handleSearchInput.bind(this));

    // Single event listener for all dynamic elements
    $(document)
      .on("click", "#searchButton", this.handleSearchClick.bind(this))
      .on("click", ".suggestion-item", this.handleSuggestionClick.bind(this))
      .on("click", ".film-card", this.handleFilmClick.bind(this))
      .on("click", this.hideSuggestions.bind(this));
  }

  // Initialize app and fetch films
  async init() {
    try {
      this.showLoading();
      this.films = await getGhibliFilms();
      this.filteredFilms = this.films;
      this.hideLoading();
      this.render();
    } catch (error) {
      this.showError("Failed to load films");
    }
  }

  showLoading() {
    this.$loading.removeClass("hidden");
    this.$filmsContainer.addClass("hidden");
    this.$noResults.addClass("hidden");
  }

  hideLoading() {
    this.$loading.addClass("hidden");
    this.$filmsContainer.removeClass("hidden");
    this.isLoading = false;
  }

  showError(msg) {
    this.$loading.addClass("hidden");
    this.$filmsContainer.html(`
            <div class="error">
                <h3>Error</h3>
                <p>${msg}</p>
                <button class="retry">Retry</button>
            </div>
        `);
    this.$filmsContainer.removeClass("hidden");

    this.$filmsContainer.on("click", ".retry", () => location.reload());
  }

  // Handle search with debouncing
  handleSearchInput() {
    const query = this.$searchInput.val().trim();
    this.searchQuery = query;

    clearTimeout(this.searchTimeout);

    if (!query) {
      this.$suggestions.hide();
      this.update();
      return;
    }

    this.searchTimeout = setTimeout(() => {
      const suggestions = getSearchSuggestions(this.films, query, 3);

      if (suggestions.length > 0) {
        this.$suggestions.html(createSuggestionsHTML(suggestions));
        this.$suggestions.show();
      } else {
        this.$suggestions.hide();
      }

      this.update();
    }, 300);
  }

  handleSearchClick() {
    this.$suggestions.hide();
    this.update();
  }

  handleSuggestionClick(event) {
    const filmTitle = $(event.currentTarget).data("film-title");
    const film = this.films.find((f) => f.title === filmTitle);

    if (film) {
      this.$searchInput.val(film.title);
      this.searchQuery = film.title;
      this.$suggestions.hide();
      this.update();
    }
  }

  handleFilmClick(event) {
    const filmId = $(event.currentTarget).data("film-id");
    const film = this.films.find((f) => f.id === filmId);

    if (film) {
      alert(`${film.title}\n\n${film.description}`);
    }
  }

  // Hide suggestions when clicking outside search area
  hideSuggestions(event) {
    if (!$(event.target).closest(".search-section").length) {
      this.$suggestions.hide();
    }
  }


  // Filter films based on search query
  update() {
    const query = this.searchQuery.toLowerCase();

    if (!query) {
      this.filteredFilms = this.films;
    } else {
      this.filteredFilms = this.films.filter(
        (film) =>
          film.title.toLowerCase().includes(query) ||
          film.original_title.toLowerCase().includes(query) ||
          film.description.toLowerCase().includes(query)
      );
    }

    this.render();
  }

  // Render films to DOM
  render() {
    if (this.isLoading || !this.filteredFilms) return;

    if (this.filteredFilms.length === 0) {
      this.$noResults.removeClass("hidden");
      this.$filmsContainer.addClass("hidden");
      return;
    }

    this.$noResults.addClass("hidden");
    this.$filmsContainer.removeClass("hidden");

    const filmsHTML = this.filteredFilms
      .map((film) => createFilmCardHTML(film))
      .join("");

    this.$filmsContainer.html(filmsHTML);
  }
}

// Start application
new GhibliSearchApp();
