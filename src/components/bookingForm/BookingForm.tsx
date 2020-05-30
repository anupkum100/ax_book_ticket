import * as React from 'react';
import './BookingForm.css';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

import validationMessage from '../../JSON/validationMessage.json';
import { createBrowserHistory as createHistory } from 'history';

const nameRegex = /^[a-zA-Z ]*$/;
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

interface Props {
    eventInfo: any
}

const history = createHistory();

export default class BookingForm extends React.Component<Props, {}> {

    public state = {
        attendeesList: [], // Array to store Form Element for All New Attendees
        email: '',
        emailError: undefined, // error message for email can be traversed as email + Error for common function use
        isTicketBooked: false, // flag to show Ticket Booked and disable Form Buttons
        name: '',
        nameError: undefined,
        phoneNumber: undefined,
        selectedSeats: 1, // dropdown value initially set to 1
        selectedSeatsError: undefined
    }

    // Input Field Elements
    public createFormElement = (controlId: string, label: string, type: string, placeholder: string, maxlength?: number) => {
        return <Form.Group className="row" controlId={controlId}>
            <Form.Label className="col-xl-3 pt-2">{label}:</Form.Label>
            <Form.Control
                className="col-xl-8 col-sm-12"
                onChange={this.handleChange}
                defaultValue={this.state[controlId]}
                type={type}
                placeholder={placeholder}
                maxLength={maxlength}
                disabled={this.state.isTicketBooked}
            />
            {this.state[controlId + 'Error'] ? <small className='offset-md-3 text-danger'>{this.state[controlId + 'Error']}</small> : null}
        </Form.Group>
    }

    public handleChange = (e: any) => {
        this.setState({
            [e.target.id]: e.target.value,
        })
    }

    public handleSubmit = () => {
        if (this.validateForm()) {

            const requestOptions = {
                body: JSON.stringify({
                    id: this.props.eventInfo.id,
                    eventName: this.props.eventInfo.eventName,
                    eventDate: this.props.eventInfo.eventDate,
                    availableSeats: this.props.eventInfo.availableSeats - this.state.selectedSeats,
                    eventImg: this.props.eventInfo.eventImg
                }),
                headers: { 'Content-Type': 'application/json' },
                method: 'PUT',
            };

            fetch('http://localhost:8080/events/' + this.props.eventInfo.id, requestOptions)
                .then(response => response.json())
                .then(_ => this.setState({
                    isTicketBooked: true
                }));
            console.log(JSON.stringify('Congratulations ' + this.state.name + ' You have successfully booked ' + this.state.selectedSeats + ' Seat(s).'));
            console.log("Tickets Booked for", requestOptions.body)
        }

    }

    public hanldeSeatSelection = (e: any) => {
        this.setState({
            selectedSeats: e.target.value
        }, this.validateAvailableSeats)

        this.updateAttendeeList(e.target.value)
    }

