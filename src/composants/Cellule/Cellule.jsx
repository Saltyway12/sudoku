import React, { memo, useCallback, useMemo } from 'react';
import styles from './Cellule.module.css';
import { TYPES_SAISIE } from '../../utilitaires/constantes.js';

/**
 * Composant Cellule avec CSS modules
 */
const Cellule = memo(({
  valeur = 0,
  brouillons = [],
  estInitiale = false,
  estSelectionnee = false,
  estSurlignee = false,
  estInvalide = false,
  modeBrouillonGlobal = false,
  ligne,
  colonne,
  indexZone,
  surSelection,
  surSaisie
}) => {

  // Calculer les classes CSS avec CSS modules
  const classesCellule = useMemo(() => {
    const classes = [styles.cellule];
    
    if (estInitiale) classes.push(styles.celluleInitiale);
    if (estSelectionnee) classes.push(styles.celluleSelectionnee);
    if (estSurlignee) classes.push(styles.celluleSurlignee);
    if (estInvalide) classes.push(styles.celluleInvalide);
    if (brouillons.length > 0) classes.push(styles.celluleBrouillon);
    
    return classes.join(' ');
  }, [estInitiale, estSelectionnee, estSurlignee, estInvalide, brouillons.length]);

  // Gestionnaire de clic
  const gererClic = useCallback((evenement) => {
    evenement.preventDefault();
    evenement.stopPropagation();
    
    if (surSelection) {
      surSelection(ligne, colonne, evenement);
    }
  }, [ligne, colonne, surSelection]);

  // Gestionnaire de touches
  const gererTouche = useCallback((evenement) => {
    if (!estSelectionnee || !surSaisie) return;
    
    const { key, altKey, shiftKey } = evenement;
    
    // Gestion des chiffres 1-9
    if (/^[1-9]$/.test(key)) {
      evenement.preventDefault();
      const chiffre = parseInt(key);
      const forceBrouillon = altKey || modeBrouillonGlobal;
      const typeSaisie = forceBrouillon ? TYPES_SAISIE.BROUILLON : TYPES_SAISIE.NORMAL;
      
      surSaisie(ligne, colonne, chiffre, typeSaisie);
    } 
    // Gestion de l'effacement
    else if (key === 'Backspace' || key === 'Delete' || key === '0') {
      evenement.preventDefault();
      const effacerBrouillons = shiftKey;
      const typeSaisie = effacerBrouillons ? TYPES_SAISIE.BROUILLON : TYPES_SAISIE.NORMAL;
      
      surSaisie(ligne, colonne, 0, typeSaisie);
    }
  }, [ligne, colonne, surSaisie, modeBrouillonGlobal, estSelectionnee]);

  // Rendu du contenu de la cellule
  const renduContenu = useMemo(() => {
    // Si la cellule a une valeur définie
    if (valeur !== 0) {
      return (
        <div className={styles.conteneurValeurDefinitive}>
          <span className={styles.valeurDefinitive}>
            {valeur}
          </span>
        </div>
      );
    }
    
    // Si la cellule a des brouillons
    if (brouillons.length > 0) {
      return (
        <div className={styles.conteneurBrouillon}>
          <div className={styles.contenuBrouillon}>
            {Array.from({ length: 9 }, (_, index) => {
              const numero = index + 1;
              const estPresent = brouillons.includes(numero);
              
              return (
                <div 
                  key={`brouillon-${numero}`}
                  className={`${styles.valeurBrouillon} ${estPresent ? styles.presente : styles.vide}`}
                >
                  {estPresent && numero}
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    
    // Cellule vide
    return (
      <div className={styles.conteneurVide}>
        {estSelectionnee && (
          <span className={styles.curseurSaisie}>|</span>
        )}
      </div>
    );
  }, [valeur, brouillons, estSelectionnee]);

  // Attributs pour l'accessibilité
  const attributsAccessibilite = useMemo(() => {
    const position = `ligne ${ligne + 1}, colonne ${colonne + 1}`;
    
    let description = `Cellule ${position}`;
    
    if (valeur !== 0) {
      description += `, valeur ${valeur}`;
    } else if (brouillons.length > 0) {
      description += `, ${brouillons.length} brouillon${brouillons.length > 1 ? 's' : ''}: ${brouillons.join(', ')}`;
    } else {
      description += ', cellule vide';
    }
    
    if (estInitiale) {
      description += ', cellule initiale non modifiable';
    }
    
    if (estInvalide) {
      description += ', erreur détectée';
    }

    return {
      role: 'gridcell',
      tabIndex: estSelectionnee ? 0 : -1,
      'aria-label': description,
      'aria-invalid': estInvalide,
      'aria-readonly': estInitiale,
      'aria-selected': estSelectionnee
    };
  }, [ligne, colonne, valeur, brouillons, estInitiale, estSelectionnee, estInvalide]);

  // Attributs de données pour le CSS
  const attributsDonnees = useMemo(() => {
    return {
      'data-ligne': ligne,
      'data-colonne': colonne,
      'data-valeur': valeur,
      'data-zone': indexZone,
      'data-est-initiale': estInitiale,
      'data-est-selectionnee': estSelectionnee,
      'data-est-surlignee': estSurlignee,
      'data-est-invalide': estInvalide,
      'data-nombre-brouillons': brouillons.length,
      'data-peut-modifier': !estInitiale
    };
  }, [ligne, colonne, valeur, indexZone, estInitiale, estSelectionnee, estSurlignee, estInvalide, brouillons.length]);

  return (
    <div
      className={classesCellule}
      onClick={gererClic}
      onKeyDown={gererTouche}
      {...attributsAccessibilite}
      {...attributsDonnees}
    >
      {renduContenu}
      
      {/* Indicateurs visuels */}
      {estInvalide && (
        <div className={styles.indicateurErreur} title="Cette valeur entre en conflit">
          ❌
        </div>
      )}
      
      {modeBrouillonGlobal && !estInitiale && valeur === 0 && (
        <div className={styles.indicateurModeBrouillon} title="Mode brouillon actif">
          📝
        </div>
      )}
    </div>
  );
});

Cellule.displayName = 'CelluleSudoku';

export default Cellule;