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
