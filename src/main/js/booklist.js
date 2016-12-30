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
import UpdateBookDialog from './updateBookDialog';

export default class BookList extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            books:[],
            searchCriteriaType: "author",
            searchCriteriaValue: "",
            sortField: "title"
        };
        this.doAfterBookCreatedEvent = this.doAfterBookCreatedEvent.bind(this);
        this.doAfterBookDeletedEvent = this.doAfterBookDeletedEvent.bind(this);
        this.deleteBook = this.deleteBook.bind(this);
        this.editBook = this.editBook.bind(this);
        this.findBookBySelfLink = this.findBookBySelfLink.bind(this);
        this.search = this.search.bind(this);
        this.updateCriteriaSelect = this.updateCriteriaSelect.bind(this);
        this.updateCriteriaValue = this.updateCriteriaValue.bind(this);
        this.updateSortSelect = this.updateSortSelect.bind(this);
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

    updateCriteriaSelect(event){
        this.setState({searchCriteriaType: event.target.value}, this.search);
    }

    updateSortSelect(event){
        this.setState({sortField: event.target.value}, this.search);
    }

    updateCriteriaValue(event){
        this.setState({searchCriteriaValue: event.target.value}, this.search);
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
                <Book key={book.id} book={book}
                      deleteBook={this.deleteBook}
                      editBook={this.editBook}/>
        );
        return (
            <div>
                <div className="col-md-12">
                    <div className="col-md-3">
                        <select className="form-control" onChange={this.updateCriteriaSelect} value={this.state.searchCriteriaType}>
                            <option value="whatever">Search on whatever</option>
                            <option value="title">Search on title</option>
                            <option value="author">Search on author name</option>
                            <option value="category">Search on category</option>
                            <option value="type">Search on type</option>
                            <option value="format">Search on format</option>
                            <option value="keyword">Search on keyword</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <input type="text" className="form-control" value={this.state.searchCriteriaValue} onChange={this.updateCriteriaValue}/>
                    </div>
                    <div className="col-md-3">
                        <select className="form-control" onChange={this.updateSortSelect} value={this.state.sortField}>
                            <option value="title">Sort on title</option>
                            <option value="isbn10">Sort on ISBN10</option>
                        </select>
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="row">
                        {book}
                    </div>
                </div>
            </div>
        );
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
        var style = {
            inner:{
                border: "1px solid"
            },
            outer:{
                "marginTop": "1%",
                "marginBottom": "1%"
            }
        };

        return (
            <div className="col-sm-4" style={style.outer}>
                <div className="col-md-12 alert-danger" style={style.inner}>
                    <h3>{this.props.book.title}</h3>
                    <form className="form-horizontal">
                        <div className="form-group">
                            <label className="control-label col-md-3">Auteurs:</label>
                            <div className="col-md-9">
                                <p className="form-control-static">
                                    {
                                        this.state.authors.map(function(author){
                                            return author.name;
                                        }).join(", ")
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label col-md-3">ISBN:</label>
                            <div className="col-md-9">
                                <p className="form-control-static">{this.props.book.isbn10}</p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            //<tr>
            //    <td>{this.props.book.title}</td>
            //    <td>{
            //        this.state.categories.map(function(category){
            //            return <li key={this.props.book.id + '_' + category.id}>{category.name}</li>
            //        },this)
            //    }
            //    </td>
            //    <td>{this.props.book.isbn10}</td>
            //    <td>
            //        <button className="btn btn-danger" type="button" onClick={this.delete}>
            //            <span className="glyphicon glyphicon-trash"></span>
            //        </button>
            //        <button className="btn btn-default" type="button" onClick={this.openUpdateModal}>
            //            <span className="glyphicon glyphicon-edit"></span>
            //        </button>
            //        <UpdateBookDialog show={this.state.updateModalOpen} book={this.props.book} close={this.closeUpdateModal}/>
            //    </td>
            //</tr>
        )
    }
}