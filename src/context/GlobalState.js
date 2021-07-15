import axios from 'axios';
import React, { createContext, useReducer, useState } from 'react';
import AppReducer from './AppReducer';
import Config from '../config.json';

//Initial state

const initialState = {
  investments: [],
  accounts: JSON.parse(localStorage.getItem('userInfo')).fundsToInvest,
  error: null,
  loading: true,
  hasLoaded: false,
};

// Create constext

export const GlobalContext = createContext(initialState);

//Provider component

export const GlobalProvider = ({ children }) => {
  const [login] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );
  const [state, dispatch] = useReducer(AppReducer, initialState);

  //Actions

  const getInvestments = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${login.token}`,
        },
      };

      const res = await axios.get(
        `${Config.SERVER_ADDRESS}/api/investments`,
        config
      );
      dispatch({ type: 'GET_INVESTMENTS', payload: res.data });
    } catch (err) {
      dispatch({ type: 'INVESTMENTS_ERROR', payload: err.response.data.error });
    }
  };
  const addInvestment = (investment) => {
    dispatch({
      type: 'ADD_INVESTMENT',
      payload: investment,
    });
  };

  const editInvestment = (investment) => {
    dispatch({
      type: 'EDIT_INVESTMENT',
      payload: investment,
    });
  };
  const archiveInvestment = (investment) => {
    dispatch({
      type: 'ARCHIVE_INVESTMENT',
      payload: investment,
    });
  };
  const deleteInvestment = async (id) => {
    return new Promise(async (resolve, reject) => {
      const config = {
        headers: {
          Authorization: `Bearer ${login.token}`,
        },
      };
      await axios
        .delete(`${Config.SERVER_ADDRESS}/api/investments/${id}`, config)
        .then((response) => {
          dispatch({
            type: 'DELETE_INVESTMENT',
            payload: id,
          });
          resolve('That worked');
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const updateAccounts = (accounts) => {
    console.log(accounts);
    dispatch({
      type: 'UPDATE_ACCOUNTS',
      payload: accounts,
    });
  };
  return (
    <GlobalContext.Provider
      value={{
        investments: state.investments,
        accounts: state.accounts,
        error: state.error,
        loading: state.loading,
        getInvestments,
        deleteInvestment,
        addInvestment,
        editInvestment,
        archiveInvestment,
        updateAccounts,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
