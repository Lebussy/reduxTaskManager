import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/tasks'

const getTasks = async () => {
  const tasks = await axios.get(baseUrl)
  return tasks.data
}

const addTask = async (content) => {
  const response = await axios.post(baseUrl, {content})
  return response.data
}

export default { getTasks, addTask }