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
            const res = await axios.post(`http://localhost:${process.env.REACT_APP_BACKEND_PORT}/upload/roomID=${roomId}`, formData);
            onImageUploaded();
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <div class="p-2">
            <div class="card">
                <div class="card-body">
                    <form class="px-2" onSubmit={onFileUpload}>
                        <input type="file" class="col-8" name="image" accept="image/*" onChange={onFileChange} />
                        <button type="submit" class="btn btn-add m-2">Upload</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;
