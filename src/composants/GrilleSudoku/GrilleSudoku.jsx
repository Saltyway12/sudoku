import React, { useCallback, useMemo } from 'react';
import Cellule from '../Cellule';
import { CLASSES_CSS } from '../../utilitaires/constantes.js';

const GrilleSudoku = React.memo(({ 
  grille, 
  grilleInitiale, 
  celluleSelectionnee, 
  onChangementCellule, 
  onSelectionCellule, 
  cellulesInvalides,
  modeBrouillon,
  obtenirBrouillonCellule,
  estMobile,
  estTactile
}) => {
  const estSurlignee = useCallback((ligne, colonne) => {
    if (!celluleSelectionnee) return false;
    
    const { ligne: ligneSelectionnee, colonne: colonneSelectionnee } = celluleSelectionnee;
    
    return (
      ligne === ligneSelectionnee || 
      colonne === colonneSelectionnee ||
      (Math.floor(ligne / 3) === Math.floor(ligneSelectionnee / 3) && 
       Math.floor(colonne / 3) === Math.floor(colonneSelectionnee / 3))
    );
  }, [celluleSelectionnee]);

  const estSelectionnee = useCallback((ligne, colonne) => {
    return celluleSelectionnee && 
           celluleSelectionnee.ligne === ligne && 
           celluleSelectionnee.colonne === colonne;
  }, [celluleSelectionnee]);

  const estInvalide = useCallback((ligne, colonne) => {
    return cellulesInvalides.some(cellule => 
      cellule.ligne === ligne && cellule.colonne === colonne
    );
  }, [cellulesInvalides]);

  // Gestionnaire de sélection de cellule
  const gererSelectionCellule = useCallback((ligne, colonne) => {
    if (onSelectionCellule) {
      onSelectionCellule(ligne, colonne);
    }
  }, [onSelectionCellule]);

  // Gestionnaire de changement de cellule
  const gererChangementCellule = useCallback((ligne, colonne, valeur, typeSaisie) => {
    if (onChangementCellule) {
      onChangementCellule(ligne, colonne, valeur, typeSaisie);
    }
  }, [onChangementCellule]);

  const renduGrille = useMemo(() => {
    const elementsGrille = [];
    
    for (let ligne = 0; ligne < 9; ligne++) {
      const elementsLigne = [];
      
      for (let colonne = 0; colonne < 9; colonne++) {
        // Obtenir les brouillons pour cette cellule
        const brouillons = obtenirBrouillonCellule ? 
          obtenirBrouillonCellule(ligne, colonne) : [];
        
        elementsLigne.push(
          <Cellule
            key={`${ligne}-${colonne}`}
            valeur={grille[ligne][colonne]}
            brouillons={brouillons}
            estInitiale={grilleInitiale[ligne][colonne] !== 0}
            estSelectionnee={estSelectionnee(ligne, colonne)}
            estSurlignee={estSurlignee(ligne, colonne)}
            estInvalide={estInvalide(ligne, colonne)}
            modeBrouillonGlobal={modeBrouillon}
            ligne={ligne}
            colonne={colonne}
            indexZone={Math.floor(ligne / 3) * 3 + Math.floor(colonne / 3)}
            surSelection={gererSelectionCellule}
            surSaisie={gererChangementCellule}
          />
        );
      }
      
      elementsGrille.push(
        <div key={ligne} className={`ligne-grille ${CLASSES_CSS.LIGNE_GRILLE}`}>
          {elementsLigne}
        </div>
      );
    }
    
    return elementsGrille;
  }, [
    grille, 
    grilleInitiale, 
    obtenirBrouillonCellule,
    modeBrouillon,
    estSelectionnee, 
    estSurlignee, 
    estInvalide,
    gererSelectionCellule,
    gererChangementCellule
  ]);

  // Classes CSS pour la grille
  const classesGrille = useMemo(() => {
    const classes = [`grille-sudoku`, CLASSES_CSS.GRILLE];
    
    if (estMobile) classes.push('grille-mobile');
    if (estTactile) classes.push('grille-tactile');
    if (modeBrouillon) classes.push('grille-mode-brouillon');
    
    return classes.join(' ');
  }, [estMobile, estTactile, modeBrouillon]);

  return (
    <div className={classesGrille} role="grid" aria-label="Grille de Sudoku 9x9">
      {renduGrille}
    </div>
  );
});

GrilleSudoku.displayName = 'GrilleSudoku';
export default GrilleSudoku;