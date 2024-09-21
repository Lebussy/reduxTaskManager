import axios from 'axios'

const baseUrl = 'http://localhost:3001/tasks'

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

export default { getTasks, addTask, updateTask }