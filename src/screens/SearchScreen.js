import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import * as BooksAPI from '../BooksAPI'
import BookList from '../Components/BookList'

const MAX_SEARCH_RESULT = 20
export default class SearchScreen extends Component {
  state = {
    query: '',
    searchResult: []
  }

  handleSearch = (query = this.state.query) => {
    BooksAPI.search(query, MAX_SEARCH_RESULT).then(results => {
      if (results.length > 0) {
        //loop through the books in the shelves
        //check if the id corresponds
        //if yes assign the corresponding shelf to the search results
        const { bookDetails } = this.props
        for (const books of bookDetails) {
          for (const result of results) {
            if (books.id === result.id) {
              result.shelf = books.shelf
            }
          }
        }
        this.setState(() => ({
          searchResult: results
        }))
      }
    })
  }

  handleQueryChange = query => {
    this.setState(() => ({
      query
    }))
  }

  handleShelfChange = (book, newShelf, newShelfTitle) => {
    BooksAPI.updateAsync(book, newShelf).then(() => {
      alert(`${book.title} successfully moved to ${newShelfTitle}`)
    })
  }

  render() {
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link className="close-search" to="/">
            Close
          </Link>
          <div className="search-books-input-wrapper">
            <form
              onSubmit={event => {
                event.preventDefault()
                this.handleSearch()
              }}
            >
              <input
                type="text"
                placeholder="Search by title or author"
                value={this.state.query}
                onChange={event => this.handleQueryChange(event.target.value)}
              />
            </form>
          </div>
        </div>
        <div className="search-books-results">
          <BookList
            books={this.state.searchResult}
            onShelfChange={this.handleShelfChange}
          />
        </div>
      </div>
    )
  }
}
