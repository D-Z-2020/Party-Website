import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react';
import JoinRoomForm from '../JoinRoomForm';
import '@testing-library/jest-dom'
import axios from "axios";
jest.mock('axios');
const mockedAxios = axios;
describe('Test JoinRoomForm', () => {
    it('should render correctly', () => {
        const joinRoom = jest.fn();
        const setRoomCodeToJoin = jest.fn();
        const setShowJoinRoomForm = jest.fn();
        const { getByText, queryByPlaceholderText } = render(
          <JoinRoomForm
            joinRoom={joinRoom}
            setRoomCodeToJoin={setRoomCodeToJoin}
            setShowJoinRoomForm={setShowJoinRoomForm}
            roomIdToJoin={'123'}
          />
        );
        expect(getByText('Join a party')).toBeInTheDocument();
        expect(queryByPlaceholderText('4 Digits Party Code')).toBeInTheDocument();
    });
    it('should call setRoomCodeToJoin when enter', () => {
        const joinRoom = jest.fn();
        const setRoomCodeToJoin = jest.fn();
        const setShowJoinRoomForm = jest.fn();
        const { getByText, queryByPlaceholderText } = render(
          <JoinRoomForm
            joinRoom={joinRoom}
            setRoomCodeToJoin={setRoomCodeToJoin}
            setShowJoinRoomForm={setShowJoinRoomForm}
            roomIdToJoin={'123'}
          />
        );
        const input = queryByPlaceholderText('4 Digits Party Code');
        fireEvent.change(input, {target: {value: 'test'}});
        expect(setRoomCodeToJoin).toHaveBeenCalledTimes(1)
    })
    it('should call setShowJoinRoomForm when click submit', () => {
        const joinRoom = jest.fn();
        const setRoomCodeToJoin = jest.fn();
        const setShowJoinRoomForm = jest.fn();
        const { getByText,
            getByDisplayValue,
            queryByPlaceholderText } = render(
          <JoinRoomForm
            joinRoom={joinRoom}
            setRoomCodeToJoin={setRoomCodeToJoin}
            setShowJoinRoomForm={setShowJoinRoomForm}
            roomIdToJoin={'123'}
          />
        );
        const button = getByDisplayValue('Back');
        fireEvent.click(button);
        expect(setShowJoinRoomForm).toHaveBeenCalledTimes(1)
    })
});
