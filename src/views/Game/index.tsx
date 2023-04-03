import { useEffect, useMemo, useState } from 'react';
import { createUseStyles } from 'react-jss';
import Board from 'components/Board';
import { Ship } from 'components/Board/types';
import MainLayout from 'layouts/MainLayout';
import OpponentBoard from 'components/Board/OpponentBoard';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RootLocation } from 'Locations';
// import { useGame } from 'hooks/useGame';
import GameSkeleton from './components/GameSkeleton';
// import { playingGame, ITx, transaction, leaveGame } from 'web3/battleshipGame';
import eth from 'images/eth.svg';
// import { IMetaTx, metatransaction } from 'web3/erc2771';
import { Shot } from './types';
import { toast } from 'react-hot-toast';
import GameOver from './components/GameOver';
import { delay } from 'utils';
import { GameStatus } from 'utils/constants';

const useStyles = createUseStyles({
  content: {
    display: 'flex',
    gap: '114px',
    marginInline: 'auto',
    width: 'fit-content',
  },
  eth: {
    height: '28px',
    width: '28px',
  },
  fleetLabel: {
    alignItems: 'center',
    borderRadius: '3px',
    color: '#FFFFFF',
    display: 'flex',
    fontSize: '24px',
    fontWeight: 700,
    gap: '16px',
    justifyContent: 'center',
    lineHeight: '34.68px',
    paddingBlock: '2px',
  },
  waitingForOpponent: {
    alignItems: 'center',
    display: 'flex',
    fontSize: '24px',
    fontWeight: 700,
    height: '523px',
    justifyContent: 'center',
    lineHeight: '34.68px',
  },
});

