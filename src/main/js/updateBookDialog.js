'use strict';
const React = require('react');
const Modal = require('react-bootstrap/lib/Modal');

export default class UpdateBookDialog extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <Modal show={this.props.show} bsSize="large">
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-lg">Edit Book</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h2>TODO</h2>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-primary" onClick={this.props.close}>Close</button>
                </Modal.Footer>
            </Modal>
        );
    }
}