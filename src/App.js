import React from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button} from 'react-bootstrap';
import Login from './components/Login';
import Register from './components/Register';
import ExpenseList from './components/ExpenseList';
import CreateExpense from './components/CreateExpense';
import EditExpense from './components/EditExpense';
import Dashboard from './components/Dashboard';
import UserProfile from './components/UserProfile';

function App() {
  const navigate = useNavigate();

  // Check if user is authenticated (JWT token exists in localStorage)
  const isAuthenticated = () => !!localStorage.getItem('access_token');

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    // Added d-flex and min-vh-100 to make footer stick to bottom
    <div className="d-flex flex-column min-vh-100">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Expense Tracker</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {isAuthenticated() ? (
                <>
                  {/* Removed Home link for authenticated users */}
                  <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                  <Nav.Link as={Link} to="/expenses">Expenses</Nav.Link>
                  <Nav.Link as={Link} to="/expenses/create">Add Expense</Nav.Link>
                  <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                  <Button 
                    variant="outline-light" 
                    size="sm" 
                    onClick={handleLogout} 
                    className="ms-2"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/">Home</Nav.Link>
                  <Nav.Link as={Link} to="/login">Login</Nav.Link>
                  <Nav.Link as={Link} to="/register">Register</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Added flex-grow-1 to ensure content pushes footer down */}
      <Container className="flex-grow-1 my-4">
        <Routes>
          {/* Updated home route to redirect authenticated users to dashboard */}
          <Route path="/" element={
            isAuthenticated() ? (
              <Navigate to="/dashboard" />
            ) : (
              <div className="py-5 text-center">
                <h1 className="display-4">Welcome to Expense Tracker</h1>
                <p className="lead mb-4">
                  Track and manage your expenses easily with our simple application.
                </p>
                <p>
                  <Button variant="primary" as={Link} to="/register" className="me-2">
                    Get Started
                  </Button>
                  <Button variant="outline-primary" as={Link} to="/login">
                    Login
                  </Button>
                </p>
              </div>
            )
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/expenses"
            element={isAuthenticated() ? <ExpenseList /> : <Navigate to="/login" />}
          />
          <Route
            path="/expenses/create"
            element={isAuthenticated() ? <CreateExpense /> : <Navigate to="/login" />}
          />
          <Route
            path="/expenses/edit/:id"
            element={isAuthenticated() ? <EditExpense /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={isAuthenticated() ? <UserProfile /> : <Navigate to="/login" />}
          />
        </Routes>
      </Container>
      
      {/* Added mt-auto to push footer to bottom */}
      <footer className="bg-dark text-white py-3 mt-auto">
        <Container className="text-center">
          <p className="mb-0">Expense Tracker &copy; {new Date().getFullYear()}</p>
        </Container>
      </footer>
    </div>
  );
}

export default App;
