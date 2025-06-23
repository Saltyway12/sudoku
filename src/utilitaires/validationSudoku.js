// =============================================
// VALIDATION SUDOKU OPTIMISÉE
// =============================================

import { estMouvementValide } from './generateurSudoku.js';

/**
 * Trouve toutes les cellules invalides dans la grille
 * @param {number[][]} grille - Grille à valider
 * @returns {Array<{ligne: number, colonne: number}>} Cellules invalides
 */
export const trouverCellulesInvalides = (grille) => {
  const invalides = [];
  
  for (let ligne = 0; ligne < 9; ligne++) {
    for (let colonne = 0; colonne < 9; colonne++) {
      const valeur = grille[ligne][colonne];
      if (valeur !== 0) {
        // Créer une grille temporaire sans cette cellule
        const grilleTemp = grille.map(l => [...l]);
        grilleTemp[ligne][colonne] = 0;
        
        // Vérifier si la valeur est valide à cette position
        if (!estMouvementValide(grilleTemp, ligne, colonne, valeur)) {
          invalides.push({ ligne, colonne });
        }
      }
    }
  }
  
  return invalides;
};

/**
 * Vérifie si la grille est complètement remplie
 * @param {number[][]} grille - Grille à vérifier
 * @returns {boolean} True si complète
 */
export const estGrilleComplete = (grille) => {
  for (let ligne = 0; ligne < 9; ligne++) {
    for (let colonne = 0; colonne < 9; colonne++) {
      if (grille[ligne][colonne] === 0) {
        return false;
      }
    }
  }
  return true;
};

/**
 * Vérifie si la grille est résolue correctement
 * @param {number[][]} grille - Grille à vérifier
 * @returns {boolean} True si résolue
 */
export const estGrilleResolue = (grille) => {
  return estGrilleComplete(grille) && trouverCellulesInvalides(grille).length === 0;
};

/**
 * Obtient les cellules de la même région (ligne, colonne, carré 3x3)
 * @param {number} ligne - Ligne de référence
 * @param {number} colonne - Colonne de référence
 * @returns {Array<{ligne: number, colonne: number}>} Cellules de la région
 */
export const obtenirCellulesRegion = (ligne, colonne) => {
  const cellules = new Set();
  
  // Ajouter toute la ligne
  for (let c = 0; c < 9; c++) {
    cellules.add(`${ligne}-${c}`);
  }
  
  // Ajouter toute la colonne
  for (let l = 0; l < 9; l++) {
    cellules.add(`${l}-${colonne}`);
  }
  
  // Ajouter tout le carré 3x3
  const debutLigne = ligne - (ligne % 3);
  const debutColonne = colonne - (colonne % 3);
  
  for (let l = debutLigne; l < debutLigne + 3; l++) {
    for (let c = debutColonne; c < debutColonne + 3; c++) {
      cellules.add(`${l}-${c}`);
    }
  }
  
  // Convertir en array d'objets
  return Array.from(cellules).map(pos => {
    const [l, c] = pos.split('-').map(Number);
    return { ligne: l, colonne: c };
  });
};

/**
 * Obtient les valeurs possibles pour une cellule
 * @param {number[][]} grille - Grille actuelle
 * @param {number} ligne - Ligne de la cellule
 * @param {number} colonne - Colonne de la cellule
 * @returns {number[]} Valeurs possibles (1-9)
 */
export const obtenirValeursPossibles = (grille, ligne, colonne) => {
  if (grille[ligne][colonne] !== 0) {
    return []; // Cellule déjà remplie
  }
  
  const possibles = [];
  
  for (let numero = 1; numero <= 9; numero++) {
    if (estMouvementValide(grille, ligne, colonne, numero)) {
      possibles.push(numero);
    }
  }
  
  return possibles;
};

/**
 * Calcule le pourcentage de completion de la grille
 * @param {number[][]} grille - Grille à analyser
 * @returns {number} Pourcentage (0-100)
 */
export const calculerPourcentageCompletion = (grille) => {
  let cellulesRemplies = 0;
  
  for (let ligne = 0; ligne < 9; ligne++) {
    for (let colonne = 0; colonne < 9; colonne++) {
      if (grille[ligne][colonne] !== 0) {
        cellulesRemplies++;
      }
    }
  }
  
  return Math.round((cellulesRemplies / 81) * 100);
};