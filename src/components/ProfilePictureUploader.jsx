import { useState, useEffect } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../firebase';
import axios from 'axios'; // <-- Make sure to import axios!

function ProfilePictureUploader({ userId, onUploadComplete }) {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    // State for tracking the profile picture URL
    const [profilePictureURL, setProfilePictureURL] = useState(null);

    useEffect(() => {
        // Check localStorage for a previously stored profile picture URL
        const storedProfilePictureURL = localStorage.getItem('profilePictureURL');
        if (storedProfilePictureURL) {
            setProfilePictureURL(storedProfilePictureURL);
        }
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file || !userId) return;

        const storageRef = ref(storage, `profilePictures/${userId}/${file.name}`);
        setUploading(true);

        try {
            // Upload file to Firebase Storage
            await uploadBytes(storageRef, file);

            // Get the download URL
            const downloadURL = await getDownloadURL(storageRef);

            // Save the download URL to localStorage
            localStorage.setItem('profilePictureURL', downloadURL);

            // Call the backend to update the user's profile picture
            await axios.put(`https://e9a31eec-d312-45e7-8960-2a935181c7c2-00-21vv1xhchkzhd.sisko.replit.dev/users/${userId}/profile-picture`, {
                profile_picture: downloadURL,
            });

            // After everything successful, call onUploadComplete
            onUploadComplete(downloadURL);
        } catch (err) {
            console.error(err);
            setError('Failed to upload');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="mb-3">
            <input type="file" onChange={handleFileChange} accept="image/*" />
            <button onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload'}
            </button>
            {error && <p className="text-danger">{error}</p>}
        </div>
    );
}

export default ProfilePictureUploader;

