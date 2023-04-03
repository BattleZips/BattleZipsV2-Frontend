import { useMemo, useState } from 'react';
import { createUseStyles } from 'react-jss';
import Board from 'components/Board';
import { EMPTY_SHIP, Ship } from 'components/Board/types';
import MainLayout from 'layouts/MainLayout';
import ShipSelection from './components/ShipSelection';
import carrier from 'components/Board/images/carrierSelection.svg';
import battleship from 'components/Board/images/battleshipSelection.svg';
import submarine from 'components/Board/images/submarineSelection.svg';
import cruiser from 'components/Board/images/cruiserSelection.svg';
import destroyer from 'components/Board/images/destroyerSelection.svg';
// import { ITx, transaction, getGameIndex } from 'web3/battleshipGame';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { BigNumber as BN } from 'ethers';
// import { IMetaTx, metatransaction } from 'web3/erc2771';
import { ActiveGameLocation } from 'Locations';

const useStyles = createUseStyles({
  content: {
    display: 'flex',
    gap: '114px',
    marginInline: 'auto',
    width: 'fit-content',
  },
  fleetLabel: {
    borderRadius: '3px',
    color: '#FFFFFF',
    fontSize: '24px',
    fontWeight: 700,
    lineHeight: '34.68px',
    paddingBlock: '2px',
    textAlign: 'center',
  },
  wrapper: {
    outline: 'none',
  },
});

const SHIPS: Ship[] = [
  {
    image: carrier,
    name: 'carrier',
    length: 5,
    sections: [],
  },
  {
    image: battleship,
    name: 'battleship',
    length: 4,
    sections: [],
  },
  {
    image: cruiser,
    name: 'cruiser',
    length: 3,
    sections: [],
  },
  {
    image: submarine,
    name: 'submarine',
    length: 3,
    sections: [],
  },
  {
    image: destroyer,
    name: 'destroyer',
    length: 2,
    sections: [],
  },
];

/**
 * View for placing ships prior to creating or joining a game
 */
