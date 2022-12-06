import React, { useCallback, useEffect, useState } from "react";

// creating the context object
const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

// being able to pass the timer between functions with this variable
let logoutTimer;

// function to create remaining time for auto logout
const calculateRemainingTime = (expirationTime) => {
  // storing the current time in milliseconds
  const currentTime = new Date().getTime();
  // storing the expiration time in milliseconds
  const adjExpirationTime = new Date(expirationTime).getTime();
  // storing the result of the times subtracted from each other
  const remainingDuration = adjExpirationTime - currentTime;
  // ensuring we can use the const inside component
  return remainingDuration;
};

// helper function to retrieve token and expiration time
const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpiration = localStorage.getItem("expirationTime");
  const remainingTime = calculateRemainingTime(storedExpiration);
  if (remainingTime <= 3600) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  }
  return {
    token: storedToken,
    duration: remainingTime,
  };
};
// creating the provider by defining what the functions and what the context keys should contain
export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  let initialToken;
  // searching the local storage to see if we already have a valid token
  if (tokenData) {
    initialToken = tokenData.token;
    console.log("you have a token");
  }

  // storing and setting the token
  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    // removing the token from the local storage
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    // conditional so that the auto logout finishes when user logs out
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);
  const loginHandler = (token, expirationTime) => {
    setToken(token);
    // storing the token in the browser storage and when we log out we clear it
    localStorage.setItem("token", token);
    // setting timer when we log in
    localStorage.setItem("expirationTime", expirationTime);
    // calling the remaining time from the function above
    const remainingTime = calculateRemainingTime(expirationTime);
    // setting an effect up calling logout if the remaining duration of token is 0
    // storing the timeout effect as a variable so we can cancel it if a user logs out
    logoutTimer = setTimeout(logoutHandler, remainingTime);
    console.log(remainingTime);
  };

  useEffect(() => {
    if (tokenData) {
      console.log(tokenData);
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };
  //   providing the context value as the value in the provider
  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};
//
export default AuthContext;
