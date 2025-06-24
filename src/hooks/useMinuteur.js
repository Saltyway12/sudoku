// =============================================
// HOOK MINUTEUR OPTIMISÉ AVEC AUTO-RÉINITIALISATION
// =============================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { STATUTS_JEU } from '../utilitaires/constantes.js';

/**
 * Hook pour gérer le minuteur du jeu avec réinitialisation automatique
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
  const heureDebutPrecedenteRef = useRef(heureDebut);

  // Calculer le temps écoulé
  const calculerTempsEcoule = useCallback(() => {
    if (!heureDebut) return 0;
    
    const maintenant = Date.now();
    const tempsTotal = maintenant - heureDebut - tempsPause;
    
    return Math.max(0, Math.floor(tempsTotal / 1000));
  }, [heureDebut, tempsPause]);

  // Réinitialiser automatiquement quand une nouvelle partie commence
  useEffect(() => {
    // Si heureDebut change (nouvelle partie), réinitialiser
    if (heureDebut && heureDebut !== heureDebutPrecedenteRef.current) {
      setTempsEcoule(0);
      setEstEnPause(false);
      setTempsPause(0);
      heureDebutPauseRef.current = null;
      
      // Arrêter l'ancien intervalle
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      // Mettre à jour la référence
      heureDebutPrecedenteRef.current = heureDebut;
    }
  }, [heureDebut]);

  // Démarrer/arrêter le minuteur
  useEffect(() => {
    if (statutJeu === STATUTS_JEU.EN_COURS && !estEnPause && heureDebut) {
      // Démarrer le minuteur
      intervalRef.current = setInterval(() => {
        setTempsEcoule(calculerTempsEcoule());
      }, 1000);
      
      // Mise à jour immédiate
      setTempsEcoule(calculerTempsEcoule());
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
        intervalRef.current = null;
      }
    };
  }, [statutJeu, estEnPause, heureDebut, calculerTempsEcoule]);

  // Réinitialiser quand le jeu est en attente ou terminé
  useEffect(() => {
    if (statutJeu === STATUTS_JEU.EN_ATTENTE || statutJeu === STATUTS_JEU.NOUVEAU) {
      setTempsEcoule(0);
      setEstEnPause(false);
      setTempsPause(0);
      heureDebutPauseRef.current = null;
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [statutJeu]);

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

  // Réinitialiser manuellement le minuteur
  const reinitialiserMinuteur = useCallback(() => {
    setTempsEcoule(0);
    setEstEnPause(false);
    setTempsPause(0);
    heureDebutPauseRef.current = null;
    heureDebutPrecedenteRef.current = null;
    
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

  // Basculer pause/reprendre
  const basculerPause = useCallback(() => {
    if (estEnPause) {
      reprendre();
    } else {
      mettreEnPause();
    }
  }, [estEnPause, reprendre, mettreEnPause]);

  // Vérifier si le minuteur est actif
  const estActif = useCallback(() => {
    return statutJeu === STATUTS_JEU.EN_COURS && !estEnPause && !!heureDebut;
  }, [statutJeu, estEnPause, heureDebut]);

  // Obtenir des statistiques de temps
  const obtenirStatistiques = useCallback(() => {
    const totalSecondes = tempsEcoule;
    const totalMinutes = Math.floor(totalSecondes / 60);
    const totalHeures = Math.floor(totalMinutes / 60);
    
    return {
      secondes: totalSecondes,
      minutes: totalMinutes,
      heures: totalHeures,
      affichageCompact: totalMinutes < 60 ? `${totalMinutes}m` : `${totalHeures}h ${totalMinutes % 60}m`,
      affichageDetaille: formaterTemps(totalSecondes)
    };
  }, [tempsEcoule, formaterTemps]);

  return {
    // États
    tempsEcoule,
    estEnPause,
    estActif: estActif(),
    
    // Fonctions de contrôle
    mettreEnPause,
    reprendre,
    basculerPause,
    reinitialiserMinuteur,
    
    // Fonctions d'affichage
    formaterTemps,
    obtenirTempsFormate,
    obtenirStatistiques
  };
};

export default useMinuteur;