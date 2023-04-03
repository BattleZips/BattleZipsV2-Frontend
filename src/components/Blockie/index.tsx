import makeBlockie from 'ethereum-blockies-base64';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  blockie: {
    borderRadius: '50%',
    height: '33px',
    width: '33px'
  }
});

type BlockieProps = {
  address: string; // Ethereum address
};

/**
 * This component utilizes the "ethereum-blockies-base64" library to auto generate images based on
 * an arbitrary ethereum address
 */
export default function Blockie({ address }: BlockieProps): JSX.Element {
  const styles = useStyles();
  return (
    <img alt={address} className={styles.blockie} src={makeBlockie(address)} />
  );
}
