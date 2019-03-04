import React, { Component } from 'react';
import Calendar from './Calendar';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import './Home.css';

class Home extends Component {
  componentDidMount () {
    // get all data from database to save them in store
    this.props.schedule();
  }

  render() {
    return (
      <div>
          <div>
            <span className="glyphicon glyphicon-calendar">Calendar</span>
          </div>
        <main>
          <Calendar fullSchedule={this.props.fullSchedule} history={this.props.history}/>
        </main>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    fullSchedule: state.schedule.schedule,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    schedule: () => dispatch(actions.schedule()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
