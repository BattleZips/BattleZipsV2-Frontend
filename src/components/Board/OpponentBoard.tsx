import { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { ReactComponent as HitIcon } from './images/hit.svg';
import { ReactComponent as MissIcon } from './images/miss.svg';
import { ReactComponent as PendingShot } from './images/pendingShot.svg';
import { ReactComponent as CrosshairIcon } from './images/crosshair.svg';
import { Shot } from 'views/Game/types';

const useStyles = createUseStyles({
  board: {
    marginTop: '25px'
  },
  crossHair: {
    stroke: '#FF0055',
    width: '100%'
  },
  fire: {
    borderRadius: '3px',
    color: '#FFFFFF',
    fontSize: '24px',
    fontWeight: 700,
    letterSpacing: '3.6px',
    margin: '46px auto 0 auto',
    padding: '5px 15px',
    width: 'fit-content'
  },
  label: {
    alignItems: 'center',
    color: '#9CA3B6',
    display: 'flex',
    fontSize: '24px',
    fontWeight: 700,
    justifyContent: 'center',
    lineHeight: '34.68px',
    width: '46px'
  },
  row: {
    alignItems: 'center',
    display: 'flex',
    gap: '7px',
    marginTop: '7px'
  },
  tile: {
    alignItems: 'center',
    background: '#EBEBEB',
    borderRadius: '3px',
    cursor: 'crosshair',
    display: 'flex',
    height: '46px',
    justifyContent: 'center',
    width: '46px'
  }
});

const BOARD = new Array(10).fill('').map((_) => new Array(10).fill(''));

type OpponentBoardProps = {
  shots: Shot[]; // your shots
  takeShot: (shot: Shot) => void; // take shot at opponent
  totalTurns: number; // total turns in game
  yourTurn: boolean; // whether or not turn is yours
};

/**
 * Renders opponent board and provides related functionality to playing game (hover effect, shot selection, etc.)
 */
export default function OpponentBoard({
  shots,
  takeShot,
  totalTurns,
  yourTurn
}: OpponentBoardProps): JSX.Element {
  const styles = useStyles();
  const [hoveredTile, setHoveredTile] = useState(-1); // tile mouse is hovering over
  const [selectedTile, setSelectedTile] = useState(-1); // tile that has been clicked

  /**
   * Take shot at tile that has been clicked. Unselect tile afterward
   */
  const handleShot = () => {
    const x = selectedTile % 10;
    const y = Math.floor(selectedTile / 10);
    // Increment turn nonce
    const turn = totalTurns + 1;
    takeShot({ x, y, turn });
    setSelectedTile(-1);
  };

  return (
    <div>
      <div className={styles.board}>
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
                // If tile was shot then render shot icon
                const wasShot = shots.find(
                  (shot) => shot.x + shot.y * 10 === index
                );
                return (
                  <div
                    className={styles.tile}
                    key={index}
                    // Only allow tile selection on your turn
                    onClick={() =>
                      yourTurn && !wasShot && setSelectedTile(index)
                    }
                    // Only show hover option on your turn
                    onMouseOver={() => yourTurn && setHoveredTile(index)}
                    onMouseLeave={() => setHoveredTile(-1)}
                  >
                    {wasShot &&
                      // Show pending shot until adversary report
                      (wasShot.hit === null || wasShot.hit === undefined ? (
                        <PendingShot />
                      ) : wasShot.hit ? (
                        <HitIcon />
                      ) : (
                        <MissIcon />
                      ))}
                    {}
                    {index === selectedTile && (
                      <CrosshairIcon className={styles.crossHair} />
                    )}
                    {/* Show lighter crosshair if simply hovered over and not selected */}
                    {!wasShot &&
                      index === hoveredTile &&
                      index !== selectedTile &&
                      yourTurn && (
                        <CrosshairIcon
                          className={styles.crossHair}
                          style={{ opacity: 0.6 }}
                        />
                      )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div
        className={styles.fire}
        onClick={() => yourTurn && selectedTile >= 0 && handleShot()}
        style={{
          background: yourTurn && selectedTile >= 0 ? '#FF0055' : '#C7C7C7',
          cursor: yourTurn && selectedTile >= 0 ? 'pointer' : 'not-allowed'
        }}
      >
        {selectedTile >= 0 ? 'FIRE' : 'SELECT POSITION'}
      </div>
    </div>
  );
}
