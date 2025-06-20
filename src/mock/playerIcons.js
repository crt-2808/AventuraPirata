// src/mock/playerIcons.js
// Asegúrate de que estas imágenes existan en src/img/
import pirataNino1 from '../img/pirata_niño1.png';
import pirataNino2 from '../img/pirata_niño2.png';
import pirataNino3 from '../img/pirata_niño3.png';
import pirataNina1 from '../img/pirata_niña1.png';
import pirataNina2 from '../img/pirata_niña2.png';
import pirataNina3 from '../img/pirata_niña3.png';

export const DEMO_PLAYER_ICONS = [
    { id: 'pirata_niño1', url: pirataNino1, alt: 'Pirata Niño 1' },
    { id: 'pirata_niño2', url: pirataNino2, alt: 'Pirata Niño 2' },
    { id: 'pirata_niño3', url: pirataNino3, alt: 'Pirata Niño 3' },
    { id: 'pirata_niña1', url: pirataNina1, alt: 'Pirata Niña 1' },
    { id: 'pirata_niña2', url: pirataNina2, alt: 'Pirata Niña 2' },
    { id: 'pirata_niña3', url: pirataNina3, alt: 'Pirata Niña 3' },
];

// Si quieres usar los íconos que tenías antes (mp1, fp1, etc.), puedes redefinirlos aquí
// o simplemente ajustar la lógica en App.js para usar esos IDs si existen.