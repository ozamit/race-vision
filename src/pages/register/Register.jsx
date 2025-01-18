import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Container, Typography, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { host } from '../../utils/host';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
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

                setTimeout(() => {
                    navigate('/login');
                }, 2000);
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
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    return (
        <Container maxWidth="sm">
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

            <Typography color='white' variant="h4" component="h1" gutterBottom>
                Register
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    fullWidth
                    label="Email"
                    margin="normal"
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Invalid email address',
                        },
                    })}
                    error={!!errors.email}
                    helperText={errors.email ? errors.email.message : ''}
                    sx={{
                        '& .MuiInputBase-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)', // Background color
                            borderRadius: '4px',       // Rounded corners
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#FFFFFF',    // Border color
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#FFFFFF',    // Hover border color
                        },
                        '& .MuiFormLabel-root': {
                            color: '#FFFFFF',          // Label color
                        },
                        '& .MuiFormLabel-root.Mui-focused': {
                            color: '#FFFFFF',          // Focused label color
                        },
                        '& .MuiInputBase-input': {
                            color: '#FFFFFF',             // Text color
                        },
                    }}
                />
                <TextField
                    fullWidth
                    label="Name"
                    margin="normal"
                    {...register('name', {
                        required: 'Name is required',
                        minLength: {
                            value: 3,
                            message: 'Name must be at least 3 characters',
                        },
                    })}
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ''}
                    sx={{
                        '& .MuiInputBase-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)', // Background color
                            borderRadius: '4px',       // Rounded corners
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#FFFFFF',    // Border color
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#FFFFFF',    // Hover border color
                        },
                        '& .MuiFormLabel-root': {
                            color: '#FFFFFF',          // Label color
                        },
                        '& .MuiFormLabel-root.Mui-focused': {
                            color: '#FFFFFF',          // Focused label color
                        },
                        '& .MuiInputBase-input': {
                            color: '#FFFFFF',             // Text color
                        },
                    }}
                />
                
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    margin="normal"
                    {...register('password', {
                        required: 'Password is required',
                        minLength: {
                            value: 3,
                            message: 'Password must be at least 3 characters',
                        },
                    })}
                    error={!!errors.password}
                    helperText={errors.password ? errors.password.message : ''}
                    sx={{
                        '& .MuiInputBase-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)', // Background color
                            borderRadius: '4px',       // Rounded corners
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#FFFFFF',    // Border color
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#FFFFFF',    // Hover border color
                        },
                        '& .MuiFormLabel-root': {
                            color: '#FFFFFF',          // Label color
                        },
                        '& .MuiFormLabel-root.Mui-focused': {
                            color: '#FFFFFF',          // Focused label color
                        },
                        '& .MuiInputBase-input': {
                            color: '#FFFFFF',             // Text color
                        },
                    }}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth
                sx={{
                    width: '100%', // 90% width of the container
                    backgroundColor: '#FDCA40', // Button color
                    color: '#3772FF', // Text color
                    margin: '10px auto', // Margin to center the button horizontally and spacing on top
                    display: 'block', // Ensures the button is treated as a block element for centering
                    '&:hover': {
                        backgroundColor: '#FDCA40', // Slightly lighter black on hover
                    },
                }}
                >
                    Register
                </Button>
                <Typography
                    variant="body1"
                    component="p"
                    onClick={() => window.location.href = '/login'}
                    style={{ cursor: 'pointer', color: 'white', textDecoration: 'underline', marginTop: '1rem' }}
                    >
                    Already have an account? Login
                </Typography>
            </form>
        </Container>
    );
};

export default Register;
