import React, { memo, useCallback, useMemo } from 'react';
import { CLASSES_CSS, TYPES_SAISIE } from '../../utilitaires/constantes.js'; // Correction du chemin

/**
 * Composant Cellule simplifié mais fonctionnel
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

  // Calculer les classes CSS
  const classesCellule = useMemo(() => {
    const classes = [CLASSES_CSS.CELLULE_BASE];
    
    if (estInitiale) classes.push(CLASSES_CSS.CELLULE_INITIALE);
    if (estSelectionnee) classes.push(CLASSES_CSS.CELLULE_SELECTIONNEE);
    if (estSurlignee) classes.push(CLASSES_CSS.CELLULE_SURLIGNEE);
    if (estInvalide) classes.push(CLASSES_CSS.CELLULE_INVALIDE);
    if (brouillons.length > 0) classes.push(CLASSES_CSS.CELLULE_BROUILLON);
    
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
        <div className="conteneur-valeur-definitive">
          <span className="valeur-definitive">
            {valeur}
          </span>
        </div>
      );
    }
    
    // Si la cellule a des brouillons
    if (brouillons.length > 0) {
      return (
        <div className="conteneur-brouillon">
          <div className="grille-brouillon">
            {Array.from({ length: 9 }, (_, index) => {
              const numero = index + 1;
              const estPresent = brouillons.includes(numero);
              
              return (
                <div 
                  key={`brouillon-${numero}`}
                  className={`case-brouillon ${estPresent ? 'presente' : 'vide'}`}
                >
                  {estPresent && (
                    <span className="valeur-brouillon">
                      {numero}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    
    // Cellule vide
    return (
      <div className="conteneur-vide">
        {estSelectionnee && (
          <span className="curseur-saisie">|</span>
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
        <div className="indicateur-erreur" title="Cette valeur entre en conflit">
          ❌
        </div>
      )}
      
      {modeBrouillonGlobal && !estInitiale && valeur === 0 && (
        <div className="indicateur-mode-brouillon" title="Mode brouillon actif">
          📝
        </div>
      )}
    </div>
  );
});

Cellule.displayName = 'CelluleSudoku';

export default Cellule;