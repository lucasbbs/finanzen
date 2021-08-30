const AppReducer = (state, action) => {
  switch (action.type) {
    case 'GET_INVESTMENTS':
      return {
        ...state,
        loading: false,
        investments: action.payload.investments,
        hasLoaded: true,
      };
    case 'DELETE_INVESTMENT':
      return {
        ...state,
        investments: state.investments.filter(
          (investment) => investment._id !== action.payload
        ),
      };
    case 'ADD_INVESTMENT':
      return {
        ...state,
        investments: [...state.investments, action.payload],
      };
    case 'UPDATE_ACCOUNTS':
      return { ...state, accounts: action.payload };
    case 'ARCHIVE_INVESTMENT':
      return {
        ...state,
        investments: state.investments.filter(
          (investment) => investment._id !== action.payload
        ),
      };
    case 'INVESTMENTS_ERROR':
      return { ...state, error: action.payload };
    case 'GET_ACCOUNTS':
      return { ...state, accounts: action.payload };
    case 'EMPTY_STATE':
      return { ...state, accounts: action.payload };
    default:
      return state;
  }
};
export default AppReducer;
