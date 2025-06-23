# 🎮 Sudoku React

Une application Sudoku moderne et interactive construite avec React, offrant une expérience de jeu fluide et intuitive.

## ✨ Fonctionnalités

### 🎯 Jeu Principal
- **Génération de puzzles** : Algorithme avancé créant des grilles avec solution unique
- **Trois niveaux de difficulté** : Facile, Moyen, Difficile
- **Validation en temps réel** : Détection automatique des erreurs
- **Navigation au clavier** : Contrôle complet avec les flèches et chiffres
- **Sélection de cellules** : Interface intuitive avec mise en évidence

### 🛠️ Outils de Jeu
- **Système d'indices** : Aide ponctuelle pour débloquer des situations
- **Fonction d'annulation** : Retour en arrière sur les derniers mouvements
- **Résolution automatique** : Affichage de la solution complète
- **Réinitialisation** : Recommencer le puzzle actuel
- **Nouveau jeu** : Génération d'une nouvelle grille

### 📊 Suivi des Performances
- **Chronomètre** : Temps de jeu en temps réel
- **Compteur de mouvements** : Suivi du nombre d'actions
- **Détecteur d'erreurs** : Affichage du nombre de conflits
- **Statut du jeu** : Indication de progression et de victoire

### 🎨 Interface Utilisateur
- **Design moderne** : Interface élégante avec dégradés et effets
- **Responsive** : Adaptation automatique à tous les écrans
- **Animations** : Transitions fluides et feedback visuel
- **Accessibilité** : Support des lecteurs d'écran et navigation clavier

## 🚀 Installation

### Prérequis
- **Node.js** (version 14 ou supérieure)
- **npm** ou **yarn**

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone https://github.com/Saltyway12/sudoku.git
cd sudoku
```

2. **Installer les dépendances**
```bash
npm install
# ou
yarn install
```

3. **Lancer l'application en mode développement**
```bash
npm start
# ou
yarn start
```

4. **Ouvrir dans le navigateur**
```
http://localhost:3000
```

## 🏗️ Architecture du Projet

```
src/
├── components/           # Composants React
│   ├── Cell/            # Cellule individuelle du Sudoku
│   │   ├── Cell.js
│   │   └── Cell.css
│   └── SudokuGrid/      # Grille principale 9x9
│       ├── SudokuGrid.js
│       └── SudokuGrid.css
├── hooks/               # Hooks personnalisés
│   └── useSudoku.js     # Logique métier principale
├── utils/               # Fonctions utilitaires
│   └── sudokuGenerator.js # Génération et validation
├── App.js               # Composant racine
├── App.css              # Styles globaux
└── index.js             # Point d'entrée
```

## 🎮 Guide d'Utilisation

### Contrôles de Base
- **Clic** : Sélectionner une cellule
- **Chiffres 1-9** : Entrer une valeur
- **Backspace/Delete** : Effacer une cellule
- **Flèches directionnelles** : Naviguer entre les cellules

### Interface
- **Difficulté** : Sélecteur en haut à gauche
- **Boutons d'action** : Nouveau jeu, Recommencer, Indice, Annuler, Résoudre
- **Indicateurs** : Temps, mouvements, erreurs
- **Statut** : Progression du jeu en temps réel

### Système de Validation
- ❌ **Cellules rouges** : Valeurs en conflit
- 🟡 **Cellules surlignées** : Même ligne/colonne/carré que la sélection
- 🔵 **Cellule bleue** : Cellule actuellement sélectionnée
- ⚫ **Cellules grises** : Valeurs initiales non modifiables

## 🛠️ Technologies Utilisées

### Frontend
- **React 18** : Bibliothèque UI avec hooks modernes
- **CSS3** : Styles avec Flexbox, Grid et animations
- **JavaScript ES6+** : Syntaxe moderne et fonctionnelle

### Algorithmes
- **Backtracking** : Résolution des puzzles Sudoku
- **Génération aléatoire** : Création de grilles valides
- **Validation en temps réel** : Vérification des règles Sudoku

### Patterns React
- **Hooks personnalisés** : Abstraction de la logique métier
- **useMemo/useCallback** : Optimisation des performances
- **Component composition** : Architecture modulaire
- **State management** : Gestion d'état locale avec useState

## 📱 Responsive Design

L'application s'adapte automatiquement aux différentes tailles d'écran :

- **Desktop** (>768px) : Interface complète avec tous les contrôles
- **Tablet** (400-768px) : Layout adapté tactile
- **Mobile** (<400px) : Interface optimisée pour petits écrans

## ⚡ Optimisations Performances

- **React.memo** : Évite les re-rendus inutiles
- **useMemo** : Cache les calculs coûteux
- **useCallback** : Optimise les fonctions de callback
- **Lazy loading** : Chargement différé des composants

## 🎯 Fonctionnalités Avancées

### Génération de Puzzles
- Algorithme garantissant une solution unique
- Ajustement automatique de la difficulté
- Validation des règles Sudoku en temps réel

### Système d'Aide
- Indices intelligents basés sur la logique Sudoku
- Résolution progressive ou complète
- Historique des mouvements avec annulation

### Interface Adaptative
- Thème moderne avec dégradés
- Animations CSS pour le feedback utilisateur
- Support complet du clavier et de la souris

## 🔧 Scripts Disponibles

```bash
# Développement
npm start           # Lance le serveur de développement

# Build
npm run build       # Compile pour la production

# Tests
npm test           # Lance les tests unitaires

# Déploiement
npm run deploy     # Déploie sur GitHub Pages
```

## 🚀 Déploiement

### GitHub Pages
Le projet est configuré pour le déploiement automatique sur GitHub Pages via GitHub Actions.

### Build de Production
```bash
npm run build
```
Génère une version optimisée dans le dossier `build/`.

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. **Fork** le repository
2. **Créer** une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Commiter** les changements (`git commit -am 'Ajoute nouvelle fonctionnalité'`)
4. **Push** vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. **Créer** une Pull Request


## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👤 Auteur

**Saltyway12**
- GitHub: [@Saltyway12](https://github.com/Saltyway12)

## 🙏 Remerciements

- Algorithmes Sudoku inspirés de Peter Norvig
- Design moderne inspiré par les tendances UI/UX actuelles
- Communauté React pour les bonnes pratiques

---

⭐ **N'hésitez pas à mettre une étoile si ce projet vous plaît !**