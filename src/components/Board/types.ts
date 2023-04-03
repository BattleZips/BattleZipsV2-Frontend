export type Ship = {
  image: string; // image corresponding to ship
  length: number; // length of the ship
  name: string; // ship name
  orientation?: 'x' | 'y';
  sections: number[];
};

export const EMPTY_SHIP: Ship = {
  image: '',
  length: 0,
  name: '',
  sections: []
};
