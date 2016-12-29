'use strict';
const React = require('react');
const client = require('./client');
const stompClient = require('./websocket-listener');
const root = 'http://localhost:8080';
import UpdateBookDialog from './updateBookDialog'

export default class BookList extends React.Component{

    constructor(props) {
        super(props);
        this.state = {books:[]};
        this.doAfterBookCreatedEvent = this.doAfterBookCreatedEvent.bind(this);
        this.doAfterBookDeletedEvent = this.doAfterBookDeletedEvent.bind(this);
        this.deleteBook = this.deleteBook.bind(this);
        this.editBook = this.editBook.bind(this);
        this.findBookBySelfLink = this.findBookBySelfLink.bind(this);
    }

    findBookBySelfLink(selfLink){
        var foundBook = undefined;
        this.state.books.forEach(function(book){
            if(book._links.self.href.indexOf(selfLink) != -1){
                foundBook = book;
            }
        });
        return foundBook;
    }

    doAfterBookCreatedEvent(message) {
        client({method: 'GET', path: root + message.body}).done(response => {
            this.setState({books: this.state.books.concat([response.entity])});
        });
    }

    doAfterBookDeletedEvent(message) {
        var foundBook = this.findBookBySelfLink(message.body);
        if(foundBook){
            this.state.books.splice(this.state.books.indexOf(foundBook), 1);
            this.setState({books: this.state.books});
        }
    }

    deleteBook(book){
        client({method: 'DELETE', path: book._links.self.href}).then(
                response => {
                    //the websocket delete book event will handle the removal from the books array.
                },
                error => {
            console.log("Error occured deleting book with ref: " + book._links.self.href + ": (" + error + ")");
        });
    }

    editBook(book){
        console.log("Now editing book " + book._links.self.href);
    }

    componentDidMount() {
        client({method: 'GET', path: root + '/api/books'}).done(response => {
            this.setState({books: response.entity._embedded.books});
        });
        stompClient.register([
            {route: '/topic/booksCreated', callback: this.doAfterBookCreatedEvent},
            {route: '/topic/booksDeleted', callback: this.doAfterBookDeletedEvent}
        ]);
    }

    render() {
        var book = this.state.books.map(book =>
                <Book key={book._links.self.href} book={book}
                      deleteBook={this.deleteBook}
                      editBook={this.editBook}/>
        );
        return (
            <table className="table table-hover table-bordered table-striped">
                <thead>
                <tr>
                    <th className="col-md-3">Author</th>
                    <th className="col-md-3">Title</th>
                    <th className="col-md-3">Categories</th>
                    <th className="col-md-3">Details</th>
                </tr>
                </thead>
                <tbody>
                {book}
                </tbody>
            </table>
        )
    }
}

class Book extends React.Component{

    constructor(props) {
        super(props);
        this.delete = this.delete.bind(this);
        this.openUpdateModal = this.openUpdateModal.bind(this);
        this.closeUpdateModal = this.closeUpdateModal.bind(this);
        this.state = {updateModalOpen: false, authors: [], categories: []};
    }

    componentDidMount() {
        client({method: 'GET', path: this.props.book._links.authors.href}).done(response => {
            this.setState({authors: response.entity._embedded.authors});
        });
        client({method: 'GET', path: this.props.book._links.categories.href}).done(response => {
            this.setState({categories: response.entity._embedded.categories});
        });
    }

    delete(){
        this.props.deleteBook(this.props.book);
    }

    openUpdateModal(){
        this.setState({updateModalOpen: true});
    }

    closeUpdateModal(){
        this.setState({updateModalOpen: false});
    }

    render() {
        return (
            <tr>
                <td>
                    <ul className="unstyled">
                        {
                            this.state.authors.map(function(author){
                                return <li key={author.firstName + " " + author.lastName}>{author.firstName + " " + author.lastName}</li>
                            })
                        }
                    </ul>
                </td>
                <td>{this.props.book.title}</td>
                <td>{
                    this.state.categories.map(function(category){
                        return <li key={category.name}>{category.name}</li>
                    })
                }
                </td>
                <td>
                    <button className="btn btn-danger" type="button" onClick={this.delete}>
                        <span className="glyphicon glyphicon-trash"></span>
                    </button>
                    <button className="btn btn-default" type="button" onClick={this.openUpdateModal}>
                        <span className="glyphicon glyphicon-edit"></span>
                    </button>
                    <UpdateBookDialog show={this.state.updateModalOpen} book={this.props.book} close={this.closeUpdateModal}/>
                </td>
            </tr>
        )
    }
}