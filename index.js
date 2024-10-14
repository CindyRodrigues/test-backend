require('dotenv').config()

const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

const { initializeDatabase } = require('./db/db.connect')
const Book = require('./models/books.models')

initializeDatabase()

async function createBook(newBook) {
  try {
    const book = new Book(newBook)
    const saveBook = await book.save()
    return saveBook
  } catch (error) {
    console.log("Error adding book:", error)
  }
}

app.post("/books", async (req, res) => {
  try {
    const savedBook = await createBook(req.body)
    if(savedBook) {
      res.status(201).json({message: "Book added successfully.", book: savedBook})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to add book."})
  }
})

async function readAllBooks() {
  try {
    const allBooks = await Book.find()
    console.log("Books found:", allBooks)
    return allBooks
  } catch (error) {
    console.log("Error reading all books:", error)
  }
}

app.get("/books", async (req, res) => {
  try {
    const books = await readAllBooks()
    if(books.length != 0) {
      res.json(books)
    } else {
      res.status(404).json({error: "No books found."})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to fetch books."})
  }
})

async function readBookByTitle(bookTitle) {
  try {
    const bookByTitle = await Book.findOne({title: bookTitle})
    return bookByTitle
  } catch (error) {
    console.log("Error reading book by title:", error)
  }
}

app.get("/books/:bookTitle", async (req, res) => {
  try {
    const book = await readBookByTitle(req.params.bookTitle)
    if(book) {
      res.json(book)
    } else {
      res.status(404).json({error: "Book not found."})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to fetch book."})
  }
})

async function readBooksByAuthor(bookAuthor) {
  try {
    const booksByAuthor = await Book.find({author: bookAuthor})
    return booksByAuthor
  } catch (error) {
    console.log("Error reading books by author:", error)
  }
}

app.get("/books/author/:authorName", async (req, res) => {
  try {
    const books = await readBooksByAuthor(req.params.authorName)
    if(books.length != 0) {
      res.json(books)
    } else {
      res.status(404).json({error: "No books found."})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to fetch books."})
  }
})

async function readBooksByGenre(bookGenre) {
  try {
    const booksByGenre = await Book.find({genre: bookGenre})
    return booksByGenre
  } catch (error) {
    console.log("Error reading books by genre:", error)
  }
}

app.get("/books/genre/:genreName", async (req, res) => {
  try {
    const books = await readBooksByGenre(req.params.genreName)
    if(books.length != 0) {
      res.json(books)
    } else {
      res.status(404).json({error: "No books found."})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to fetch books."})
  }
})

async function readBooksByPublishedYear(bookPublishedYear) {
  try {
    const booksByPublishedYear = await Book.find({publishedYear: bookPublishedYear})
    return booksByPublishedYear
  } catch (error) {
    console.log("Error reading books by published year:", error)
  }
}

app.get("/books/year/:publishedYear", async (req, res) => {
  try {
    const books = await readBooksByPublishedYear(req.params.publishedYear)
    if(books.length != 0) {
      res.json(books)
    } else {
      res.status(404).json({error: "No books found."})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to fetch books."})
  }
})

async function updateBookById(bookId, dataToUpdate) {
  try {
    const updateBook = await Book.findByIdAndUpdate(bookId, dataToUpdate, {new: true})
    return updateBook
  } catch (error) {
    console.log("Error updating book by id:", error)
  }
}

app.post("/books/:bookId", async (req, res) => {
  try {
    const updatedBook = await updateBookById(req.params.bookId, req.body)
    if(updatedBook) {
      res.status(200).json({message: "Book updated successfully.", updatedBook: updatedBook})
    } else {
      res.status(404).json({error: "Book does not exist."})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to update book."})
  }
})

async function updateBookByTitle(bookTitle, dataToUpdate) {
  try {
    const updateBook = await Book.findOneAndUpdate({title: bookTitle}, dataToUpdate, {new: true})
    return updateBook
  } catch (error) {
    console.log("Error updating book by title:", error)
  }
}

app.post("/books/title/:bookTitle", async (req, res) => {
  try {
    const updatedBook = await updateBookByTitle(req.params.bookTitle, req.body)
    if(updatedBook) {
      res.status(200).json({message: "Book updated successfully.", updatedBook: updatedBook})
    } else {
      res.status(404).json({error: "Book does not exist."})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to update book."})
  }
})

async function deleteBookById(bookId) {
  try {
    const deleteBook = await Book.findByIdAndDelete(bookId)
    return deleteBook
  } catch (error) {
    console.log("Error deleting book by id:", error)
  }
}

app.delete("/books/:bookId", async (req, res) => {
  try {
    const deletedBook = await deleteBookById(req.params.bookId)
    if(deletedBook) {
      res.status(200).json({message: "Book deleted successfully."})
    } else {
      res.status(404).json({error: "Book not found."})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to delete book."})
  }
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})