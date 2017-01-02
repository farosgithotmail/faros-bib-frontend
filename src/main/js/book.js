const React = require('react');
const client = require('./client');
const Form = require('react-bootstrap/lib/Form');
const FormGroup = require('react-bootstrap/lib/FormGroup');
const Col = require('react-bootstrap/lib/Col');
const FormControl = require('react-bootstrap/lib/FormControl');
const FormControlStatic = require('react-bootstrap/lib/FormControlStatic');
const ControlLabel = require('react-bootstrap/lib/ControlLabel');
const Button = require('react-bootstrap/lib/Button');
const ButtonToolbar = require('react-bootstrap/lib/ButtonToolbar');
const Glyphicon = require('react-bootstrap/lib/Glyphicon');
import UpdateBookDialog from "./updateBookDialog";

export default class Book extends React.Component{

    constructor(props) {
        super(props);
        this.openUpdateModal = this.openUpdateModal.bind(this);
        this.closeUpdateModal = this.closeUpdateModal.bind(this);
        this.doDelete = this.doDelete.bind(this);
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

    doDelete(){
        console.log("Deleting");
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
                border: "1px solid",
                borderColor: "#87a790",
                backgroundColor: "#97BAA0"
            },
            outer:{
                "marginTop": "1%",
                "marginBottom": "1%"
            }
        };

        return (
            <Col md={4} style={style.outer}>
                <Col md={12} style={style.inner}>
                    <Col md={12} >
                        <h3>{this.props.book.title}</h3>
                    </Col>
                    <Col md={12}>
                        <Form horizontal>
                            <FormGroup>
                                <Col md={4}>
                                    <ControlLabel>Auteurs:</ControlLabel>
                                </Col>
                                <Col md={8}>
                                    <FormControlStatic>
                                        {
                                            this.state.authors.map(function(author){
                                                return author.name;
                                            }).join(", ")
                                        }
                                    </FormControlStatic>
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col md={4}>
                                    <ControlLabel>Categorieën:</ControlLabel>
                                </Col>
                                <Col md={8}>
                                    <FormControlStatic>
                                        {
                                            this.state.categories.map(function(category){
                                                return category.name;
                                            }).join(", ")
                                        }
                                    </FormControlStatic>
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col md={4}>
                                    <ControlLabel>ISBN 10:</ControlLabel>
                                </Col>
                                <Col md={8}>
                                    <FormControlStatic>{this.props.book.isbn10}</FormControlStatic>
                                </Col>
                            </FormGroup>
                            <hr/>
                            <FormGroup>
                                <Col md={12}>
                                    <ButtonToolbar>
                                        <Button type="button" bsStyle="danger" onClick={() => this.props.delete(this.props.book)}><Glyphicon glyph="trash"/> Verwijder</Button>
                                        <Button type="button" disabled bsStyle="primary" onClick={this.openUpdateModal}><Glyphicon glyph="edit"/> Wijzig</Button>
                                        <UpdateBookDialog show={this.state.updateModalOpen} book={this.props.book} close={this.closeUpdateModal}/>
                                    </ButtonToolbar>
                                </Col>
                            </FormGroup>
                        </Form>
                    </Col>
                </Col>
            </Col>
        )
    }
}