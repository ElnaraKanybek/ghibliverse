# Ghibli Films Search
 
A search page for browsing Studio Ghibli films. Users can look up films by title, see live search suggestions as they type, and browse results as film cards with posters, ratings, and details pulled from the [Studio Ghibli API](https://ghibliapi.vercel.app).
 
## Features
 
- 🔍 **Live search** — debounced input search across film titles, original titles, and descriptions
- 💡 **Autocomplete suggestions** — dropdown of matching titles as you type
- 🎬 **Film cards** — poster, release year, Rotten Tomatoes score, director, producer, runtime, and description
- 🖼️ **Graceful image fallback** — displays a placeholder icon if a poster fails to load
- 📱 **Responsive layout** — adapts from desktop grid down to a single-column mobile view
## Tech Stack
 
- HTML5 / CSS3
- Vanilla JavaScript (ES modules)
- [jQuery 3.7.1](https://jquery.com/) for DOM manipulation and event delegation
- [Studio Ghibli API](https://ghibliapi.vercel.app) for film data
## Project Structure
 
```
ghibli-search/
├── ghibli-search.html      # Page markup
├── ghibli-search.css       # Styles
└── ghibli-search.js        # App logic (GhibliSearchApp controller)
services/
└── ghibli-api.js           # Fetches films, builds search suggestions
utils/
└── film-formatters.js      # Builds film card and suggestion HTML
```
 
## Getting Started
 
1. Clone the repo:
```bash
   git clone https://github.com/<your-username>/<repo-name>.git
   cd <repo-name>
```
2. Open `ghibli-search/ghibli-search.html` in a browser, or serve the project with a local static server (recommended, since it uses ES modules):
```bash
   npx serve .
```
3. Navigate to the Ghibli Films page and start searching.
No build step or dependencies to install — jQuery is loaded via CDN.
 
## How It Works
 
- `services/ghibli-api.js` fetches the film list from the Ghibli API and normalizes the response (filling in fallback values for any missing fields).
- `utils/film-formatters.js` turns film objects into the HTML for film cards and search suggestions, escaping user-facing text to avoid markup issues.
- `ghibli-search.js` ties it together: it fetches films on load, filters them as the user types, and re-renders the film grid.
## Credits
 
Film data provided by the [Studio Ghibli API](https://ghibliapi.vercel.app).
