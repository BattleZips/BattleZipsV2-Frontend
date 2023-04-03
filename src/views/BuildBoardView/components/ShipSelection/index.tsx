import { createUseStyles } from 'react-jss';
import { EMPTY_SHIP, Ship } from 'components/Board/types';

const useStyles = createUseStyles({
  row: {
    alignItems: 'flex-end',
    display: 'flex',
    justifyContent: 'space-between'
  },
  select: {
    borderRadius: '3px',
    color: '#FFFFFF',
    cursor: 'pointer',
    fontSize: '24px',
    fontWeight: 700,
    letterSpacing: '3.6px',
    margin: '46px 0 0 auto',
    padding: '5px 15px',
    textAlign: 'center',
    width: '120px'
  },
  ships: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginTop: '18px'
  },
  space: {
    background: '#EBEBEB',
    borderRadius: '3px',
    height: '46px',
    width: '46px'
  },
  spaces: {
    display: 'flex',
    gap: '7px',
    marginTop: '9px'
  },
  startButton: {
    borderRadius: '3px',
    color: '#FFFFFF',
    fontSize: '24px',
    fontWeight: 700,
    letterSpacing: '3.6px',
    margin: '46px auto 0 auto',
    padding: '5px 15px',
    width: 'fit-content'
  }
});

type ShipSelectionProps = {
  allPlaced: boolean; // all ships are place or not
  placedShips: Ship[]; // array of all placed ships
  removeShip: (ship: Ship) => void; // remove ship from board
  selectShip: (ship: Ship) => void; // select ship to place
  selectedShip: Ship; // ship selected for placement
  ships: Ship[]; // array of all ships
  startGame: () => void; // function to start game if all are placed
};

export default function ShipSelection({
  allPlaced,
  placedShips,
  removeShip,
  selectShip,
  selectedShip,
  ships,
  startGame
}: ShipSelectionProps): JSX.Element {
  const styles = useStyles();

  /**
   * Remove ship from board and set selected ship to empty ship
   *
   * @param {Ship} ship - ship selected for removal
   */
  const handleRemove = (ship: Ship) => {
    removeShip(ship);
    selectShip(EMPTY_SHIP);
  };

  /**
   * Set selected ship from menu on lefthand side of screen
   *
   * @param {Ship} ship - ship selected from menu
   */
  const handleSelect = (ship: Ship) => {
    // If selected ship is clicked again then remove it from active selection
    if (ship.name === selectShip.name) {
      selectShip(EMPTY_SHIP);
    } else {
      selectShip(ship);
    }
  };

  /**
   * Checks to see whether a ship has been placed on the board already
   *
   * @param {Ship} ship - ship being checked for placement
   * @returns {Ship | undefined} - ship if found and undefined if not
   */
  const isPlaced = (ship: Ship) => {
    return placedShips.find((placedShip) => placedShip.name === ship.name);
  };

  return (
    <div>
      <div className={styles.ships}>
        {ships.map((ship) => {
          const placed = isPlaced(ship);
          return (
            <div className={styles.row} key={ship.name}>
              <div>
                <img alt="Ship" src={ship.image} />
                <div className={styles.spaces}>
                  {new Array(ship.length).fill('').map((_, index) => (
                    <div
                      className={styles.space}
                      key={`${ship.name}-${index}`}
                    />
                  ))}
                </div>
              </div>
              <div
                className={styles.select}
                // If ship has already been placed then remove on click
                onClick={() =>
                  placed ? handleRemove(ship) : handleSelect(ship)
                }
                style={{
                  backgroundColor: placed
                    ? '#FF0055'
                    : ship.name === selectedShip.name
                    ? '#C7C7C7'
                    : '#2861E9'
                }}
              >
                {placed
                  ? 'Remove'
                  : ship.name === selectedShip.name
                  ? 'Selected'
                  : 'Select'}
              </div>
            </div>
          );
        })}
      </div>
      <div
        className={styles.startButton}
        // Only allow game to start if all ships are placed
        onClick={() => allPlaced && startGame()}
        style={{
          background: allPlaced ? '#2861E9' : '#C7C7C7',
          cursor: allPlaced ? 'pointer' : 'not-allowed'
        }}
      >
        START GAME
      </div>
    </div>
  );
}
