'use strict';
const React = require('react');
const Modal = require('react-bootstrap/lib/Modal');
const client = require('./client');
const root = 'http://localhost:8080';
const Form = require('react-bootstrap/lib/Form');
const FormGroup = require('react-bootstrap/lib/FormGroup');
const Col = require('react-bootstrap/lib/Col');
const FormControl = require('react-bootstrap/lib/FormControl');
const ControlLabel = require('react-bootstrap/lib/ControlLabel');
const ButtonToolbar = require('react-bootstrap/lib/ButtonToolbar');
const Button = require('react-bootstrap/lib/Button');
const Glyphicon = require('react-bootstrap/lib/Glyphicon');

export default class SelectAuthorDialog extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            authors: [],
            selectedAuthor: ""
        };
        this.handleAuthorSelection = this.handleAuthorSelection.bind(this);
        this.submit = this.submit.bind(this);
    }
    componentDidMount() {
        client({method: 'GET', path: root + "/api/authors"}).done(response => {
            this.setState({authors: response.entity._embedded.authors});
        });
    }
    handleAuthorSelection(event){
        this.setState({
            selectedAuthor: event.target.value
        })
    }
    submit(){
        if(this.state.selectedAuthor){
            var foundAuthor = undefined;
            this.state.authors.forEach(
                function(author) {
                    if (author.id == this.state.selectedAuthor) {
                        foundAuthor = author;
                    }
                }, this
            );
            this.props.add(foundAuthor);
        }
    }

    render(){

        var authors = this.state.authors.map(author =>
            <option key={author.id} value={author.id}>{author.name}</option>
        );

        return (
            <Modal show={this.props.show} bsSize="small">
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-lg">Selecteer auteur</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form horizontal>
                        <FormGroup>
                            <Col md={12}>
                                <FormControl componentClass="select" value={this.state.selectedAuthor} onChange={this.handleAuthorSelection}>
                                    <option value="">-- Selecteer hieronder --</option>
                                    {authors}
                                </FormControl>
                            </Col>
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <ButtonToolbar>
                        <Button bsStyle="primary" onClick={this.submit}>
                            <Glyphicon glyph="ok"/> Bevestigen
                        </Button>
                        <Button bsStyle="primary" onClick={this.props.cancel}>
                            <Glyphicon glyph="remove"/> Annuleren
                        </Button>
                    </ButtonToolbar>
                </Modal.Footer>
            </Modal>
        );
    }
}