import { ReactNode, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import Header from 'components/Header';
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
import { error } from 'console';

const useStyles = createUseStyles({
  projectContainer: {
    height: '100vh',
    overflow: 'scroll',
  },
  connectWallet: {
    alignItems: 'center',
    display: 'flex',
    fontSize: '64px',
    fontWeight: 700,
    justifyContent: 'center',
    letterSpacing: '3.6px',
    height: '100%',
  },

  content: {
    transform: 'scale(0.9)',
    marginTop: '122px',
    height: 'calc(100vh - 122px)',
  },
  [`@media (max-height: ${827}px)`]: {
    content: {
      marginTop: '100px',
      transform: 'scale(0.8)',
    },
  },
  [`@media (max-height: ${766}px)`]: {
    content: {
      marginTop: '70px',
      transform: 'scale(0.7)',
    },
  },
  [`@media (max-height: ${676}px)`]: {
    content: {
      marginTop: '50px',
      transform: 'scale(0.6)',
    },
  },
  [`@media (max-height: ${596}px)`]: {
    content: {
      marginTop: '40px',
      transform: 'scale(0.5)',
    },
  },
});

type MainLayoutProps = {
  children: ReactNode;
};

/**
 * Main layout which wraps around all views in the BattleZipsV2 app
 */
export default function MainLayout({ children }: MainLayoutProps): JSX.Element {
  const styles = useStyles();
  const { isConnected, isConnecting } = useAccount();

  return (
    <div className={styles.projectContainer}>
      <Header />
      <div className={styles.content}>
        {isConnected ? (
          children
        ) : (
          <div className={styles.connectWallet}>
            {isConnecting ? 'Connecting Wallet...' : 'Connect Wallet'}
          </div>
        )}
      </div>
    </div>
  );
}
