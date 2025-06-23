// =============================================
// GÉNÉRATEUR SUDOKU OPTIMISÉ
// =============================================

/**
 * Génère une grille vide 9x9
 * @returns {number[][]} Grille vide
 */
export const creerGrilleVide = () => {
  return Array(9).fill().map(() => Array(9).fill(0));
};

/**
 * Vérifie si un mouvement est valide selon les règles du Sudoku
 * @param {number[][]} grille - La grille de jeu
 * @param {number} ligne - Index de la ligne (0-8)
 * @param {number} colonne - Index de la colonne (0-8)
 * @param {number} numero - Numéro à placer (1-9)
 * @returns {boolean} True si le mouvement est valide
 */
export const estMouvementValide = (grille, ligne, colonne, numero) => {
  // Vérifier la ligne - optimisé avec for classique
  for (let x = 0; x < 9; x++) {
    if (grille[ligne][x] === numero) return false;
  }
  
  // Vérifier la colonne
  for (let x = 0; x < 9; x++) {
    if (grille[x][colonne] === numero) return false;
  }
  
  // Vérifier le carré 3x3 - calcul optimisé
  const debutLigne = ligne - (ligne % 3);
  const debutColonne = colonne - (colonne % 3);
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grille[i + debutLigne][j + debutColonne] === numero) return false;
    }
  }
  
  return true;
};

/**
 * Résout le Sudoku avec algorithme de backtracking optimisé
 * @param {number[][]} grille - Grille à résoudre (modifiée en place)
 * @returns {boolean} True si résolu
 */
export const resoudreSudoku = (grille) => {
  // Trouver la première case vide - optimisé
  for (let ligne = 0; ligne < 9; ligne++) {
    for (let colonne = 0; colonne < 9; colonne++) {
      if (grille[ligne][colonne] === 0) {
        // Essayer les chiffres 1-9
        for (let numero = 1; numero <= 9; numero++) {
          if (estMouvementValide(grille, ligne, colonne, numero)) {
            grille[ligne][colonne] = numero;
            
            // Récursion
            if (resoudreSudoku(grille)) {
              return true;
            }
            
            // Backtrack
            grille[ligne][colonne] = 0;
          }
        }
        return false; // Aucun chiffre ne fonctionne
      }
    }
  }
  return true; // Grille complète
};

/**
 * Remplit les carrés diagonaux pour accélérer la génération
 * @param {number[][]} grille - Grille à remplir
 */
const remplirDiagonale = (grille) => {
  for (let i = 0; i < 9; i += 3) {
    remplirCarre(grille, i, i);
  }
};

/**
 * Remplit un carré 3x3 avec des nombres aléatoires valides
 * @param {number[][]} grille - Grille à modifier
 * @param {number} ligne - Ligne de début du carré
 * @param {number} colonne - Colonne de début du carré
 */
const remplirCarre = (grille, ligne, colonne) => {
  const nombres = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  
  // Mélanger les nombres pour plus de variété
  for (let i = nombres.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nombres[i], nombres[j]] = [nombres[j], nombres[i]];
  }
  
  let index = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      grille[ligne + i][colonne + j] = nombres[index++];
    }
  }
};

/**
 * Génère un Sudoku complet et valide
 * @returns {number[][]} Grille complète
 */
export const genererSudokuComplet = () => {
  const grille = creerGrilleVide();
  remplirDiagonale(grille);
  resoudreSudoku(grille);
  return grille;
};

/**
 * Compte le nombre de solutions possibles (limité à 2 pour performance)
 * @param {number[][]} grille - Grille à analyser
 * @returns {number} Nombre de solutions (max 2)
 */
const compterSolutions = (grille) => {
  const solutions = [];
  trouverSolutions(grille, solutions, 2); // Limite à 2 pour performance
  return solutions.length;
};

/**
 * Trouve toutes les solutions jusqu'à une limite
 * @param {number[][]} grille - Grille à analyser
 * @param {number[][][]} solutions - Array pour stocker les solutions
 * @param {number} limite - Limite de solutions à trouver
 */
const trouverSolutions = (grille, solutions, limite) => {
  if (solutions.length >= limite) return;
  
  for (let ligne = 0; ligne < 9; ligne++) {
    for (let colonne = 0; colonne < 9; colonne++) {
      if (grille[ligne][colonne] === 0) {
        for (let numero = 1; numero <= 9; numero++) {
          if (estMouvementValide(grille, ligne, colonne, numero)) {
            grille[ligne][colonne] = numero;
            trouverSolutions(grille, solutions, limite);
            grille[ligne][colonne] = 0;
            
            if (solutions.length >= limite) return;
          }
        }
        return;
      }
    }
  }
  
  // Solution trouvée
  solutions.push(grille.map(ligne => [...ligne]));
};

/**
 * Génère un puzzle avec difficulté spécifiée
 * @param {string} difficulte - 'facile', 'moyen', ou 'difficile'
 * @returns {Object} {puzzle: number[][], solution: number[][]}
 */
export const genererPuzzle = (difficulte = 'moyen') => {
  const grilleComplete = genererSudokuComplet();
  const puzzle = grilleComplete.map(ligne => [...ligne]);
  
  // Configuration des difficultés
  const configDifficulte = {
    facile: { casesARetirer: 35, maxTentatives: 100 },
    moyen: { casesARetirer: 45, maxTentatives: 150 },
    difficile: { casesARetirer: 55, maxTentatives: 200 }
  };
  
  const config = configDifficulte[difficulte] || configDifficulte.moyen;
  let casesRetirees = 0;
  let tentatives = 0;
  
  // Créer une liste de positions aléatoires
  const positions = [];
  for (let ligne = 0; ligne < 9; ligne++) {
    for (let colonne = 0; colonne < 9; colonne++) {
      positions.push({ ligne, colonne });
    }
  }
  
  // Mélanger les positions
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  
  // Retirer les cases une par une
  for (const { ligne, colonne } of positions) {
    if (casesRetirees >= config.casesARetirer || tentatives >= config.maxTentatives) {
      break;
    }
    
    tentatives++;
    const valeurOriginale = puzzle[ligne][colonne];
    puzzle[ligne][colonne] = 0;
    
    // Vérifier que la solution reste unique
    const grilleTest = puzzle.map(l => [...l]);
    if (compterSolutions(grilleTest) === 1) {
      casesRetirees++;
    } else {
      // Restaurer la valeur si solution non unique
      puzzle[ligne][colonne] = valeurOriginale;
    }
  }
  
  return {
    puzzle,
    solution: grilleComplete
  };
};