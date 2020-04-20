import React, { Component } from 'react'

//Displays books in a shelf and also keeps the
//value of the shelf in state
class Shelves extends Component {
  state = {
    value: ''
  }

  componentDidMount() {
    const { props } = this
    const { books } = props
    const { shelf } = books

    this.setState(() => ({
      value: shelf
    }))
  }

  handleChange = (book, value, shelfName) => {
    if (this.state.value !== value) {
      const { onShelfChange } = this.props

      this.setState(() => ({
        value
      }))
      onShelfChange(book, value, shelfName)
    }
  }

  render() {
    const { books } = this.props
    const { value } = this.state

    return (
      <li>
        <div className="book">
          <div className="book-top">
            <div
              className="book-cover"
              style={{
                width: 128,
                height: 193,
                backgroundImage: `url(${books.backgroundImage.thumbnail})`
              }}
            />
            <div className="book-shelf-changer">
              <select
                value={typeof value !== 'undefined' ? value : 'none'}
                onChange={event =>
                  this.handleChange(
                    books,
                    event.target.value,
                    event.target[event.target.selectedIndex].text
                  )
                }
              >
                <option value="move" disabled>
                  Move to...
                </option>
                <option value="currentlyReading">Currently Reading</option>
                <option value="wantToRead">Want to Read</option>
                <option value="read">Read</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>
          <div className="book-title">{books.title}</div>
          <div className="book-authors">{books.author}</div>
        </div>
      </li>
    )
  }
}

export default Shelves
