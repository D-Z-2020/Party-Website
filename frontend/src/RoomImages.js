import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RoomImages = ({ roomId, handleImageDeleted, isHost }) => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await axios.get(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/images/roomID=${roomId}`);
                setImages(res.data.files);
            } catch (error) {
                console.error(error);
            }
        };
        fetchImages();
    }, [roomId]);

    const downloadImage = async (url, filename) => {
        try {
            const response = await axios.get(url, { responseType: 'blob' });
            const binary = response.data;
            const fileExtension = url.split('.')[1];
            const anchor = document.createElement('a');
            anchor.href = URL.createObjectURL(binary);
            anchor.download = `${filename}.${fileExtension}`;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteImage = async (url, index) => {
        try {
            const filename = url.split('/').pop();
            await axios.delete(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/images/roomID=${roomId}/filename=${filename}`);
            setImages(prevImages => prevImages.filter((img, i) => i !== index));
            handleImageDeleted();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='text-center'>
            {images.map((image, index) => (
                <div key={index} style={{ display: 'inline-block', margin: '10px' }}>
                    <img
                        src={`http://localhost:${process.env.REACT_APP_BACKEND_PORT}${image}`}
                        alt={`Room-${roomId}-Image${index + 1}`}
                        style={{ width: '250px' }}
                    />
                    <br />
                    <div className='text-center'>
                        <a href={`http://localhost:${process.env.REACT_APP_BACKEND_PORT}${image}`} download={`Room-${roomId}-Image-${index + 1}`} target="_blank" rel="noopener noreferrer">
                            <button className='btn btn-secondary ml-5' style={{ display: 'inline', border: 'none', cursor: 'pointer' }} >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z" />
                                    <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z" />
                                </svg>
                            </button>
                        </a>
                        <button className='btn btn-add ml-5' style={{ display: 'inline', border: 'none', cursor: 'pointer', marginLeft: '0.4rem' }} onClick={() => downloadImage(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}` + image, `Room-${roomId}-Image-${index + 1}`)}>

                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
                                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                            </svg>
                        </button>

                        {isHost && <button className='btn btn-danger ml-5' style={{ display: 'inline', border: 'none', cursor: 'pointer', marginLeft: '0.4rem' }} onClick={() => deleteImage(image, index)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                            </svg>
                        </button>}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RoomImages;
