import ReactDOM from 'react-dom/client';
import './scss/app.scss';
import init from './init';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(await init());
