/**
 * Ponto de entrada da aplicação React.
 *
 * Inicializa React, Router e Providers.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

import { ProvedorProgresso, ProvedorBadges, ProvedorQuiz } from './contextos';

const elementoRaiz = document.getElementById('root');

if (!elementoRaiz) {
  throw new Error("Elemento root não encontrado no DOM");
}

const raiz = ReactDOM.createRoot(elementoRaiz);

raiz.render(
  <React.StrictMode>
    <BrowserRouter>
      <ProvedorProgresso>
        <ProvedorBadges>
          <ProvedorQuiz>
            <App />
          </ProvedorQuiz>
        </ProvedorBadges>
      </ProvedorProgresso>
    </BrowserRouter>
  </React.StrictMode>
);
