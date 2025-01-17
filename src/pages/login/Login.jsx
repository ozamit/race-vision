import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Container, Typography, Snackbar, Alert } from '@mui/material';
import { host } from '../../utils/host';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const onSubmit = (data) => {
        // Convert email to lowercase
        data.email = data.email.toLowerCase();

        fetch(`${host}users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('res data: ', data);

                setSnackbarMessage(data.message);
                setSnackbarSeverity(data.message === 'Success' ? 'success' : 'error');
                setSnackbarOpen(true);

                if (data.message === 'Success') {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userId', data.user._id);
                    console.log('Token and User ID stored in localStorage');
                    window.location.href = '/'; // Redirect to home page
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                setSnackbarMessage(error.message || 'Error logging in');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            });
    };

    const handleCloseSnackbar = () => {
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

            <Typography color='white' variant="h4" component="h1" gutterBottom>
                Login
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                label="Email"
                type="email"
                {...register('email', {
                    required: 'Email is required',
                    pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: 'Invalid email address',
                    },
                })}
                fullWidth
                margin="normal"
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
                    label="Password"
                    type="password"
                    {...register('password', {
                        required: 'Password is required',
                        minLength: {
                            value: 3,
                            message: 'Password must be at least 3 characters long',
                        },
                    })}
                    fullWidth
                    margin="normal"
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
                }}>
                    Login
                </Button>
            </form>
            <Typography
                variant="body1"
                component="p"
                onClick={() => window.location.href = '/Register'}
                style={{ cursor: 'pointer', color: 'white', textDecoration: 'underline', marginTop: '1rem' }}
            >
                I don't have an account. Register me.
            </Typography>
        </Container>
    );
};

export default Login;
