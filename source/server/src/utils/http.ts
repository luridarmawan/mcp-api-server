import axios from 'axios'

export const http = axios.create({
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Add interceptors if needed
http.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('HTTP Error:', error)
    return Promise.reject(error)
  }
)

// Menambahkan header default
// http.defaults.headers.common['Authorization'] = 'Bearer your-token-here'
// http.defaults.headers.common['X-Custom-Header'] = 'custom-value'
