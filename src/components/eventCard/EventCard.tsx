import * as React from 'react';
import './EventCard.css';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Events } from 'src/App';

const EventCard = (props: { eventList: Events[], onselectCallback: any }) => {
    return <div className="p-2 row">
        {props.eventList.map((events: Events) => {
            return <div key={events.eventName} className="mb-2 col-xl-3 p-0">
                <Card className="m-auto">
                    <Card.Title className="text-center mt-3">{events.eventName}</Card.Title>
                    <div className="row m-0">
                        <Card.Img className="p-2 col-lg-6 col-sm-12" src={events.eventImg} />
                        <Card.Body className="p-2 col-lg-6 col-sm-12 text-center">
                            <Card.Text>
                                {events.eventDate}
                            </Card.Text>
                            <Card.Text>
                                Available Seats : {events.availableSeats}
                            </Card.Text>
                                <Button
                                    onClick={() => { props.onselectCallback(events) }}
                                    disabled={events.availableSeats ? false : true}
                                    size="sm"
                                    variant={events.availableSeats ? 'primary' : 'link'}>
                                    {events.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
                                </Button>
                        </Card.Body>
                    </div>
                </Card >
            </div>
        })
        }
    </div>
}

export default EventCard;


