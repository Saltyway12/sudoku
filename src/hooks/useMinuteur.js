// =============================================
// HOOK MINUTEUR OPTIMISÉ
// =============================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { STATUTS_JEU } from '../utilitaires/constantes.js';

/**
 * Hook pour gérer le minuteur du jeu
 * @param {string} statutJeu - Statut actuel du jeu
 * @param {number} heureDebut - Timestamp de début de partie
 * @returns {Object} État et fonctions du minuteur
 */
const useMinuteur = (statutJeu, heureDebut) => {
  const [tempsEcoule, setTempsEcoule] = useState(0);
  const [estEnPause, setEstEnPause] = useState(false);
  const [tempsPause, setTempsPause] = useState(0);
  const intervalRef = useRef(null);
  const heureDebutPauseRef = useRef(null);

  // Calculer le temps écoulé
  const calculerTempsEcoule = useCallback(() => {
    if (!heureDebut) return 0;
    
    const maintenant = Date.now();
    const tempsTotal = maintenant - heureDebut - tempsPause;
    
    return Math.max(0, Math.floor(tempsTotal / 1000));
  }, [heureDebut, tempsPause]);

  // Démarrer/arrêter le minuteur
  useEffect(() => {
    if (statutJeu === STATUTS_JEU.EN_COURS && !estEnPause) {
      // Démarrer le minuteur
      intervalRef.current = setInterval(() => {
        setTempsEcoule(calculerTempsEcoule());
      }, 1000);
    } else {
      // Arrêter le minuteur
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [statutJeu, estEnPause, calculerTempsEcoule]);

  // Mettre en pause
  const mettreEnPause = useCallback(() => {
    if (statutJeu !== STATUTS_JEU.EN_COURS || estEnPause) return;
    
    setEstEnPause(true);
    heureDebutPauseRef.current = Date.now();
  }, [statutJeu, estEnPause]);

  // Reprendre
  const reprendre = useCallback(() => {
    if (!estEnPause || !heureDebutPauseRef.current) return;
    
    const dureeePause = Date.now() - heureDebutPauseRef.current;
    setTempsPause(prev => prev + dureeePause);
    setEstEnPause(false);
    heureDebutPauseRef.current = null;
  }, [estEnPause]);

  // Réinitialiser le minuteur
  const reinitialiserMinuteur = useCallback(() => {
    setTempsEcoule(0);
    setEstEnPause(false);
    setTempsPause(0);
    heureDebutPauseRef.current = null;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Formater le temps pour l'affichage
  const formaterTemps = useCallback((secondes = tempsEcoule) => {
    const heures = Math.floor(secondes / 3600);
    const minutes = Math.floor((secondes % 3600) / 60);
    const secs = secondes % 60;
    
    if (heures > 0) {
      return `${heures}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [tempsEcoule]);

  // Obtenir le temps formaté pour différents usages
  const obtenirTempsFormate = useCallback(() => {
    return {
      affichage: formaterTemps(),
      minutes: Math.floor(tempsEcoule / 60),
      secondes: tempsEcoule % 60,
      total: tempsEcoule
    };
  }, [formaterTemps, tempsEcoule]);

  return {
    tempsEcoule,
    estEnPause,
    formaterTemps,
    obtenirTempsFormate,
    mettreEnPause,
    reprendre,
    reinitialiserMinuteur
  };
};

export default useMinuteur;