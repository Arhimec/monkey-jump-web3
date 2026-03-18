import { createRoot } from 'react-dom/client';
import { initApp } from '@multiversx/sdk-dapp/out/methods/initApp/initApp';
import { EnvironmentsEnum } from '@multiversx/sdk-dapp/out/types/enums.types';
import { App } from './App';
import './index.css';

initApp({
  storage: { getStorageCallback: () => sessionStorage },
  dAppConfig: {
    environment: EnvironmentsEnum.mainnet,
    nativeAuth: { expirySeconds: 86400 },
    walletConnectV2ProjectId: 'fd3049c565c6078ab9dff1e313ee7eef',
  },
}).then(() => {
  createRoot(document.getElementById('root')!).render(<App />);
});
