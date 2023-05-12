import React from 'react';
import {render, fireEvent,} from '@testing-library/react';
import UserRegister from '../UserRegister';
import '@testing-library/jest-dom'
import {BrowserRouter} from "react-router-dom";
describe('Test UserRegister', () => {
    it('should render correctly', () => {
        const setUseName = jest.fn();
        const { queryByPlaceholderText } = render(
          <BrowserRouter>
              <UserRegister setUserName={setUseName} />
          </BrowserRouter>
        );
        expect(queryByPlaceholderText('name')).toBeInTheDocument();
        expect(queryByPlaceholderText('password')).toBeInTheDocument();
    });

    it('should updates name and password when user enter', () => {
        const { getByPlaceholderText } = render(
          <BrowserRouter>
              <UserRegister setUserName={() => {}} />
          </BrowserRouter>
        );
        fireEvent.change(getByPlaceholderText('name'), { target: { value: 'tester' } });
        fireEvent.change(getByPlaceholderText('password'), { target: { value: 'tester' } });
        expect(getByPlaceholderText('name')).toHaveValue('tester');
        expect(getByPlaceholderText('password')).toHaveValue('tester');
    });

});
