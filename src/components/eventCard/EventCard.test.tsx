import * as React from 'react';
import * as ReactDOM from 'react-dom';
import EventCard from './EventCard';


it('Event Card should render when Event Data is passedrend', () => {
    const div = document.createElement('div');
    fetch('http://localhost:8080/db')
        .then((response: any) => ReactDOM.render(<EventCard onselectCallback eventList={response.events} />, div))
        .catch((err) => console.log('Error!!!!' + err));
});

