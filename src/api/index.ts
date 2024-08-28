import axios from "axios"

const isDevelopment = import.meta.env.MODE === "development"
let baseURL = "http://localhost:8080/api/v1"

if (!isDevelopment) {
  baseURL = "http://localhost:8080/api/v1"
}

const api = axios.create({
  baseURL
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken")
    if (token && config.method !== "get") {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api

