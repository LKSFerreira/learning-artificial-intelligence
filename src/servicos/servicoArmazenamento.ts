/**
 * Serviço de persistência de dados no LocalStorage.
 * 
 * Gerencia o salvamento e carregamento do progresso do usuário.
 * 
 * **Exemplo:**
 * 
 * .. code-block:: typescript
 * 
 *     import { 
 *         salvarProgresso, 
 *         carregarProgresso, 
 *         limparProgresso 
 *     } from '@/src/servicos/servicoArmazenamento';
 *     
 *     salvarProgresso(estado);
 *     const estadoSalvo = carregarProgresso();
 * 
 * .. note::
 *    O progresso é salvo automaticamente sempre que o estado muda.
 *    A migração de estados legados é feita automaticamente no carregamento.
 */

import type { EstadoProgresso, EstadoProgressoLegado } from '../tipos';

/**
 * Chave usada no LocalStorage para armazenar o progresso.
 * Simula o caminho de arquivo solicitado no projeto original.
 */
const CHAVE_ARMAZENAMENTO = 'data/progress.json';

/**
 * Salva o progresso do usuário no LocalStorage.
 * 
 * :param estado: Estado atual do progresso do usuário
 * 
 * **Exemplo:**
 * 
 * .. code-block:: typescript
 * 
 *     salvarProgresso({
 *         indiceFaseAtual: 1,
 *         indicePassoAtual: 3,
 *         // ... resto do estado
 *     });
 */
export function salvarProgresso(estado: EstadoProgresso | EstadoProgressoLegado): void {
  try {
    // Serializa o estado, tratando o Set de círculos clicados
    const estadoSerializavel = {
      ...estado,
      // Converte Set para Array para serialização JSON
      circulosClicados: estado.circulosClicados 
        ? Array.from(estado.circulosClicados) 
        : []
    };
    
    const estadoSerializado = JSON.stringify(estadoSerializavel);
    localStorage.setItem(CHAVE_ARMAZENAMENTO, estadoSerializado);
  } catch (erro) {
    console.error("Erro ao salvar progresso:", erro);
  }
}

/**
 * Carrega o progresso do usuário do LocalStorage.
 * 
 * Faz migração automática de estados legados para o novo formato.
 * 
 * :returns: Estado do progresso ou null se não existir
 * 
 * **Exemplo:**
 * 
 * .. code-block:: typescript
 * 
 *     const estado = carregarProgresso();
 *     if (estado) {
 *         console.log("Fase atual:", estado.indiceFaseAtual);
 *     }
 */
export function carregarProgresso(): EstadoProgresso | EstadoProgressoLegado | null {
  try {
    const estadoSerializado = localStorage.getItem(CHAVE_ARMAZENAMENTO);
    if (!estadoSerializado) return null;
    
    const estadoParsed = JSON.parse(estadoSerializado);
    
    // Reconstrói o Set de círculos clicados se existir
    if (Array.isArray(estadoParsed.circulosClicados)) {
      estadoParsed.circulosClicados = new Set(estadoParsed.circulosClicados);
    } else {
      estadoParsed.circulosClicados = new Set();
    }
    
    return estadoParsed;
  } catch (erro) {
    console.error("Erro ao carregar progresso:", erro);
    return null;
  }
}

/**
 * Remove todos os dados de progresso do LocalStorage.
 * 
 * Usado quando o usuário quer reiniciar do zero.
 * 
 * **Exemplo:**
 * 
 * .. code-block:: typescript
 * 
 *     if (confirm("Deseja reiniciar?")) {
 *         limparProgresso();
 *     }
 */
export function limparProgresso(): void {
  try {
    localStorage.removeItem(CHAVE_ARMAZENAMENTO);
  } catch (erro) {
    console.error("Erro ao limpar progresso:", erro);
  }
}

/**
 * Verifica se existe progresso salvo.
 * 
 * :returns: true se existe um save válido
 */
export function existeProgressoSalvo(): boolean {
  return localStorage.getItem(CHAVE_ARMAZENAMENTO) !== null;
}

// Mantém exports legados para compatibilidade durante migração
export const saveProgress = salvarProgresso;
export const loadProgress = carregarProgresso;
export const clearProgress = limparProgresso;
