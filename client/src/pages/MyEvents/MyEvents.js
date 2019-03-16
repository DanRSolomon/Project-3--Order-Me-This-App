import React, { Component } from "react";
import Nav from "../../components/Nav";
import Slide from 'react-reveal/Slide';
import "./MyEvents.css";
import CreatedEvents from "../../components/CreatedEvents";
import API from "../../utils/API";

class MyEvents extends Component {
    state = {
        events: []
    }
    componentDidMount() {
        this.loadEvents();
    }
    loadEvents = () => {
        API.getEvent()
            .then(res => this.setState({ events: res.data }))
            .catch(err => console.log(err));
    };
    deleteEvent = (id) => {
        API.deleteEvent(id)
            .catch(err => console.log(err));
    };
    render() {
        return (
            <Slide left>
                <div>
                    <Nav />
                    <div className="container d-flex justify-content-center">
                        <div className="myEventsBackground justify-content-center">
                            <div className="myEventsTitle col text-center">
                                <h1> My Events - All events made by Host </h1>
                            </div>
                            <div className="myEventsArea p-3">
                                <small>Click on an event name to see the full details</small>

                                {this.state.events.length ?
                                    this.state.events.map(event => (
                                        <CreatedEvents
                                        key={event._id}
                                        id={event._id}
                                        deleteEvent={this.deleteEvent}
                                        eventName={event.eventName}
                                        eventDateTime={event.eventDateTime}
                                        link={event.link}
                                        message={event.message}
                                        orderDateTime={event.orderDateTime}
                                        restaurantName={event.restaurantName}
                                        sendToEmail={event.sendToEmail}
                                        />
                                    )) : (
                                        <h3>No Results to Display</h3>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>

            </Slide >
        )
    }
}
export default MyEvents;