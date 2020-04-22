import React, { Component, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import * as BooksAPI from '../BooksAPI'
import BookList from '../Components/BookList'
import Loading from '../Components/Loading'

const MAX_SEARCH_RESULT = 20
export default class SearchScreen extends Component {
  // const [query, ]
  state = {
    query: '',
    searchResult: [],
    isLoading: false,
  }

  handleSearch = (query = this.state.query) => {
    this.setState(() => ({
      isLoading: true,
    }))
    BooksAPI.search(query, MAX_SEARCH_RESULT)
      .then((results) => {
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
            searchResult: results,
            isLoading: false,
          }))
        }
      })
      .catch((err) => {
        this.setState(() => ({
          isLoading: false,
          searchResult: [],
        }))
        console.warn('search error', err)
        toast.error(`No books found for the keywoard - ${query}`, {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
  }

  handleQueryChange = (query) => {
    this.setState(() => ({
      query,
    }))
  }

  handleShelfChange = (book, newShelf, newShelfTitle) => {
    this.setState(() => ({
      isLoading: true,
    }))
    BooksAPI.updateAsync(book, newShelf)
      .then(() => {
        toast.success(`${book.title} successfully moved to ${newShelfTitle}`, {
          position: toast.POSITION.TOP_RIGHT,
        })
        this.setState(() => ({
          isLoading: false,
        }))
      })
      .catch((error) => {
        this.setState(() => ({
          isLoading: false,
        }))
        toast.error(`An Error occured. Please try again later.`, {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
  }

  render() {
    const { isLoading } = this.state
    return (
      <div className="search-books">
        {isLoading === true && <Loading />}
        <div className="search-books-bar">
          <Link className="close-search" to="/">
            Close
          </Link>
          <div className="search-books-input-wrapper">
            <form
              onSubmit={(event) => {
                event.preventDefault()
                this.handleSearch()
              }}
            >
              <input
                type="text"
                placeholder="Search by title or author"
                value={this.state.query}
                onChange={(event) => this.handleQueryChange(event.target.value)}
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
