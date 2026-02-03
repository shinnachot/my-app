import BooksContext from "@/context/books";
import { useContext } from "react";

function useBookContext() {
    return useContext(BooksContext);
}

export default useBookContext;
