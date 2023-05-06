import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RoomImages = ({ roomId, handleImageDeleted}) => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/images/roomID=${roomId}`);
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
            await axios.delete(`http://localhost:3001/images/roomID=${roomId}/filename=${filename}`);
            setImages(prevImages => prevImages.filter((img, i) => i !== index));
            handleImageDeleted();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <div>
                {images.map((image, index) => (
                    <div key={index} style={{ display: 'inline-block', margin: '10px' }}>
                        <img
                            src={`http://localhost:3001${image}`}
                            alt={`Room-${roomId}-Image${index + 1}`}
                            style={{ width: '200px' }}
                        />
                        <br />
                        <a href={`http://localhost:3001${image}`} download={`Room-${roomId}-Image-${index + 1}`} target="_blank" rel="noopener noreferrer">
                            <button>View In New Tab</button>
                        </a>
                        <button onClick={() => downloadImage(`http://localhost:3001` + image, `Room-${roomId}-Image-${index + 1}`)}>
                            Download
                        </button>
                        <button onClick={() => deleteImage(image, index)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoomImages;
