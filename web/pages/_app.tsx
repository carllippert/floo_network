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
  configureChains,
  createClient,
  WagmiConfig,
} from "wagmi";

import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { APP_NAME } from "../utils/consts";
import { AppContextProvider } from "../context/appContext";

function MyApp({ Component, pageProps }: AppProps) {
  
  const { chains, provider } = configureChains(
    [chain.foundry, chain.rinkeby, chain.mainnet],
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
