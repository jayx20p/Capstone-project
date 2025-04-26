import { useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../firebase';

function ProfilePictureUploader({ userId, onUploadComplete }) {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file || !userId) return;

        const storageRef = ref(storage, `profilePictures/${userId}/${file.name}`);
        setUploading(true);
        try {
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            onUploadComplete(downloadURL);
        } catch (err) {
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
