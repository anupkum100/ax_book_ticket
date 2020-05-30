import * as React from 'react';
import * as ReactDOM from 'react-dom';
import EventCard from './EventCard';

import EventList from '../../eventsData/eventList.json';

it('Event Card should render when Event Data is passedrend', () => {
    const div = document.createElement('div');
    ReactDOM.render(<EventCard onselectCallback eventList={EventList} />, div);
});
