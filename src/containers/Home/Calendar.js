import React from "react";
import dateFns from "date-fns";
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';

class Calendar extends React.Component {
  state = {
    currentMonth: new Date(),
    selectedDate: '',
    today: new Date(),
    booked : []
  };

  componentDidUpdate(prevProps) {
    // find the days that the user has events in and update the booked state
    if ((this.props.fullSchedule !== prevProps.fullSchedule)) {
      let rep = this.props.fullSchedule;
      let booked = [];
      let uniqueArray = [];
      for ( let key in rep ) {
          if(rep[key].organizer===this.props.username){
              booked.push(rep[key].date);
          }
      }
      // keep only the unique values
      uniqueArray = booked.filter(function(item, pos, self) {
        return self.indexOf(item) === pos;
      })
      this.setState( { booked: uniqueArray } );
    }
  }

  // the calendar header with buttons to navigate through months
  renderHeader() {
    const dateFormat = "MMMM YYYY";

    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={this.prevMonth}>
            <span className="glyphicon glyphicon-chevron-left"></span>
          </div>
        </div>
        <div className="col col-center">
          <span>{dateFns.format(this.state.currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end" onClick={this.nextMonth}>
          <div className="icon">
            <span className="glyphicon glyphicon-chevron-right"></span>
          </div>
        </div>
      </div>
    );
  }

  // render day names in a week
  renderDays() {
    const dateFormat = "dddd";
    const days = [];

    // the start of the week
    let startDate = dateFns.startOfWeek(this.state.currentMonth);

    // go through seven days and display their names
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="days row">{days}</div>;
  }

  // render days in month
  renderCells() {
    const { currentMonth, today, booked } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const dateFormat = "D";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    // loop from startDate to endDate to show all the dates
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        const cloneDay = day;
        // determine if day is disabled, today or has event and assign the style
        days.push(
          <div
            className={`col cell ${
              !dateFns.isSameMonth(day, monthStart)
                ? "disabled"
                : dateFns.isSameDay(day, today) ? "selected" : ""
            }${booked.map((book) =>  dateFns.isSameDay(day, book) ? "booked" : "").join('')}
             ` }
            
            key={day}
            onClick={() => this.onDateClick(dateFns.parse(cloneDay))}
          >
            <span className="number">{formattedDate}</span>
            <span className="bg">{formattedDate}</span>
            
          </div>
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  }

  // handle day selection
  onDateClick = day => {
    this.props.selectDate(day);
    this.setState({
      selectedDate: day
    });
    this.props.history.push('/day-schedule');
  };

  // take the current month from state, and either add or subtract a month from it
  nextMonth = () => {
    this.setState({
      currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
    });
  };

  prevMonth = () => {
    this.setState({
      currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
    });
  };

  render() {
    return (
      <div className="calendar">
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
      isAuthenticated: state.auth.token !== null,
      username: state.auth.username
  };
};

const mapDispatchToProps = dispatch => {
  return {
      selectDate: (value) => dispatch(actions.selectedDate(value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);