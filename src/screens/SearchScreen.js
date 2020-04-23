import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import * as BooksAPI from '../BooksAPI'
import BookList from '../Components/BookList'
import Loading from '../Components/Loading'

const MAX_SEARCH_RESULT = 20
const SearchScreen = () => {
  const [query, setQuery] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = (searchTerm = query) => {
    setIsLoading(true)
    BooksAPI.search(searchTerm, MAX_SEARCH_RESULT)
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
          setIsLoading(false)
          setSearchResult(results)
        }
      })
      .catch((err) => {
        setIsLoading(false)
        setSearchResult([])
        console.warn('search error', err)
        toast.error(`No books found for the keywoard - ${query}`, {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
  }

  const handleShelfChange = (book, newShelf, newShelfTitle) => {
    setIsLoading(true)
    BooksAPI.updateAsync(book, newShelf)
      .then(() => {
        toast.success(`${book.title} successfully moved to ${newShelfTitle}`, {
          position: toast.POSITION.TOP_RIGHT,
        })
        setIsLoading(false)
      })
      .catch((error) => {
        setIsLoading(false)
        toast.error(`An Error occured. Please try again later.`, {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
  }
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
              handleSearch()
            }}
          >
            <input
              type="text"
              placeholder="Search by title or author"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                console.log('query', query)
              }}
            />
          </form>
        </div>
      </div>
      <div className="search-books-results">
        <BookList books={searchResult} onShelfChange={handleShelfChange} />
      </div>
    </div>
  )
}

export default SearchScreen