export default function BuildBoard(): JSX.Element {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id'); // game id
  const styles = useStyles();
  const navigate = useNavigate();
  // const { address, chainId, provider, biconomy } = useWallet();
  const [placedShips, setPlacedShips] = useState<Ship[]>([]); // all placed ships
  const [rotationAxis, setRotationAxis] = useState('y'); // orientation to place ships in
  const [selectedShip, setSelectedShip] = useState<Ship>(EMPTY_SHIP); // currently selected ship

  /**
   * Memoized value to see if all ships have been placed
   */
  const allPlaced = useMemo(() => {
    return placedShips.length === 5;
  }, [placedShips]);

  /**
   * Helper to function to place a ship
   *
   * @param {Ship} ship - selected ship
   */
  const handleShipSelect = (ship: Ship) => {
    // Select ship or set to empty if same ship is selected twice
    setSelectedShip(ship.name === selectedShip.name ? EMPTY_SHIP : ship);
  };

  /**
   * Put selected ship into ship array and place on board
   *
   * @param {Ship} placedShip - selected ship to place
   */
  const handlePlacedShip = (placedShip: Ship) => {
    setPlacedShips((prev) =>
      [...prev, placedShip].sort((a, b) => b.length - a.length)
    );
    setSelectedShip(EMPTY_SHIP);
  };
  /**
   * Removes ship from placed array and then from board
   *
   * @param {Ship} removedShip - ship to be removed from board
   */
  const handleRemoveShip = (removedShip: Ship) => {
    setPlacedShips((prev) =>
      prev.filter((ship) => ship.name !== removedShip.name)
    );
  };

  /**
   * Change orientation for ship placement when spacebar is pressed
   *
   * @param {React.KeyboardEvent} e - React keyboard event
   */
  const handleRotate = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.code === 'Space') {
      setRotationAxis((prev) => (prev === 'x' ? 'y' : 'x'));
    }
  };

  /**
   * Wrapper for generating the Noir board proof
   *
   * @param {number[][]} board - 2D array containing coordinates for placed ships on the board
   * @returns {Promise} - promise containign board hash and Noir proof for board
   */
  // const boardProof = async (
  //   board: number[][]
  // ): Promise<{ hash: string; proof: Buffer }> => {
  //   // Generate Pedersen hash of ships on board
  //   const _shipHash = await createShipHash(board);
  //   const abi = {
  //     hash: _shipHash,
  //     // Convert to 1D array for Noir
  //     ships: board.flat(),
  //   };
  //   const proof = await generateProof('board', abi);
  //   // TODO: Add browser verification
  //   return { hash: _shipHash, proof };
  // };

  /**
   * Wrapper for smart contract function to create game if non-existent, or join game if created
   *
   * @returns {null} - exit if chainId or eth provider are undefined
   */
  // const startGame = async () => {
  //   if (!chainId || !provider) return;
  //   let loadingToast = '';
  //   try {
  //     loadingToast = toast.loading('Generating board proof...');
  //     const board: number[][] = [];
  //     placedShips.forEach((ship: Ship) => {
  //       const x = ship.sections[0] % 10;
  //       const y = Math.floor(ship.sections[0] / 10);
  //       const z = ship.orientation === 'x' ? 0 : 1;
  //       board.push([x, y, z]);
  //     });
  //     // Grab hash of board and Noir proof
  //     const { hash, proof } = await boardProof(board);
  //     // If id exists then game is already created so attempt to join
  //     if (id) {
  //       toast.loading(`Attempting to join game ${id}...`, {
  //         id: loadingToast,
  //       });
  //       const params = [+id, BN.from(hash), proof];
  //       // If biconomy is enabled then trigger meta transaction
  //       if (biconomy) {
  //         const metatx: IMetaTx = {
  //           provider,
  //           biconomy,
  //           functionName: 'joinGame',
  //           args: params,
  //         };
  //         await metatransaction(metatx);
  //       } else {
  //         const tx: ITx = {
  //           provider,
  //           functionName: 'joinGame',
  //           args: params,
  //         };
  //         await transaction(tx);
  //       }
  //       // Set ship placements in local storage for later retrieval
  //       // Format: BOARD_STATE_<unique_game_id>_<user_address>
  //       localStorage.setItem(
  //         `BOARD_STATE_${id}_${address}`,
  //         JSON.stringify(placedShips)
  //       );
  //       toast.remove(loadingToast);
  //       toast.success(`Joined game ${id}`);
  //       // Upon joining game, push to active location
  //       navigate(ActiveGameLocation(id));
  //       // If no id is present then new game is created
  //     } else {
  //       toast.loading(`Creating game...`, { id: loadingToast });
  //       // Base current game index off of current nonce in contract
  //       const currentIndex = await getGameIndex(chainId, provider);
  //       const params = [BN.from(hash), proof];
  //       // If biconomy is enabled then trigger meta transaction
  //       if (biconomy) {
  //         const metatx: IMetaTx = {
  //           provider,
  //           biconomy,
  //           functionName: 'newGame',
  //           args: params,
  //         };
  //         await metatransaction(metatx);
  //       } else {
  //         const tx: ITx = {
  //           provider,
  //           functionName: 'newGame',
  //           args: params,
  //         };
  //         await transaction(tx);
  //       }
  //       // Set ship placements in local storage for later retrieval
  //       // Format: BOARD_STATE_<unique_game_id>_<user_address>
  //       localStorage.setItem(
  //         `BOARD_STATE_${+currentIndex + 1}_${address}`,
  //         JSON.stringify(placedShips)
  //       );
  //       toast.success('Game successfully created.', {
  //         duration: 5000,
  //         id: loadingToast,
  //       });
  //       navigate(ActiveGameLocation(`${+currentIndex + 1}`));
  //     }
  //   } catch (err) {
  //     console.log('ERROR: ', err);
  //     toast.error(id ? 'Error joining game' : 'Error creating game', {
  //       id: loadingToast,
  //       duration: 5000,
  //     });
  //   }
  // };

  return (
    <MainLayout>
      <div
        className={styles.wrapper}
        // Change placement orientation
        onKeyDown={(e) => handleRotate(e)}
        tabIndex={0}
      >
        <div className={styles.content}>
          <div style={{ width: '551px' }}>
            <div
              className={styles.fleetLabel}
              style={{ background: '#717C96' }}
            >
              DEPLOY YOUR FLEET
            </div>
            {/* <ShipSelection
              allPlaced={allPlaced}
              placedShips={placedShips}
              removeShip={handleRemoveShip}
              selectShip={handleShipSelect}
              selectedShip={selectedShip}
              ships={SHIPS}
              startGame={startGame}
            /> */}
          </div>
          <div style={{ width: '523px' }}>
            <div
              className={styles.fleetLabel}
              style={{ background: '#FF0055' }}
            >
              YOUR FLEET
            </div>
            <Board
              allPlaced={allPlaced}
              opponentShots={[]}
              placedShips={placedShips}
              rotationAxis={rotationAxis}
              selectedShip={selectedShip}
              setPlacedShip={handlePlacedShip}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
