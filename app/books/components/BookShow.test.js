import { fireEvent, render, screen } from "@testing-library/react";
import useBookContext from "../../../hooks/use-books-context";
import BookShow from "./BookShow";

// Mock `useBookContext`
jest.mock("../../../hooks/use-books-context", () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe("BookShow Component", () => {
    const mockDeleteBookById = jest.fn();
    const mockEditBookById = jest.fn();
    const book = { id: "123", title: "The Great Gatsby" };

    beforeEach(() => {
        // Mock the context return value
        useBookContext.mockReturnValue({
            deleteBookById: mockDeleteBookById,
            editBookById: mockEditBookById
        });
    });

    test("renders the book cover image correctly", () => {
        render(<BookShow book={book} />);

        const imgElement = screen.getByRole("img", { name: /booksImage/i });
        expect(imgElement).toBeInTheDocument();
        expect(imgElement).toHaveAttribute("src", `https://picsum.photos/seed/${book.id}/300/200`);
    });

    test("renders the book title", () => {
        render(<BookShow book={book} />);

        expect(screen.getByText(book.title)).toBeInTheDocument();
    });

    test("calls deleteBookById when delete button is clicked", () => {
        render(<BookShow book={book} />);

        const deleteButton = screen.getByRole("button", { name: /delete/i });
        fireEvent.click(deleteButton);

        expect(mockDeleteBookById).toHaveBeenCalledTimes(1);
        expect(mockDeleteBookById).toHaveBeenCalledWith(book.id);
    });

    test("toggles edit mode when edit button is clicked", () => {
        render(<BookShow book={book} />);

        const editButton = screen.getByRole("button", { name: /edit/i });
        fireEvent.click(editButton);

        expect(screen.getByRole("textbox")).toBeInTheDocument(); // Assuming `BookEdit` contains an input field
    });

    test("hides edit form when handleSubmit is called", () => {
        render(<BookShow book={book} />);

        // Click "Edit" button to show BookEdit
        fireEvent.click(screen.getByRole("button", { name: /edit/i }));

        // Ensure `BookEdit` appears
        expect(screen.getByRole("textbox")).toBeInTheDocument();

        // Submit the form
        fireEvent.submit(screen.getByRole("form"));

        // Ensure `BookEdit` disappears
        expect(screen.queryByRole("textbox")).not.toBeInTheDocument();

        // Ensure `editBookById` was called
        expect(mockEditBookById).toHaveBeenCalledWith(book.id, book.title);
    });
});