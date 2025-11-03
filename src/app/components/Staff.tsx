
import '../styles/Staff.css';

import React, { useState, useEffect } from 'react';

const Staff = () => {
  // Sample employee data
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@company.com',
      phone: '+1 (555) 123-4567',
      department: 'Engineering',
      project: 'Website Redesign',
      position: 'Senior Developer',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      phone: '+1 (555) 987-6543',
      department: 'Marketing',
      project: 'Q4 Campaign',
      position: 'Marketing Manager',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      phone: '+1 (555) 456-7890',
      department: 'Engineering',
      project: 'Mobile App',
      position: 'Frontend Developer',
      status: 'Active'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      phone: '+1 (555) 234-5678',
      department: 'HR',
      project: 'Recruitment Drive',
      position: 'HR Specialist',
      status: 'On Leave'
    },
    {
      id: 5,
      name: 'Robert Wilson',
      email: 'r.wilson@company.com',
      phone: '+1 (555) 876-5432',
      department: 'Sales',
      project: 'Enterprise Clients',
      position: 'Sales Director',
      status: 'Active'
    }
  ]);

  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    project: '',
    status: ''
  });
  const [activeFilters, setActiveFilters] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  // Departments and projects for filter options
  const departments = ['Engineering', 'Marketing', 'HR', 'Sales', 'Finance', 'Operations'];
  const projects = ['Website Redesign', 'Mobile App', 'Q4 Campaign', 'Recruitment Drive', 'Enterprise Clients'];
  const statusOptions = ['Active', 'On Leave', 'Inactive'];

  // Quick filter options
  const quickFilters = [
    { label: 'Engineering', value: 'Engineering', type: 'department' },
    { label: 'Active', value: 'Active', type: 'status' },
    { label: 'Marketing', value: 'Marketing', type: 'department' },
    { label: 'Website Project', value: 'Website Redesign', type: 'project' }
  ];

  // Filter employees based on search and filters
  useEffect(() => {
    let results = employees;

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(employee =>
        employee.name.toLowerCase().includes(term) ||
        employee.email.toLowerCase().includes(term) ||
        employee.phone.toLowerCase().includes(term) ||
        employee.department.toLowerCase().includes(term) ||
        employee.project.toLowerCase().includes(term)
      );
    }

    // Apply individual filters
    if (filters.department) {
      results = results.filter(employee => employee.department === filters.department);
    }
    if (filters.project) {
      results = results.filter(employee => employee.project === filters.project);
    }
    if (filters.status) {
      results = results.filter(employee => employee.status === filters.status);
    }

    // Apply active filters from tags
    activeFilters.forEach(filter => {
      results = results.filter(employee => employee[filter.type] === filter.value);
    });

    // Apply sorting
    results = [...results].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'department') {
        return a.department.localeCompare(b.department);
      }
      return 0;
    });

    setFilteredEmployees(results);
  }, [employees, searchTerm, filters, activeFilters, sortBy]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Handle quick filter click
  const handleQuickFilter = (filter) => {
    // Check if filter is already active
    const isAlreadyActive = activeFilters.some(
      activeFilter => activeFilter.type === filter.type && activeFilter.value === filter.value
    );

    if (!isAlreadyActive) {
      setActiveFilters(prev => [...prev, filter]);
    }
  };

  // Remove active filter
  const removeActiveFilter = (index) => {
    setActiveFilters(prev => prev.filter((_, i) => i !== index));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setFilters({ department: '', project: '', status: '' });
    setActiveFilters([]);
  };

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle form submission (save changes)
  const handleSave = () => {
    // Here you would typically save changes to an API
    //alert('Changes saved successfully!');
  };

  return (
    <div className="staff-container">
      <div className="staff-content">
        {/* Search Section */}
        <div className="staff-search-section">
          <div className="staff-search-container">
            <div className="staff-search-row">
              <input
                type="text"
                className="staff-search-input"
                placeholder="Search by name, email, phone, department, or project..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button className="staff-search-button">
                <span>🔍</span>
                Search
              </button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="staff-quick-filters">
            {quickFilters.map((filter, index) => (
              <button
                key={index}
                className="staff-quick-filter"
                onClick={() => handleQuickFilter(filter)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Active Filter Tags */}
          {activeFilters.length > 0 && (
            <div className="staff-filter-section">
              <span className="staff-filter-label">Active Filters:</span>
              <div className="staff-filter-tags">
                {activeFilters.map((filter, index) => (
                  <span key={index} className="staff-filter-tag">
                    {filter.label}
                    <button
                      className="staff-filter-tag-remove"
                      onClick={() => removeActiveFilter(index)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Advanced Filters */}
        <div className="staff-content-filters">
          <div className="staff-filter-group">
            <label className="staff-filter-label">Department</label>
            <select
              className="staff-content-select"
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="staff-filter-group">
            <label className="staff-filter-label">Project</label>
            <select
              className="staff-content-select"
              value={filters.project}
              onChange={(e) => handleFilterChange('project', e.target.value)}
            >
              <option value="">All Projects</option>
              {projects.map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
          </div>

          <div className="staff-filter-group">
            <label className="staff-filter-label">Status</label>
            <select
              className="staff-content-select"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <button className="staff-button-clear" onClick={clearAllFilters}>
            Clear Filters
          </button>

        </div>

        {/* Results Summary */}
        <div className="staff-results-summary">
          <div className="staff-results-count">
            Showing {filteredEmployees.length} of {employees.length} employees
          </div>
          <select
            className="staff-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="department">Sort by Department</option>
          </select>
        </div>

        {/* Employee List */}
        <div className="staff-content-items">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map(employee => (
              <div key={employee.id} className="staff-item">
                <div className="staff-item-avatar">
                  {getInitials(employee.name)}
                </div>
                <div className="staff-item-details">
                  <div className="staff-item-name">{employee.name}</div>
                  <div className="staff-item-meta">
                    <span className="staff-item-contact">
                      📧 {employee.email}
                    </span>
                    <span className="staff-item-contact">
                      {'             '}
                    </span>
                    <span className="staff-item-contact">
                      📞 {employee.phone}
                    </span>
                    <span className="staff-item-contact">
                      💼 {employee.position}
                    </span>
                  </div>
                </div>
                <div className="staff-item-actions">
                  <button className="staff-button-save" style={{ height: '35px', padding: '0 1rem' }}>
                    Edit
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="staff-empty-state">
              <div className="staff-empty-icon">👥</div>
              <div className="staff-empty-text">
                No employees found matching your criteria.
              </div>
              <button className="staff-button-clear" onClick={clearAllFilters}>
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="staff-button-container">
          <button className="staff-button-save" onClick={handleSave}>
            <span className="button-text">Add new</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Staff;
