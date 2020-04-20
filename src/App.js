import React from 'react'
import './App.css'
import { Route } from 'react-router-dom'

import ReadsScreen from './screens/ReadsScreen'
import SearchScreen from './screens/SearchScreen'
import * as BooksAPI from './BooksAPI'

const bookDetails = []

const getBooksIdAndShelfDetails = function(shelves) {
  bookDetails.length = []
  //loop through all the available shelves and extract the
  //id's and shelf details of each book to be used to initialize the
  //right shelves in the search compoment
  for (const shelve of shelves) {
    for (const books of shelve.books) {
      bookDetails.push({ id: books.id, shelf: books.shelf })
    }
  }
}

class BooksApp extends React.Component {
  state = {
    shelves: []
  }

  componentDidMount() {
    BooksAPI.getAll().then(shelves => {
      getBooksIdAndShelfDetails(shelves)
      this.setState({
        shelves
      })
    })
  }

  handleBookShelfChange = (book, newShelf) => {
    BooksAPI.updateAsync(book, newShelf).then(shelves => {
      getBooksIdAndShelfDetails(shelves)
      this.setState(() => ({
        shelves
      }))
    })
  }

  render() {
    const { shelves } = this.state
    return (
      <div className="app">
        <Route
          path="/search"
          render={() => <SearchScreen bookDetails={bookDetails} />}
        />
        <Route
          exact
          path="/"
          render={() => (
            <ReadsScreen
              shelves={shelves}
              handleBookShelfChange={this.handleBookShelfChange}
            />
          )}
        />
      </div>
    )
  }
}

export default BooksApp
