import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { configureChains, createClient, mainnet } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import Routes from 'Routes';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { WagmiConfig } from 'wagmi';

function App() {
  const { chains, provider } = configureChains([mainnet], [publicProvider()]);

  const client = createClient({
    autoConnect: true,
    connectors: [new MetaMaskConnector({ chains })],
    provider,
  });

  return (
    <WagmiConfig client={client}>
      <BrowserRouter>
        <Toaster position='top-left' />
        <Routes />
      </BrowserRouter>
    </WagmiConfig>
  );
}

export default App;
