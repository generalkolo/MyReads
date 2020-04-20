const api = 'https://reactnd-books-api.udacity.com'

// Generate a unique token for storing your bookshelf data on the backend server.
let token = localStorage.token
if (!token)
  token = localStorage.token = Math.random()
    .toString(36)
    .substr(-8)

const headers = {
  Accept: 'application/json',
  Authorization: token
}

//shelves represent the correct format of each shelves where
//a shelf has a title and the books on the shelf
const shelves = [
  {
    title: 'Read',
    books: []
  },
  {
    title: 'Currently Reading',
    books: []
  },
  {
    title: 'Want to Read',
    books: []
  }
]

//SHELVE_INDEX is used to reduce typo errors
const SHELVE_INDEX = {
  READ: 0,
  CURRENTLY_READING: 1,
  WANT_TO_READ: 2
}

//function to process books in shelves and add then to their
//appropriate shelf in the shelves variable
function processShelves(books) {
  for (const book of books) {
    switch (book.shelf) {
      case 'currentlyReading':
        processBooks(SHELVE_INDEX.CURRENTLY_READING, book)
        break
      case 'wantToRead':
        processBooks(SHELVE_INDEX.WANT_TO_READ, book)
        break
      case 'read':
        processBooks(SHELVE_INDEX.READ, book)
        break
      default:
        break
    }
  }
}

//processBooks add each book to their appropriate shelf
function processBooks(shelfIndex, books) {
  shelves[shelfIndex].books = [
    ...shelves[shelfIndex].books,
    getVitalBookDetails(books)
  ]
}

//getVitalBookDetails retrives the needed values from the book and returns the values to the caller
function getVitalBookDetails(books) {
  return {
    title: books.title,
    author: books.authors,
    description: books.description,
    backgroundImage: books.imageLinks,
    id: books.id,
    shelf: books.shelf
  }
}

//method to process shelf change
//by setting the books array of all shelves to an empty array
//then calling the get method with each id
//and then adding them to the repestive shelf
async function processShelfChanges(data) {
  shelves[SHELVE_INDEX.CURRENTLY_READING].books = []
  shelves[SHELVE_INDEX.READ].books = []
  shelves[SHELVE_INDEX.WANT_TO_READ].books = []

  await data.currentlyReading.forEach(id =>
    getBookDetailsAndAddToCorrectShelf(id, SHELVE_INDEX.CURRENTLY_READING)
  )

  await data.wantToRead.forEach(id =>
    getBookDetailsAndAddToCorrectShelf(id, SHELVE_INDEX.WANT_TO_READ)
  )

  await data.read.forEach(id =>
    getBookDetailsAndAddToCorrectShelf(id, SHELVE_INDEX.READ)
  )
}

async function getBookDetailsAndAddToCorrectShelf(bookId, shelfIndex) {
  await get(bookId).then(
    bookDetails =>
      (shelves[shelfIndex].books = [...shelves[shelfIndex].books, bookDetails])
  )
}

export const get = async bookId => {
  const response = await fetch(`${api}/books/${bookId}`, { headers })
  const data = await response.json()
  return getVitalBookDetails(data.book)
}

export const getAll = () =>
  fetch(`${api}/books`, { headers })
    .then(res => res.json())
    .then(data => processShelves(data.books))
    .then(() => shelves)

export const update = (book, shelf) =>
  fetch(`${api}/books/${book.id}`, {
    method: 'PUT',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ shelf })
  })
    .then(res => res.json())
    .then(data => processShelfChanges(data))
    .then(() => shelves)

export const updateAsync = async (book, shelf) => {
  const response = await fetch(`${api}/books/${book.id}`, {
    method: 'PUT',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ shelf })
  })
  const data = await response.json()
  await processShelfChanges(data)
  return shelves
}

export const search = query =>
  fetch(`${api}/search`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  })
    .then(res => res.json())
    .then(data => data.books.map(getVitalBookDetails))
    .catch(error => console.log('error', error))
