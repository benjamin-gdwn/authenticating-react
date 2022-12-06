import React, { useState } from "react";
// cvreating the context object
const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});
// 
const calculateRemainingTime = (expirationTime) => {
  // storing the current time in milliseconds
  const currentTime = new Date().getTime();
  // storing the expiration time in milliseconds
  const adjExpirationTime = new Date(expirationTime).getTime();
// storing the result of the times subtracted from each other
  const remainingTime = adjExpirationTime - currentTime;
// ensuring we can use the const inside component
  return remainingTime;

}
// creating the provider by defining what the functions and what the context keys should contain
export const AuthContextProvider = (props) => {
  // searching the local storage to see if we already have a valid token
  const initialToken = localStorage.getItem('token');
  // storing and setting the token
  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token;

 
  const logoutHandler = () => {
    setToken(null);
    // removing the token from the local storage
    localStorage.removeItem('token', token);
  };
  const loginHandler = (token, expirationTime) => {

    setToken(token);
        // storing the token in the browser storage and when we log out we clear it
    localStorage.setItem('token', token);
    // calling the remaining time from the function above
    const remainingDuration = calculateRemainingTime(expirationTime);
    // setting an effect up calling logout if the remaining duration of token is 0
    setTimeout(logoutHandler, remainingDuration)
  };


  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };
//   providing the context value as the value in the provider
  return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
};
// 
export default AuthContext;
