// React Deependencies
import * as React from 'react';

// Stylings
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Components Used 
import BookingForm from './components/bookingForm/BookingForm';
import EventCard from './components/eventCard/EventCard';

// React -Bootstrap Dependencies 
import Form from 'react-bootstrap/Form';

// Routing Dependency
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

  // Error mesage to show when the JSONserver is not UP and running 
  public getServerErrorMessage = () => {
    return <h5 className="text-danger text-center mt-5">Something went wrong. Make sure your JSON Server is UP and Running.
      <a target="_blank" href="http://localhost8080/db/">Check this</a>
    </h5>
  }

  // Show list of Events or No Events found message according to the search filter
  public getEventsContainer = () => {
    return this.state.items.length !== 0 ?
      <EventCard onselectCallback={(event: Events) => this.changeSelectedEvent(event)} eventList={this.state.items} /> :
      (!this.state.isLoaded ? this.getServerErrorMessage() : <h5 className='text-center text-danger'>No results found!</h5>)
  }

  // Render the search field
  public getSearchField = () => {
    return <Form.Group>
      <Form.Control defaultValue={this.state.searchText} onChange={this.handleSearchChange} type="search" placeholder="SEARCH EVENTS" />
    </Form.Group>
  }

  public render() {
    if (!this.state.isLoaded) {
      return null
    }
    return (
      <div className="container pt-3">
        <Router history={history}>
          <Route exact={true} path="/events">
            {this.getSearchField()}
            {this.getEventsContainer()}
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
