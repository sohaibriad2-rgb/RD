import { Artist } from '../types';
import azizRiadPortrait from '../assets/images/calssic 2.jpg';

export const ARTISTS: Artist[] = [
  {
    id: 'aziz-riad',
    name: 'Aziz Riad',
    location: 'Casablanca & Agadir',
    specialty: 'Impasto Oil, 24K Gold Leaf & Mineral Abstraction',
    bio: 'For over two decades, Aziz Riad has cultivated a singular practice at the intersection of North African architectural heritage and contemporary material abstraction. Working in solitary discipline with heavy impasto oil, 24-karat gold leaf, and hand-ground Atlas minerals, his canvases map the quiet conversations between ancient stone and shifting desert light. His masterworks are held in prestigious private collections across Europe, North America, and the Middle East.',
    philosophy: 'The canvas is not a surface to be filled, but a sanctuary of quiet light. Twenty years of painting have taught me that true mastery lies in the patience of layer upon layer.',
    portraitUrl: azizRiadPortrait,
    selectedExhibitions: [
      'Institut du Monde Arabe, Paris (2024)',
      'Venice Biennale Collateral Event (2023)',
      '1-54 Contemporary African Art Fair, London (2022)',
      'Palazzo Strozzi Fine Art Showcase, Florence (2020)'
    ]
  }
];

