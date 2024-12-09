import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import Main from './views/Main';
import Anywhere from './Anywhere';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Anywhere />
  </React.StrictMode>
);
