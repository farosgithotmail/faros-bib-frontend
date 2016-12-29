'use strict';
const React = require('react');
const ReactDOM = require('react-dom');
const when = require('when');
const client = require('./client');
const follow = require('./follow');
const stompClient = require('./websocket-listener');
const root = 'http://localhost:8080';
import BookList from "./booklist";

class App extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="col-md-12">
                <h2>Books</h2>
                <BookList/>
            </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('react')
);
