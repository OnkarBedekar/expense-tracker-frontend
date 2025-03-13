import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import api from '../api';
import { useNavigate, useParams } from 'react-router-dom';

function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: '',
    category: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // Predefined categories
  const categories = [
    'Food', 'Transportation', 'Housing', 'Utilities', 
    'Entertainment', 'Healthcare', 'Education', 'Other'
  ];

  // Fetch the expense data
  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await api.get(`/expenses/${id}`);
        const expense = response.data;
        setFormData({
          amount: expense.amount,
          description: expense.description || '',
          date: expense.date,
          category: expense.category || '',
        });
      } catch (err) {
        setError('Failed to fetch expense details');
        console.error(err);
      } finally {
        setFetchLoading(false);
      }
    };
    
    fetchExpense();
  }, [id]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/expenses/${id}`, formData);
      navigate('/expenses');
    } catch (err) {
      setError('Failed to update expense');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <div className="text-center py-4">Loading expense data...</div>;
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>Edit Expense</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Amount ($)</Form.Label>
                <Form.Control
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control 
                  name="date" 
                  type="date" 
                  value={formData.date} 
                  onChange={handleChange} 
                  required 
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select 
              name="category" 
              value={formData.category} 
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Form.Select>
          </Form.Group>
          
          <div className="d-flex justify-content-between">
            <Button 
              variant="secondary" 
              onClick={() => navigate('/expenses')}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Expense'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default EditExpense;
