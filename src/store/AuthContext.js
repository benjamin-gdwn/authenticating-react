import React, { useState } from "react";
// cvreating the context object
const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});
// creating the provider by defining what the functions and what the context keys should contain
export const AuthContextProvider = (props) => {
  const [token, setToken] = useState(null);

  const userIsLoggedIn = !!token;

  const loginHandler = (token) => {
    setToken(token);
  };
  const logoutHandler = () => {
    setToken(null);
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
