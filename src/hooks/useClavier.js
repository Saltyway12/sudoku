// =============================================
// HOOK GESTION CLAVIER OPTIMISÉ AVEC BROUILLON
// =============================================

import { useEffect, useCallback } from 'react';
import { TOUCHES_NAVIGATION, STATUTS_JEU, TYPES_SAISIE } from '../utilitaires/constantes.js';

/**
 * Hook pour gérer les interactions clavier avec support du brouillon
 * @param {Object} celluleSelectionnee - Cellule actuellement sélectionnée
 * @param {string} statutJeu - Statut du jeu
 * @param {boolean} modeBrouillon - Mode brouillon actif ou non
 * @param {Function} mettreAJourCellule - Fonction pour modifier une cellule
 * @param {Function} naviguerCellule - Fonction pour naviguer entre cellules
 * @param {Function} obtenirIndice - Fonction pour obtenir un indice
 * @param {Function} annulerMouvement - Fonction pour annuler le dernier mouvement
 * @param {Function} basculerModeBrouillon - Fonction pour basculer le mode brouillon
 * @param {Function} effacerBrouillonsCellule - Fonction pour effacer les brouillons d'une cellule
 * @returns {Object} Fonctions utilitaires du clavier
 */
const useClavier = ({
  celluleSelectionnee,
  statutJeu,
  modeBrouillon,
  mettreAJourCellule,
  naviguerCellule,
  obtenirIndice,
  annulerMouvement,
  basculerModeBrouillon,
  effacerBrouillonsCellule
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
  const gererSaisieChiffre = useCallback((touche, forceModeBrouillon = false) => {
    if (!celluleSelectionnee || statutJeu !== STATUTS_JEU.EN_COURS) return false;
    
    const { ligne, colonne } = celluleSelectionnee;
    const chiffre = parseInt(touche);
    const typeSaisie = (modeBrouillon || forceModeBrouillon) ? TYPES_SAISIE.BROUILLON : TYPES_SAISIE.NORMAL;
    
    return mettreAJourCellule(ligne, colonne, chiffre, typeSaisie);
  }, [celluleSelectionnee, statutJeu, modeBrouillon, mettreAJourCellule]);

  // Gérer l'effacement
  const gererEffacement = useCallback((effacerBrouillons = false) => {
    if (!celluleSelectionnee || statutJeu !== STATUTS_JEU.EN_COURS) return false;
    
    const { ligne, colonne } = celluleSelectionnee;
    
    if (effacerBrouillons || modeBrouillon) {
      // Effacer les brouillons
      effacerBrouillonsCellule(ligne, colonne);
      return true;
    } else {
      // Effacement normal
      return mettreAJourCellule(ligne, colonne, 0, TYPES_SAISIE.NORMAL);
    }
  }, [celluleSelectionnee, statutJeu, modeBrouillon, mettreAJourCellule, effacerBrouillonsCellule]);

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
    const { key, ctrlKey, metaKey, shiftKey, altKey } = evenement;
    
    // Raccourcis clavier avec modificateurs
    if (ctrlKey || metaKey) {
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
        case 'b':
          evenement.preventDefault();
          basculerModeBrouillon();
          return;
        default:
          return;
      }
      return;
    }
    
    // Raccourcis avec Alt
    if (altKey) {
      if (estChiffreValide(key)) {
        evenement.preventDefault();
        gererSaisieChiffre(key, true); // Force le mode brouillon
        return;
      }
    }
    
    // Gestion des touches normales
    if (estChiffreValide(key)) {
      evenement.preventDefault();
      gererSaisieChiffre(key);
    } else if (estToucheEffacement(key)) {
      evenement.preventDefault();
      if (shiftKey) {
        // Shift + Delete/Backspace = effacer les brouillons
        gererEffacement(true);
      } else {
        gererEffacement(false);
      }
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
      case 'b':
      case 'B':
        if (!ctrlKey && !metaKey) {
          evenement.preventDefault();
          basculerModeBrouillon();
        }
        break;
      case TOUCHES_NAVIGATION.ESPACE:
        evenement.preventDefault();
        basculerModeBrouillon();
        break;
      case TOUCHES_NAVIGATION.ENTREE:
        evenement.preventDefault();
        if (celluleSelectionnee) {
          // Passer à la cellule suivante
          naviguerCellule('droite') || naviguerCellule('bas');
        }
        break;
      case 'c':
      case 'C':
        if (shiftKey && celluleSelectionnee) {
          // Shift + C = effacer tous les brouillons de la cellule
          evenement.preventDefault();
          effacerBrouillonsCellule(celluleSelectionnee.ligne, celluleSelectionnee.colonne);
        }
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
    annulerMouvement,
    basculerModeBrouillon,
    effacerBrouillonsCellule,
    celluleSelectionnee,
    naviguerCellule
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
  const simulerTouche = useCallback((touche, modificateurs = {}) => {
    const evenementSimule = {
      key: touche,
      ctrlKey: modificateurs.ctrl || false,
      metaKey: modificateurs.meta || false,
      shiftKey: modificateurs.shift || false,
      altKey: modificateurs.alt || false,
      preventDefault: () => {}
    };
    
    gererEvenementClavier(evenementSimule);
  }, [gererEvenementClavier]);

  // Simuler la saisie en mode brouillon
  const simulerSaisieBrouillon = useCallback((chiffre) => {
    if (estChiffreValide(chiffre.toString())) {
      gererSaisieChiffre(chiffre.toString(), true);
    }
  }, [estChiffreValide, gererSaisieChiffre]);

  // Obtenir la liste des raccourcis disponibles
  const obtenirRaccourcis = useCallback(() => {
    return {
      navigation: {
        'Flèches': 'Naviguer entre les cellules',
        'Entrée': 'Passer à la cellule suivante',
        'Tab': 'Cellule suivante'
      },
      saisie: {
        '1-9': `Entrer un chiffre ${modeBrouillon ? '(mode brouillon)' : '(mode normal)'}`,
        'Alt + 1-9': 'Entrer un chiffre en brouillon',
        'Backspace/Delete/0': 'Effacer la cellule',
        'Shift + Backspace/Delete': 'Effacer les brouillons uniquement'
      },
      modes: {
        'B ou Espace': `${modeBrouillon ? 'Désactiver' : 'Activer'} le mode brouillon`,
        'Ctrl + B': 'Basculer le mode brouillon',
        'Shift + C': 'Effacer tous les brouillons de la cellule'
      },
      actions: {
        'H': 'Obtenir un indice',
        'U': 'Annuler le dernier mouvement',
        'Ctrl + Z': 'Annuler (raccourci standard)',
        'Ctrl + H': 'Aide (indice)'
      }
    };
  }, [modeBrouillon]);

  // Obtenir les indicateurs visuels pour l'interface
  const obtenirIndicateursVisuels = useCallback(() => {
    return {
      modeBrouillon,
      raccourciActuel: modeBrouillon ? 'Mode Brouillon (B pour désactiver)' : 'Mode Normal (B pour brouillon)',
      touchesDisponibles: {
        chiffres: modeBrouillon ? 'Ajout/retrait en brouillon' : 'Saisie définitive',
        effacement: modeBrouillon ? 'Effacement brouillons' : 'Effacement valeur',
        navigation: 'Flèches pour naviguer'
      }
    };
  }, [modeBrouillon]);

  return {
    // Fonctions principales
    simulerTouche,
    simulerSaisieBrouillon,
    
    // Informations
    obtenirRaccourcis,
    obtenirIndicateursVisuels,
    
    // Tests de touches
    estChiffreValide,
    estToucheEffacement,
    estToucheNavigation,
    
    // État actuel
    modeBrouillonActif: modeBrouillon
  };
};

export default useClavier;