import React from 'react'
import Shelves from './Shelves'

const BookList = props => {
  const { books, onShelfChange } = props
  return (
    <div>
      <div className="bookshelf">
        <div className="bookshelf-books">
          <ol className="books-grid">
            {books.map(book => (
              <Shelves
                books={book}
                key={book.id}
                onShelfChange={onShelfChange}
              />
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}

export default BookList
