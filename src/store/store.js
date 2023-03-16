import React, { createContext, useReducer } from "react";
import { notification } from "antd";

const Store = createContext();
const StateProvider = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();
  const showNotification = ({ type, message }) => {
    return api[type]({ message, placement: "bottomRight" });
  };
  return (
    <Store.Provider value={{ showNotification }}>
      {contextHolder}
      {children}
    </Store.Provider>
  );
};

export { Store, StateProvider };
