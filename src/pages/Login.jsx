import React, { useState } from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, signInWithPopup } from '../firebase';
import axios from 'axios';

function Login() {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            const email = user.email;
            const displayName = user.displayName;
            const google_uid = user.uid;

            const response = await axios.post('https://e9a31eec-d312-45e7-8960-2a935181c7c2-00-21vv1xhchkzhd.sisko.replit.dev/auth/google', {
                email,
                display_name: displayName,
                google_uid,
            });

            localStorage.setItem("user_id", response.data.user.id);
            navigate('/home');
        } catch (err) {
            console.error('Google login error:', err);
            setError(err.message || 'Something went wrong');
        }
    };

    return (
        <div style={{
            background: 'linear-gradient(to bottom right, #e0f7fa, #ffffff)',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Card style={{
                width: '25rem',
                padding: '2rem',
                borderRadius: '1rem',
                boxShadow: '0 0 20px rgba(0, 123, 255, 0.1)'
            }}>
                <Card.Body>
                    <div className="text-center mb-4">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/3820/3820331.png"
                            alt="Dental Logo"
                            style={{ width: '60px', marginBottom: '10px' }}
                        />
                        <h4 style={{ color: '#007bff' }}>Welcome to BrightSmile Dental</h4>
                        <p className="text-muted">Please sign in to continue</p>
                    </div>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Button
                        variant="outline-primary"
                        onClick={handleGoogleSignIn}
                        className="w-100"
                    >
                        Sign in with Google
                    </Button>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Login;
