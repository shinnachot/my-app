"use client"
import { useEffect, useState } from 'react';
// import BookCreate from './components/BookCreate';
// import BookList from './components/BookList';
import TestingAPICalls from "./components/TestingAPICalls";

function App() {
  const [book, setBook] = useState(0);
  const [data, setData] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);

  useEffect(() => {
  }, []);

  const addBook = () => {
    setBook(book + 1);
  }

  const handleTest = () => {
    const text = document.getElementById("textId").value;
    setData(text);
  }

  const mockData = [
    {
      "id": 1,
      "first_name": "Fletcher",
      "last_name": "McVanamy",
      "email": "mmcvanamy0@e-recht24.de",
      "age": 30
    }, {
      "id": 2,
      "first_name": "Clarice",
      "last_name": "Harrild",
      "email": "charrild1@dion.ne.jp",
      "age": 35
    },
  ]

  const TestWithMockData = ({ data }) => {
    return (
      <div>
        <ul>
          {data.map(item => (
            <li key={item.id}>
              {item.id}
              <div data-testid="firstName">{item.first_name}</div>
              <div data-testid="lastName">{item.last_name}</div>
              {item.email}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="app">
      <h1>Reading List</h1>
      <button data-testid="btn-add" onClick={addBook} className="bg-blue-500 p-2">Add Book</button>
      <div data-testid="bookResult">{book}</div>
      {TestWithMockData({ data: mockData })}
      <input id="textId" placeholder='Enter name' />
      <button data-testid="btn-submit" onClick={handleTest} className="bg-green-500 p-2"> Submit </button>
      <div data-testid="display">{data}</div>
      <button onClick={() => { setBtnDisabled(!btnDisabled) }} className="bg-amber-500 p-2">
        Toggle button disabled
      </button>
      <button disabled={btnDisabled} className="bg-red-500 p-2">
        Toggle text
      </button>
      {/* <BookList />
      <BookCreate /> */}
      <TestingAPICalls />
    </div>
  );
}

export default App;
