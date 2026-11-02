import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router'
import App from './App'
import './styles.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Giữ dữ liệu trong RAM 5 phút không cần gọi lại mạng
      gcTime: 1000 * 60 * 30, // Giữ bộ nhớ đệm cache 30 phút
      refetchOnWindowFocus: false, // Tránh fetch lại liên tục khi người dùng chuyển qua lại các tab
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)