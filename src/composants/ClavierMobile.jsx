// =============================================
// COMPOSANT CLAVIER NUMÉRIQUE MOBILE
// =============================================

import React, { useEffect } from 'react';
import { useDetectionMobile } from '../hooks/useDetectionMobile';

/**
 * Composant clavier numérique optimisé pour mobile
 * @param {Object} props - Propriétés du composant
 * @param {boolean} props.estVisible - Visibilité du clavier
 * @param {Function} props.surSelectionNombre - Callback lors de la sélection d'un nombre
 * @param {Function} props.surFermeture - Callback lors de la fermeture
 * @param {Object} props.celluleSelectionnee - Cellule actuellement sélectionnée
 */
const ClavierMobile = ({ 
  estVisible, 
  surSelectionNombre, 
  surFermeture, 
  celluleSelectionnee 
}) => {
  const { estMobile, estTactile } = useDetectionMobile();

  // Effet pour gérer le verrouillage du défilement
  useEffect(() => {
    if (estVisible && estMobile) {
      // Verrouiller le défilement quand le clavier est ouvert
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      
      return () => {
        // Restaurer le défilement
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      };
    }
  }, [estVisible, estMobile]);

  // Gestion des touches du clavier physique
  useEffect(() => {
    if (!estVisible) return;

    const gererToucheClavier = (evenement) => {
      const { key } = evenement;
      
      if (key >= '1' && key <= '9') {
        evenement.preventDefault();
        surSelectionNombre(parseInt(key));
      } else if (key === 'Backspace' || key === 'Delete') {
        evenement.preventDefault();
        surSelectionNombre(null);
      } else if (key === 'Escape') {
        evenement.preventDefault();
        surFermeture();
      }
    };

    window.addEventListener('keydown', gererToucheClavier);
    return () => window.removeEventListener('keydown', gererToucheClavier);
  }, [estVisible, surSelectionNombre, surFermeture]);

  // Ne pas afficher le clavier sur desktop ou si pas tactile
  if (!estMobile || !estTactile || !estVisible) {
    return null;
  }

  const gererClicNombre = (nombre) => {
    // Vibration tactile si supportée
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    surSelectionNombre(nombre);
  };

  const gererEffacement = () => {
    // Vibration tactile si supportée
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
    
    surSelectionNombre(null);
  };

  const gererClicOverlay = (evenement) => {
    if (evenement.target === evenement.currentTarget) {
      surFermeture();
    }
  };

  const obtenirPositionCellule = () => {
    if (!celluleSelectionnee) return '';
    const { ligne, colonne } = celluleSelectionnee;
    return `Ligne ${ligne + 1}, Colonne ${colonne + 1}`;
  };

  return (
    <>
      {/* Overlay semi-transparent */}
      <div 
        className={`overlay-mobile ${estVisible ? 'actif' : ''}`}
        onClick={gererClicOverlay}
        role="button"
        tabIndex={-1}
        aria-label="Fermer le clavier"
      />
      
      {/* Clavier numérique */}
      <div 
        className={`clavier-mobile ${estVisible ? 'actif' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="clavier-titre"
        aria-describedby="clavier-description"
      >
        {/* En-tête du clavier */}
        <div className="clavier-entete">
          <div>
            <h3 id="clavier-titre">Sélectionner un nombre</h3>
            {celluleSelectionnee && (
              <p id="clavier-description" className="position-cellule">
                {obtenirPositionCellule()}
              </p>
            )}
          </div>
          <button
            className="clavier-fermer"
            onClick={surFermeture}
            aria-label="Fermer le clavier"
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Grille des nombres */}
        <div className="grille-nombres" role="grid" aria-label="Nombres de 1 à 9">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(nombre => (
            <button
              key={nombre}
              className="btn-nombre"
              onClick={() => gererClicNombre(nombre)}
              aria-label={`Insérer le nombre ${nombre}`}
              type="button"
              role="gridcell"
            >
              {nombre}
            </button>
          ))}
        </div>

        {/* Bouton d'effacement */}
        <button
          className="btn-nombre btn-effacer"
          onClick={gererEffacement}
          aria-label="Effacer la cellule"
          type="button"
        >
          Effacer
        </button>

        {/* Instructions tactiles */}
        <div className="instructions-clavier">
          <p>Appuyez sur un nombre pour remplir la cellule</p>
        </div>
      </div>
    </>
  );
};

export default ClavierMobile;