import React, { useCallback, useMemo } from 'react';
import Cellule from '../Cellule';
import { CLASSES_CSS } from '../../utilitaires/constantes.js';
import styles from './GrilleSudoku.module.css';

const GrilleSudoku = React.memo(({ 
  grille, 
  grilleInitiale, 
  celluleSelectionnee, 
  onChangementCellule, 
  onSelectionCellule, 
  cellulesInvalides 
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

  const renduGrille = useMemo(() => {
    const elementsGrille = [];
    
    for (let ligne = 0; ligne < 9; ligne++) {
      const elementsLigne = [];
      
      for (let colonne = 0; colonne < 9; colonne++) {
        elementsLigne.push(
          <Cellule
            key={`${ligne}-${colonne}`}
            valeur={grille[ligne][colonne]}
            onChange={onChangementCellule}
            estInitiale={grilleInitiale[ligne][colonne] !== 0}
            estSelectionnee={estSelectionnee(ligne, colonne)}
            estSurlignee={estSurlignee(ligne, colonne)}
            estInvalide={estInvalide(ligne, colonne)}
            ligne={ligne}
            colonne={colonne}
            onSelect={onSelectionCellule}
          />
        );
      }
      
      elementsGrille.push(
        <div key={ligne} className={`${styles.ligneGrille} ${CLASSES_CSS.LIGNE_GRILLE}`}>
          {elementsLigne}
        </div>
      );
    }
    
    return elementsGrille;
  }, [grille, grilleInitiale, onChangementCellule, onSelectionCellule, estSelectionnee, estSurlignee, estInvalide]);

  return (
    <div className={`${styles.grilleSudoku} ${CLASSES_CSS.GRILLE}`} role="grid">
      {renduGrille}
    </div>
  );
});

GrilleSudoku.displayName = 'GrilleSudoku';
export default GrilleSudoku;