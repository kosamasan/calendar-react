import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import * as actions from '../../store/actions/index';

class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Email'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                label: 'E-mail: ',
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                label: 'Password: ',
                valid: false,
                touched: false
            }
        }
    }

    checkValidity ( value, rules ) {
        let isValid = true;
        if ( !rules ) {
            return true;
        }

        if ( rules.required ) {
            isValid = value.trim() !== '' && isValid;
        }

        if ( rules.minLength ) {
            isValid = value.length >= rules.minLength && isValid
        }

        if ( rules.maxLength ) {
            isValid = value.length <= rules.maxLength && isValid
        }

        if ( rules.isEmail ) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test( value ) && isValid
        }

        if ( rules.isNumeric ) {
            const pattern = /^\d+$/;
            isValid = pattern.test( value ) && isValid
        }
        console.log(isValid)
        return isValid;
    }

    inputChangedHandler = ( event, controlName ) => {
        console.log(controlName);
        const updatedControls = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value: event.target.value,
                valid: this.checkValidity( event.target.value, this.state.controls[controlName].validation ),
                touched: true
            }
        };
        this.setState( { controls: updatedControls } );
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value);
    }

    render () {
        // the form
        const formElementsArray = [];
        for ( let key in this.state.controls ) {
            formElementsArray.push( {
                id: key,
                config: this.state.controls[key]
            } );
        }
        
        let form =<form className='form-horizontal well' onSubmit={this.submitHandler}>
                {formElementsArray.map(formElement => (
                    <div key={formElement.id} className='form-group'>
                    <div ><Input 
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched}
                changed={( event ) => this.inputChangedHandler( event, formElement.id )}/></div>
                    </div>
                ))}
                <button className='btn btn-primary'>Log in</button>
            </form>

        // display error
        let errorMessage = null;
        if (this.props.error) {
            errorMessage = (
                <p className='alert-danger'>{this.props.error}</p>
            );
        }

        // we redirect the loggedin user to home page
        let authRedirect = null;
        if (this.props.isAuthenticated) {
            authRedirect = <Redirect to='/' />
        }

        return (
            <div className='row Auth'>
                <div className="col-xs-0 col-md-4">
                <h1>Calendar App</h1>
                </div>
                <div className="col-md-8 col-sm-12">
                    <div>
                        {authRedirect}
                        {errorMessage}
                        {form}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password) => dispatch(actions.auth(email, password))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);