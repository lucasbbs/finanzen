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
    case 'EDIT_INVESTMENT':
      return {
        ...state,
        investments: state.investments.map((investment) =>
          investment._id === action.payload._id ? action.payload : investment
        ),
      };
    case 'ARCHIVE_INVESTMENT':
      return {
        ...state,
        investments: state.investments.filter(
          (investment) => investment._id !== action.payload
        ),
      };
    case 'INVESTMENTS_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};
export default AppReducer;
