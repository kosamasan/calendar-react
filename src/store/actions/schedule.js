import * as actionTypes from './actionTypes';
import axios from 'axios';

export const selectedDate = (value) => {
  return {
      type: actionTypes.SELECTED_DATE,
      val: value
  };
};

export const setSchedule = ( schedule ) => {
  return {
      type: actionTypes.SET_SCHEDULE,
      val: schedule
  };
};

export const schedule = () => {
  return dispatch => {
      axios.get( '/schedule.json' )
      .then( response => {
        dispatch(setSchedule(response.data));
    } )
    .catch( error => {
        console.log(error);
    } );
  };
};