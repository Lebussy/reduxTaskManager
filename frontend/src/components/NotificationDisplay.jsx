import { useSelector } from 'react-redux'

const NotificationDisplay = () => {
  // Uses the useSelector redux hook to get the notification state from the store
  const notification = useSelector(store => store.notification)

  // If there is no message, renders an empty component
  if (!notification.message){
    return (
      <></>
    )
  }

  // A map object for the style of the notification
  const notificationStyles = {
    'ERROR': {
      color: 'red',
      backgroundColor: '#faa2a4',
      padding: '5px',
      margin: '4px'
    },
    'SUCCESS': {
      color: 'green',
      backgroundColor: '#9cff99',
      padding: '5px',
      margin: '4px'
    },
    'DEFAULT': {
      color: 'blue',
      backgroundColor: '#999cff',
      padding: '5px',
      margin: '4px'
    }
  }

  const style = notificationStyles[notification.type] || notificationStyles['DEFAULT']

  return (
    <div style={style}>
      <h3><b>{notification.type}:</b></h3>
      <p>{notification.message}</p>
    </div>
  )
}

export default NotificationDisplay