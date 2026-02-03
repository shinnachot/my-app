"use client"
import BooksContext from '@/context/books';
import { Suspense, lazy, useContext, useEffect } from 'react';
import BookCreate from './components/BookCreate';
const BookList = lazy(() => import('./components/BookList'));

function App() {
  const { fetchBooks } = useContext(BooksContext);
  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="app">
      <h1>Reading List</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <BookList />
      </Suspense>
      <BookCreate />

    </div>
  );
}

export default App;
