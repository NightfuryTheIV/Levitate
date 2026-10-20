import { createRouter, createWebHistory } from 'vue-router'
import SearchView from '../views/SearchView.vue'
import LibraryView from '../views/LibraryView.vue'
import FavoritesView from '../views/FavoritesView.vue'
import MovieDetailView from '../views/MovieDetailView.vue'

const routes = [
  { path: '/', name: 'search', component: SearchView },
  { path: '/library', name: 'library', component: LibraryView },
  { path: '/favorites', name: 'favorites', component: FavoritesView },
  { path: '/movie/:id', name: 'movie', component: MovieDetailView, props: true },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})
