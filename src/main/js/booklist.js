'use strict';
const React = require('react');
const client = require('./client');
const stompClient = require('./websocket-listener');
const root = 'http://localhost:8080';
const searchRoots = {
    title:{
        root: 'by-title',
        queryParam: 'title'
    },
    author:{
        root: 'by-author',
        queryParam: 'name'
    },
    type:{
        root: 'by-type',
        queryParam: 'name'
    },
    category:{
        root: 'by-category',
        queryParam: 'name'
    },
    format:{
        root: 'by-format',
        queryParam: 'name'
    },
    keyword:{
        root: 'by-keyword',
        queryParam: 'keywords'
    },
    whatever:{
        root: 'by-whatever',
        queryParam: 'whatever'
    }
};
import CreateBookDialog from './createBookDialog';
import Book from "./book";
const Col = require('react-bootstrap/lib/Col');
const Button = require('react-bootstrap/lib/Button');
const Glyphicon = require('react-bootstrap/lib/Glyphicon');
const FormControl = require('react-bootstrap/lib/FormControl');

export default class BookList extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            books:[],
            searchCriteriaType: "author",
            searchCriteriaValue: "",
            sortField: "title",
            createModalOpen: false
        };
        this.doAfterBookCreatedEvent = this.doAfterBookCreatedEvent.bind(this);
        this.doAfterBookDeletedEvent = this.doAfterBookDeletedEvent.bind(this);
        this.findBookBySelfLink = this.findBookBySelfLink.bind(this);
        this.search = this.search.bind(this);
        this.updateCriteriaSelect = this.updateCriteriaSelect.bind(this);
        this.updateCriteriaValue = this.updateCriteriaValue.bind(this);
        this.updateSortSelect = this.updateSortSelect.bind(this);
        this.openCreateModal = this.openCreateModal.bind(this);
        this.closeCreateModal = this.closeCreateModal.bind(this);
        this.delete = this.delete.bind(this);
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

    delete(book){
        client({method: 'DELETE', path: book._links.self.href}).then(
                response => {
                    //the websocket delete book event will handle the removal from the books array.
                },
                error => {
            console.log("Error occured deleting book with ref: " + book._links.self.href + ": (" + error + ")");
        });
    }

    updateCriteriaSelect(event){
        this.setState({searchCriteriaType: event.target.value}, this.search);
    }

    updateSortSelect(event){
        this.setState({sortField: event.target.value}, this.search);
    }

    updateCriteriaValue(event){
        this.setState({searchCriteriaValue: event.target.value}, this.search);
    }

    openCreateModal(){
        this.setState({createModalOpen: true});
    }

    closeCreateModal(){
        this.setState({createModalOpen: false});
    }

    search(){
        if(this.state.searchCriteriaValue){
            client({method: 'GET', path: root + '/api/books/search/' + searchRoots[this.state.searchCriteriaType]['root'] + '?'
                + searchRoots[this.state.searchCriteriaType]['queryParam'] + '=' + encodeURIComponent(this.state.searchCriteriaValue)
                + "&sort="+encodeURIComponent(this.state.sortField)
            }).then(
                    response => {
                        this.setState({books: response.entity._embedded.books});
                });
        } else{
            client({method: 'GET', path: root + '/api/books' + "?sort="+encodeURIComponent(this.state.sortField)}).done(response => {
                this.setState({books: response.entity._embedded.books});
            });
        }
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
                <Book key={book.id} book={book} delete={this.delete}/>
        );
        return (
            <Col md={12}>
                <Col md={12}>
                    <h2>Boeken</h2>
                </Col>
                <Col md={3}>
                    <select className="form-control" onChange={this.updateCriteriaSelect} value={this.state.searchCriteriaType}>
                        <option value="whatever">Zoek op eender wat</option>
                        <option value="title">Zoek op titel</option>
                        <option value="author">Zoek op auteur</option>
                        <option value="category">Zoek op categorie</option>
                        <option value="type">Zoek op type</option>
                        <option value="format">Zoek op formaat</option>
                        <option value="keyword">Zoek op keyword</option>
                    </select>
                </Col>
                <Col md={6}>
                    <FormControl type="text" value={this.state.searchCriteriaValue} onChange={this.updateCriteriaValue}/>
                </Col>
                <Col md={3}>
                    <select className="form-control" onChange={this.updateSortSelect} value={this.state.sortField}>
                        <option value="title">Sorteer op titel</option>
                        <option value="isbn10">Sorteer op iSBN 10</option>
                    </select>
                </Col>
                <Col md={12}>
                    <hr/>
                </Col>
                {book}
                <Col md={12}>
                    <hr/>
                </Col>
                <Col md={12}>
                    <Button  type="button" onClick={this.openCreateModal}>
                        <Glyphicon glyph="plus"/> Voeg nieuw boek toe
                    </Button>
                </Col>
                <CreateBookDialog show={this.state.createModalOpen} close={this.closeCreateModal}/>
            </Col>
        );
    }
}