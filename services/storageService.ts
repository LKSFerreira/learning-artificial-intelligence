import { AppState } from '../types';

// Simulando o caminho do arquivo solicitado como chave do LocalStorage
const STORAGE_FILE_PATH = 'data/progress.json';

export const saveProgress = (state: AppState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_FILE_PATH, serializedState);
    // Em um ambiente de desenvolvimento local real, aqui poderíamos fazer um POST para um endpoint que salva o arquivo fs.
  } catch (err) {
    console.error("Erro ao salvar progresso:", err);
  }
};

export const loadProgress = (): AppState | null => {
  try {
    const serializedState = localStorage.getItem(STORAGE_FILE_PATH);
    if (!serializedState) return null;
    return JSON.parse(serializedState) as AppState;
  } catch (err) {
    console.error("Erro ao carregar progresso:", err);
    return null;
  }
};

export const clearProgress = (): void => {
    try {
        localStorage.removeItem(STORAGE_FILE_PATH);
    } catch (err) {
        console.error("Erro ao limpar progresso:", err);
    }
}