    // handle new atendees addition and error message
    public updateAttendeeList = (numberOfAttendees: number) => {
        const newAttendees: any = [];

        for (let i = 1; i < numberOfAttendees; i++) {
            newAttendees.push(<Form.Group className="row" controlId={'newAttendee' + i}>
                <Form.Label className="col-xl-4 pt-2 col-sm-12">{'Name of Attendee ' + (i + 1)} :</Form.Label>
                <Form.Control
                    required={true}
                    onChange={this.handleChange}
                    className="col-xl-6 col-sm-12"
                    defaultValue={this.state['newAttendee' + (i)]}
                    type={'text'}
                    placeholder={'Enter Name of Attendee ' + (i + 1)}
                    disabled={this.state.isTicketBooked}
                />
                {this.state['newAttendee' + i + 'Error'] ? <small className='offset-md-4 text-danger'>Please enter the name of Attendee #{i + 1}</small> : null}
            </Form.Group>)

            this.setState({
                ['newAttendee' + i]: this.state['newAttendee' + i] || '',
                ['newAttendee' + i + 'Error']: false,
            })
        }
        this.setState({
            attendeesList: newAttendees
        })
    }

    // Create dropdown options for avaialable seats 
    public createAvailableSeatOptions = () => {
        const totalOptions: number = 6;
        const options = [];
        for (let i = 1; i <= totalOptions; i++) {
            options.push(<option key={i}>{i}</option>)
        }
        return options
    }

    // return the available seats on render and updates the value when user successfully books ticket
    public getAvailableSeats = () => {
        return this.state.isTicketBooked ? (this.props.eventInfo.availableSeats - this.state.selectedSeats) : this.props.eventInfo.availableSeats;
    }

    // Redirect to home page 
    public goBack = () => {
        history.goBack();
        if (this.state.isTicketBooked) {
            location.reload();
        }
    }

    public render() {
        return <div className="p-2">
            <Card className="mb-2 w-100" >
                <Button onClick={this.goBack} className="position-absolute" variant="link" type="button">
                    Home
                </Button>
                <Card.Title className="text-center mt-3">{this.props.eventInfo.eventName}</Card.Title>
                <Card.Subtitle className="text-center mt-3">Number of available Seats : {this.getAvailableSeats()}</Card.Subtitle>
                {this.state.isTicketBooked ? <Card.Subtitle className="text-success text-center mt-3">Tickets Booked</Card.Subtitle> : null}
                <div className="row m-0">
                    <Card.Img className="col-xl-6 p-3" src={this.props.eventInfo.eventImg} />
                    <Card.Body className="col-xl-6">
                        <Form>
                            {this.createFormElement('name', 'Name', 'text', 'Enter Name')}
                            {this.createFormElement('email', 'Email', 'email', 'Enter Email')}
                            {this.createFormElement('phoneNumber', 'Phone Number', 'number', 'Enter Phone Number', 10)}

                            <Form.Group className="row" controlId={'formBasicSeats'}>
                                <Form.Label className="col-xl-4 pt-2">Number of Seats:</Form.Label>
                                <Form.Control disabled={this.state.isTicketBooked} className="col-xl-6" as="select" value={this.state.selectedSeats} onChange={this.hanldeSeatSelection}>
                                    {this.createAvailableSeatOptions()}
                                </Form.Control>
                                {this.state.selectedSeatsError ? <small className='offset-md-4 text-danger'>{this.state.selectedSeatsError}</small> : null}
                            </Form.Group>

                            {this.state.attendeesList}

                            <div className="text-center">
                                <Button disabled={this.state.isTicketBooked} className="mr-2" onClick={this.handleSubmit} variant="primary" type="button">
                                    Submit
                                </Button>

                                <Button onClick={this.goBack} disabled={this.state.isTicketBooked} variant="danger" type="button">
                                    Cancel
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </div>
            </Card >
        </div>
    }


    // ALL FORM VALIDATION
    public validateForm = () => {
        const that = this;
        let isNewAttendeesFieldsValid: boolean = true;

        // Validate All New Attendees 
        this.state.attendeesList.forEach((attendees: any) => {
            if (that.state[attendees.props.controlId] === '') {
                that.setState({
                    [attendees.props.controlId + 'Error']: true
                }, () => { this.updateAttendeeList(this.state.selectedSeats) })
                isNewAttendeesFieldsValid = false;
            } else {
                that.setState({
                    [attendees.props.controlId + 'Error']: false
                }, () => { this.updateAttendeeList(this.state.selectedSeats) })
            }
        })

        // Validate fields Name and Email
        const isNameFieldValid: boolean = this.validateField('name', nameRegex);
        const isEmailFieldValid: boolean = this.validateField('email', emailRegex);
        const isAvailableSeatsValid: boolean = this.validateAvailableSeats()

        return isNewAttendeesFieldsValid && isNameFieldValid && isEmailFieldValid && isAvailableSeatsValid
    }

    // DROPDOWN VALIDATION
    public validateAvailableSeats = () => {
        if (this.state.selectedSeats > this.props.eventInfo.availableSeats) {
            this.setState({
                selectedSeatsError: validationMessage.selectedSeats.pattern
            })
            return false;
        } else {
            this.setState({
                selectedSeatsError: undefined
            })
            return true
        }
    }

    // TEXT FIELD VALIDATION
    public validateField = (param: string, pattern: RegExp) => {
        let isFieldValid: boolean = true;
        if (this.state[param].trim() === '') {
            this.setState({
                [param + 'Error']: validationMessage[param].required
            })
            isFieldValid = false;
        } else if (!new RegExp(pattern).test(this.state[param])) {
            this.setState({
                [param + 'Error']: validationMessage[param].pattern
            })
            isFieldValid = false;
        } else {
            this.setState({
                [param + 'Error']: undefined
            })
            isFieldValid = true
        }
        return isFieldValid;
    }
}