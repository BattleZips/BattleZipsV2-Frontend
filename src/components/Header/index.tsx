import Blockie from 'components/Blockie';
import metamask from 'images/metamask.png';
import { createUseStyles } from 'react-jss';
import headerLogo from './images/headerLogo.svg';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { formatAddress } from 'utils';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsName,
  useNetwork,
} from 'wagmi';
import { ConnectorData, watchAccount } from '@wagmi/core';

const useStyles = createUseStyles({
  container: {
    alignItems: 'center',
    background: '#F5F5F5',
    display: 'flex',
    height: '122px',
    justifyContent: 'space-between',
    left: 0,
    paddingInline: '54px',
    position: 'fixed',
    top: 0,
    width: 'calc(100% - 108px)',
    zIndex: 10,
  },
  docs: {
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 600,
  },
  faucet: {
    color: 'inherit',
    fontWeight: 600,
    textDecoration: 'none',
  },
  imageContainer: {
    alignItems: 'center',
    display: 'flex',
    gap: '16px',
  },
  left: {
    alignItems: 'center',
    display: 'flex',
    gap: '19px',
  },
  link: {
    color: '#3590FF',
    textDecoration: 'none',
  },
  loginButton: {
    alignItems: 'center',
    background: '#FFFFFF',
    border: '1px solid #D1D2DE',
    borderRadius: '80px',
    color: '#9CA3B6',
    cursor: 'pointer',
    display: 'flex',
    gap: '8px',
    letterSpacing: '2.1px',
    padding: '8px 12px',
  },
  logo: {
    heigth: '86px',
    width: '75px',
  },
  logoText: {
    fontSize: '36px',
    fontWeight: 700,
    letterSpacing: '5.4px',
    lineHieght: '52px',
  },
  metamask: {
    height: '35px',
    width: '35px',
  },
  right: {
    alignItems: 'center',
    display: 'flex',
    gap: '16px',
  },
  separator: {
    background: '#D1D2DE',
    height: '44px',
    width: '1px',
  },
});

/**
 * Header component displays logo as well as provides the login / logout functionality for the app.
 */
export default function Header(): JSX.Element {
  const styles = useStyles();
  const { address, connector, isConnected, isConnecting } = useAccount();
  const { connect, connectors, error } = useConnect({ chainId: 1 });
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { chain } = useNetwork();

  // Disconnect is switched chain is not mainnet
  useEffect(() => {
    if (chain?.id !== 1) {
      disconnect();
    }
  }, [chain]);

  // Disconnect on account change
  useEffect(() => {
    const handleAccountChange = ({ account }: ConnectorData) => {
      if (account) {
        disconnect();
      }
    };

    if (connector) {
      connector.on('change', handleAccountChange);
    }
    return () => {
      if (connector) {
        connector.off('change', handleAccountChange);
      }
    };
  }, [connector]);

  // If Metamask is not found then open toast with installation guide
  useEffect(() => {
    if (!error) return;
    if (error.name === 'ConnectorNotFoundError') {
      toast(
        () => (
          <div>
            Metamask is not installed on your device. Click{' '}
            <a
              className={styles.link}
              href='https://metamask.io/download/'
              rel='noreferrer'
              target='_blank'
            >
              here
            </a>{' '}
            for installation guide
          </div>
        ),
        {
          icon: (
            <img alt='Metamask' className={styles.metamask} src={metamask} />
          ),
          style: { border: '2px solid #FF2828' },
        }
      );
    }
  }, [error]);

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.imageContainer}>
          <img alt='Logo' className={styles.logo} src={headerLogo} />
        </div>
        <div className={styles.separator} />
        <div className={styles.logoText}>BATTLEZIPS V2</div>
      </div>
      <div className={styles.right}>
        <button
          className={styles.loginButton}
          onClick={() =>
            !isConnecting &&
            (!isConnected
              ? connect({ connector: connectors[0] })
              : disconnect())
          }
        >
          {address && <Blockie address={address} />}
          <div>
            {isConnected
              ? formatAddress(address, ensName)
              : isConnecting
              ? 'Connecting...'
              : 'Connect'}
          </div>
        </button>
      </div>
    </div>
  );
}
