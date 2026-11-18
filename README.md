# 🐽 Groin & Truffes — App de Calcul Mental (iPhone, iPad & Web)

Application web ludique de calcul mental conçue pour **iPhone**, **iPad** et navigateur web, sans dépendance externe.

## Fonctionnalités
- **Opérations au choix (combinables)** :
  - ➕ **Additions** (`a + b = ?`)
  - ✖️ **Multiplications** (`a × b = ?`)
  - 🔄 **Multiplications inversées** (`? × ? = Produit` — trouver deux facteurs différents de 1)
- **Nombre de chiffres** : `1 chiffre`, `2 chiffres` ou `Mix (1 & 2 chiffres)`
- **Difficulté réglable** : `Facile 🌱`, `Moyen 🌿`, `Difficile 🔥`
- **Chronomètre optionnel** : `Sans chrono`, `20s / calcul`, `12s / calcul` ou `Sprint 60s`
- **Progression animée** : **Barnabé le petit cochon truffier** renifle la piste, gratte la terre, déterre une truffe à chaque bonne réponse et trotte d'emplacement en emplacement sous les chênes.
- **Récompense spéciale toutes les 10 truffes** : une **Sucette au Cornichon** 🥒🍭 illustrée à collectionner !
- **Dressing de chapeaux toutes les 3 sucettes** : tous les **3 cornichons-sucettes** gagnés (`3, 6, 9, 12, 15, 18, 21`), Barnabé débloque et porte automatiquement un **nouveau chapeau** 🎩 (Béret du Truffier, Explorateur, Toque de Chef, Haut-de-Forme Cornichon, Bicorne Pirate, Enchanteur, Couronne Royale), avec dressing interactif dans *Trésors & Chapeaux*.
- **Ergonomie iPhone & iPad** :
  - Clavier numérique tactile intégré (évite l'ouverture du clavier système iOS qui masque l'animation)
  - Compatible clavier physique (iPad Magic Keyboard / ordinateur)
  - Prise en charge `100dvh`, `safe-area-inset` et installation **Sur l'écran d'accueil** (`manifest.webmanifest`)

## Fichiers du projet
- `index.html` — Structure sémantique, scène vectorielle animée et modales
- `index.css` — Design system responsive iPhone / iPad (portrait & paysage)
- `app.js` — Générateur de calculs, animations, chronomètre et synthétiseur sonore Web Audio
- `manifest.webmanifest` — Manifeste Web App pour l'installation sur iOS / iPadOS
