
import React, { Component } from 'react'
import config from '../config'
import ValidationError from './ValidationError'
import ApiContext from '../ApiContext';

class AddNote extends Component {
  static contextType = ApiContext;
  constructor(props){
    super(props);
    this.state = {
      name: '',
      text: '',
      folder: 'b0715efe-ffaf-11e8-8eb2-f2801f1b9fd1',
      folders: [],
      errorName: null,
      errorText: null
    }
  }

  componentDidMount() {
    fetch(`${config.API_ENDPOINT}/folders`)
    .then(foldersRes => {
        if (!foldersRes.ok)
            return foldersRes.json().then(e => Promise.reject(e));
        return foldersRes.json()
    })
    .then(folders => {
        this.setState({folders})
    })
    .catch(error => {
        console.error({error})
    })
  }

  updateName(name) {
    this.setState({
      name: name,
    })
  }

  updateText(text) {
    this.setState({
      text: text,
    })
  }

  updateFolder(folder) {
    this.setState({folder: folder})
  }

  getFolders = array => {
    return array.map((option, index) => {
      return <option key={index} value={option.id}> {option.name}</option>
    })
  }

  clearNameError = () => {
    this.setState({
      errorName: null
    })
  }

  clearTextError = () => {
    this.setState({
      errorText: null
    })
  }

  validateName() {
    const name = this.state.name.trim()
    if (name.length === 0) {
      return 'Name is required';
    } else if (name.length < 3) {
      return 'Name must be at least 3 characters long';
    }
  }

  validateText() {
    const text = this.state.text.trim()
    if (text.length === 0) {
      return 'Text is required'
    }
  }

  handleSubmit(e){
    e.preventDefault();
    const newNote = {
      name: this.state.name,
      content: this.state.text,
      folderId: this.state.folder,
      modified: new Date().toLocaleDateString()
    }
    const errorName = this.validateName();
    const errorText = this.validateText();
    this.clearNameError()
    this.clearTextError()
    if (errorName){
      this.setState({
        errorName
      })
    }
    else if (errorText) {
      this.setState({
        errorText
      })
    } 
    else {
      fetch(`${config.API_ENDPOINT}/notes`, {
        method: 'POST',
        body: JSON.stringify(newNote),
        headers: {'Content-Type': 'application/json'}
      })
      .then(res => {
        if(!res.ok){
          throw new Error('Something went wrong, please try again later');
        }
        return res.json();
      })
      .then(note => {
        this.context.addNote(note)
        this.props.history.push(`/note/${note.id}`)
      })
      .catch(err => console.log(err.message)) 
    }
  }

  render() {
    return (
      <form className="addNote" onSubmit={e => this.handleSubmit(e)}>
        <h2>Add Note</h2>
        <div className="addNote__hint">* required field</div>
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            className="addNote__control"
            name="name"
            id="name"
            onChange={e => this.updateName(e.target.value)}
          />
          {this.state.errorName && (<ValidationError message={this.state.errorName} clearError={this.clearNameError}/>)}
        </div>
        
        <div className="form-group">
          <label htmlFor="text">Text *</label>
          <input
            type="text"
            className="addNote__control"
            name="text"
            id="text"
            onChange={e => this.updateText(e.target.value)}
          />
          {this.state.errorText && (<ValidationError message={this.state.errorText} clearError={this.clearTextError}/>)}
        </div>

        <div className="form-group">
          <label htmlFor="text">Folder *</label>
          <select
            name='folder'
            id='folder'
            onChange={e => this.updateFolder(e.target.value)}
          >
          {this.getFolders(this.state.folders)}
          </select>
        </div>

        <div className="addNote__button__group">
          <button type="reset" className="addNote__button" onClick={() => this.props.history.push('/')}>
            Cancel
          </button>
          <button
            type="submit"
            className="addNote__button"
          >
            Save
          </button>
        </div>
      </form>
    );
  }
}

export default AddNote;