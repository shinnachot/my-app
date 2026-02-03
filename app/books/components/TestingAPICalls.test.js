import { render, screen, waitFor } from '@testing-library/react';
import { FetchData } from '../../utils/Services';
import TestingAPICalls from './TestingAPICalls';

jest.mock('../../utils/Services', () => ({
    FetchData: jest.fn(),
}));
const mockData = [{ name: 'Book 1' }, { name: 'Book 2' }];

describe('TestingAPICalls Component', () => {
    it('renders data fetched from FetchData', async () => {
        // Mock the FetchData function to return test data
        FetchData.mockResolvedValueOnce(mockData);

        // Render the component
        render(<TestingAPICalls />);

        // Wait for the data to be rendered
        await waitFor(() => {
            mockData.forEach(item => {
                expect(screen.getByText(item.name)).toBeInTheDocument();
            });
        });
    });

    it('renders no data when FetchData returns an empty array', async () => {
        // Mock the FetchData function to return an empty array
        FetchData.mockResolvedValueOnce([]);

        // Render the component
        render(<TestingAPICalls />);

        // Wait for the component to update and check that no data is rendered
        await waitFor(() => {
            expect(screen.queryByText(/Book 1/)).not.toBeInTheDocument();
        });
    });
});