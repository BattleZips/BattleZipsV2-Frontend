import { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useNavigate } from 'react-router-dom';
import {
  ActiveGameLocation,
  JoinGameLocation,
  NewGameLocation,
} from 'Locations';
import MainLayout from 'layouts/MainLayout';
import { useMemo } from 'react';
import { Game } from './types';
import GameList from './components/GameList';
import { getRandomInt } from 'utils';
import {
  generateBoardProof,
  generateShotProof,
  verifyBoardProof,
  verifyShotProof,
} from 'zk/wasmTest';
import toast from 'react-hot-toast';

const useStyles = createUseStyles({
  content: {
    display: 'flex',
    gap: '200px',
    marginInline: 'auto',
    width: 'fit-content',
  },
  gameOption: {
    alignItems: 'center',
    display: 'flex',
    gap: '49px',
    marginInline: 'auto',
    textAlign: 'left',
    width: '387px',
  },
  gameOptions: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '24px',
    fontWeight: 400,
    gap: '36px',
    letterSpacing: '3.6px',
    lineHeight: '34.68px',
    marginTop: '221px',
  },
  isInGame: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    fontSize: '48px',
    fontWeight: 700,
    height: '400px',
    justifyContent: 'center',
    letterSpacing: '3.6px',
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    width: '551px',
  },
  proofContainer: {
    alignItems: 'center',
    display: 'flex',
    gap: '150px',
  },
  rejoin: {
    background: '#FF0055',
    borderRadius: '3px',
    color: '#FFFFFF',
    cursor: 'pointer',
    fontSize: '24px',
    fontWeight: 700,
    letterSpacing: '3.6px',
    lineHeight: '34.68px',
    margin: '48px auto 0 auto',
    padding: '6px 12px',
    textAlign: 'center',
  },
  right: {
    width: '523px',
  },
  sectionHead: {
    borderRadius: '3px',
    color: '#FFFFFF',
    fontSize: '24px',
    fontWeight: 700,
    letterSpacing: '3.6px',
    lineHeight: '34.68px',
    paddingBlock: '2px',
    textAlign: 'center',
  },
  select: {
    alignItems: 'center',
    border: '4px solid #717C96',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    height: '28px',
    justifyContent: 'center',
    width: '28px',
  },
  selected: {
    background: '#000000',
    borderRadius: '50%',
    height: '20px',
    width: '20px',
  },
  startButton: {
    borderRadius: '3px',
    color: '#FFFFFF',
    fontSize: '24px',
    fontWeight: 700,
    letterSpacing: '3.6px',
    lineHeight: '34.68px',
    margin: '239px auto 0 auto',
    paddingBlock: '2px',
    textAlign: 'center',
    width: '245px',
  },
});

// Options for how to proceed with game
const GAME_OPTIONS = ['HOST GAME', 'JOIN GAME', 'JOIN RANDOM GAME'];

