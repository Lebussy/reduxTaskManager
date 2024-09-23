import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/tasks'

const getTasks = async () => {
  const tasks = await axios.get(baseUrl)
  return tasks.data
}

const addTask = async (newTask) => {
  const response = await axios.post(baseUrl, newTask)
  return response.data
}

const updateTask = async (updatedTask) => {
  const response = await axios.put(`${baseUrl}/${updatedTask.id}`, updatedTask)
  return response.data
}

const deleteTask = async (taskId) => {
  const response = await axios.delete(`${baseUrl}/${taskId}`)
  return response.status
}

export default { getTasks, addTask, updateTask, deleteTask }