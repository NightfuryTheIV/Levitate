# Partie 1 — UI/UX Design

## 1. Persona principale

**Léa Martin, 24 ans — étudiante en communication, Paris**

| | |
|---|---|
| **Contexte** | Regarde 2 à 3 films par semaine, sur plusieurs plateformes de streaming et en salle. Utilise surtout son smartphone. |
| **Objectifs** | Garder une trace de ce qu'elle a vu et veut voir · Retrouver rapidement ses films préférés · Noter ses films et garder quelques mots sur chacun · Ne plus passer 20 minutes à choisir un film |
| **Frustrations** | Sa liste « à voir » est éparpillée (notes du téléphone, captures d'écran, messages) · Elle oublie quels films elle a déjà vus · Les applications existantes sont lourdes, avec des comptes à créer et trop de publicités · Elle ne se souvient plus pourquoi elle avait aimé un film |
| **Besoins** | Une recherche rapide avec affiche et réalisateur · Ajouter un film en un clic · Distinguer « vu » et « à voir » d'un coup d'œil · Des favoris, une note de 1 à 5 et un champ d'avis personnel · Une application utilisable sans compte, sur mobile comme sur ordinateur |

> *« Je veux juste un endroit simple où je range mes films, sans m'inscrire nulle part. »*

## 2. Problem statement

**How might we help Léa, une cinéphile occasionnelle qui jongle entre plusieurs listes dispersées, à rechercher, regrouper et suivre ses films (vus, à voir, favoris, notés) en un seul endroit simple et rapide, afin de toujours savoir quoi regarder et de se souvenir de ce qu'elle a aimé ?**

## 3. Parcours principal

**Recherche → Résultats → Ajout → Bibliothèque**

1. Léa saisit « Interstellar » dans la barre de recherche.
2. Les résultats s'affichent (affiche, titre, réalisateur, année).
3. Elle clique sur « + Ajouter » : une notification confirme l'ajout et le bouton devient « ✓ Dans la bibliothèque ».
4. Dans la bibliothèque, elle marque le film comme vu, le met en favori et lui donne une note.

## 4. Wireframes basse fidélité

À reproduire dans Figma avec de simples rectangles gris (cadre mobile 390 × 844 et cadre desktop 1440 × 900).

### Wireframe 1 — Recherche & résultats

```
┌──────────────────────────────┐
│ 🎬 Ma Vidéothèque       🌙   │
│ Recherche | Biblio | Favoris │
├──────────────────────────────┤
│  Rechercher un film          │
│ ┌───────────────┐ [Chercher] │
│ │ Interstellar  │            │
│ └───────────────┘            │
│  12 résultats                │
│ ┌────────┐  ┌────────┐       │
│ │ affiche│  │ affiche│       │
│ │        │  │        │       │
│ ├────────┤  ├────────┤       │
│ │Titre   │  │Titre   │       │
│ │Réalis. │  │Réalis. │       │
│ │[+Ajout]│  │[✓ Dans │       │
│ └────────┘  │  biblio]       │
│                              │
│      [ Charger plus ]        │
└──────────────────────────────┘
États : chargement · aucun résultat · erreur
```

### Wireframe 2 — Bibliothèque

```
┌──────────────────────────────┐
│ 🎬 Ma Vidéothèque       🌙   │
├──────────────────────────────┤
│ Ma bibliothèque              │
│ [Films 8][Vus 3][À voir 5]   │
│ [Favoris 2][Note moy. 4.2★]  │
│ [🔍 rechercher…][Filtre][Tri]│
│ ┌────────┐  ┌────────┐       │
│ │ affiche│  │ affiche│       │
│ │ Titre  │  │ Titre  │       │
│ │ ★★★★☆  │  │ ☆☆☆☆☆  │       │
│ │[Vu][♥][🗑]│[Voir][♡][🗑]    │
│ └────────┘  └────────┘       │
└──────────────────────────────┘
État vide : « Votre bibliothèque est vide » + bouton Rechercher
Suppression : confirmation « Supprimer ce film ? »
```

### Wireframe 3 — Détail d'un film

```
┌──────────────────────────────┐
│ ← Retour                     │
│ ┌────────┐ Interstellar (2014)│
│ │        │ Christopher Nolan │
│ │ affiche│ 169 min · Sci-Fi  │
│ │        │ Synopsis…         │
│ └────────┘ [Vu] [♥ Favori]   │
│            Ma note : ★★★★☆   │
│            Mon avis :        │
│            ┌───────────────┐ │
│            │               │ │
│            └───────────────┘ │
│            [Enregistrer]     │
└──────────────────────────────┘
```

## 5. Prototype Figma cliquable

À créer dans Figma (je ne peux pas accéder à votre compte Figma) :

1. Créez 5 frames mobiles : **Recherche (vide)**, **Résultats**, **Ajout confirmé (toast)**, **Bibliothèque**, **Détail**.
2. Passez en mode **Prototype** et reliez :
   - bouton « Rechercher » → *Résultats* (Navigate to)
   - bouton « + Ajouter » → *Ajout confirmé* (Open overlay ou Smart animate)
   - onglet « Bibliothèque » → *Bibliothèque*
   - une carte → *Détail*
3. Définissez *Recherche* comme frame de départ du flow : **Search → Results → Add → Library**.
4. Cliquez sur **Share → Copy link** (accès « Anyone with the link can view ») et ajoutez le lien dans le README.

Vous pouvez vous appuyer sur la charte du projet : accent orange `#D9480F`, fond `#F6F5F2`, cartes blanches arrondies (12 px), police système, mode sombre `#141413`.
