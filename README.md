# 🎬 Levitate

Application Vue.js pour rechercher des films, les ajouter à sa bibliothèque personnelle, gérer ses favoris et suivre ce qu'on a vu.

## Technologies

- **Vue 3** (Composition API, `<script setup>`) + **Vite**
- **Vue Router 4** : `/`, `/library`, `/favorites`, `/movie/:id`
- **Vuex 4** : state, getters, mutations, actions
- **API externe : [TMDB (The Movie Database)](https://www.themoviedb.org/)** (films)
- **localStorage** : sauvegarde de la bibliothèque et du thème
- **Figma** : maquettes et prototype (voir `docs/UX.md`)

## Installation

Prérequis : [Node.js](https://nodejs.org/) 18 ou plus récent.

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer la clé API TMDB
cp .env.example .env
# puis éditez .env et remplacez la valeur de VITE_TMDB_API_KEY

# 3. Lancer le serveur de développement
npm run dev
```

L'application est disponible sur http://localhost:5173.

Pour une version de production : `npm run build` puis `npm run preview`.

### Obtenir une clé TMDB (gratuite)

1. Créez un compte sur https://www.themoviedb.org/signup et validez votre e-mail.
2. Allez dans *Paramètres → API* (https://www.themoviedb.org/settings/api) et demandez une clé (usage « Education » / personnel).
3. Copiez la **clé API (v3 auth)** dans le fichier `.env` : `VITE_TMDB_API_KEY=xxxxxxxx`.

> Le fichier `.env` est ignoré par Git : ne publiez jamais votre clé.

## API utilisée

**TMDB API v3** (`https://api.themoviedb.org/3`), en français (`language=fr-FR`) :

- `GET /search/movie?query=<titre>&page=<n>` : recherche paginée (20 résultats par page)
- `GET /movie/<id>?append_to_response=credits` : détail d'un film (synopsis, durée, genres, réalisateur et acteurs via `credits`)
- Affiches : `https://image.tmdb.org/t/p/w500/<poster_path>`

La recherche ne renvoie pas le réalisateur : l'application récupère donc le détail de chaque résultat en parallèle pour afficher **titre, réalisateur, année et affiche**.

This product uses the TMDB API but is not endorsed or certified by TMDB.

## Fonctionnalités

### Obligatoires
- Recherche dynamique via l'API TMDB, sélection d'un film
- Page `/library` : ajouter, supprimer, marquer vu / pas vu, ajouter aux favoris
- Page `/favorites` : alimentée par le getter Vuex `favorites`
- Persistance : la bibliothèque est sauvegardée dans `localStorage` (clé `movie-library-v2`) et rechargée au démarrage

### Avancées (4 blocs implémentés)
1. **Filtres et tri** : favoris, vu / pas vu ; tri par titre, année, date d'ajout ; recherche dans la bibliothèque
2. **Notation et notes** : note personnelle de 1 à 5 étoiles + avis écrit (persistés) ; page de détail `/movie/:id` avec paramètre de route
3. **Statistiques** : total, vus, restants, favoris, note moyenne
4. **Meilleure expérience API et UX** : indicateur de chargement, message d'erreur avec « Réessayer », état « aucun résultat », bouton « Charger plus », anti-doublons, mode sombre / clair, interface responsive, états vides, confirmation avant suppression, notifications (toasts)

## Architecture

```
src/
├── main.js
├── App.vue                 # en-tête, navigation, thème, toasts
├── router/index.js
├── store/index.js          # Vuex + plugin de persistance localStorage
├── services/tmdb.js        # appels à l'API
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

### Store Vuex

| Élément | Contenu |
|---|---|
| **state** | `library` (chargée depuis localStorage), `toasts` |
| **getters** | `libraryItems`, `favorites`, `isInLibrary(id)`, `getById(id)`, `stats` |
| **mutations** | `ADD_ITEM`, `REMOVE_ITEM`, `TOGGLE_FAVORITE`, `TOGGLE_WATCHED`, `SET_RATING`, `SET_NOTE`, `PUSH_TOAST`, `REMOVE_TOAST` |
| **actions** | `addMovie` (refuse les doublons), `removeMovie`, `toggleFavorite`, `toggleWatched`, `setRating`, `setNote`, `notify` |

Chaque film enregistré a la forme :

```js
{ id, title, director, year, poster, plot, genre, runtime, actors, voteAverage,
  favorite: false, watched: false, rating: 0, note: '', addedAt: 1700000000000 }
```

## Vérifier la persistance

1. Ajoutez un film, mettez-le en favori, notez-le.
2. Rechargez la page (F5) : tout est conservé.
3. Onglet *Application → Local Storage* des outils de développement : la clé `movie-library-v2` contient la bibliothèque.

## Livrables

- Prototype Figma : _ajoutez ici votre lien_
- Persona, problem statement, wireframes : `docs/UX.md`
- Dépôt Git : _ajoutez ici le lien_
