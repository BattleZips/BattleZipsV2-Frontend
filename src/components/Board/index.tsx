import { useEffect, useMemo, useState } from 'react';
import { createUseStyles, jss } from 'react-jss';
import { EMPTY_SHIP, Ship } from './types';
import { DISPLAY_IMAGES } from './images';
import { SHIP_STYLES } from './styles';
import hitIcon from './images/hit.svg';
import missIcon from './images/miss.svg';
import { Shot } from 'views/Game/types';
import { GameStatus } from 'utils/constants';

const useStyles = createUseStyles({
  label: {
    alignItems: 'center',
    color: '#9CA3B6',
    cursor: 'pointer',
    display: 'flex',
    fontSize: '24px',
    fontWeight: 700,
    justifyContent: 'center',
    lineHeight: '34.68px',
    width: '46px',
  },
  leave: {
    backgroundColor: '#FF0055',
    borderRadius: '3px',
    color: '#FFFFFF',
    cursor: 'pointer',
    fontSize: '24px',
    fontWeight: 700,
    letterSpacing: '3.6px',
    margin: '46px auto 0 auto',
    padding: '5px 15px',
    width: 'fit-content',
  },
  rotateText: {
    fontSize: '24px',
    fontWeight: 400,
    letterSpacing: '3.6px',
    margin: '55px auto 0 auto',
    width: 'fit-content',
  },
  row: {
    alignItems: 'center',
    display: 'flex',
    gap: '7px',
    marginTop: '7px',
  },
  ship: {
    left: 0,
    pointerEvents: 'none',
    position: 'absolute',
    transformOrigin: 'top left',
    transition: '.2s transform',
    zIndex: 1,
    '& > circle': {
      fill: '#FFFFFF',
    },
  },
  tile: {
    alignItems: 'center',
    background: '#DFF4FF',
    borderRadius: '3px',
    cursor: 'crosshair',
    display: 'flex',
    justifyContent: 'center',
    height: '46px',
    position: 'relative',
    width: '46px',
  },
  wrapper: {
    marginTop: '24px',
  },
});

// Board is simply a 10x10 array
const BOARD = new Array(10).fill('').map((_) => new Array(10).fill(''));

type BoardProps = {
  allPlaced: boolean; // boolean prop detailing if all ships have been placed
  onLeave?: () => void; // optional function to execute tx to leave a game
  opponentShots: Shot[]; // array of the shots an opponent has taken
  placedShips: Ship[]; // array of ships already placed
  rotationAxis: string; // orientation of ship placement (horizontal / vertical)
  selectedShip: Ship; // ship that is in the process of being places
  setPlacedShip: (ship: Ship) => void; // function to add selected ship to placeShips array
  status?: GameStatus; // optional prop detailing whether or not board is rendered in a game and what the status of the game is
};

