// =============================================
// HOOK PERSONNALISÉ SUDOKU AVEC BROUILLON ET INDICES LIMITÉS
// =============================================

import { useState, useCallback, useMemo, useEffect } from 'react';
import { genererPuzzle } from '../utilitaires/generateurSudoku.js';
import { trouverCellulesInvalides, estGrilleResolue } from '../utilitaires/validationSudoku.js';
import { 
  STATUTS_JEU, 
  LIMITES_DIFFICULTE, 
  TYPES_SAISIE, 
  MESSAGES 
} from '../utilitaires/constantes.js';

/**
 * Hook personnalisé pour gérer l'état du jeu Sudoku avec brouillon et indices limités
 * @param {string} difficulte - Niveau de difficulté initial
 * @returns {Object} État et fonctions du jeu
 */
const useSudoku = (difficulte = 'moyen') => {
  // État principal du jeu - optimisé avec lazy initialization
  const [donneeJeu, setDonneeJeu] = useState(() => genererPuzzle(difficulte));
  
  const [grilleActuelle, setGrilleActuelle] = useState(() =>
    donneeJeu.puzzle.map(ligne => [...ligne])
  );
  
  // Nouvelle structure pour gérer les brouillons
  const [grilleBrouillon, setGrilleBrouillon] = useState(() =>
    Array(9).fill().map(() => Array(9).fill().map(() => new Set()))
  );
  
  const [celluleSelectionnee, setCelluleSelectionnee] = useState(null);
  const [statutJeu, setStatutJeu] = useState(STATUTS_JEU.EN_COURS);
  const [heureDebut] = useState(Date.now());
  const [mouvements, setMouvements] = useState([]);
  
  // Nouveaux états pour les fonctionnalités
  const [modeBrouillon, setModeBrouillon] = useState(false);
  const [indicesUtilises, setIndicesUtilises] = useState(0);
  const [difficulteActuelle, setDifficulteActuelle] = useState(difficulte);

  // Configuration de la difficulté actuelle
  const configDifficulte = useMemo(() => {
    return LIMITES_DIFFICULTE[difficulteActuelle] || LIMITES_DIFFICULTE.moyen;
  }, [difficulteActuelle]);

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

  const indicesRestants = useMemo(() => {
    return Math.max(0, configDifficulte.maxIndices - indicesUtilises);
  }, [configDifficulte.maxIndices, indicesUtilises]);

  // Effet pour mettre à jour le statut du jeu
  useEffect(() => {
    if (estTermine && statutJeu === STATUTS_JEU.EN_COURS) {
      setStatutJeu(STATUTS_JEU.TERMINE);
    }
  }, [estTermine, statutJeu]);

  // Fonctions optimisées avec useCallback
  const mettreAJourCellule = useCallback((ligne, colonne, valeur, typeSaisie = TYPES_SAISIE.NORMAL) => {
    // Vérifier si la cellule est modifiable
    if (donneeJeu.puzzle[ligne][colonne] !== 0) return false;
    
    if (typeSaisie === TYPES_SAISIE.BROUILLON) {
      // Gestion du brouillon
      setGrilleBrouillon(brouillonPrec => {
        const nouveauBrouillon = brouillonPrec.map(l => 
          l.map(c => new Set(c))
        );
        
        if (valeur === 0) {
          // Effacer tous les brouillons de la cellule
          nouveauBrouillon[ligne][colonne].clear();
        } else if (nouveauBrouillon[ligne][colonne].has(valeur)) {
          // Retirer la valeur du brouillon si elle existe
          nouveauBrouillon[ligne][colonne].delete(valeur);
        } else {
          // Ajouter la valeur au brouillon (max 5 valeurs)
          if (nouveauBrouillon[ligne][colonne].size < 5) {
            nouveauBrouillon[ligne][colonne].add(valeur);
          }
        }
        
        return nouveauBrouillon;
      });
    } else {
      // Gestion normale
      setGrilleActuelle(grillePrec => {
        const nouvelleGrille = grillePrec.map(l => [...l]);
        
        // Enregistrer le mouvement pour l'historique
        const valeurPrecedente = nouvelleGrille[ligne][colonne];
        setMouvements(mouvPrec => [...mouvPrec, { 
          ligne, 
          colonne, 
          valeurPrecedente, 
          nouvelleValeur: valeur,
          typeSaisie,
          timestamp: Date.now()
        }]);
        
        nouvelleGrille[ligne][colonne] = valeur;
        return nouvelleGrille;
      });
      
      // Effacer les brouillons de la cellule quand on met une valeur définitive
      if (valeur !== 0) {
        setGrilleBrouillon(brouillonPrec => {
          const nouveauBrouillon = brouillonPrec.map(l => 
            l.map(c => new Set(c))
          );
          nouveauBrouillon[ligne][colonne].clear();
          return nouveauBrouillon;
        });
      }
    }
    
    return true;
  }, [donneeJeu.puzzle]);

  const basculerModeBrouillon = useCallback(() => {
    setModeBrouillon(prev => !prev);
    return !modeBrouillon;
  }, [modeBrouillon]);

  const selectionnerCellule = useCallback((ligne, colonne) => {
    setCelluleSelectionnee({ ligne, colonne });
  }, []);

  const deselectionnerCellule = useCallback(() => {
    setCelluleSelectionnee(null);
  }, []);

  const nouveauJeu = useCallback((nouvelleDifficulte = difficulteActuelle) => {
    const nouvelleDonneeJeu = genererPuzzle(nouvelleDifficulte);
    setDonneeJeu(nouvelleDonneeJeu);
    setGrilleActuelle(nouvelleDonneeJeu.puzzle.map(ligne => [...ligne]));
    setGrilleBrouillon(Array(9).fill().map(() => Array(9).fill().map(() => new Set())));
    setCelluleSelectionnee(null);
    setStatutJeu(STATUTS_JEU.EN_COURS);
    setMouvements([]);
    setIndicesUtilises(0);
    setModeBrouillon(false);
    setDifficulteActuelle(nouvelleDifficulte);
  }, [difficulteActuelle]);

  const reinitialiserJeu = useCallback(() => {
    setGrilleActuelle(donneeJeu.puzzle.map(ligne => [...ligne]));
    setGrilleBrouillon(Array(9).fill().map(() => Array(9).fill().map(() => new Set())));
    setCelluleSelectionnee(null);
    setStatutJeu(STATUTS_JEU.EN_COURS);
    setMouvements([]);
    setIndicesUtilises(0);
    setModeBrouillon(false);
  }, [donneeJeu.puzzle]);

  const resoudreJeu = useCallback(() => {
    const grilleResolue = donneeJeu.solution.map(ligne => [...ligne]);
    setGrilleActuelle(grilleResolue);
    setGrilleBrouillon(Array(9).fill().map(() => Array(9).fill().map(() => new Set())));
    setStatutJeu(STATUTS_JEU.TERMINE);
    
    // Ajouter à l'historique
    setMouvements(mouvPrec => [...mouvPrec, {
      type: 'resolution_auto',
      timestamp: Date.now()
    }]);
  }, [donneeJeu.solution]);

  const obtenirIndice = useCallback(() => {
    // Vérifier si on a encore des indices disponibles
    if (indicesUtilises >= configDifficulte.maxIndices) {
      return {
        succes: false,
        message: MESSAGES.LIMITE_INDICES_ATTEINTE
      };
    }

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
      mettreAJourCellule(celluleCible.ligne, celluleCible.colonne, valeurCorrecte, TYPES_SAISIE.NORMAL);
      
      // Incrémenter le compteur d'indices
      setIndicesUtilises(prev => prev + 1);
      
      // Sélectionner la cellule avec l'indice
      selectionnerCellule(celluleCible.ligne, celluleCible.colonne);
      
      // Ajouter à l'historique
      setMouvements(mouvPrec => [...mouvPrec, {
        type: 'indice',
        ligne: celluleCible.ligne,
        colonne: celluleCible.colonne,
        valeur: valeurCorrecte,
        timestamp: Date.now()
      }]);
      
      return {
        succes: true,
        message: MESSAGES.INDICE_UTILISE,
        cellule: celluleCible,
        valeur: valeurCorrecte
      };
    }
    
    return {
      succes: false,
      message: MESSAGES.AUCUN_INDICE_DISPONIBLE
    };
  }, [
    celluleSelectionnee, 
    donneeJeu, 
    grilleActuelle, 
    mettreAJourCellule, 
    selectionnerCellule,
    indicesUtilises,
    configDifficulte.maxIndices
  ]);

  const annulerMouvement = useCallback(() => {
    if (mouvements.length === 0) return false;
    
    const dernierMouvement = mouvements[mouvements.length - 1];
    
    if (dernierMouvement.type === 'resolution_auto') {
      return false;
    }
    
    if (dernierMouvement.type === 'indice') {
      // Annuler un indice
      setGrilleActuelle(grillePrec => {
        const nouvelleGrille = grillePrec.map(l => [...l]);
        nouvelleGrille[dernierMouvement.ligne][dernierMouvement.colonne] = 0;
        return nouvelleGrille;
      });
      
      setIndicesUtilises(prev => Math.max(0, prev - 1));
    } else {
      // Annuler un mouvement normal
      setGrilleActuelle(grillePrec => {
        const nouvelleGrille = grillePrec.map(l => [...l]);
        nouvelleGrille[dernierMouvement.ligne][dernierMouvement.colonne] = dernierMouvement.valeurPrecedente;
        return nouvelleGrille;
      });
    }
    
    setMouvements(mouvPrec => mouvPrec.slice(0, -1));
    return true;
  }, [mouvements]);

  const effacerBrouillonsCellule = useCallback((ligne, colonne) => {
    setGrilleBrouillon(brouillonPrec => {
      const nouveauBrouillon = brouillonPrec.map(l => 
        l.map(c => new Set(c))
      );
      nouveauBrouillon[ligne][colonne].clear();
      return nouveauBrouillon;
    });
  }, []);

  const obtenirStatistiques = useCallback(() => {
    return {
      nombreMouvements: mouvements.filter(m => !['resolution_auto', 'indice'].includes(m.type)).length,
      nombreErreurs: cellulesInvalides.length,
      pourcentageCompletion,
      tempsEcoule: Math.floor((Date.now() - heureDebut) / 1000),
      difficulte: difficulteActuelle,
      indicesUtilises,
      indicesRestants,
      modeBrouillon
    };
  }, [
    mouvements, 
    cellulesInvalides.length, 
    pourcentageCompletion, 
    heureDebut, 
    difficulteActuelle,
    indicesUtilises,
    indicesRestants,
    modeBrouillon
  ]);

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

  const obtenirBrouillonCellule = useCallback((ligne, colonne) => {
    return Array.from(grilleBrouillon[ligne][colonne]).sort((a, b) => a - b);
  }, [grilleBrouillon]);

  const estCelluleEnBrouillon = useCallback((ligne, colonne) => {
    return grilleBrouillon[ligne][colonne].size > 0;
  }, [grilleBrouillon]);

  // Retourner l'API du hook
  return {
    // État de la grille
    grilleActuelle,
    grilleInitiale: donneeJeu.puzzle,
    solution: donneeJeu.solution,
    grilleBrouillon,
    
    // État de l'interface
    celluleSelectionnee,
    cellulesInvalides,
    statutJeu,
    estTermine,
    pourcentageCompletion,
    
    // Nouveaux états
    modeBrouillon,
    indicesUtilises,
    indicesRestants,
    difficulteActuelle,
    configDifficulte,
    
    // Historique
    mouvements,
    heureDebut,
    
    // Actions de jeu
    mettreAJourCellule,
    selectionnerCellule,
    deselectionnerCellule,
    naviguerCellule,
    
    // Nouvelles actions
    basculerModeBrouillon,
    effacerBrouillonsCellule,
    obtenirBrouillonCellule,
    estCelluleEnBrouillon,
    
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