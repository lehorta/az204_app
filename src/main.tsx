import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { loadApiConfig } from './config/api.ts'
import { initializeApiClient } from './config/apiClient'
import { getApiUrl } from './config/api.ts'

// Carregar configuração da API antes de renderizar a aplicação
loadApiConfig().then(() => {
  initializeApiClient(getApiUrl())
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}).catch((error) => {
  console.error('Erro ao inicializar aplicação:', error);
  initializeApiClient(getApiUrl())
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
});
