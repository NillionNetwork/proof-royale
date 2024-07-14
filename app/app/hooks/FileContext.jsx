'use client';

import React, { createContext, useState, useContext } from 'react';

const FileContext = createContext();

export const useFile = () => {
  return useContext(FileContext);
};

export const FileProvider = ({ children }) => {
  const [fileBytes, setFileBytes] = useState(null);

  const value = {
    fileBytes,
    setFileBytes,
  };

  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
};
