import * as React from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import BookingForm from './components/bookingForm/BookingForm';

import EventCard from './components/eventCard/EventCard';
import EventList from './eventsData/eventList.json';
import Form from 'react-bootstrap/Form';

import createHistory from 'history/createBrowserHistory';
import { Router, Route } from 'react-router-dom';

const history = createHistory();

// interface for Events ## Shared by EventCard Component
export interface Events {
  eventName: string,
  eventDate: string,
  availableSeats: number,
  eventImg: string
}

class App extends React.Component {

  public state = { items: [] as any, isLoaded: false, searchText: undefined, selectedEvent: {} }


  public componentWillMount() {
    history.push('/')
  }

  public componentDidMount() {
    this.getEventList();
  }

  public getEventList = () => {
    this.setState({
      isLoaded: true,
      items: EventList
    });
  }

  public filterEvents = () => {
    const that = this;
    if (this.state.searchText) {
      // @ts-ignore
      const allItems = EventList.filter((item: any) => item.eventName.toLowerCase().includes(that.state.searchText.toLowerCase()));
      this.setState({
        items: allItems
      })
    } else {
      this.setState({
        items: EventList
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
    history.push(`/${event.eventName.replace(/ /g, '')}`)
  }

  public render() {
    if (!this.state.isLoaded) {
      return null
    }
    return (
      <div className="container mt-3">
        <Router history={history}>
          <Route exact={true} path="/">
            <Form.Group>
              <Form.Control defaultValue={this.state.searchText} onChange={this.handleSearchChange} type="search" placeholder="SEARCH EVENTS" />
            </Form.Group>
            {
              this.state.items.length !== 0 ?
                <EventCard onselectCallback={(event: Events) => this.changeSelectedEvent(event)} eventList={this.state.items} /> : <h5 className='text-center text-danger'>No results found!</h5>
            }
          </Route>

          <Route path="/:eventId">
            <BookingForm eventInfo={this.state.selectedEvent} />
          </Route>
        </Router>
      </div>
    );
  }
}

export default App;
