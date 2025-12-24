/**
 * Ponto de entrada da aplicação React.
 * 
 * Este arquivo inicializa o React e monta o componente App no DOM.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Importa os provedores de contexto
import { ProvedorProgresso, ProvedorBadges, ProvedorQuiz } from './contextos';

const elementoRaiz = document.getElementById('root');

if (!elementoRaiz) {
  throw new Error("Elemento root não encontrado no DOM");
}

const raiz = ReactDOM.createRoot(elementoRaiz);

/**
 * A ordem dos provedores importa:
 * - ProvedorProgresso: Base (gerencia estado de navegação)
 * - ProvedorBadges: Depende do progresso para verificar conquistas
 * - ProvedorQuiz: Depende do progresso para registrar pontuações
 */
raiz.render(
  <React.StrictMode>
    <ProvedorProgresso>
      <ProvedorBadges>
        <ProvedorQuiz>
          <App />
        </ProvedorQuiz>
      </ProvedorBadges>
    </ProvedorProgresso>
  </React.StrictMode>
);
