import axios from 'axios'

export default axios.create({
  baseURL: 'http://localhost:8000/api', // Asegúrate de que Laravel esté en el puerto 8000
  headers: { 'Content-Type': 'application/json' }
})