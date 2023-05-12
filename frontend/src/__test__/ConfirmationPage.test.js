import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ConfirmationPage from '../ConfirmationPage';
import '@testing-library/jest-dom'
describe('Test ConfirmationPage', () => {
  it('should render correctly', () => {
    const handleClickConfirm = jest.fn();
    const handleClickCancel = jest.fn();
    const { getByText } = render(
      <ConfirmationPage handleConfirm={handleClickConfirm} handleCancel={handleClickCancel} />
    );
    expect(getByText('Are you sure?')).toBeInTheDocument();
    expect(getByText('You will lose the access to the party space.')).toBeInTheDocument();
    expect(getByText('Yes')).toBeInTheDocument();
    expect(getByText('No')).toBeInTheDocument();
  });

  it('Should call handleConfirm function when click yes', () => {
    const handleConfirm = jest.fn();
    const handleCancel = jest.fn();
    const { getByText } = render(
      <ConfirmationPage handleConfirm={handleConfirm} handleCancel={handleCancel} />
    );
    const confirmButton = getByText('Yes');
    fireEvent.click(confirmButton);
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it('Should call handleCancel function when click no', () => {
    const handleConfirm = jest.fn();
    const handleCancel = jest.fn();
    const { getByText } = render(
      <ConfirmationPage handleConfirm={handleConfirm} handleCancel={handleCancel} />
    );

    const cancelButton = getByText('No');
    fireEvent.click(cancelButton);
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });
});