export default function Game(): JSX.Element {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const styles = useStyles();
  const navigate = useNavigate();
  // const { address, chainId, provider, biconomy } = useWallet();
  // Display GameOver component if over
  const [gameOver, setGameOver] = useState({ over: false, winner: '' });
  const [opponentShots, setOpponentShots] = useState<Shot[]>([]);
  const [placedShips, setPlacedShips] = useState<Ship[]>([]);
  const [yourShots, setYourShots] = useState<Shot[]>([]);
  // const { fetching, game, refreshCount } = useGame(id ?? '');

  /**
   * Function to leave the game early. If there is not an adversary then this is simply an exit.
   * If adversary is in game then the leave is treated as a forfeit with the adversary being treated
   * as the winner
   *
   * @returns {null} - return null if initial if-statement is validated
   */
  // const onLeave = async () => {
  //   if (!chainId || !id || game.status === GameStatus.Over || !provider) return;
  //   // Game status started means that only one player is in game
  //   const action =
  //     game.status === GameStatus.Started ? 'Leaving' : 'Forfeiting';
  //   let loadingToast = '';
  //   try {
  //     loadingToast = toast.loading(`${action} game ${id}...`);
  //     const tx = await leaveGame(chainId, provider, Number(id));
  //     await tx.wait();
  //     const completedAction =
  //       game.status === GameStatus.Started ? 'Left' : 'Forfeited';
  //     toast.success(`${completedAction} game ${id}`, { id: loadingToast });
  //     await delay(3000);
  //     // Go to home location after leaving game
  //     navigate(RootLocation);
  //   } catch (err) {
  //     toast.error(`Error ${action} game`, { id: loadingToast });
  //   }
  // };

  /**
   *
   * @param {number[][]} board - 2d array representing ships and their placement on the bord
   * @param {number[]} shot - array containing x and y coordinate of a shot
   * @param {boolean} hit - whether shot has hit a ship or not
   * @returns {Promise} - a promise containing the board hash and the proof
   */
  // const shotProof = async (
  //   board: number[][],
  //   shot: number[],
  //   hit: boolean
  // ): Promise<{ hash: string; proof: Buffer }> => {
  //   // Generate Pedersen hash of ships on board
  //   const _shipHash = await createShipHash(board);
  //   const abi = {
  //     hash: _shipHash,
  //     hit: hit ? 1 : 0,
  //     // Flatten board to 1D array
  //     ships: board.flat(),
  //     shot,
  //   };
  //   // Generate shot proof
  //   const proof = await generateProof('shot', abi);
  //   // TODO: Add in window verification
  //   return { hash: _shipHash, proof };
  // };

  /**
   * Convert ships and shot to formate friendly for proof generation
   *
   * @param {number[]} shotCoords - x and y coordinates of the shot
   * @param {boolean} hit - whether or not the shot has hit a ship
   * @returns {Buffer} - Noir proof
   */
  // const prepareShotProof = async (shotCoords: number[], hit: boolean) => {
  //   const board: number[][] = [];
  //   placedShips.forEach((ship: Ship) => {
  //     const x = ship.sections[0] % 10;
  //     const y = Math.floor(ship.sections[0] / 10);
  //     const z = ship.orientation === 'x' ? 0 : 1;
  //     board.push([x, y, z]);
  //   });
  //   const { proof } = await shotProof(
  //     board,
  //     [shotCoords[0], shotCoords[1]],
  //     hit
  //   );
  //   return proof;
  // };

  /**
   * Checks to see whether logged in user is in the request game
   *
   * @returns {bool} - if response id equals game id
   */
  // const playing = async () => {
  //   if (!address || !chainId || !provider) return;
  //   const res = await playingGame(chainId, provider, address);
  //   return `${res}` === id;
  // };

  /**
   * Restore the latest board state by loading in ship positions from local storage and shot
   * data from subgraph
   *
   * @returns {null} - Exits function if game has not been fetched
   */
  // const restoreBoardState = () => {
  //   if (!game) return;
  //   // Check if chain state has been updated
  //   const update = shouldUpdateShots();
  //   if (update) {
  //     const storedBoard = localStorage.getItem(`BOARD_STATE_${id}_${address}`);
  //     if (storedBoard) {
  //       setPlacedShips(JSON.parse(storedBoard));
  //     }
  //     const evenShots = game.shots
  //       .filter((_shot: Shot, index: number) => index % 2 === 0)
  //       .map((shot: Shot) => ({
  //         hit: shot.hit,
  //         turn: +shot.turn,
  //         x: +shot.x,
  //         y: +shot.y,
  //       }));
  //     const oddShots = game.shots
  //       .filter((_shot: Shot, index: number) => index % 2 === 1)
  //       .map((shot: Shot) => ({
  //         hit: shot.hit,
  //         turn: +shot.turn,
  //         x: +shot.x,
  //         y: +shot.y,
  //       }));
  //     // If game was started by logged in user then even shots are theirs, else opponents
  //     if (game.startedBy === address) {
  //       setOpponentShots(oddShots);
  //       setYourShots(evenShots);
  //     } else {
  //       setOpponentShots(evenShots);
  //       setYourShots(oddShots);
  //     }
  //   }
  // };

  /**
   * Memoized value to render board once an opponent has joined
   */
  // const showOpponentBoard = useMemo(() => {
  //   if (!address || !game) return false;
  //   return (
  //     (game.startedBy === address && game.joinedBy) ||
  //     game.startedBy !== address
  //   );
  // }, [address, game]);

  /**
   * Wrapper for smart contract function to take shot
   *
   * @param { Shot } shot - Shot with coordinate, turn number, and hit confirmation
   * @returns {null} - function exits if chainId or eth provider are undefined
   */
  // const takeShot = async (shot: Shot) => {
  //   if (!chainId || !provider) return;
  //   setYourShots((prev) => [...prev, shot].sort((a, b) => b.turn - a.turn));
  //   let loadingToast = '';
  //   try {
  //     // Check if shot is first shot of game
  //     const first = !opponentShots.length && !yourShots.length;
  //     // If shot is first shot then no proof is generated as hit needs to be reported by
  //     // adversary
  //     if (first) {
  //       loadingToast = toast.loading('Firing shot...');
  //       const params = [+game.id, [shot.x, shot.y]];
  //       // If biconomy is enabled then trigger meta transaction
  //       if (biconomy) {
  //         const metatx: IMetaTx = {
  //           provider,
  //           biconomy,
  //           functionName: 'firstTurn',
  //           args: params,
  //         };
  //         await metatransaction(metatx);
  //       } else {
  //         const tx: ITx = {
  //           provider,
  //           functionName: 'firstTurn',
  //           args: params,
  //         };
  //         await transaction(tx);
  //       }
  //     } else {
  //       loadingToast = toast.loading('Generating shot proof...');
  //       // Last shot is reported into shot proof
  //       const lastShot = opponentShots[opponentShots.length - 1];
  //       // Check if shot coordinates correspond to one of user's ship
  //       const hit = !!wasHit(lastShot.x + lastShot.y * 10);
  //       const proof = await prepareShotProof([lastShot.x, lastShot.y], hit);
  //       toast.loading('Firing shot...', { id: loadingToast });
  //       const params = [+game.id, hit, [shot.x, shot.y], proof];
  //       // If biconomy is enabled then trigger meta transaction
  //       if (biconomy) {
  //         const metatx: IMetaTx = {
  //           provider,
  //           biconomy,
  //           functionName: 'turn',
  //           args: params,
  //         };
  //         await metatransaction(metatx);
  //       } else {
  //         const tx: ITx = {
  //           provider,
  //           functionName: 'turn',
  //           args: params,
  //         };
  //         await transaction(tx);
  //       }
  //     }
  //     toast.success('Shot fired', { id: loadingToast });
  //   } catch (err) {
  //     console.log('Err: ', err);
  //     toast.error('Error firing shot', { id: loadingToast });
  //     // Reset shots rendered on opponent board
  //     setYourShots((prev) => prev.filter((prevShot) => prevShot !== shot));
  //   }
  // };

  /**
   * Memoized value of total turns in a game
   */
  // const totalTurns = useMemo(() => {
  //   return opponentShots.length + yourShots.length;
  // }, [opponentShots, yourShots]);

  /**
   *
   * @param {number} tile - tile coordinate calculated from x and y
   * @returns
   */
  // const wasHit = (tile: number) => {
  //   return placedShips.find((ship) => ship.sections.includes(tile));
  // };

  /**
   * Function to check whether the board state should be re-rendered on UI. Checks if no prior shots
   * or if new shot length from subgraph is greater than existing shots in state variables
   *
   * @returns {boolean} - whether board should be updated
   */
  // const shouldUpdateShots = () => {
  //   const newShotLength = game.shots.length;
  //   const oldShotLength = opponentShots.length + yourShots.length;
  //   return !oldShotLength || newShotLength > oldShotLength;
  // };

  /**
   * Memoized value to determine if turn is yours or not
   */
  // const yourTurn = useMemo(() => {
  //   if (!game) return false;
  //   const totalShots = totalTurns;
  //   return game.startedBy === address
  //     ? totalShots % 2 === 0
  //     : totalShots % 2 === 1;
  // }, [address, game, totalTurns]);

  // useEffect(() => {
  //   (async () => {
  //     if (!fetching) {
  //       if (game) {
  //         const historic = game.status === 'OVER';
  //         // Check is user is in game
  //         const inGame = await playing();
  //         // Kick user to home if not in game
  //         if (!historic && !inGame) {
  //           navigate(RootLocation);
  //           // If game is historic and user is in game then show "GameOver" compoenent
  //         } else if (historic && inGame) {
  //           setGameOver({ over: true, winner: game.winner });
  //         } else {
  //           restoreBoardState();
  //         }
  //       } else {
  //         navigate(RootLocation);
  //       }
  //     }
  //   })();
  //   // eslint-disable-next-line
  // }, [address, fetching, game, id, navigate]);
  return (
    <MainLayout>
      {true ? (
        <GameSkeleton />
      ) : gameOver.over ? (
        // <GameOver winner={gameOver.winner === address} />
        <></>
      ) : (
        <div>
          <div className={styles.content}>
            <div style={{ width: '523px' }}>
              <div
                className={styles.fleetLabel}
                style={{ background: '#717C96' }}
              >
                OPPONENT
                {/* {!yourTurn && (
                  <img alt='Eth' className={styles.eth} src={eth} />
                )} */}
              </div>
              {/* {showOpponentBoard ? ( */}
              {true ? (
                // <OpponentBoard
                //   shots={yourShots}
                //   takeShot={takeShot}
                //   totalTurns={totalTurns}
                //   yourTurn={yourTurn}
                // />
                <></>
              ) : (
                <div className={styles.waitingForOpponent}>
                  WAITING FOR OPPONENT
                </div>
              )}
            </div>
            <div style={{ width: '523px' }}>
              <div
                className={styles.fleetLabel}
                style={{ background: '#FF0055' }}
              >
                YOUR FLEET
                {/* {yourTurn && <img alt='Eth' className={styles.eth} src={eth} />} */}
              </div>
              {/* <Board
                allPlaced={true}
                onLeave={onLeave}
                opponentShots={opponentShots}
                placedShips={placedShips}
                rotationAxis={''}
                selectedShip={{} as Ship}
                setPlacedShip={() => null}
                status={game?.status}
              /> */}
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