export default function Board({
  allPlaced,
  onLeave,
  opponentShots,
  placedShips,
  rotationAxis,
  selectedShip,
  setPlacedShip,
  status,
}: BoardProps): JSX.Element {
  const styles = useStyles();
  // Sections above which a seleted ship is being rendered before placement
  const [highlightedSections, setHighlightedSections] = useState<number[]>([]);
  // State variable describing whether placement would be valid or not
  const [invalidPlacement, setInvalidPlacement] = useState(false);

  /**
   *Determine path of ship depending on rotational axis.
   *
   * @param {number} index - coordinate of starting section of ship.
   * @param {number} row - cow number on the board.
   *
   * @returns Array of spaces to be occupied after ship placement.
   */
  const calculateSections = (index: number, row: number): number[] => {
    const sections: number[] = [];
    for (let i = 0; i < selectedShip.length; i++) {
      const pos = rotationAxis === 'y' ? index + i * 10 : index + i;
      sections.push(pos);
      checkValidPlacement(pos, row, sections);
    }
    return sections;
  };

  /**
   * Helper function to generate a ship image sized correctly to the board size generated
   *
   * @param {number} len - length of the ship
   * @returns width of the ship in pixels
   */
  const calculateShipWidth = (len: number) => {
    return `${len * 46}px`;
  };

  /**
   * Check whether ship is in bounds or whether there is an overlap with a placed ship
   *
   * @param {number} pos - index of tile being hovered over
   * @param {number} row - index of the row being hovered over
   * @param {number[]} sections - sections of the board selected ship will occupy
   */
  const checkValidPlacement = (
    pos: number,
    row: number,
    sections: number[]
  ) => {
    const occupied = sections.find((section) => occupiedSpace(section).length);
    // If space is occupied then automatically invalid
    if (occupied) {
      setInvalidPlacement(true);
    } else {
      // If orientation is vertical then values below 0 and above 100 are all that need to be checked
      if (rotationAxis === 'y') {
        setInvalidPlacement(pos < 0 || pos > 100);
        // If orientation is horizontal need to check if ship is out of row boundary
      } else {
        const rowStart = row * 10;
        const rowEnd = row * 10 + 9;
        const outOfBoundsElement = sections.find(
          (element) => element < rowStart || element > rowEnd
        );
        setInvalidPlacement(!!outOfBoundsElement);
      }
    }
  };

  /**
   * Colors inner svg circles of ship if a shot has been taken at that specific coordinate
   *
   * @param {Ship} ship - ship being redenered in JSX return
   * @returns corresponding svg circle styles to be rendered with ship
   */
  const circleStyles = (ship: Ship) => {
    const hits: any = ship.sections.map((section, index) => [
      section,
      opponentShots.find((shot) => shot.x + shot.y * 10 === section),
      index + 1,
    ]);
    const defaultClass = {
      '& > circle': {
        fill: '#FFFFFF',
      },
    };
    const pseudoClasses = hits
      .filter((hit: any) => hit[1])
      .map((hit: any) => ({
        [`& > circle:nth-of-type(${hit[2]})`]: {
          fill: '#FF0055',
        },
      }));
    const obj = [defaultClass].concat(pseudoClasses).reduce(
      (obj, item) => ({
        ...obj,
        [Object.keys(item)[0]]: Object.values(item)[0],
      }),
      {}
    );
    const sheet = jss
      .createStyleSheet(
        {
          circle: obj,
        },
        { link: true }
      )
      .attach();
    return sheet.classes.circle;
  };

  /**
   *
   * Function to determine where to render ship on board during placement phase
   *
   * @param {number} index - index of the board being hovered over
   * @param {number} row - index of the row being hovered over
   */
  const handleHover = (index: number, row: number) => {
    console.log('Index: ', index);
    const sections = calculateSections(index, row);
    if (rotationAxis === 'y') {
      setHighlightedSections(sections.filter((section) => section < 100));
    } else {
      const rowStart = row * 10;
      const rowEnd = rowStart + 9;
      setHighlightedSections(
        sections.filter(
          (section) => !(section > rowEnd) && !(section < rowStart)
        )
      );
    }
  };

  /**
   * Calculate sections ship will occupt upon placement and then place
   *
   * @param {number} index - index of the tile
   * @param {number} row - index of the row
   */
  const handleShipPlacement = (index: number, row: number) => {
    const sections = calculateSections(index, row);
    setPlacedShip({
      ...selectedShip,
      orientation: rotationAxis,
      sections,
    } as Ship);
    setHighlightedSections([]);
  };

  /**
   * Memoized value to determine how many invalid sections of the ship to render based on
   * position of the board
   */
  const invalidSections = useMemo(() => {
    return selectedShip.length - highlightedSections.length;
  }, [highlightedSections, selectedShip]);

  /**
   *  Determines whether a specified coordinate contains a placed ship
   *
   * @param {number} pos - coordinate on the board
   * @returns {Ship} - ship that currently occupies the supplied space
   */
  const occupiedSpace = (pos: number): Ship => {
    let placedShip = EMPTY_SHIP;
    placedShips.forEach((ship) => {
      ship.sections.forEach((section) => {
        if (section === pos) {
          placedShip = ship;
          return;
        }
        if (placedShip.name) return;
      });
    });
    return placedShip;
  };

  /**
   * Memoized value to determine what coordinates contain the heads of a ship so that the image may
   * be rendered from the head
   */
  const shipHeads = useMemo(() => {
    const heads: number[] = [];
    placedShips.forEach((ship) => {
      // Head is simply index 0 of where the ship exists on the board
      heads.push(ship.sections[0]);
    });
    return heads;
  }, [placedShips]);

  /**
   * useEffect will run each time the rotation axis of the ship is changed
   */
  useEffect(() => {
    if (highlightedSections[0] !== undefined) {
      const row = Math.floor(highlightedSections[0] / 10);
      handleHover(highlightedSections[0], row);
    }
    // eslint-disable-next-line
  }, [rotationAxis]);

  return (
    <div>
      <div className={styles.wrapper}>
        <div className={styles.row} style={{ marginLeft: '46px' }}>
          {new Array(10).fill('').map((_, index) => (
            <div className={styles.label} key={index}>
              {String.fromCharCode(65 + index)}
            </div>
          ))}
        </div>
        {BOARD.map((row, rowIndex) => {
          return (
            <div className={styles.row} key={rowIndex}>
              <div className={styles.label}>{rowIndex + 1}</div>
              {row.map((_, colIndex) => {
                const index = rowIndex * 10 + colIndex;
                // Check if index includes start of ship
                const containsHead = shipHeads.includes(index);
                const occupied = occupiedSpace(index);
                const HoverImage = selectedShip.length
                  ? DISPLAY_IMAGES[selectedShip.name][invalidSections]
                  : undefined;
                const PlacedImage = occupied.length
                  ? DISPLAY_IMAGES[occupied.name].default
                  : undefined;
                const shot = opponentShots.find(
                  (shot) => shot.x + shot.y * 10 === index
                );
                const hit = shot && occupied.length;
                const validPlacement =
                  !occupied.length && !invalidPlacement && selectedShip.name;
                const yOrinetation = rotationAxis === 'y';
                return (
                  <div
                    className={styles.tile}
                    key={index}
                    onClick={() =>
                      validPlacement && handleShipPlacement(index, rowIndex)
                    }
                    onMouseOver={() =>
                      !allPlaced && handleHover(index, rowIndex)
                    }
                    onMouseLeave={() =>
                      !allPlaced && setHighlightedSections([])
                    }
                  >
                    {shot && !occupied.length && (
                      <img
                        alt={hit ? 'Hit' : 'Miss'}
                        src={hit ? hitIcon : missIcon}
                      />
                    )}
                    {/* Render ship if index contains head */}
                    {PlacedImage && containsHead && (
                      <PlacedImage
                        className={`${styles.ship} ${circleStyles(occupied)}`}
                        style={{
                          fill: '#000000',
                          transform:
                            occupied.orientation === 'y'
                              ? `rotate(90deg) translateY(-${
                                  SHIP_STYLES[occupied.name].translate
                                }px)`
                              : 'rotate(0deg)',
                          width: calculateShipWidth(occupied.length),
                        }}
                      />
                    )}
                    {/* Render selected ship */}
                    {HoverImage && highlightedSections[0] === index && (
                      <HoverImage
                        className={styles.ship}
                        style={{
                          fill: validPlacement ? '#717C96' : '#FF0055',
                          transform: yOrinetation
                            ? `rotate(90deg) translateY(-${
                                SHIP_STYLES[selectedShip.name].translate
                              }px)`
                            : 'rotate(0deg)',
                          width: calculateShipWidth(highlightedSections.length),
                          zIndex: 2,
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      {!allPlaced && (
        <div className={styles.rotateText}>[PRESS THE SPACE BAR TO ROTATE]</div>
      )}
      {status && status !== GameStatus.Over && onLeave && (
        <div className={styles.leave} onClick={() => onLeave()}>
          {status === GameStatus.Started ? 'LEAVE' : 'FORFEIT'} GAME
        </div>
      )}
    </div>
  );
}
