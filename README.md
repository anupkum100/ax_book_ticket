This Applicaiton used React to run the application.
The JSON-Server is used to make API calls for local json files.

## To Run the Application
* Make sure you have npm installed globally
* `npm install -g json-server` Make sure to install json-server globally to run the JSON server
* `npm install -g concurrently` Install concurrently globally 
* `npm install` Install all Dependencies
* `npm start` runs the json server at 8080 and the node server at 3000

## Data source
* The data for the events are stored in db.json file 
* Event Images are static URL to random images (googled images)
* Book Now button is mapped to availableTickets value. If the value is 0 "Sold Out" text will be dislayed

## Searching
* User can search the events with respect to the event Name 
* If No events are filtered wrt the search criteria "No results found!" is displayed

## Booking
* Once User clicks on the Book Now Button. User will be redirected to the booking form.
* User is supposed to enter valid Name and Email Id 
* Default Selected seat is set to 1 and if the user selects the seats greater than available seats the validation will fail.
* If user selects seats more than 1, user is supposed to add the name of new person however no valdation is there for new name except blank value.
* Once user fills every field correctly and clicks on Submit "Ticked booked" will be shown and log is generated in the console.
* "Cancel" and "Home" are 2 links from where a user can go back to Home Page.
* Once the booking is done the db.json will be updated with the new data.

