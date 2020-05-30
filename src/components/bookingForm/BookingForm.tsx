import * as React from 'react';
import './BookingForm.css';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';

const nameRegex = /^[a-zA-Z ]*$/;
// const emailRegex = /\S+@\S+\.\S+/;
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const errorMessages = {
    email: {
        pattern: "Invalid email",
        required: "Please enter your email",
    },
    name: {
        pattern: "Only letters and spaces are allowed",
        required: "Please enter your name",
    },
    selectedSeats: {
        pattern: "Number of seats selected is more than available seats",
        required: "Please enter the number of seats",
    },
}

interface Props {
    eventInfo: any
}

export default class BookingForm extends React.Component<Props, {}> {

    public state = {
        attendeesList: [],
        email: '',
        emailError: undefined,
        isTicketBooked: false,
        name: '',
        nameError: undefined,
        phoneNumber: undefined,
        selectedSeats: 1,
        selectedSeatsError: undefined
    }

    public createFormElement = (controlId: string, label: string, type: string, placeholder: string, maxlength?: number) => {
        return <Form.Group className="row" controlId={controlId}>
            <Form.Label className="col-xl-3">{label}:</Form.Label>
            <Form.Control
                className="col-xl-8 col-sm-12"
                onChange={this.handleChange}
                defaultValue={this.state[controlId]}
                type={type}
                placeholder={placeholder}
                maxLength={maxlength}
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
            this.setState({
                isTicketBooked: true
            })
            alert(JSON.stringify('Congratulations ' + this.state.name + ' You have successfully booked ' + this.state.selectedSeats + ' Seat(s).'))
        }

    }

    public hanldeSeatSelection = (e: any) => {
        this.setState({
            selectedSeats: e.target.value
        }, this.validateAvailableSeats)

        this.updateAttendeeList(e.target.value)


    }

    public updateAttendeeList = (numberOfAttendees: number) => {
        const newAttendees: any = [];
       
        for (let i = 1; i < numberOfAttendees; i++) {
            newAttendees.push(<Form.Group className="row" controlId={'newAttendee' + i}>
                <Form.Label className="col-xl-4 col-sm-12">{'Name of Attendee ' + (i + 1)} :</Form.Label>
                <Form.Control
                    required={true}
                    onChange={this.handleChange}
                    className="col-xl-6 col-sm-12"
                    defaultValue={this.state['newAttendee' + (i)]}
                    type={'text'}
                    placeholder={'Enter Name of Attendee ' + (i + 1)}
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

    public createAvailableSeatOptions = () => {
        const totalOptions: number = 6;
        const options = [];
        for (let i = 1; i <= totalOptions; i++) {
            options.push(<option key={i}>{i}</option>)
        }

        return options
    }

    public render() {
        return <div className="p-2">
            <Card className="mb-2 w-100" >
                <Card.Title className="text-center mt-3">{this.props.eventInfo.eventName}</Card.Title>
                <Card.Subtitle className="text-center mt-3">Number of available Seats : {this.props.eventInfo.availableSeats}</Card.Subtitle>
                {this.state.isTicketBooked ? <Card.Subtitle className="text-success text-center mt-3">Tickets Booked</Card.Subtitle> : null}
                <div className="row m-0">
                    <Card.Img className="col-xl-6 p-3" src={this.props.eventInfo.eventImg} />
                    <Card.Body className="col-xl-6">
                        <Form>
                            {this.createFormElement('name', 'Name', 'text', 'Enter Name')}
                            {this.createFormElement('email', 'Email', 'email', 'Enter Email')}
                            {this.createFormElement('phoneNumber', 'Phone Number', 'number', 'Enter Phone Number', 10)}

                            <Form.Group className="row" controlId={'formBasicSeats'}>
                                <Form.Label className="col-xl-4">Number of Seats:</Form.Label>
                                <Form.Control className="col-xl-6" as="select" value={this.state.selectedSeats} onChange={this.hanldeSeatSelection}>
                                    {this.createAvailableSeatOptions()}
                                </Form.Control>
                                {this.state.selectedSeatsError ? <small className='offset-md-4 text-danger'>{this.state.selectedSeatsError}</small> : null}
                            </Form.Group>

                            {this.state.attendeesList}

                            <div className="text-center">
                                <Button disabled={this.state.isTicketBooked} className="mr-2" onClick={this.handleSubmit} variant="primary" type="button">
                                    Submit
                                </Button>

                                <Link to={this.state.isTicketBooked ? '' : '/'} >
                                    <Button disabled={this.state.isTicketBooked} variant="secondary" type="button">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </Form>
                    </Card.Body>
                </div>
            </Card >
        </div>
    }


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
        const isNameFieldValid = this.validateField('name', nameRegex);
        const isEmailFieldValid = this.validateField('email', emailRegex);
        const isAvailableSeatsValid = this.validateAvailableSeats()

        return isNewAttendeesFieldsValid && isNameFieldValid && isEmailFieldValid && isAvailableSeatsValid
    }

    public validateAvailableSeats = () => {
        if (this.state.selectedSeats > this.props.eventInfo.availableSeats) {
            this.setState({
                selectedSeatsError: errorMessages.selectedSeats.pattern
            })
            return false;
        } else {
            this.setState({
                selectedSeatsError: undefined
            })
            return true
        }
    }

    public validateField = (param: string, pattern: RegExp) => {
        let isFieldValid: boolean = true;
        if (this.state[param] === '') {
            this.setState({
                [param + 'Error']: errorMessages[param].required
            })
            isFieldValid = false;
        } else if (!new RegExp(pattern).test(this.state[param])) {
            this.setState({
                [param + 'Error']: errorMessages[param].pattern
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