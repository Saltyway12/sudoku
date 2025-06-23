// =============================================
// HOOK PERSONNALISÉ SUDOKU
// =============================================

import { useState, useCallback, useMemo, useEffect } from 'react';
import { genererPuzzle } from '../utilitaires/generateurSudoku.js';
import { trouverCellulesInvalides, estGrilleResolue } from '../utilitaires/validationSudoku.js';
import { STATUTS_JEU } from '../utilitaires/constantes.js';

/**
 * Hook personnalisé pour gérer l'état du jeu Sudoku
 * @param {string} difficulte - Niveau de difficulté initial
 * @returns {Object} État et fonctions du jeu
 */
const useSudoku = (difficulte = 'moyen') => {
  // État principal du jeu - optimisé avec lazy initialization
  const [donneeJeu, setDonneeJeu] = useState(() => genererPuzzle(difficulte));
  
  const [grilleActuelle, setGrilleActuelle] = useState(() =>
    donneeJeu.puzzle.map(ligne => [...ligne])
  );
  
  const [celluleSelectionnee, setCelluleSelectionnee] = useState(null);
  const [statutJeu, setStatutJeu] = useState(STATUTS_JEU.EN_COURS);
  const [heureDebut] = useState(Date.now());
  const [mouvements, setMouvements] = useState([]);

  // Calculs optimisés avec useMemo
  const cellulesInvalides = useMemo(() => {
    return trouverCellulesInvalides(grilleActuelle);
  }, [grilleActuelle]);

  const estTermine = useMemo(() => {
    return estGrilleResolue(grilleActuelle);
  }, [grilleActuelle]);

  const pourcentageCompletion = useMemo(() => {
    let cellulesRemplies = 0;
    for (let ligne = 0; ligne < 9; ligne++) {
      for (let colonne = 0; colonne < 9; colonne++) {
        if (grilleActuelle[ligne][colonne] !== 0) {
          cellulesRemplies++;
        }
      }
    }
    return Math.round((cellulesRemplies / 81) * 100);
  }, [grilleActuelle]);

  // Effet pour mettre à jour le statut du jeu
  useEffect(() => {
    if (estTermine && statutJeu === STATUTS_JEU.EN_COURS) {
      setStatutJeu(STATUTS_JEU.TERMINE);
    }
  }, [estTermine, statutJeu]);

  // Fonctions optimisées avec useCallback
  const mettreAJourCellule = useCallback((ligne, colonne, valeur) => {
    // Vérifier si la cellule est modifiable
    if (donneeJeu.puzzle[ligne][colonne] !== 0) return false;
    
    setGrilleActuelle(grillePrec => {
      const nouvelleGrille = grillePrec.map(l => [...l]);
      
      // Enregistrer le mouvement pour l'historique
      const valeurPrecedente = nouvelleGrille[ligne][colonne];
      setMouvements(mouvPrec => [...mouvPrec, { 
        ligne, 
        colonne, 
        valeurPrecedente, 
        nouvelleValeur: valeur,
        timestamp: Date.now()
      }]);
      
      nouvelleGrille[ligne][colonne] = valeur;
      return nouvelleGrille;
    });
    
    return true;
  }, [donneeJeu.puzzle]);

  const selectionnerCellule = useCallback((ligne, colonne) => {
    setCelluleSelectionnee({ ligne, colonne });
  }, []);

  const deselectionnerCellule = useCallback(() => {
    setCelluleSelectionnee(null);
  }, []);

  const nouveauJeu = useCallback((nouvelleDifficulte = difficulte) => {
    const nouvelleDonneeJeu = genererPuzzle(nouvelleDifficulte);
    setDonneeJeu(nouvelleDonneeJeu);
    setGrilleActuelle(nouvelleDonneeJeu.puzzle.map(ligne => [...ligne]));
    setCelluleSelectionnee(null);
    setStatutJeu(STATUTS_JEU.EN_COURS);
    setMouvements([]);
  }, [difficulte]);

  const reinitialiserJeu = useCallback(() => {
    setGrilleActuelle(donneeJeu.puzzle.map(ligne => [...ligne]));
    setCelluleSelectionnee(null);
    setStatutJeu(STATUTS_JEU.EN_COURS);
    setMouvements([]);
  }, [donneeJeu.puzzle]);

  const resoudreJeu = useCallback(() => {
    const grilleResolue = donneeJeu.solution.map(ligne => [...ligne]);
    setGrilleActuelle(grilleResolue);
    setStatutJeu(STATUTS_JEU.TERMINE);
    
    // Ajouter à l'historique
    setMouvements(mouvPrec => [...mouvPrec, {
      type: 'resolution_auto',
      timestamp: Date.now()
    }]);
  }, [donneeJeu.solution]);

  const obtenirIndice = useCallback(() => {
    let celluleCible = null;
    
    // Prioriser la cellule sélectionnée si elle est vide
    if (celluleSelectionnee) {
      const { ligne, colonne } = celluleSelectionnee;
      if (donneeJeu.puzzle[ligne][colonne] === 0 && grilleActuelle[ligne][colonne] === 0) {
        celluleCible = { ligne, colonne };
      }
    }
    
    // Sinon, trouver une cellule vide aléatoirement
    if (!celluleCible) {
      const cellulesVides = [];
      for (let ligne = 0; ligne < 9; ligne++) {
        for (let colonne = 0; colonne < 9; colonne++) {
          if (donneeJeu.puzzle[ligne][colonne] === 0 && grilleActuelle[ligne][colonne] === 0) {
            cellulesVides.push({ ligne, colonne });
          }
        }
      }
      
      if (cellulesVides.length > 0) {
        celluleCible = cellulesVides[Math.floor(Math.random() * cellulesVides.length)];
      }
    }
    
    // Appliquer l'indice
    if (celluleCible) {
      const valeurCorrecte = donneeJeu.solution[celluleCible.ligne][celluleCible.colonne];
      mettreAJourCellule(celluleCible.ligne, celluleCible.colonne, valeurCorrecte);
      
      // Sélectionner la cellule avec l'indice
      selectionnerCellule(celluleCible.ligne, celluleCible.colonne);
      
      return true;
    }
    
    return false;
  }, [celluleSelectionnee, donneeJeu, grilleActuelle, mettreAJourCellule, selectionnerCellule]);

  const annulerMouvement = useCallback(() => {
    if (mouvements.length === 0) return false;
    
    // Trouver le dernier mouvement qui n'est pas une résolution auto
    const dernierMouvement = mouvements[mouvements.length - 1];
    
    if (dernierMouvement.type === 'resolution_auto') {
      // Ne pas permettre d'annuler une résolution automatique
      return false;
    }
    
    setGrilleActuelle(grillePrec => {
      const nouvelleGrille = grillePrec.map(l => [...l]);
      nouvelleGrille[dernierMouvement.ligne][dernierMouvement.colonne] = dernierMouvement.valeurPrecedente;
      return nouvelleGrille;
    });
    
    setMouvements(mouvPrec => mouvPrec.slice(0, -1));
    return true;
  }, [mouvements]);

  const obtenirStatistiques = useCallback(() => {
    return {
      nombreMouvements: mouvements.filter(m => m.type !== 'resolution_auto').length,
      nombreErreurs: cellulesInvalides.length,
      pourcentageCompletion,
      tempsEcoule: Math.floor((Date.now() - heureDebut) / 1000),
      difficulte
    };
  }, [mouvements, cellulesInvalides.length, pourcentageCompletion, heureDebut, difficulte]);

  const naviguerCellule = useCallback((direction) => {
    if (!celluleSelectionnee) return false;
    
    const { ligne, colonne } = celluleSelectionnee;
    let nouvelleLigne = ligne;
    let nouvelleColonne = colonne;
    
    switch (direction) {
      case 'haut':
        nouvelleLigne = Math.max(0, ligne - 1);
        break;
      case 'bas':
        nouvelleLigne = Math.min(8, ligne + 1);
        break;
      case 'gauche':
        nouvelleColonne = Math.max(0, colonne - 1);
        break;
      case 'droite':
        nouvelleColonne = Math.min(8, colonne + 1);
        break;
      default:
        return false;
    }
    
    selectionnerCellule(nouvelleLigne, nouvelleColonne);
    return true;
  }, [celluleSelectionnee, selectionnerCellule]);

  // Retourner l'API du hook
  return {
    // État de la grille
    grilleActuelle,
    grilleInitiale: donneeJeu.puzzle,
    solution: donneeJeu.solution,
    
    // État de l'interface
    celluleSelectionnee,
    cellulesInvalides,
    statutJeu,
    estTermine,
    pourcentageCompletion,
    
    // Historique
    mouvements,
    heureDebut,
    
    // Actions de jeu
    mettreAJourCellule,
    selectionnerCellule,
    deselectionnerCellule,
    naviguerCellule,
    
    // Actions de contrôle
    nouveauJeu,
    reinitialiserJeu,
    resoudreJeu,
    obtenirIndice,
    annulerMouvement,
    
    // Utilitaires
    obtenirStatistiques
  };
};

export default useSudoku;