import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
import api from '../api';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const response = await api.get('/expenses');
        setExpenses(response.data);
      } catch (err) {
        setError('Failed to fetch expenses');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExpenses();
  }, []);

  // Group expenses by category for pie chart
  const categoryData = expenses.reduce((acc, expense) => {
    const category = expense.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + expense.amount;
    return acc;
  }, {});

  // Group expenses by month for bar chart
  const monthlyData = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date);
    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    acc[monthYear] = (acc[monthYear] || 0) + expense.amount;
    return acc;
  }, {});

  // Sort months chronologically
  const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA - dateB;
  });

  // Chart data
  const pieChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#9966FF', '#FF9F40', '#8D99AE', '#EF476F',
        ],
      },
    ],
  };

  const barChartData = {
    labels: sortedMonths,
    datasets: [
      {
        label: 'Monthly Expenses',
        data: sortedMonths.map(month => monthlyData[month]),
        backgroundColor: '#36A2EB',
      },
    ],
  };

  // Improved chart options for better responsiveness
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows chart to adapt to container height
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Expense Trend',
      },
    },
  };
  
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows chart to adapt to container height
    plugins: {
      legend: {
        position: 'right',
        // Make legend more compact on small screens
        labels: {
          boxWidth: 10,
          font: {
            size: 10
          }
        }
      }
    }
  };
  
  // Some quick stats
  const totalExpenses = expenses.length;
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const avgAmount = totalExpenses ? totalAmount / totalExpenses : 0;
  const maxExpense = expenses.length ? Math.max(...expenses.map(exp => exp.amount)) : 0;

  // Enhanced loading state
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading dashboard data...</span>
        </Spinner>
        <p className="mt-2">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-4">Dashboard</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {/* Improved grid with better mobile responsiveness */}
      <Row className="mb-4">
        <Col xs={6} md={3} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title>Total Expenses</Card.Title>
              <h3 className="mt-3">{totalExpenses}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title>Total Amount</Card.Title>
              <h3 className="mt-3">${totalAmount.toFixed(2)}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title>Average Expense</Card.Title>
              <h3 className="mt-3">${avgAmount.toFixed(2)}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title>Highest Expense</Card.Title>
              <h3 className="mt-3">${maxExpense.toFixed(2)}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        {/* Charts now stack vertically on mobile */}
        <Col lg={6} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Expenses by Category</Card.Title>
              <div style={{ height: '300px' }}>
                {Object.keys(categoryData).length > 0 ? (
                  <Pie data={pieChartData} options={pieChartOptions} />
                ) : (
                  <div className="text-center py-5">No data available</div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Monthly Expense Trend</Card.Title>
              <div style={{ height: '300px' }}>
                {sortedMonths.length > 0 ? (
                  <Bar data={barChartData} options={barChartOptions} />
                ) : (
                  <div className="text-center py-5">No data available</div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Dashboard;
