# Notes App

A simple and efficient Notes application built using **React** for the frontend and **.NET** for the backend. This app allows users to create, view, edit, and delete notes, providing a seamless and user-friendly experience.

---

## Features

- **User Authentication**:
  - Secure user registration and login.
  - JWT-based authentication for secure session management.

- **Create Notes**:
  - Add notes with a title and detailed description.
  - Rich text formatting support.

- **Manage Notes**:
  - View a list of all your notes.
  - Edit and update existing notes.
  - Delete notes you no longer need.

- **Search and Filter**:
  - Search notes by keywords.
  - Filter notes by creation date or categories.

- **Responsive Design**:
  - Fully responsive and optimized for both desktop and mobile devices.

- **Real-time Updates**:
  - Notes list updates in real-time without needing to refresh the page.

---

## Tech Stack

### Frontend
- **React**:
  - React Hooks for state management.
  - Axios for API calls.
  - Styled Components for custom styling.

### Backend
- **.NET**:
  - ASP.NET Core for RESTful API development.
  - Entity Framework Core for database management.
  - SQL Server for data storage.

---

## Installation

### Prerequisites
- Node.js and npm installed.
- .NET SDK installed.
- SQL Server running locally or accessible remotely.



# **Notes App Solution**

Welcome to the **Notes App** project! This solution is designed with modern software engineering principles and clean architecture to ensure maintainability, scalability, and testability. It features a multi-layered structure with a backend built in **ASP.NET Core Web API** and a frontend in **React**.

---

## **1. Solution Structure**

The project is organized into separate solutions to promote modularity and separation of concerns:

```plaintext
📦 NotesAppSolution/
│
├── 📂 Common (Class Library)
│   ├── Enums/                     # Shared enums for the project
│   ├── DTOs/                      # Data Transfer Objects for clean data exchange
│   ├── CryptoHelper.cs            # Utility for encryption and decryption
│   └── Converters/                # Converters for mapping DTOs to Entities and vice versa
│
├── 📂 Entities (Class Library)
│   ├── Models/                    # Database entity models (e.g., Note, User)
│   └── Scripts/                   # SQL scripts for schema creation
│
├── 📂 Repository (Class Library)
│   ├── Interfaces/                # Repository interfaces (e.g., INoteRepository)
│   └── Implementations/           # Concrete repository implementations
│
├── 📂 Service (ASP.NET Core Web API)
│   ├── Controllers/               # API endpoints (e.g., NotesController)
│   ├── Program.cs                 # Application entry point and dependency injection
│   └── Startup.cs                 # Middleware and service configuration
│
├── 📂 Test (Class Library)
│   ├── NotesRepositoryTests.cs    # Unit tests for repositories
│   └── NotesControllerTests.cs    # Unit tests for controllers
│
└── 📂 React (Frontend)
    ├── src/
        ├── Components/            # UI components
        ├── Pages/                 # Application pages
        ├── API/                   # API integration
        └── App.js                 # Main React application file


2. Design Patterns Used
The project follows several modern design patterns to ensure clean, maintainable, and scalable code:

Repository Pattern
Purpose: Abstracts the data access logic, ensuring the business layer does not interact directly with the database.
Implementation: Located in the Repository Solution with interfaces and concrete implementations.

DTO Pattern (Data Transfer Object)
Purpose: Decouples the API layer from database entities and ensures efficient data transfer.
Implementation: Located in the Common Solution.

Dependency Injection (DI)
Purpose: Reduces tight coupling between components and improves testability.
Implementation: Used in the Service Solution to inject repositories into controllers.

3-Layer Architecture
Purpose: Ensures separation of concerns:
Controllers handle HTTP requests and responses.
Repositories manage data operations.
Entities define the database models.
Implementation: Separation across Service, Repository, and Entities solutions.




3. Why Separate Solutions Instead of Folders?
Using separate solutions instead of folders enhances modularity, reusability, scalability, and testability:

Modularity: Each solution has a clear, single responsibility, making the codebase easier to navigate and maintain.
Reusability: Solutions like Common and Repository can be reused in other projects without duplication.
Scalability: Adding new features or integrating with other applications becomes straightforward.
Testability: Independent testing of each solution ensures robust and reliable code.
