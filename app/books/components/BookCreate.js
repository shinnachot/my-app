"use client"
import useBookContext from '@/hooks/use-books-context';
import { useState } from 'react';

function BookCreate() {
  const [title, setTitle] = useState('');
  const { createBook } = useBookContext();

  const handleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createBook(title);
    setTitle('');
  };

  return (
    <div className="book-create">
      <h3>Add a Book</h3>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input className="input" value={title} onChange={handleChange} />
        <button className="bg-amber-500 p-5">Create!</button>
      </form>
    </div>
  );
}

export default BookCreate;