export default function Home(): JSX.Element {
  // const { address, chainId, provider } = useWallet();
  const navigate = useNavigate();
  const styles = useStyles();
  const [activeGame] = useState(0); // if user is already in active game or not
  const [boardProof, setBoardProof] = useState(null);
  const [gameOption, setGameOption] = useState(0); // host (create) / join / join random
  const [generatingBoardProof, setGeneratingBoardProof] = useState(false);
  const [generatingShotProof, setGeneratingShotProof] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null); // selected game from active list
  const [shotProof, setShotProof] = useState(null);
  const [verifyingBoardProof, setVerifyingBoardProof] = useState(false);
  const [verifyingShotProof, setVerifyingShotProof] = useState(false);

  const games: any[] = [];

  /**
   * Determine when to enable button at button for next stage of game process
   */
  const disabled = useMemo(() => {
    return (
      (gameOption === 1 && !selectedGame) ||
      (gameOption === 2 && !games?.length)
    );
  }, [games, gameOption, selectedGame]);

  /**
   * Check whether user is currently in game
   *
   * @returns {null} - exit if address, chainId, or eth provider are undefined
   */
  // const playing = async () => {
  //   if (!address || !chainId || !provider) return;
  //   const playing = Number(await playingGame(chainId, provider, address));
  //   setActiveGame(playing || -1);
  // };

  /**
   * Select option from game menu
   *
   * @param {number} option - host (create), join, or join random
   * @returns {null} - exit if option is already selected and clicked again
   */
  const handleOptionSelected = (option: number) => {
    if (option === gameOption) return;
    else {
      setGameOption(option);
      setSelectedGame(null);
    }
  };

  /**
   * Continue to next step of game based on option selected
   */
  const startGame = () => {
    switch (gameOption) {
      // if first option is selected then go to new game location
      case 0: {
        navigate(NewGameLocation);
        break;
      }
      // if game is selected from list proceed to place ships and join
      case 1: {
        if (!games || !selectedGame) break;
        navigate(JoinGameLocation(`${selectedGame.id}`));
        break;
      }
      // choose random game from list
      case 2: {
        if (!games) break;
        const randomIndex = getRandomInt(0, games.length - 1);
        navigate(JoinGameLocation(`${games[randomIndex].id}`));
        break;
      }
    }
  };

  const makeBoardProof = async () => {
    setGeneratingBoardProof(true);
    setBoardProof(await generateBoardProof());
    setGeneratingBoardProof(false);
  };

  const makeShotProof = async () => {
    setGeneratingShotProof(true);
    setShotProof(await generateShotProof());
    setGeneratingShotProof(false);
  };

  return (
    <MainLayout>
      {/* {fetching && !refreshCount ? ( */}
      {true ? (
        // <HomeSkeleton />
        <div className={styles.proofContainer}>
          <div>
            <button onClick={() => makeBoardProof()}>
              {generatingBoardProof ? 'Running Board WASM' : 'Run Board WASM'}
            </button>
            {boardProof && (
              <button
                onClick={async () => {
                  setVerifyingBoardProof(true);
                  const verified = await verifyBoardProof(boardProof);
                  if (verified) {
                    toast.success('Shot proof verified');
                  } else {
                    toast.error('Failed to verify shot proof');
                  }
                  setVerifyingBoardProof(false);
                }}
                style={{ display: 'block', marginTop: '32px' }}
              >
                {verifyingBoardProof
                  ? 'Verifying Board Proof'
                  : 'Verify Board Proof'}
              </button>
            )}
          </div>
          <div>
            <button onClick={() => makeShotProof()}>
              {generatingShotProof ? 'Running Shot WASM' : 'Run Shot WASM'}
            </button>
            {shotProof && (
              <button
                onClick={async () => {
                  setVerifyingShotProof(true);
                  const verified = await verifyShotProof(shotProof);
                  if (verified) {
                    toast.success('Shot proof verified');
                  } else {
                    toast.error('Failed to verify shot proof');
                  }
                  setVerifyingShotProof(false);
                }}
                style={{ display: 'block', marginTop: '32px' }}
              >
                {verifyingShotProof
                  ? 'Verifying Shot Proof'
                  : 'Verify Shot Proof'}
              </button>
            )}
          </div>
        </div>
      ) : // Render rejoin button is player already in game
      activeGame > 0 ? (
        <div className={styles.isInGame}>
          <div>YOU ARE ALREADY IN A GAME</div>
          <div
            className={styles.rejoin}
            // Navigate back to active game
            onClick={() => navigate(ActiveGameLocation(`${activeGame}`))}
          >
            REJOIN
          </div>
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.left}>
            <div
              className={styles.sectionHead}
              style={{ background: '#FF0055' }}
            >
              PLAY GAME
            </div>
            <div className={styles.gameOptions}>
              {GAME_OPTIONS.map((option, index) => (
                <div className={styles.gameOption} key={option}>
                  <div
                    className={styles.select}
                    onClick={() => handleOptionSelected(index)}
                  >
                    {index === gameOption && (
                      <div className={styles.selected} />
                    )}
                  </div>
                  <div>{option}</div>
                </div>
              ))}
            </div>
            <div
              className={styles.startButton}
              onClick={() => startGame()}
              style={{
                background: disabled ? '#C7C7C7' : '#2861E9',
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}
            >
              START GAME
            </div>
          </div>
          <div className={styles.right}>
            <div
              className={styles.sectionHead}
              style={{ background: '#717C96' }}
            >
              OPEN GAMES
            </div>

            <GameList
              games={games ?? []}
              gameOption={gameOption}
              selectedGame={selectedGame}
              setSelectedGame={setSelectedGame}
            />
          </div>
        </div>
      )}
    </MainLayout>
  );
}
