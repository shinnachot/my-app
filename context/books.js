"use client"
import axios from 'axios';
import { createContext, useState } from 'react';

const BooksContext = createContext();

function Provider({ children }) {
    const [books, setBooks] = useState([]);

    const fetchBooks = async () => {
        const response = await axios.get('http://localhost:3000/api/books');

        setBooks(response.data);
    };

    const editBookById = async (id, newTitle) => {
        const response = await axios.put(`http://localhost:3000/api/books/${id}`, {
            title: newTitle,
        });

        const updatedBooks = books.map((book) => {
            if (book.id === id) {
                return { ...book, ...response.data };
            }

            return book;
        });

        setBooks(updatedBooks);
    };

    const deleteBookById = async (id) => {
        await axios.delete(`http://localhost:3000/api/books/${id}`);

        const updatedBooks = books.filter((book) => {
            return book.id !== id;
        });

        setBooks(updatedBooks);
    };

    const createBook = async (title) => {
        const response = await axios.post('http://localhost:3000/api/books', {
            title,
        });

        const updatedBooks = [...books, response.data];
        setBooks(updatedBooks);
    };

    const valueToShare = {
        books,
        deleteBookById,
        editBookById,
        fetchBooks,
        createBook,
    }

    return <BooksContext.Provider value={valueToShare}>{children}</BooksContext.Provider>
}

export { Provider };
export default BooksContext;
