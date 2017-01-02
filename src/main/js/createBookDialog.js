'use strict';
const React = require('react');
const Modal = require('react-bootstrap/lib/Modal');
const Form = require('react-bootstrap/lib/Form');
const FormGroup = require('react-bootstrap/lib/FormGroup');
const Col = require('react-bootstrap/lib/Col');
const FormControl = require('react-bootstrap/lib/FormControl');
const FormControlStatic = require('react-bootstrap/lib/FormControlStatic');
const ControlLabel = require('react-bootstrap/lib/ControlLabel');
const ButtonToolbar = require('react-bootstrap/lib/ButtonToolbar');
const Button = require('react-bootstrap/lib/Button');
const Glyphicon = require('react-bootstrap/lib/Glyphicon');
const InputGroup = require('react-bootstrap/lib/InputGroup');
const DatePicker = require("react-bootstrap-date-picker");
import SelectDialog from "./selectDialog"

const client = require('./client');
const root = 'http://localhost:8080';

require('react-datepicker/dist/react-datepicker.css');

export default class CreateBookDialog extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            title: "",
            authors: [],
            isbn10: "",
            isbn13: "",
            language: "NL",
            pages: 0,
            categories: [],
            keywords: [],
            releaseDate: "2017-04-24",
            edition: 1,
            type: undefined,
            format: undefined,
            summary: "This is a summary",
            images:[],
            selectAuthorModalOpen: false,
            selectCategoryModalOpen: false,
            selecttypeModalOpen: false,
            selectFormatModalOpen: false
        };
        this.handleTitle = this.handleTitle.bind(this);
        this.handleIsbn10 = this.handleIsbn10.bind(this);
        this.handleIsbn13 = this.handleIsbn13.bind(this);
        this.handleLanguage = this.handleLanguage.bind(this);
        this.handlePages = this.handlePages.bind(this);
        this.handleReleaseDate = this.handleReleaseDate.bind(this);
        this.handleEdition = this.handleEdition.bind(this);
        this.handleSummary = this.handleSummary.bind(this);
        this.submit = this.submit.bind(this);

        this.deleteAuthor = this.deleteAuthor.bind(this);
        this.addAuthor = this.addAuthor.bind(this);
        this.openSelectAuthorModal = this.openSelectAuthorModal.bind(this);
        this.closeSelectAuthorModal = this.closeSelectAuthorModal.bind(this);

        this.deleteCategory = this.deleteCategory.bind(this);
        this.addCategory = this.addCategory.bind(this);
        this.openSelectCategoryModal = this.openSelectCategoryModal.bind(this);
        this.closeSelectCategoryModal = this.closeSelectCategoryModal.bind(this);

        this.setType = this.setType.bind(this);
        this.openSelectTypeModal = this.openSelectTypeModal.bind(this);
        this.closeSelectTypeModal = this.closeSelectTypeModal.bind(this);

        this.setFormat = this.setFormat.bind(this);
        this.openSelectFormatModal = this.openSelectFormatModal.bind(this);
        this.closeSelectFormatModal = this.closeSelectFormatModal.bind(this);
    }

    handleTitle(event){
        this.setState({
            title: event.target.value
        })
    }
    handleIsbn10(event){
        this.setState({
            isbn10: event.target.value
        })
    }
    handleIsbn13(event){
        this.setState({
            isbn13: event.target.value
        })
    }
    handleLanguage(event){
        this.setState({
            language: event.target.value
        })
    }
    handlePages(event){
        this.setState({
            pages: event.target.value
        })
    }
    handleReleaseDate(event){
        this.setState({
            releaseDate: event
        })
    }
    handleEdition(event){
        this.setState({
            pages: event.target.value
        })
    }
    handleSummary(event){
        this.setState({
            summary: event.target.value
        })
    }
    deleteAuthor(author){
        var authorIndex = this.state.authors.indexOf(author);
        var newData = this.state.authors.slice();
        newData.splice(authorIndex,1);
        this.setState({
            authors: newData
        });
    }
    addAuthor(author){
        this.setState({
            authors: this.state.authors.concat([author]),
            selectAuthorModalOpen: false
        })
    }
    openSelectAuthorModal(){
        this.setState({
            selectAuthorModalOpen: true
        })
    }
    closeSelectAuthorModal(){
        this.setState({
            selectAuthorModalOpen: false
        })
    }

    deleteCategory(category){
        var categoryIndex = this.state.categories.indexOf(category);
        var newData = this.state.categories.slice();
        newData.splice(categoryIndex,1);
        this.setState({
            categories: newData
        });
    }
    addCategory(category){
        this.setState({
            categories: this.state.categories.concat([category]),
            selectCategoryModalOpen: false
        })
    }
    openSelectCategoryModal(){
        this.setState({
            selectCategoryModalOpen: true
        })
    }
    closeSelectCategoryModal(){
        this.setState({
            selectCategoryModalOpen: false
        })
    }

    setType(type){
        this.setState({
            type: type,
            selectTypeModalOpen: false
        })
    }
    openSelectTypeModal(){
        this.setState({
            selectTypeModalOpen: true
        })
    }
    closeSelectTypeModal(){
        this.setState({
            selectTypeModalOpen: false
        })
    }

    setFormat(format){
        this.setState({
            format: format,
            selectFormatModalOpen: false
        })
    }
    openSelectFormatModal(){
        this.setState({
            selectFormatModalOpen: true
        })
    }
    closeSelectFormatModal(){
        this.setState({
            selectFormatModalOpen: false
        })
    }

    submit(){
        var authorLinks = this.state.authors.map(author => author._links.self.href);
        var categoryLinks = this.state.categories.map(category => category._links.self.href);
        var typeLink = this.state.type ? this.state.type._links.self.href : undefined;
        var formatLink = this.state.format ? this.state.format._links.self.href : undefined;

        client({
            method: 'POST',
            path: root + "/api/books",
            entity: {
                title: this.state.title,
                authors: authorLinks,
                isbn10: this.state.isbn10,
                isbn13: this.state.isbn13,
                language: this.state.language,
                pages: this.state.pages,
                categories: categoryLinks,
                keywords: this.state.keywords,
                releaseDate: this.state.releaseDate,
                edition: this.state.edition,
                type: typeLink,
                format: formatLink,
                summary: this.state.summary,
                images: this.state.images
            },
            headers: {'Content-Type': 'application/json'}}
        ).done(response => {
                this.props.close();
        });
    }

    render(){
        return (
            <Modal show={this.props.show} bsSize="large">
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-lg">Creëer nieuw boek</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form horizontal>
                        <FormGroup>
                            <Col md={3}>
                                <ControlLabel>Titel:</ControlLabel>
                            </Col>
                            <Col md={9}>
                                <FormControl type="text" placeholder="Een titel" onChange={this.handleTitle}/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col md={3}>
                                <ControlLabel>Auteurs:</ControlLabel>
                            </Col>
                            <Col md={9}>
                                <table className="table table-striped table-bordered">
                                    <tbody>
                                        {
                                            this.state.authors.length === 0 ?
                                                <tr>
                                                    <td className="col-md-12" colSpan="2">Geen auteurs</td>
                                                </tr>
                                                :
                                            this.state.authors.map(author =>
                                                <tr key={author.id}>
                                                    <td>{author.name}</td>
                                                    <td>
                                                        <Button bsStyle="primary" type="button" onClick={() => this.deleteAuthor(author)}>
                                                            <Glyphicon glyph="thrash"/> Verwijder
                                                        </Button>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        <tr>
                                            <td colSpan="2">
                                                <Button bsStyle="primary" type="button" onClick={this.openSelectAuthorModal}>
                                                    <Glyphicon glyph="plus"/> Voeg bestaande auteur toe
                                                </Button>
                                                <SelectDialog show={this.state.selectAuthorModalOpen}
                                                                    add={this.addAuthor}
                                                                    cancel={this.closeSelectAuthorModal}
                                                                    collectionUrl={root + "/api/authors"}
                                                                    collectionName={"authors"}
                                                                    collectionLabel={"name"}
                                                                    title={"Selecteer auteur"}
                                                    />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col md={3}>
                                <ControlLabel>Categorieën:</ControlLabel>
                            </Col>
                            <Col md={9}>
                                <table className="table table-striped table-bordered">
                                    <tbody>
                                    {
                                        this.state.categories.length === 0 ?
                                            <tr>
                                                <td className="col-md-12" colSpan="2">Geen categorieën</td>
                                            </tr>
                                            :
                                            this.state.categories.map(category =>
                                                    <tr key={category.id}>
                                                        <td>{category.name}</td>
                                                        <td>
                                                            <Button bsStyle="primary" type="button" onClick={() => this.deleteCategory(category)}>
                                                                <Glyphicon glyph="thrash"/> Verwijder
                                                            </Button>
                                                        </td>
                                                    </tr>
                                            )
                                    }
                                    <tr>
                                        <td colSpan="2">
                                            <Button bsStyle="primary" type="button" onClick={this.openSelectCategoryModal}>
                                                <Glyphicon glyph="plus"/> Voeg bestaande categorie toe
                                            </Button>
                                            <SelectDialog show={this.state.selectCategoryModalOpen}
                                                          add={this.addCategory}
                                                          cancel={this.closeSelectCategoryModal}
                                                          collectionUrl={root + "/api/categories"}
                                                          collectionName={"categories"}
                                                          collectionLabel={"name"}
                                                          title={"Selecteer categorie"}
                                                />
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col md={3}>
                                <ControlLabel>ISBN 10:</ControlLabel>
                            </Col>
                            <Col md={9}>
                                <FormControl type="text" placeholder="1234567890" onChange={this.handleIsbn10}/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col md={3}>
                                <ControlLabel>ISBN 13:</ControlLabel>
                            </Col>
                            <Col md={9}>
                                <FormControl type="text" placeholder="1234567890123" onChange={this.handleIsbn13}/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col md={3}>
                                <ControlLabel>Taal:</ControlLabel>
                            </Col>
                            <Col md={9}>
                                <FormControl componentClass="select" value={this.state.language} onChange={this.handleLanguage}>
                                    <option value="NL">Nederlands</option>
                                    <option value="FR">Frans</option>
                                    <option value="EN">Engels</option>
                                    <option value="DE">Duits</option>
                                    <option value="OTHER">Andere</option>
                                </FormControl>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col md={3}>
                                <ControlLabel>Pagina's:</ControlLabel>
                            </Col>
                            <Col md={9}>
                                <FormControl type="number" placeholder="250" onChange={this.handlePages}/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col md={3}>
                                <ControlLabel>Uitgavedatum:</ControlLabel>
                            </Col>
                            <Col md={9}>
                                <DatePicker id="releaseDate-datepicker" value={this.state.releaseDate} onChange={this.handleReleaseDate} />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col md={3}>
                                <ControlLabel>Editie:</ControlLabel>
                            </Col>
                            <Col md={9}>
                                <FormControl type="number" placeholder="1" onChange={this.handleEdition}/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col md={3}>
                                <ControlLabel>Type:</ControlLabel>
                            </Col>
                            <Col md={9}>
                                <InputGroup>
                                    <FormControl.Static type="text">{this.state.type ? this.state.type.name : ""}</FormControl.Static>
                                    <InputGroup.Button>
                                        <Button bsStyle="primary" type="button" onClick={this.openSelectTypeModal}>
                                            <Glyphicon glyph="plus"/> Selecteer type
                                        </Button>
                                    </InputGroup.Button>
                                    <SelectDialog show={this.state.selectTypeModalOpen}
                                                  add={this.setType}
                                                  cancel={this.closeSelectTypeModal}
                                                  collectionUrl={root + "/api/bookTypes"}
                                                  collectionName={"bookTypes"}
                                                  collectionLabel={"name"}
                                                  title={"Selecteer type"}
                                        />
                                </InputGroup>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col md={3}>
                                <ControlLabel>Format:</ControlLabel>
                            </Col>
                            <Col md={9}>
                                <InputGroup>
                                    <FormControl.Static type="text">{this.state.format ? this.state.format.name : ""}</FormControl.Static>
                                    <InputGroup.Button>
                                        <Button bsStyle="primary" type="button" onClick={this.openSelectFormatModal}>
                                            <Glyphicon glyph="plus"/> Selecteer formaat
                                        </Button>
                                    </InputGroup.Button>
                                    <SelectDialog show={this.state.selectFormatModalOpen}
                                                  add={this.setFormat}
                                                  cancel={this.closeSelectFormatModal}
                                                  collectionUrl={root + "/api/bookFormats"}
                                                  collectionName={"bookFormats"}
                                                  collectionLabel={"name"}
                                                  title={"Selecteer formaat"}
                                        />
                                </InputGroup>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col md={3}>
                                <ControlLabel>Samenvatting:</ControlLabel>
                            </Col>
                            <Col md={9}>
                                <FormControl componentClass="textarea" placeholder="A summary of the book" onChange={this.handleSummary}/>
                            </Col>
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <ButtonToolbar>
                        <Button bsStyle="primary" type="button" onClick={this.submit}>
                            <Glyphicon glyph="ok"/> Creëer
                        </Button>
                        <Button bsStyle="primary" type="button" onClick={this.props.close}>
                            <Glyphicon glyph="remove"/> Annuleer
                        </Button>
                    </ButtonToolbar>
                </Modal.Footer>
            </Modal>
        );
    }
}