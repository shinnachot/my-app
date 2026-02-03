import { fireEvent, render, screen } from '@testing-library/react';
import { default as App, default as mockData, default as TestWithMockData } from './App';


describe('App Component', () => {
    test("renders title successfully", () => {
        render(<App />);
        const element = screen.getByText(/Reading List/i);
        expect(element).toBeInTheDocument();
    });

    test("renders the Counter component correctly", () => {
        render(<App />);

        // ตรวจสอบว่ามีตัวเลข 0 แสดงอยู่
        const countElement = screen.getByTestId("bookResult");
        expect(countElement).toHaveTextContent("0");

        // ตรวจสอบว่ามีปุ่มที่เขียนว่า "Increment"
        const button = screen.getByRole("button", { name: /Add Book/i });
        expect(button).toBeInTheDocument();
    });

    test("should click button when the user clicks", () => {
        render(<App />);
        const button = screen.getByTestId('btn-add');
        fireEvent.click(button);
        const result = screen.getByTestId('bookResult');
        expect(result).toHaveTextContent('1');
    })


    test("List renders successfully", () => {
        render(<TestWithMockData data={mockData} />)
        const firstNames = screen.getAllByTestId('firstName');
        const lastNames = screen.getAllByTestId('lastName');
        expect(firstNames[0]).toHaveTextContent(/fletcher/i);
        expect(lastNames[0]).toHaveTextContent(/mcvanamy/i);
        expect(screen.getByText(/fletcher/i)).toBeInTheDocument();
    })

    test("should display text when user types in input", () => {
        render(<App />);
        const input = screen.getByPlaceholderText('Enter name');
        fireEvent.change(input, { target: { value: 'Hello' } });
        expect(input.value).toBe('Hello');
    })

    test("should click button submit display text", () => {
        render(<App />);
        const button = screen.getByTestId('btn-submit');
        const input = screen.getByPlaceholderText('Enter name');
        fireEvent.change(input, { target: { value: 'Hello' } });
        fireEvent.click(button);
        const display = screen.getByTestId('display');
        expect(display).toHaveTextContent('Hello');
    });

    test("should disable button when user clicks", () => {
        render(<App />);
        const button = screen.getByText('Toggle button disabled');
        fireEvent.click(button);
        const toggleButton = screen.getByText('Toggle text');
        expect(toggleButton).toBeDisabled();

    });
});