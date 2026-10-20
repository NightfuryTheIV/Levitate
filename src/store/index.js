import { createStore } from 'vuex'

const STORAGE_KEY = 'movie-library-v2'

function loadLibrary() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const LIBRARY_MUTATIONS = [
  'ADD_ITEM',
  'REMOVE_ITEM',
  'TOGGLE_FAVORITE',
  'TOGGLE_WATCHED',
  'SET_RATING',
  'SET_NOTE'
]
const persistLibrary = (store) => {
  store.subscribe((mutation, state) => {
    if (!LIBRARY_MUTATIONS.includes(mutation.type)) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.library))
    } catch {

    }
  })
}

let toastId = 0

export default createStore({
  state: () => ({
    library: loadLibrary(),
    toasts: []
  }),

  getters: {
    libraryItems: (state) => state.library,
    favorites: (state) => state.library.filter((m) => m.favorite),
    isInLibrary: (state) => (id) => state.library.some((m) => m.id === id),
    getById: (state) => (id) => state.library.find((m) => m.id === id),
    stats(state) {
      const total = state.library.length
      const watched = state.library.filter((m) => m.watched).length
      const rated = state.library.filter((m) => m.rating > 0)
      const average = rated.length ? rated.reduce((sum, m) => sum + m.rating, 0) / rated.length : null
      return {
        total,
        watched,
        remaining: total - watched,
        favorites: state.library.filter((m) => m.favorite).length,
        averageRating: average
      }
    }
  },

  mutations: {
    ADD_ITEM(state, movie) {
      state.library.push({
        ...movie,
        favorite: false,
        watched: false,
        rating: 0,
        note: '',
        addedAt: Date.now()
      })
    },
    REMOVE_ITEM(state, id) {
      state.library = state.library.filter((m) => m.id !== id)
    },
    TOGGLE_FAVORITE(state, id) {
      const item = state.library.find((m) => m.id === id)
      if (item) item.favorite = !item.favorite
    },
    TOGGLE_WATCHED(state, id) {
      const item = state.library.find((m) => m.id === id)
      if (item) item.watched = !item.watched
    },
    SET_RATING(state, { id, rating }) {
      const item = state.library.find((m) => m.id === id)
      if (item) item.rating = rating
    },
    SET_NOTE(state, { id, note }) {
      const item = state.library.find((m) => m.id === id)
      if (item) item.note = note
    },
    PUSH_TOAST(state, toast) {
      state.toasts.push(toast)
    },
    REMOVE_TOAST(state, id) {
      state.toasts = state.toasts.filter((t) => t.id !== id)
    }
  },

  actions: {
    notify({ commit }, { message, type = 'success' }) {
      const id = ++toastId
      commit('PUSH_TOAST', { id, message, type })
      setTimeout(() => commit('REMOVE_TOAST', id), 3000)
    },

    addMovie({ commit, dispatch, getters }, movie) {
      if (getters.isInLibrary(movie.id)) {
        dispatch('notify', { message: `« ${movie.title} » is already in your library`, type: 'info' })
        return false
      }
      commit('ADD_ITEM', movie)
      dispatch('notify', { message: `« ${movie.title} » added to your library` })
      return true
    },

    removeMovie({ commit, dispatch, getters }, id) {
      const movie = getters.getById(id)
      commit('REMOVE_ITEM', id)
      if (movie) dispatch('notify', { message: `« ${movie.title} » removed`, type: 'info' })
    },

    toggleFavorite({ commit }, id) {
      commit('TOGGLE_FAVORITE', id)
    },
    toggleWatched({ commit }, id) {
      commit('TOGGLE_WATCHED', id)
    },
    setRating({ commit, getters }, { id, rating }) {

      const current = getters.getById(id)?.rating
      commit('SET_RATING', { id, rating: current === rating ? 0 : rating })
    },
    setNote({ commit }, payload) {
      commit('SET_NOTE', payload)
    }
  },

  plugins: [persistLibrary]
})
