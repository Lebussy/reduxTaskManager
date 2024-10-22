import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/tasks'

// Sets the global authorisation token for requests in this module
const setAuthToken = (token) => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

const getTasks = async () => {
  const tasks = await axios.get(baseUrl)
  return tasks.data
}

const addTask = async (newTask) => {
  const response = await axios.post(baseUrl, newTask)
  return response.data
}

const updateTask = async (updatedTask) => {
  const response = await axios.patch(`${baseUrl}/${updatedTask.id}`, updatedTask)
  return response.data
}

const deleteTask = async (taskId) => {
  const response = await axios.delete(`${baseUrl}/${taskId}`)
  return response.status
}

const updateMultiple = async (updatedTasks) => {
  const response = await axios.patch(`${baseUrl}/batch`, updatedTasks)
  return response.data
}

export default { getTasks, addTask, updateTask, deleteTask, updateMultiple, setAuthToken }