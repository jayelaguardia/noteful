
import React, { Component } from 'react'
import config from '../config'
import ValidationError from './ValidationError'
import ApiContext from '../ApiContext';

class AddFolder extends Component {
  static contextType = ApiContext;
  constructor(props){
    super(props);
    this.state = {
      name: '',
      error: null
    }
  }

  updateName(name) {
    this.setState({
      name: name,
    })
  }

  clearError = () => {
    this.setState({
      error: null
    })
  }

  validateName() {
    const name = this.state.name.trim();
    if (name.length === 0) {
      return 'Name is required';
    } else if (name.length < 3) {
      return 'Name must be at least 3 characters long';
    }
  }

  handleSubmit(e){
    e.preventDefault();
    const folder = {
      name: this.state.name,
    }
    const error = this.validateName();
    this.clearError()
    if (error){
      this.setState({
        error
      }) 
    } else {
      fetch(`${config.API_ENDPOINT}/folders`, {
        method: 'POST',
        body: JSON.stringify(folder),
        headers: {'Content-Type': 'application/json'}
      })
      .then(res => {
        if(!res.ok){
          throw new Error('Something went wrong, please try again later');
        }
        return res.json();
      })
      .then(folder => {
        this.context.addFolder(folder)
        this.props.history.push(`/folder/${folder.id}`)
      })
      .catch(err => console.log(err.message)) 
    }
  }

  render() {
    return (
      <form className="addFolder" onSubmit={e => this.handleSubmit(e)}>
        <h2>Add Folder</h2>
        <div className="addFolder__hint">* required field</div>
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            className="addFolder__control"
            name="name"
            id="name"
            onChange={e => this.updateName(e.target.value)}
          />
          {this.state.error && (<ValidationError message={this.state.error} clearError={this.clearError}/>)}
        </div>

        <div className="addFolder__button__group">
          <button type="reset" className="addFolder__button" onClick={() => this.props.history.push('/')}>
            Cancel
          </button>
          <button
            type="submit"
            className="addFolder__button"
          >
            Save
          </button>
        </div>
      </form>
    );
  }
}

export default AddFolder;