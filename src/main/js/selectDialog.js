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

export default class SelectDialog extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            collection: [],
            selectedId: ""
        };
        this.handleSelection = this.handleSelection.bind(this);
        this.submit = this.submit.bind(this);
    }
    componentDidMount() {
        client({method: 'GET', path: this.props.collectionUrl}).done(response => {
            this.setState({collection: response.entity._embedded[this.props.collectionName]});
        });
    }
    handleSelection(event){
        this.setState({
            selectedId: event.target.value
        })
    }
    submit(){
        if(this.state.selectedId){
            var foundObject = undefined;
            this.state.collection.forEach(
                function(item) {
                    if (item.id == this.state.selectedId) {
                        foundObject = item;
                    }
                }, this
            );
            this.props.add(foundObject);
        }
    }

    render(){

        var items = this.state.collection.map(item =>
                <option key={item.id} value={item.id}>{item[this.props.collectionLabel]}</option>
        );

        return (
            <Modal show={this.props.show} bsSize="small">
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-lg">{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form horizontal>
                        <FormGroup>
                            <Col md={12}>
                                <FormControl componentClass="select" value={this.state.selectedId} onChange={this.handleSelection}>
                                    <option value="">-- Selecteer hieronder --</option>
                                    {items}
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