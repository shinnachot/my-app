import { fireEvent, render, screen } from '@testing-library/react';
import useBookContext from '../../../hooks/use-books-context';
import BookEdit from './BookEdit';

jest.mock('../../../hooks/use-books-context');

describe('BookEdit Component', () => {
    const mockEditBookById = jest.fn();
    const mockOnSubmit = jest.fn();
    const book = { id: 1, title: 'Test Book' };

    beforeEach(() => {
        useBookContext.mockReturnValue({
            editBookById: mockEditBookById,
        });
    });

    it('renders the form with the initial book title', () => {
        render(<BookEdit book={book} onSubmit={mockOnSubmit} />);

        const input = screen.getByRole('textbox');
        expect(input.value).toBe('Test Book');
    });

    it('updates the title state when input value changes', () => {
        render(<BookEdit book={book} onSubmit={mockOnSubmit} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'Updated Title' } });

        expect(input.value).toBe('Updated Title');
    });

    it('calls onSubmit and editBookById with correct arguments on form submission', () => {
        render(<BookEdit book={book} onSubmit={mockOnSubmit} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'Updated Title' } });

        const form = screen.getByRole('form');
        fireEvent.submit(form);

        expect(mockOnSubmit).toHaveBeenCalled();
        expect(mockEditBookById).toHaveBeenCalledWith(1, 'Updated Title');
    });
});