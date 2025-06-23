// =============================================
// HOOK POUR LA DÉTECTION D'APPAREIL MOBILE
// =============================================

import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour détecter le type d'appareil et les capacités tactiles
 * @returns {Object} Informations sur l'appareil
 */
export const useDetectionMobile = () => {
  const [estMobile, setEstMobile] = useState(false);
  const [estTablette, setEstTablette] = useState(false);
  const [estTactile, setEstTactile] = useState(false);
  const [largeurEcran, setLargeurEcran] = useState(0);
  const [hauteurEcran, setHauteurEcran] = useState(0);
  const [orientationPaysage, setOrientationPaysage] = useState(false);

  useEffect(() => {
    const verifierAppareil = () => {
      const largeur = window.innerWidth;
      const hauteur = window.innerHeight;
      const aTactile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const paysage = largeur > hauteur;
      
      // Mise à jour des états
      setEstMobile(largeur <= 480);
      setEstTablette(largeur > 480 && largeur <= 768);
      setEstTactile(aTactile);
      setLargeurEcran(largeur);
      setHauteurEcran(hauteur);
      setOrientationPaysage(paysage);
      
      // Ajout de classes CSS pour le debug
      document.documentElement.classList.toggle('mobile', largeur <= 480);
      document.documentElement.classList.toggle('tablette', largeur > 480 && largeur <= 768);
      document.documentElement.classList.toggle('tactile', aTactile);
      document.documentElement.classList.toggle('paysage', paysage);
    };

    // Vérification initiale
    verifierAppareil();

    // Écoute des changements de taille et d'orientation
    window.addEventListener('resize', verifierAppareil);
    window.addEventListener('orientationchange', () => {
      // Délai pour laisser le temps au navigateur de mettre à jour
      setTimeout(verifierAppareil, 100);
    });
    
    return () => {
      window.removeEventListener('resize', verifierAppareil);
      window.removeEventListener('orientationchange', verifierAppareil);
    };
  }, []);

  // Calcul de la taille de cellule optimale pour mobile
  const obtenirTailleCellule = () => {
    if (estMobile) {
      const tailleDisponible = Math.min(largeurEcran * 0.9, 350);
      return Math.floor(tailleDisponible / 9);
    }
    if (estTablette) {
      return 45;
    }
    return 60; // Desktop
  };

  // Détection du navigateur pour les optimisations spécifiques
  const obtenirInfoNavigateur = () => {
    const userAgent = navigator.userAgent;
    return {
      estIOS: /iPad|iPhone|iPod/.test(userAgent),
      estAndroid: /Android/.test(userAgent),
      estSafari: /^((?!chrome|android).)*safari/i.test(userAgent),
      estChrome: /Chrome/.test(userAgent),
      estFirefox: /Firefox/.test(userAgent)
    };
  };

  return {
    // États principaux
    estMobile,
    estTablette,
    estDesktop: !estMobile && !estTablette,
    estTactile,
    
    // Dimensions
    largeurEcran,
    hauteurEcran,
    orientationPaysage,
    orientationPortrait: !orientationPaysage,
    
    // Utilitaires
    obtenirTailleCellule,
    obtenirInfoNavigateur,
    
    // Classes CSS conditionnelles
    classeAppareil: estMobile ? 'mobile' : estTablette ? 'tablette' : 'desktop',
    classeOrientation: orientationPaysage ? 'paysage' : 'portrait',
    classeTactile: estTactile ? 'tactile' : 'souris'
  };
};