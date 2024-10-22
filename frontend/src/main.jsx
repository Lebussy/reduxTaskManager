
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store.js'
import './index.css'



createRoot(document.getElementById('root')).render(
  // Store must be provided at the root component for all the components that will need access to it
  <Provider store={store}>
    <App/>
  </Provider>
)
