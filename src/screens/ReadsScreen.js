import React from 'react'
import ShelvesList from '../Components/ShelvesList'
import { Link } from 'react-router-dom'

//function to display the shelves and their respective books
const ReadsScreen = props => {
  const { shelves, handleBookShelfChange } = props

  return (
    <div className="list-books">
      <div className="list-books-title">
        <h1>MyReads</h1>
      </div>
      <div className="list-books-content">
        <ShelvesList shelves={shelves} onShelfChange={handleBookShelfChange} />
      </div>
      <div className="open-search">
        <Link to="/search" className="open-search">
          Add a book
        </Link>
      </div>
    </div>
  )
}

export default ReadsScreen
