import { hydrateRoot, createRoot } from 'react-dom/client';
import crawlerUserAgents from './crawlerUserAgents';
import './scss/app.scss';
import init from './init';

const app = async () => {
  const container = document.getElementById('root') as HTMLElement;

  if (container.hasChildNodes() && crawlerUserAgents.includes(window.navigator.userAgent)) {
    hydrateRoot(container, await init());
  } else {
    const root = createRoot(container);
    root.render(await init());
  }
};

app();
