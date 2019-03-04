
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  selectedDate: '',
  schedule: ''
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SELECTED_DATE:
        return {
            ...state,
            selectedDate: action.val,
        }
    case actionTypes.SET_SCHEDULE:
        return {
            ...state,
            schedule: action.val,
        }
    default:
    return state;
  }
}

export default reducer;