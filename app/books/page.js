import { Provider } from '@context/books';
import React from 'react';
import App from './App';

const BooksPage = () => {
  return (
    <Provider>
      <App />
    </Provider>
  );
}

export default BooksPage;