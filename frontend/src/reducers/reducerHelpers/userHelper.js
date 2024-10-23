// Function which attempts to read and parse initial user data from local storage
// Returns null if it does not exist or if error in parsing

const getInitialUserState = () => {
  const userInLocal = window.localStorage.getItem('user');
  if (userInLocal) {
    try {
      return { ...JSON.parse(userInLocal), loggedIn: true };
    } catch (error) {
      console.error('Error parsing user from localStorage', error);
      return null;
    }
  } else {
    return null;
  }
};

export default {getInitialUserState}