# 🎬 Levitate

A Vue.js application for searching movies, adding them to a personal library, managing favorites, and keeping track of what you've watched.
## Disclaimer
We have used AI to partially format the CSS, the README.md and the LocalStorage aspect of the project.

## Technologies

- **Vue 3** (Composition API, `<script setup>`) + **Vite**
- **Vue Router 4**: `/`, `/library`, `/favorites`, `/movie/:id`
- **Vuex 4**: state, getters, mutations, actions
- **External API: [TMDB (The Movie Database)](https://www.themoviedb.org/)** (movies)
- **localStorage**: saves the library and the theme
- **Figma**: mockups and prototype (see `docs/UX.md`)

## Installation

Prerequisite: [Node.js](https://nodejs.org/) 18 or newer.

```bash
# 1. Install dependencies
npm install

# 2. Configure the TMDB API key
cp .env.example .env
# then edit .env and replace the value of VITE_TMDB_API_KEY

# 3. Start the development server
npm run dev
```

The app is available at http://localhost:5173.

For a production build: `npm run build`, then `npm run preview`.

### Getting a TMDB key (free)

1. Create an account at https://www.themoviedb.org/signup and confirm your email.
2. Go to *Settings → API* (https://www.themoviedb.org/settings/api) and request a key (usage: "Education" / personal).
3. Copy the **API key (v3 auth)** into the `.env` file: `VITE_TMDB_API_KEY=xxxxxxxx`.

> The `.env` file is ignored by Git: never publish your key.

## API used

**TMDB API v3** (`https://api.themoviedb.org/3`), in French (`language=fr-FR`):

- `GET /search/movie?query=<title>&page=<n>`: paginated search (20 results per page)
- `GET /movie/<id>?append_to_response=credits`: movie details (synopsis, runtime, genres, director and actors via `credits`)
- Posters: `https://image.tmdb.org/t/p/w500/<poster_path>`

The search endpoint does not return the director, so the app fetches the details of each result in parallel in order to display **title, director, year and poster**.

This product uses the TMDB API but is not endorsed or certified by TMDB.

## Features

### Required
- Dynamic search through the TMDB API, with movie selection
- `/library` page: add, remove, mark as watched / unwatched, add to favorites
- `/favorites` page: powered by the Vuex getter `favorites`
- Persistence: the library is saved in `localStorage` (key `movie-library-v2`) and reloaded on startup

### Advanced (4 blocks implemented)
1. **Filters and sorting**: favorites, watched / unwatched; sort by title, year, date added; search within the library
2. **Ratings and notes**: personal rating from 1 to 5 stars + written review (persisted); detail page `/movie/:id` with a route parameter
3. **Statistics**: total, watched, remaining, favorites, average rating
4. **Better API and UX experience**: loading indicator, error message with "Retry", "no results" state, "Load more" button, duplicate prevention, dark / light mode, responsive interface, empty states, confirmation before deletion, notifications (toasts)

## Architecture

```
src/
├── main.js
├── App.vue                 # header, navigation, theme, toasts
├── router/index.js
├── store/index.js          # Vuex + localStorage persistence plugin
├── services/tmdb.js        # API calls
├── views/
│   ├── SearchView.vue
│   ├── LibraryView.vue
│   ├── FavoritesView.vue
│   └── MovieDetailView.vue
└── components/
    ├── MovieCard.vue
    ├── StarRating.vue
    ├── StatsPanel.vue
    └── EmptyState.vue
```

### Vuex store

| Element | Content |
|---|---|
| **state** | `library` (loaded from localStorage), `toasts` |
| **getters** | `libraryItems`, `favorites`, `isInLibrary(id)`, `getById(id)`, `stats` |
| **mutations** | `ADD_ITEM`, `REMOVE_ITEM`, `TOGGLE_FAVORITE`, `TOGGLE_WATCHED`, `SET_RATING`, `SET_NOTE`, `PUSH_TOAST`, `REMOVE_TOAST` |
| **actions** | `addMovie` (rejects duplicates), `removeMovie`, `toggleFavorite`, `toggleWatched`, `setRating`, `setNote`, `notify` |

Each saved movie has the following shape:

```js
{ id, title, director, year, poster, plot, genre, runtime, actors, voteAverage,
  favorite: false, watched: false, rating: 0, note: '', addedAt: 1700000000000 }
```

## Checking persistence

1. Add a movie, mark it as a favorite, rate it.
2. Reload the page (F5): everything is kept.
3. In the developer tools, open *Application → Local Storage*: the `movie-library-v2` key contains the library.

## Deliverables

- Figma prototype: _add your link here_
- Persona, problem statement, wireframes: `docs/UX.md`
- Git repository: _add the link here_
