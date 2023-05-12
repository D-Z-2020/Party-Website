import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react';
import ImageUpload from '../ImageUpload';
import '@testing-library/jest-dom'
import axios from "axios";
jest.mock('axios');
const mockedAxios = axios;
describe('Test ImageUpload', () => {
    it('should render correctly', () => {
        const onImageUploaded = jest.fn();
        const { getByText } = render(
          <ImageUpload roomId={'test-id'} onImageUploaded={onImageUploaded} />
        );
        expect(getByText('Upload')).toBeInTheDocument();
    });

    it('should call onImageUploaded function when click button', async () => {
        const onImageUploaded = jest.fn();
        const { getByText } = render(
          <ImageUpload roomId={'test-id'} onImageUploaded={onImageUploaded} />
        );
        mockedAxios.post.mockResolvedValue({
            data: null
        });
        const uploadButton = getByText('Upload');
        fireEvent.click(uploadButton);
        await waitFor(() => {
            expect(onImageUploaded).toHaveBeenCalledTimes(1);
        })
    });
});
