import { createRoot } from 'react-dom/client';
import App from './App'
import './index.css'
const domNode = document.getElementById('root');
const root = createRoot(domNode as HTMLElement);

root.render(<App />);
