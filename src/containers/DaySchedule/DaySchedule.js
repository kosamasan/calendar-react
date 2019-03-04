import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-responsive-modal';
import Input from '../../components/UI/Input/Input';
import axios from 'axios';
import dateFns from "date-fns";

class DaySchedule extends Component {
    state = {
        eventForm : {
            title: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Title'
                },
                value: '',
                label: 'Title:'
            },
            attendees: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Attendees'
                },
                value: '',
                label: 'Attendees:'
            },
            place: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Place'
                },
                value: '',
                label: 'Place:'
            },
            time:  {
                elementType: 'input',
                elementConfig: {
                    type: 'time',
                    placeholder: 'Time'
                },
                value: '',
                label: 'Time:'
            },
            description: {
                elementType: 'textarea',
                elementConfig: {
                    type: 'textarea',
                    placeholder: 'Description:'
                },
                value: '',
                label: 'Description:'
            }
        },
        open: false,
        modalTitle: 'Add Your Event',
        idToEdit: ''
    }

    componentDidMount () {
        // if a user tries to access the url directly we redirect him to the home page to select a date
        if (this.props.selectedDate==='') {
            this.props.history.push( '/' );
        }
    }

    inputChangedHandler = ( event, inputIdentifier ) => {
        const updatedOrderForm = {
            ...this.state.eventForm
        };
        const updatedFormElement = { 
            ...updatedOrderForm[inputIdentifier]
        };
        updatedFormElement.value = event.target.value;
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        this.setState({eventForm: updatedOrderForm});
    }

    submitHandler = (event) => {
        event.preventDefault();
        // we collect the data to post or patch
        const formData = {};
        for (let formElementIdentifier in this.state.eventForm) {
            formData[formElementIdentifier] = this.state.eventForm[formElementIdentifier].value;
        }
        formData['date'] = this.props.selectedDate;
        formData['organizer'] = this.props.username;

        // check whether we create new or edit event
        if (this.state.idToEdit==='') {
            axios.post( '/schedule.json', formData )
            .then( response => {
                console.log(response);
                this.onCloseModal();
                this.props.history.push( '/' );
            } )
            .catch( error => {
                console.log(error);
            } );
        } else {
            axios.patch( '/schedule/'+this.state.idToEdit+'/.json', formData )
            .then( response => {
                console.log(response);
                // we reset the initial state for the form (new event)
                this.setState( { modalTitle: 'Add Your Event', idToEdit: '' } );
                this.onCloseModal();
                this.props.history.push( '/' );
            } )
            .catch( error => {
                console.log(error);
            } );
        }
    }

    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ modalTitle: 'Add Your Event', idToEdit: '', open: false });
    };

    deleteEvent = (id, keys) => {
        // we find the id of the database firebase entry we want to delete
        let toDelete = keys[id];
        console.log(toDelete);
        axios.delete( '/schedule/'+toDelete+'.json' )
            .then( response => {
                console.log(response);
                this.props.history.push( '/' );
            } )
            .catch( error => {
                console.log(error);
            } );
    };

    editEvent = (id, title, attendees, place, description, time, keys) => {
        // we find the id of the database firebase entry we want to up
        let toedit = keys[id];
        // we assign the correct for edit form values to the state
        this.setState(prevState => ({
            ...prevState,
            eventForm: {
                ...prevState.eventForm,
                title: {
                    ...prevState.eventForm.title, 
                    value: title
                },
                attendees: {
                    ...prevState.eventForm.attendees, 
                    value: attendees
                },
                place: {
                    ...prevState.eventForm.place, 
                    value: place
                },
                description: {
                    ...prevState.eventForm.description, 
                    value: description
                },
                time: {
                    ...prevState.eventForm.time, 
                    value: time
                }
            },
            modalTitle: 'Edit Event',
            idToEdit: toedit
        }))
        this.onOpenModal()
    };

    newEvent = () => {
        this.setState(prevState => ({
            ...prevState,
            eventForm: {
                ...prevState.eventForm,
                title: {
                    ...prevState.eventForm.title, 
                    value: ''
                },
                attendees: {
                    ...prevState.eventForm.attendees, 
                    value: ''
                },
                place: {
                    ...prevState.eventForm.place, 
                    value: ''
                },
                description: {
                    ...prevState.eventForm.description, 
                    value: ''
                },
                time: {
                    ...prevState.eventForm.time, 
                    value: ''
                }
            },
            modalTitle: 'Add Your Event',
            idToEdit: ''
        }))
        this.onOpenModal()
    };

    render () {
        const { open } = this.state;

        // find the selected date to be displayed
        let date = '';
        if (this.props.selectedDate!==''){
        const nowDate = new Date(this.props.selectedDate);
        date = nowDate.getFullYear()+' - '+(nowDate.getMonth()+1)+' - '+nowDate.getDate();
        }
        
        // the form
        const formElementsArray = [];
        for (let key in this.state.eventForm) {
            formElementsArray.push({
                id: key,
                config: this.state.eventForm[key]
            });
        }
        let form = (
            <form className='form-horizontal' onSubmit={this.submitHandler}>
                {formElementsArray.map(formElement => (
                    <div key={formElement.id} className='form-group'>
                    <label htmlFor={formElement.id} className='col-sm-3 control-label '>{formElement.config.label}</label>
                    <div className='col-sm-8'><Input 
                        id={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)} /></div>
                    </div>
                ))}
                <button className='btn btn-primary'>Submit</button>
            </form>
        );


        // find the events for the selected date for the logged in user
        const rep = this.props.schedule;
        const uniqueArray = [];
        // this will be used for update and delete
        const keys = [];
        for ( let key in rep ) {
            if((rep[key].organizer===this.props.username)&&dateFns.isSameDay(rep[key].date, this.props.selectedDate)){
                uniqueArray.push(rep[key]);
                keys.push(key);
            }
        }

        // the organized events
        let toShow = uniqueArray.map((list, index) =>
            <div key={index} className='col-md-4 well panel' >
                <div className='row'><h3> {list.title}</h3></div>
                <div className='row'><i>Attendees: </i> {list.attendees}</div>
                <div className='row'><i>Place: </i> {list.place}</div>
                <div className='row'><i>Description: </i> {list.description}</div>
                <div className='row'><i>Time: </i> {list.time}</div>
                <div className='hidden'>index: {index}</div>
                <br/>
                <div className="row">
                    <button className='col-md-4 col-md-offset-1 btn btn-primary'onClick={()=>{this.editEvent(index, list.title, list.attendees, list.place, list.description, list.time, keys)}}>Edit</button>
                    <button className='col-md-4 col-md-offset-1 btn btn-danger' onClick={()=>{this.deleteEvent(index, keys)}}>Delete</button>
                </div>
            </div>
        )
      
        return (
            <div className='row '>
                <h3>My Schedule for {date}</h3>
                <div className="row">
                {toShow}
                </div>
                <div className="row">
                    <button className="btn btn-success" onClick={()=>{this.newEvent()}}>
                        <span className="glyphicon glyphicon-plus"></span> New Event
                    </button>
                </div>
                <Modal open={open} onClose={this.onCloseModal} center classNames={{ overlay: 'custom-overlay', modal: 'custom-modal' }}>
                    <br/>
                    <h2>{this.state.modalTitle}</h2>
                    <br/>
                    {form}
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        error: state.auth.error,
        selectedDate: state.schedule.selectedDate,
        isAuthenticated: state.auth.token !== null,
        username: state.auth.username,
        schedule: state.schedule.schedule
    }
};

export default connect(mapStateToProps)(DaySchedule);