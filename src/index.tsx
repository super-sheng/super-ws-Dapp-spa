import { createRoot } from 'react-dom/client';
import App from './App'
import './index.css'
import registerServiceWorker from '@utils/service-worker'
const domNode = document.getElementById('root');
const root = createRoot(domNode as HTMLElement);

root.render(<App />);

registerServiceWorker();
