import React, { useState } from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, signInWithPopup } from '../firebase.js';
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
            background: 'linear-gradient(to bottom right, #d0f0f6, #ffffff)',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem'
        }}>
            <Card style={{
                width: '100%',
                maxWidth: '400px',
                padding: '2rem',
                borderRadius: '1.5rem',
                boxShadow: '0 8px 30px rgba(0, 123, 255, 0.2)',
                border: 'none'
            }}>
                <Card.Body>
                    <div className="text-center mb-4">
                        <img
                            src="/images/clinic-logo.jpg"
                            alt="Dental Logo"
                            style={{ width: '70px', marginBottom: '1rem' }}
                        />
                        <h3 style={{ color: '#00bcd4', fontWeight: '600' }}>BrightSmile Dental</h3>
                        <p className="text-muted" style={{ fontSize: '0.95rem' }}>
                            Your Smile, Our Passion
                        </p>
                    </div>

                    {error && (
                        <Alert variant="danger" className="text-center" style={{ fontSize: '0.9rem' }}>
                            {error}
                        </Alert>
                    )}

                    <Button
                        variant="primary"
                        onClick={handleGoogleSignIn}
                        className="w-100"
                        style={{
                            backgroundColor: '#00bcd4',
                            border: 'none',
                            fontWeight: '600',
                            letterSpacing: '0.5px'
                        }}
                    >
                        Sign in with Google
                    </Button>

                    <div className="text-center mt-3">
                        <small className="text-muted">
                            By signing in, you agree to our <a href="#" style={{ color: '#00bcd4' }}>Terms</a> & <a href="#" style={{ color: '#00bcd4' }}>Privacy Policy</a>.
                        </small>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Login;

