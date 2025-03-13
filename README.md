# Expense Tracker Frontend
A modern, responsive React application for personal expense management. This frontend provides an intuitive user interface for tracking, categorizing, and visualizing expenses, working seamlessly with the Expense Tracker API backend.

## ✨ Features
User Experience
 - Clean, Intuitive Interface: Easy-to-navigate design for efficient expense management
 - Responsive Design: Works flawlessly across desktop, tablet, and mobile devices
 - Interactive Dashboard: Visual summaries of spending patterns and financial insights
 - Real-time Validation: Immediate feedback on user inputs for a smooth experience

Expense Management
 - Expense Tracking: Add, view, edit, and delete personal expenses
 - Categorization: Organize expenses by custom categories
 - Filtering & Sorting: Find expenses by date, category, or amount
 - Data Visualization: Charts and graphs to visualize spending patterns

User Management
 - Secure Authentication: User registration and login with JWT
 - Profile Management: View and update user information
 - Password Security: Secure password update functionality

## 🛠️ Technology Stack
 - React: JavaScript library for building user interfaces
 - React Router: Navigation and routing for React applications
 - React Bootstrap: UI component library based on Bootstrap
 - Axios: Promise-based HTTP client for API requests
 - Chart.js: JavaScript charting library for data visualization
 - React Hook Form: Form validation and handling
## 🏁 Getting Started
Prerequisites
 - Node.js: v14.0.0 or higher
 - npm: v6.0.0 or higher
 - Expense Tracker API: Backend server running

### Installation
 - Clone the repository:

    To deploy this project run
    ```bash
    git clone https://github.com/yourusername/expense-tracker-frontend.git
    cd expense-tracker-frontend
    ```

 - Install dependencies:
    ```bash
    npm install
    ```

 - Configure API connection:
   - Create a .env file in the root directory:
    ```bash
    REACT_APP_API_URL=http://localhost:8000
    ```

 - Start the development server:
    ```bash
    npm start
    ```
 - Access the application:
   - Open your browser and navigate to: http://localhost:3000

## 📱 Application Structure
```bash
    expense-tracker-frontend/
    ├── public/                  # Static files
    ├── src/                     # Source code
    │   ├── api.js               # API configuration and requests
    │   ├── App.js               # Main application component
    │   ├── index.js             # Application entry point
    │   ├── components/          # Reusable components
    │   │   ├── Dashboard.js     # Dashboard with expense summaries
    │   │   ├── ExpenseList.js   # List of expenses with filtering
    │   │   ├── CreateExpense.js # Form for adding expenses
    │   │   ├── EditExpense.js   # Form for editing expenses
    │   │   ├── Login.js         # Login form
    │   │   ├── Register.js      # Registration form
    │   │   └── UserProfile.js   # User profile management
    │   └── assets/              # Images, styles, and other assets
    └── package.json             # Project dependencies and scripts

```

## 🖥️ Key Components
Authentication Flow
 - Login: Secure authentication with JWT tokens
 - Registration: New user account creation
 - Protected Routes: Restricted access to authenticated users only

Expense Management
 - Dashboard: Overview of expenses with charts and summaries
 - Expense List: Comprehensive list with filtering and sorting
 - Expense Forms: User-friendly forms for adding and editing expenses

User Experience
 - Responsive Navigation: Adapts to different screen sizes
 - Form Validation: Real-time feedback on user inputs
 - Loading States: Visual indicators during API requests
 - Error Handling: Clear error messages for users

## 🔒 Security Features
 - JWT Authentication: Secure token-based authentication
 - Protected Routes: Client-side route protection for authenticated content
 - Token Expiration: Automatic handling of expired authentication tokens
 - Secure Storage: Proper handling of sensitive information