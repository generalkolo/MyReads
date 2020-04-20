import React from 'react'
import Shelves from './Shelves'

/**
 * ShelvesList displauys a list of Shelves
 */
const ShelvesList = props => {
  const { shelves, onShelfChange } = props
  return (
    <div>
      <div className="bookshelf">
        {shelves.map(shelf => (
          <div key={shelf.title}>
            <h2 className="bookshelf-title">{shelf.title}</h2>
            <div className="bookshelf-books">
              <ol className="books-grid">
                {shelf.books.map(book => (
                  <Shelves
                    books={book}
                    key={book.id}
                    onShelfChange={onShelfChange}
                  />
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ShelvesList
