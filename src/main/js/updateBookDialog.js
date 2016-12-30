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
                    <form className="form-horizontal" noValidate>
                        <div className="form-group">
                            <label className="control-label col-md-3">Title:</label>
                            <input className="col-md-9" type="text" placeholder={this.props.book.title} ref={this.props.book.title}/>
                        </div>
                        <div className="form-group">
                            <label className="control-label col-md-3">Title:</label>
                            <input className="col-md-9" type="text" placeholder={this.props.book.title} ref={this.props.book.title}/>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-primary" onClick={this.props.close}>Close</button>
                </Modal.Footer>
            </Modal>
        );
    }
}