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
- **Progression animée en 3D (Three.js style Pixar)** : **Barnabé le petit cochon truffier en 3D** (yeux pétillants, joues rebondies sculptées, oreilles souples, bandana rouge à pois, queue en tire-bouchon et sabots fendus) renifle la piste, gratte la terre avec des éclats de terre 3D, déterre une truffe à chaque bonne réponse et trotte d'emplacement en emplacement sous les chênes (avec repli SVG automatique si WebGL est désactivé).
- **Récompense spéciale toutes les 10 truffes** : une **Sucette au Cornichon** 🥒🍭 illustrée à collectionner !
- **Dressing de chapeaux 3D toutes les 3 sucettes** : tous les **3 cornichons-sucettes** gagnés (`3, 6, 9, 12, 15, 18, 21`), Barnabé débloque et porte automatiquement un **nouveau chapeau 3D** 🎩 (Béret du Truffier, Explorateur, Toque de Chef, Haut-de-Forme Cornichon, Bicorne Pirate, Enchanteur, Couronne Royale), avec dressing interactif dans *Trésors & Chapeaux*.
- **Ergonomie iPhone & iPad** :
  - Clavier numérique tactile intégré (évite l'ouverture du clavier système iOS qui masque l'animation)
  - Compatible clavier physique (iPad Magic Keyboard / ordinateur)
  - Prise en charge `100dvh`, `safe-area-inset` et installation **Sur l'écran d'accueil** (`manifest.webmanifest`)

## Fichiers du projet
- `index.html` — Structure sémantique, scène de repli SVG et modales
- `index.css` — Design system responsive iPhone / iPad (portrait & paysage)
- `pig3d.js` — Modèle 3D Pixar de Barnabé, ses 7 chapeaux 3D, animations et clairière du Périgord sous Three.js
- `vendor/three.module.min.js` — Bundle local Three.js (zéro dépendance CDN externe)
- `app.js` — Générateur de calculs, animations, chronomètre et synthétiseur sonore Web Audio
- `manifest.webmanifest` — Manifeste Web App pour l'installation sur iOS / iPadOS
