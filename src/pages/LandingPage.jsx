import React, { useState } from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, signInWithPopup } from '../firebase.js';
import axios from 'axios';

function LandingPage() {
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
            <Container>
                <Card style={{
                    padding: '3rem',
                    borderRadius: '2rem',
                    boxShadow: '0 8px 30px rgba(0, 123, 255, 0.2)',
                    border: 'none',
                    textAlign: 'center'
                }}>
                    <div className="mb-5">
                        <img
                            src="/images/clinic-logo.jpg"
                            alt="Dental Logo"
                            style={{ width: '100px', marginBottom: '1rem' }}
                        />
                        <h2 style={{ color: '#00bcd4', fontWeight: '600' }}>Welcome to BrightSmile Dental!</h2>
                        <p className="text-muted" style={{ fontSize: '1.1rem' }}>
                            Your Smile, Our Passion. Providing expert care for your dental needs.
                        </p>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h4>Transform Your Smile Today!</h4>
                        <p className="text-muted" style={{ fontSize: '1rem' }}>
                            Book an appointment with our skilled dentists and start your journey to a brighter, healthier smile.
                        </p>
                    </div>

                    <div style={{ marginTop: '3rem' }}>
                        <h5>Sign in for Personalized Care</h5>
                        <p className="text-muted" style={{ fontSize: '1rem' }}>
                            Sign in to manage your appointments, track treatments, and receive special offers.
                        </p>

                        {error && (
                            <Alert variant="danger" style={{ fontSize: '0.9rem' }}>
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
                    </div>

                    <div className="text-center mt-3">
                        <small className="text-muted">
                            By signing in, you agree to our <a href="#" style={{ color: '#00bcd4' }}>Terms</a> & <a href="#" style={{ color: '#00bcd4' }}>Privacy Policy</a>.
                        </small>
                    </div>
                </Card>
            </Container>
        </div>
    );
}

export default LandingPage;


