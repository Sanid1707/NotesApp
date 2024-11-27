import React, { useState } from "react";
import "./Login.css";
import dashboard from "../dashboard/NotesDash";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const data = { email, password }; // Prepare data to send
    
        try {
            const response = await fetch('http://localhost:5189/api/auth/register', {
                method: 'POST', // HTTP method
                headers: {
                    'Content-Type': 'application/json', // Ensure JSON payload
                },
                body: JSON.stringify(data), // Convert data to JSON
            });
    
            if (!response.ok) {
                // Handle HTTP errors
                throw new Error(`Error: ${response.status} ${response.statusText}`);
                
            }

            if (response.ok) 
            {
                console.log("Login successful!");
                alert("Login successful!"); // Replace with real logic
            }
            const result = await response.json(); // Parse JSON response
            console.log('Success:', result);
            // Add your success logic here, e.g., updating state, showing a message
        } catch (error) {
            console.error('Error:', error);
            // Handle error logic, e.g., showing an error message
        }
    };
    
    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <a href="/register">Don't have an account? Register here</a>
                <button type="submit" className="login-button">Login</button>
            </form>
        </div>
    );
};

export default Login;
