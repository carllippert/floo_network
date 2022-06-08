import "../styles/globals.css";
import type { AppProps } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import {
  chain,
  Chain,
  configureChains,
  createClient,
  WagmiConfig,
} from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { APP_NAME } from "../utils/consts";
import { AppContextProvider } from "../context/appContext";

const foundry: Chain & { iconUrl: string } = {
  ...chain.localhost,
  id: 31337,
  name: "Foundry",
  iconUrl:
    "https://pbs.twimg.com/profile_images/1380979602076667904/7NIW3Cyt_400x400.jpg",
};

function MyApp({ Component, pageProps }: AppProps) {
  
  const { chains, provider } = configureChains(
    [foundry, chain.mainnet, chain.rinkeby],
    [alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }), publicProvider()]
  );

  const { connectors } = getDefaultWallets({
    appName: APP_NAME,
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        appInfo={{
          appName: APP_NAME,
        }}
        theme={{
          lightMode: lightTheme(),
          darkMode: darkTheme(),
        }}
        coolMode
      >
        <AppContextProvider>
          <Component {...pageProps} />
        </AppContextProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
