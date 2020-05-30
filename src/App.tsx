import * as React from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import BookingForm from './components/bookingForm/BookingForm';

import EventCard from './components/eventCard/EventCard';
import Form from 'react-bootstrap/Form';

import { createBrowserHistory as createHistory } from 'history';
import { Router, Route } from 'react-router-dom';

const history = createHistory();

// interface for Events ## Shared by EventCard Component
export interface Events {
  id: number,
  eventName: string,
  eventDate: string,
  availableSeats: number,
  eventImg: string
}

class App extends React.Component {

  public state = {
    allItems: [], // list of all items received 
    items: [], // list of all items to display in the UI
    isLoaded: false, // check if the data is received to render the component
    searchText: undefined, 
    selectedEvent: {} // selected eventDetails to be passed to the booking form
  }


  public componentWillMount() {
    // redirect to home page when user refresh from the booking page
    history.push('/events')
  }

  public componentDidMount() {
    this.getEventList();
  }

  public getEventList = () => {
    // make the fetch call to get the data from db.json
    fetch("http://localhost:8080/db")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            allItems: result.events,
            isLoaded: true,
            items: result.events
          });
        }
      )
  }

  // Handle the searching of events by checking the eventName, this works for both Upper and lowercases 
  public filterEvents = () => {
    const that = this;
    if (this.state.searchText) {
      // @ts-ignore
      const allItems = this.state.allItems.filter((item: any) => item.eventName.toLowerCase().includes(that.state.searchText.toLowerCase()));
      this.setState({
        items: allItems
      })
    } else {
      this.setState({
        items: this.state.allItems
      })
    }
  }

  public handleSearchChange = (e: any) => {
    this.setState({
      items: [],
      searchText: e.target.value
    }, this.filterEvents)

  }

  public changeSelectedEvent(event: Events) {
    this.setState({
      selectedEvent: event
    })
    // Redirect to the booking form when user selects any event
    history.push(`/bookings/${event.eventName.replace(/ /g, '')}`)
  }

  public render() {
    if (!this.state.isLoaded) {
      return null
    }
    return (
      <div className="container pt-3">
        <Router history={history}>
          <Route exact={true} path="/events">
            <Form.Group>
              <Form.Control defaultValue={this.state.searchText} onChange={this.handleSearchChange} type="search" placeholder="SEARCH EVENTS" />
            </Form.Group>
            {
              this.state.items.length !== 0 ?
                <EventCard onselectCallback={(event: Events) => this.changeSelectedEvent(event)} eventList={this.state.items} /> : <h5 className='text-center text-danger'>No results found!</h5>
            }
          </Route>

          <Route path="/bookings/:eventId">
            <BookingForm eventInfo={this.state.selectedEvent} />
          </Route>
        </Router>
      </div>
    );
  }
}

export default App;
