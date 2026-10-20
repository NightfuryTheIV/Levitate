const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500'
const LANGUAGE = 'fr-FR'

async function request(path, params = {}) {
  if (!API_KEY) {
    throw new Error(
      "TMDB API key missing. Create a .env file with VITE_TMDB_API_KEY=key then restart the application."
    )
  }
  const url = new URL(BASE_URL + path)
  Object.entries({ api_key: API_KEY, language: LANGUAGE, ...params }).forEach(([k, v]) =>
    url.searchParams.set(k, v)
  )

  let res
  try {
    res = await fetch(url)
  } catch {
    throw new Error('Impossible to reach TMDB. Please check your internet connection.')
  }
  if (res.status === 401) throw new Error('Invalid TMDB API key.')
  if (res.status === 404) throw new Error('Movie not found.')
  if (res.status === 429) throw new Error('Too many requests: please try again later.')
  if (!res.ok) throw new Error(`TMDB service error (HTTP ${res.status}).`)
  return res.json()
}

function normalize(raw) {
  const director = raw.credits?.crew?.find((p) => p.job === 'Director')?.name
  return {
    id: String(raw.id),
    title: raw.title || 'Title unknown',
    year: raw.release_date ? raw.release_date.slice(0, 4) : '',
    director: director || 'Director unknown',
    poster: raw.poster_path ? IMAGE_URL + raw.poster_path : '',
    plot: raw.overview || '',
    genre: raw.genres ? raw.genres.map((g) => g.name).join(', ') : '',
    runtime: raw.runtime ? `${raw.runtime} min` : '',
    actors: raw.credits?.cast
      ? raw.credits.cast.slice(0, 5).map((a) => a.name).join(', ')
      : '',
    voteAverage: raw.vote_average ? raw.vote_average.toFixed(1) : ''
  }
}

export async function getMovie(id) {
  const data = await request(`/movie/${id}`, { append_to_response: 'credits' })
  return normalize(data)
}

export async function searchMovies(query, page = 1) {
  const data = await request('/search/movie', { query, page, include_adult: false })
  if (!data.results.length) return {
    results: [], total: 0
  }

  const settled = await Promise.allSettled(data.results.map((r) => getMovie(r.id)))
  const results = settled.map((s, i) => (s.status === 'fulfilled' ? s.value : normalize(data.results[i])))
  return {
    results, total: data.total_results
  }
}
