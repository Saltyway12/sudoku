// =============================================
// COMPOSANT CELLULE OPTIMISÉ
// =============================================

import React, { useCallback, useMemo } from 'react';
import { CLASSES_CSS } from '../../utilitaires/constantes.js';
import styles from './Cellule.module.css';

/**
 * Composant représentant une cellule individuelle du Sudoku
 * Optimisé avec React.memo pour éviter les re-rendus inutiles
 */
const Cellule = React.memo(({ 
  valeur, 
  onChange, 
  estInitiale, 
  estSelectionnee, 
  estSurlignee, 
  estInvalide, 
  ligne, 
  colonne, 
  onSelect,
  onFocus,
  onBlur,
  disabled = false
}) => {
  
  // Gestionnaire de changement optimisé
  const gererChangementSaisie = useCallback((evenement) => {
    const nouvelleValeur = evenement.target.value;
    
    // Validation stricte des entrées
    if (nouvelleValeur === '') {
      onChange(ligne, colonne, 0);
    } else if (/^[1-9]$/.test(nouvelleValeur)) {
      onChange(ligne, colonne, parseInt(nouvelleValeur, 10));
    }
    // Ignorer toute autre entrée
  }, [ligne, colonne, onChange]);

  // Gestionnaire de clic optimisé
  const gererClic = useCallback((evenement) => {
    evenement.stopPropagation();
    onSelect(ligne, colonne);
  }, [ligne, colonne, onSelect]);

  // Gestionnaire de focus
  const gererFocus = useCallback(() => {
    onSelect(ligne, colonne);
    if (onFocus) onFocus(ligne, colonne);
  }, [ligne, colonne, onSelect, onFocus]);

  // Gestionnaire de blur
  const gererBlur = useCallback(() => {
    if (onBlur) onBlur(ligne, colonne);
  }, [ligne, colonne, onBlur]);

  // Gestionnaire de touches optimisé
  const gererToucheAppuyee = useCallback((evenement) => {
    const { key } = evenement;
    
    // Liste des touches autorisées
    const touchesAutorisees = [
      'Backspace', 'Delete', 'Tab', 'Enter',
      'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'
    ];
    
    const estNombre = /^[1-9]$/.test(key);
    const estToucheAutorisee = touchesAutorisees.includes(key);
    
    // Bloquer toutes les autres touches
    if (!estNombre && !estToucheAutorisee) {
      evenement.preventDefault();
      return;
    }
    
    // Laisser React gérer les touches autorisées
    // La navigation sera gérée par le hook useClavier
  }, []);

  // Calcul des classes CSS optimisé avec useMemo
  const classesCellule = useMemo(() => {
    const classes = [styles.cellule, CLASSES_CSS.CELLULE_BASE];
    
    if (estInitiale) classes.push(styles.celluleInitiale, CLASSES_CSS.CELLULE_INITIALE);
    if (estSelectionnee) classes.push(styles.celluleSelectionnee, CLASSES_CSS.CELLULE_SELECTIONNEE);
    if (estSurlignee) classes.push(styles.celluleSurlignee, CLASSES_CSS.CELLULE_SURLIGNEE);
    if (estInvalide) classes.push(styles.celluleInvalide, CLASSES_CSS.CELLULE_INVALIDE);
    if (disabled) classes.push(styles.celluleDesactivee);
    
    return classes.join(' ');
  }, [estInitiale, estSelectionnee, estSurlignee, estInvalide, disabled]);

  // Attributs d'accessibilité
  const attributsAccessibilite = useMemo(() => ({
    'aria-label': `Cellule ligne ${ligne + 1}, colonne ${colonne + 1}`,
    'aria-invalid': estInvalide,
    'aria-describedby': estInvalide ? `erreur-${ligne}-${colonne}` : undefined,
    'role': 'gridcell',
    'tabIndex': estSelectionnee ? 0 : -1
  }), [ligne, colonne, estInvalide, estSelectionnee]);

  // Valeur affichée optimisée
  const valeurAffichee = useMemo(() => {
    return valeur === 0 ? '' : valeur.toString();
  }, [valeur]);

  return (
    <>
      <input
        type="text"
        className={classesCellule}
        value={valeurAffichee}
        onChange={gererChangementSaisie}
        onClick={gererClic}
        onFocus={gererFocus}
        onBlur={gererBlur}
        onKeyDown={gererToucheAppuyee}
        maxLength={1}
        disabled={estInitiale || disabled}
        data-ligne={ligne}
        data-colonne={colonne}
        data-testid={`cellule-${ligne}-${colonne}`}
        {...attributsAccessibilite}
      />
      
      {/* Message d'erreur pour l'accessibilité */}
      {estInvalide && (
        <div 
          id={`erreur-${ligne}-${colonne}`} 
          className={styles.messageErreur}
          role="alert"
          aria-live="polite"
        >
          Valeur invalide
        </div>
      )}
    </>
  );
});

// Définir le nom du composant pour le debugging
Cellule.displayName = 'Cellule';

export default Cellule;