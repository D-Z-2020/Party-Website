import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = ({ roomId, onImageUploaded }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const onFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const onFileUpload = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const res = await axios.post(`http://localhost:3001/upload/roomID=${roomId}`, formData);
            console.log(res.data);
            onImageUploaded();
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <div>
            <div class="card">
                <div class="card-body">
                    <form onSubmit={onFileUpload}>
                        <input type="file" name="image" accept="image/*" onChange={onFileChange} />
                        <button type="submit" class="btn btn-success">Upload</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;
