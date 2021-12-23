import React, { createContext } from "react";
export const Data = createContext();

const DataProvider = (props) => {
    return <Data.Provider value={{}}>{props.children}</Data.Provider>;
};

export default DataProvider;
