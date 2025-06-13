import { useState, useEffect } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../firebase';
import axios from 'axios';
import { Button } from 'react-bootstrap';

function ProfilePictureUploader({ userId, onUploadComplete }) {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [profilePictureURL, setProfilePictureURL] = useState(null);

    useEffect(() => {
        const storedProfilePictureURL = localStorage.getItem('profilePictureURL');
        if (storedProfilePictureURL) {
            setProfilePictureURL(storedProfilePictureURL);
        }
    }, []);

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        await handleUpload(selectedFile); // Automatically upload when file is selected
    };

    const handleUpload = async (file) => {
        if (!file || !userId) return;

        const storageRef = ref(storage, `profilePictures/${userId}/${file.name}`);
        setUploading(true);

        try {
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            localStorage.setItem('profilePictureURL', downloadURL);

            await axios.put(`https://e9a31eec-d312-45e7-8960-2a935181c7c2-00-21vv1xhchkzhd.sisko.replit.dev/users/${userId}/profile-picture`, {
                profile_picture: downloadURL,
            });

            setProfilePictureURL(downloadURL); // Optionally update profile picture URL in state
            onUploadComplete(downloadURL);
        } catch (err) {
            console.error(err);
            setError('Failed to upload');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="d-flex flex-column align-items-start mb-4">
            <label className="form-label" style={{ fontWeight: '500' }}>
                Select a profile picture
            </label>

            {/* File input (now triggers the upload automatically) */}
            <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                disabled={uploading}
                style={{ display: 'none' }}
                id="file-input"
            />

            {/* Combined button to trigger file input */}
            <Button
                variant="outline-primary"
                className="mb-2"
                onClick={() => document.getElementById('file-input').click()}
            >
                {uploading ? 'Uploading...' : 'Upload Profile Picture'}
            </Button>

            {/* Display selected file name */}
            {file && <div className="mb-2">{file.name}</div>}

            {error && <p className="text-danger mt-2">{error}</p>}
        </div>
    );
}

export default ProfilePictureUploader;



