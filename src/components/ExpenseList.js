import React, { useEffect, useState } from 'react';
import { Table, Alert, Button, Badge, Card, Row, Col, Form, Modal, Pagination, Spinner } from 'react-bootstrap';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';

function ExpenseList() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ category: '', startDate: '', endDate: '' });
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // For delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // For pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  useEffect(() => {
    fetchExpenses();
  }, []);
  
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

  // Handle sorting
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value
    });
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Reset filters
  const resetFilters = () => {
    setFilter({ category: '', startDate: '', endDate: '' });
    setCurrentPage(1);
  };

  // Calculate filtered and sorted expenses
  const filteredExpenses = expenses.filter(expense => {
    if (filter.category && expense.category !== filter.category) return false;
    if (filter.startDate && new Date(expense.date) < new Date(filter.startDate)) return false;
    if (filter.endDate && new Date(expense.date) > new Date(filter.endDate)) return false;
    return true;
  }).sort((a, b) => {
    if (sortField === 'amount') {
      return sortDirection === 'asc' 
        ? a.amount - b.amount 
        : b.amount - a.amount;
    } else if (sortField === 'date') {
      return sortDirection === 'asc' 
        ? new Date(a.date) - new Date(b.date) 
        : new Date(b.date) - new Date(a.date);
    } else {
      // Text fields like description or category
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
  });

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredExpenses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

  // Calculate category totals
  const categoryTotals = filteredExpenses.reduce((acc, expense) => {
    const category = expense.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + expense.amount;
    return acc;
  }, {});

  // Calculate total amount
  const totalAmount = filteredExpenses.reduce((acc, expense) => acc + expense.amount, 0);

  // Open delete confirmation modal
  const confirmDelete = (expense) => {
    setExpenseToDelete(expense);
    setShowDeleteModal(true);
  };

  // Handle delete expense
  const handleDelete = async () => {
    if (!expenseToDelete) return;
    
    setDeleteLoading(true);
    try {
      await api.delete(`/expenses/${expenseToDelete.id}`);
      setShowDeleteModal(false);
      setExpenseToDelete(null);
      // Refresh the expenses list
      fetchExpenses();
    } catch (err) {
      setError('Failed to delete expense');
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Get unique categories for filter
  const uniqueCategories = [...new Set(expenses.map(e => e.category).filter(Boolean))];

  // Enhanced loading state component
  const LoadingSpinner = () => (
    <div className="text-center py-5">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading expenses...</span>
      </Spinner>
      <p className="mt-2">Loading expenses...</p>
    </div>
  );

  // Pagination component for better reusability
  const PaginationComponent = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="d-flex justify-content-center mt-4 pagination-container">
        <Pagination className="flex-wrap">
          <Pagination.First 
            onClick={() => setCurrentPage(1)} 
            disabled={currentPage === 1}
          />
          <Pagination.Prev 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1}
          />
          
          {/* Responsive pagination - show fewer items on mobile */}
          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            
            // On mobile/smaller screens, show only a limited range
            // Always show first, last, and current +/- 1 page
            const isWithinRange = Math.abs(pageNum - currentPage) <= 1;
            const isEndPage = pageNum === 1 || pageNum === totalPages;
            
            if (isWithinRange || isEndPage) {
              return (
                <Pagination.Item 
                  key={pageNum}
                  active={pageNum === currentPage}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Pagination.Item>
              );
            } else if ((pageNum === currentPage - 2 && pageNum > 1) || 
                       (pageNum === currentPage + 2 && pageNum < totalPages)) {
              // Show ellipsis for skipped pages
              return <Pagination.Ellipsis key={`ellipsis-${pageNum}`} className="d-none d-md-block" />;
            }
            return null;
          })}
          
          <Pagination.Next 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
            disabled={currentPage === totalPages}
          />
          <Pagination.Last 
            onClick={() => setCurrentPage(totalPages)} 
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
    );
  };

  return (
    <>
      {/* Filters Card */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Expense Filters</Card.Title>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select 
                  name="category"
                  value={filter.category} 
                  onChange={handleFilterChange}
                >
                  <option value="">All Categories</option>
                  {uniqueCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>From Date</Form.Label>
                <Form.Control 
                  type="date" 
                  name="startDate"
                  value={filter.startDate} 
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>To Date</Form.Label>
                <Form.Control 
                  type="date" 
                  name="endDate"
                  value={filter.endDate} 
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Button variant="secondary" onClick={resetFilters}>Reset Filters</Button>
        </Card.Body>
      </Card>

      {/* Summary Card */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Expense Summary</Card.Title>
          <Row className="g-2">
            {Object.entries(categoryTotals).map(([category, amount]) => (
              <Col xs={6} sm={4} md={3} lg={2} key={category} className="mb-2">
                <Card>
                  <Card.Body className="p-2 text-center">
                    <div className="text-truncate">
                      <small>{category}</small>
                    </div>
                    <h6 className="text-primary mb-0">${amount.toFixed(2)}</h6>
                  </Card.Body>
                </Card>
              </Col>
            ))}
            <Col xs={6} sm={4} md={3} lg={2} className="mb-2">
              <Card bg="info" text="white">
                <Card.Body className="p-2 text-center">
                  <div className="text-truncate">
                    <small>Total</small>
                  </div>
                  <h6 className="mb-0">${totalAmount.toFixed(2)}</h6>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Expenses List Card */}
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
            <h5 className="m-0">Your Expenses</h5>
            <Link to="/expenses/create">
              <Button variant="primary" size="sm">
                Add New Expense
              </Button>
            </Link>
          </div>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          {loading ? (
            <LoadingSpinner />
          ) : filteredExpenses.length ? (
            <>
              {/* Responsive table container */}
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th 
                        onClick={() => handleSort('date')} 
                        style={{ cursor: 'pointer' }}
                        className="position-relative"
                      >
                        Date {sortField === 'date' && (
                          <span className="position-absolute top-50 translate-middle-y" style={{right: '8px'}}>
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th 
                        onClick={() => handleSort('description')} 
                        style={{ cursor: 'pointer' }}
                        className="position-relative"
                      >
                        Description {sortField === 'description' && (
                          <span className="position-absolute top-50 translate-middle-y" style={{right: '8px'}}>
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th 
                        onClick={() => handleSort('category')} 
                        style={{ cursor: 'pointer' }}
                        className="position-relative"
                      >
                        Category {sortField === 'category' && (
                          <span className="position-absolute top-50 translate-middle-y" style={{right: '8px'}}>
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th 
                        onClick={() => handleSort('amount')} 
                        style={{ cursor: 'pointer' }}
                        className="position-relative text-end"
                      >
                        Amount {sortField === 'amount' && (
                          <span className="position-absolute top-50 translate-middle-y" style={{right: '8px'}}>
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map(exp => (
                      <tr key={exp.id}>
                        <td>{new Date(exp.date).toLocaleDateString()}</td>
                        <td className="text-truncate" style={{maxWidth: "200px"}}>
                          {exp.description || '-'}
                        </td>
                        <td>
                          {exp.category ? (
                            <Badge bg="info">{exp.category}</Badge>
                          ) : (
                            <Badge bg="secondary">Uncategorized</Badge>
                          )}
                        </td>
                        <td className="text-end">${exp.amount.toFixed(2)}</td>
                        <td>
                          <div className="d-flex justify-content-center gap-2 flex-wrap">
                            <Button 
                              variant="warning" 
                              size="sm"
                              onClick={() => navigate(`/expenses/edit/${exp.id}`)}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm"
                              onClick={() => confirmDelete(exp)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="text-end fw-bold">Total:</td>
                      <td className="text-end fw-bold">${totalAmount.toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </Table>
              </div>
              
              {/* Pagination */}
              <PaginationComponent />
            </>
          ) : (
            <Alert variant="info">
              No expenses found. Click "Add New Expense" to get started.
            </Alert>
          )}
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this expense?
          {expenseToDelete && (
            <div className="mt-3">
              <p><strong>Date:</strong> {new Date(expenseToDelete.date).toLocaleDateString()}</p>
              <p><strong>Description:</strong> {expenseToDelete.description || '-'}</p>
              <p><strong>Amount:</strong> ${expenseToDelete.amount.toFixed(2)}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ExpenseList;
