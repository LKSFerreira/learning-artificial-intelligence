/**
 * Serviço de persistência de dados no LocalStorage.
 * 
 * Gerencia o salvamento e carregamento do progresso do usuário.
 */

import type { EstadoProgresso } from '../tipos';

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
export function salvarProgresso(estado: EstadoProgresso): void {
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
export function carregarProgresso(): EstadoProgresso | null {
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
