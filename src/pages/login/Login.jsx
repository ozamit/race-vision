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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                // Log the response data
                console.log("res data: ", data);
    
                // Set Snackbar message and severity based on response
                setSnackbarMessage(data.message);
                setSnackbarSeverity(data.message === 'Success' ? 'success' : 'error');
                setSnackbarOpen(true);
    
                // If response message is "Success", store token and user id in localStorage
                if (data.message === 'Success') {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userId', data.user._id);
                    console.log('Token and User ID stored in localStorage');
                    window.location.href = '/'; // Redirect to home page
                }
            })
            .catch(error => {
                // Handle error and display the error message
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
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Optional: Change position
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
                            message: 'Invalid email address'
                        }
                    })}
                    fullWidth
                    margin="normal"
                    error={!!errors.email}
                    helperText={errors.email ? errors.email.message : ''}
                />
                <TextField
                    label="Password"
                    type="password"
                    {...register('password', { 
                        required: 'Password is required', 
                        minLength: {
                            value: 4,
                            message: 'Password must be at least 4 characters long'
                        }
                    })}
                    fullWidth
                    margin="normal"
                    error={!!errors.password}
                    helperText={errors.password ? errors.password.message : ''}
                />
                <Button type="submit" variant="contained" color="primary">
                    Login
                </Button>
            </form>
            <Typography
                variant="body1"
                component="p"
                onClick={() => window.location.href = '/Register'}
                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
            >
                I don't have an account. Register me.
            </Typography>
        </Container>
    );
};

export default Login;
