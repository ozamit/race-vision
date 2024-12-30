import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Container, Typography, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

import { host } from '../../utils/host';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const navigate = useNavigate(); // Initialize useNavigate

    const onSubmit = async (data) => {
        try {
            // Convert email to lowercase
            data.email = data.email.toLowerCase();
    
            const response = await fetch(`${host}users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (response.status === 201) {
                const result = await response.json();
                setSnackbarMessage(result.message || 'Registration successful');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
    
                // Redirect to login after showing the snackbar
                setTimeout(() => {
                    navigate('/login');
                }, 2000); // Wait 2 seconds to display the message
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }
        } catch (error) {
            setSnackbarMessage(error.message || 'An unknown error occurred');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };
    
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return; // Prevent closing on clickaway
        setSnackbarOpen(false);
    };

    return (
        <Container maxWidth="sm">
            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Typography variant="h4" component="h1" gutterBottom>
                Register
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    fullWidth
                    label="Email"
                    margin="normal"
                    {...register('email', { required: 'Email is required' })}
                    error={!!errors.email}
                    helperText={errors.email ? errors.email.message : ''}
                />
                <TextField
                    fullWidth
                    label="Name"
                    margin="normal"
                    {...register('name', { required: 'Name is required' })}
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ''}
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    margin="normal"
                    {...register('password', { required: 'Password is required' })}
                    error={!!errors.password}
                    helperText={errors.password ? errors.password.message : ''}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Register
                </Button>
                <Typography variant="body2" align="center" style={{ marginTop: '1rem' }}>
                    Already have an account? <a href="/login" onClick={() => window.location.href = '/login'}>Login</a>
                </Typography>
            </form>
        </Container>
    );
};

export default Register;
