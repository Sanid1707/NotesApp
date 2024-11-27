// import React, { useState } from "react";
// import "./Register.css";

// const Register = () => {
//     const [formData, setFormData] = useState({
//         username: "",
//         email: "",
//         password: "",
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log("Form Data Submitted:", formData);
//         alert("Registration successful!"); // Replace with real logic
//     };

//     return (
//         <div className="register-container">
//             <h2>Register</h2>
//             <form onSubmit={handleSubmit} className="register-form">
//                 <div className="form-group">
//                     <label htmlFor="username">Username</label>
//                     <input
//                         type="text"
//                         id="username"
//                         name="username"
//                         value={formData.username}
//                         onChange={handleChange}
//                         placeholder="Enter your username"
//                         required
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label htmlFor="email">Email</label>
//                     <input
//                         type="email"
//                         id="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         placeholder="Enter your email"
//                         required
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label htmlFor="password">Password</label>
//                     <input
//                         type="password"
//                         id="password"
//                         name="password"
//                         value={formData.password}
//                         onChange={handleChange}
//                         placeholder="Enter your password"
//                         required
//                     />
//                 </div>
//                 <button type="submit" className="register-button">
//                     Register
//                 </button>
//                 <a href="/">Already have an account? Login here</a>
//             </form>
//         </div>
//     );
// };

// export default Register;


import React, { useState } from "react";
import "./Register.css";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("http://localhost:5189/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                alert("Registration successful!");
                console.log("Backend Response:", data);
                // Reset the form after successful registration
                setFormData({
                    username: "",
                    email: "",
                    password: "",
                });
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Failed to register. Please try again.");
            }
        } catch (err) {
            setError("An error occurred while connecting to the server.");
            console.error("Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit} className="register-form">
                {error && <div className="error-message">{error}</div>}
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter your username"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="register-button"
                    disabled={isLoading}
                >
                    {isLoading ? "Registering..." : "Register"}
                </button>
                <a href="/">Already have an account? Login here</a>
            </form>
        </div>
    );
};

export default Register;