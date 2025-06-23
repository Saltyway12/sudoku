// =============================================
// HOOK GESTION CLAVIER OPTIMISÉ
// =============================================

import { useEffect, useCallback } from 'react';
import { TOUCHES_NAVIGATION, STATUTS_JEU } from '../utilitaires/constantes.js';

/**
 * Hook pour gérer les interactions clavier
 * @param {Object} celluleSelectionnee - Cellule actuellement sélectionnée
 * @param {string} statutJeu - Statut du jeu
 * @param {Function} mettreAJourCellule - Fonction pour modifier une cellule
 * @param {Function} naviguerCellule - Fonction pour naviguer entre cellules
 * @param {Function} obtenirIndice - Fonction pour obtenir un indice
 * @param {Function} annulerMouvement - Fonction pour annuler le dernier mouvement
 * @returns {Object} Fonctions utilitaires du clavier
 */
const useClavier = ({
  celluleSelectionnee,
  statutJeu,
  mettreAJourCellule,
  naviguerCellule,
  obtenirIndice,
  annulerMouvement
}) => {
  
  // Vérifier si une touche est un chiffre valide (1-9)
  const estChiffreValide = useCallback((touche) => {
    return /^[1-9]$/.test(touche);
  }, []);

  // Vérifier si une touche est pour effacer
  const estToucheEffacement = useCallback((touche) => {
    return touche === TOUCHES_NAVIGATION.RETOUR_ARRIERE || 
           touche === TOUCHES_NAVIGATION.SUPPRIMER ||
           touche === '0';
  }, []);

  // Vérifier si une touche est pour la navigation
  const estToucheNavigation = useCallback((touche) => {
    return Object.values(TOUCHES_NAVIGATION).includes(touche);
  }, []);

  // Gérer la saisie de chiffres
  const gererSaisieChiffre = useCallback((touche) => {
    if (!celluleSelectionnee || statutJeu !== STATUTS_JEU.EN_COURS) return false;
    
    const { ligne, colonne } = celluleSelectionnee;
    const chiffre = parseInt(touche);
    
    return mettreAJourCellule(ligne, colonne, chiffre);
  }, [celluleSelectionnee, statutJeu, mettreAJourCellule]);

  // Gérer l'effacement
  const gererEffacement = useCallback(() => {
    if (!celluleSelectionnee || statutJeu !== STATUTS_JEU.EN_COURS) return false;
    
    const { ligne, colonne } = celluleSelectionnee;
    return mettreAJourCellule(ligne, colonne, 0);
  }, [celluleSelectionnee, statutJeu, mettreAJourCellule]);

  // Gérer la navigation
  const gererNavigation = useCallback((touche) => {
    const mappingDirection = {
      [TOUCHES_NAVIGATION.FLECHE_HAUT]: 'haut',
      [TOUCHES_NAVIGATION.FLECHE_BAS]: 'bas',
      [TOUCHES_NAVIGATION.FLECHE_GAUCHE]: 'gauche',
      [TOUCHES_NAVIGATION.FLECHE_DROITE]: 'droite'
    };
    
    const direction = mappingDirection[touche];
    return direction ? naviguerCellule(direction) : false;
  }, [naviguerCellule]);

  // Gestionnaire principal des événements clavier
  const gererEvenementClavier = useCallback((evenement) => {
    const { key, ctrlKey, metaKey, shiftKey } = evenement;
    
    // Ignorer si des modificateurs sont pressés (sauf pour les raccourcis)
    if (ctrlKey || metaKey) {
      // Raccourcis clavier
      switch (key.toLowerCase()) {
        case 'z':
          if (!shiftKey) {
            evenement.preventDefault();
            annulerMouvement();
            return;
          }
          break;
        case 'h':
          evenement.preventDefault();
          obtenirIndice();
          return;
        default:
          return;
      }
      return;
    }
    
    // Gestion des touches normales
    if (estChiffreValide(key)) {
      evenement.preventDefault();
      gererSaisieChiffre(key);
    } else if (estToucheEffacement(key)) {
      evenement.preventDefault();
      gererEffacement();
    } else if (estToucheNavigation(key)) {
      evenement.preventDefault();
      gererNavigation(key);
    }
    
    // Touches spéciales
    switch (key) {
      case 'h':
      case 'H':
        if (!ctrlKey && !metaKey) {
          evenement.preventDefault();
          obtenirIndice();
        }
        break;
      case 'u':
      case 'U':
        evenement.preventDefault();
        annulerMouvement();
        break;
      default:
        break;
    }
  }, [
    estChiffreValide,
    estToucheEffacement,
    estToucheNavigation,
    gererSaisieChiffre,
    gererEffacement,
    gererNavigation,
    obtenirIndice,
    annulerMouvement
  ]);

  // Attacher/détacher les événements clavier
  useEffect(() => {
    const gestionnaireOptimise = (evenement) => {
      // Ne traiter que si le focus est sur le jeu (pas sur un input externe)
      if (evenement.target.tagName === 'INPUT' && !evenement.target.closest('.grille-sudoku')) {
        return;
      }
      
      gererEvenementClavier(evenement);
    };

    document.addEventListener('keydown', gestionnaireOptimise);
    
    return () => {
      document.removeEventListener('keydown', gestionnaireOptimise);
    };
  }, [gererEvenementClavier]);

  // Simuler un appui de touche (utile pour les boutons tactiles)
  const simulerTouche = useCallback((touche) => {
    const evenementSimule = {
      key: touche,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
      preventDefault: () => {}
    };
    
    gererEvenementClavier(evenementSimule);
  }, [gererEvenementClavier]);

  // Obtenir la liste des raccourcis disponibles
  const obtenirRaccourcis = useCallback(() => {
    return {
      navigation: {
        'Flèches': 'Naviguer entre les cellules',
        'Tab': 'Cellule suivante'
      },
      saisie: {
        '1-9': 'Entrer un chiffre',
        'Backspace/Delete/0': 'Effacer la cellule'
      },
      actions: {
        'H': 'Obtenir un indice',
        'U': 'Annuler le dernier mouvement',
        'Ctrl+Z': 'Annuler (raccourci standard)',
        'Ctrl+H': 'Aide (indice)'
      }
    };
  }, []);

  return {
    simulerTouche,
    obtenirRaccourcis,
    estChiffreValide,
    estToucheEffacement,
    estToucheNavigation
  };
};

export default useClavier;