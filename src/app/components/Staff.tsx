import React, { useState, useEffect } from 'react';
import '../styles/Staff.css';
import '../globals.css';

import Modal from './Modal';
import StaffAddForm from './StaffAddForm';
import StaffViewForm from './StaffViewForm';
import { useModal } from '../hooks/useModal';
import { useEmployee } from '../hooks/useEmployee';
import useNotification from '../hooks/useNotification';
import NotificationContainer from './NotificationContainer';
import { unformatPhone } from '../utils/format';


const Staff = () => {
  
  type Mode = "view" | "add" | "edit";
  
  const [mode, setMode] = useState<Mode>("view");
  
  const { notifications, addNotification, removeNotification } = useNotification();

  type NotificationType = 'success' | 'error' | 'warning' | 'info';
  const showNotification = (type: NotificationType , style = 'default') => {
    const messages = {
      success: 'Employee record was created.',
      error: 'Something went wrong. Please try again.',
      warning: 'Select a project code.',
      info: 'Employee record was deleted.'
    };
    addNotification(messages[type], { type, style});
  }; 

  // interface employeesData {
  //   id: number;
  //   name: string;
  //   email: string;
  //   phone: string;
  //   dept: string;
  //   projects: string;
  //   position: string;
  //   status: string;
  //   location: string;
  //   hireDate: string;
  // }

  const { employees, reloadEmplData } = useEmployee();

  const { isModalOpen, open, close} = useModal();
  const openModal = () => {
    open();
  }
  const closeModal = () => {
    close();
    setTimeout (()=> {setMode('view')}, 500)
  }

  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    dept: '',
    projects: '',
    status: ''
  });
  const [activeFilters, setActiveFilters] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const depts = [
    {title: 'Clinical',         code: 'CLN'},
    {title: 'Data managment',   code: 'DM'},
    {title: 'Medical writing',  code: 'MW'},
  ];
  const projects = ['3456', '9872', '2900'];
  const statusOptions = ['Active', 'On Leave', 'Inactive'];

  // Quick filter options
  const quickFilters = [
    { label: 'Clinical', value: 'CLN', type: 'dept' },
    { label: 'Active', value: 'Active', type: 'status' },
    { label: '9872', value: '9872', type: 'projects' }
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
        employee.phone?.toLowerCase().includes(term) ||
        employee.dept?.toLowerCase().includes(term) ||
        employee.projects?.toLowerCase().includes(term)
      );
    }

    // Apply individual filters
    if (filters.dept) {
      results = results.filter(employee => employee.dept === filters.dept);
    }
    if (filters.projects) {
      results = results.filter(employee => employee.projects === filters.projects);
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
      } else if (sortBy === 'dept') {
        return a.dept.localeCompare(b.dept);
      }
      return 0;
    });

    setFilteredEmployees(results);
    console.log(filteredEmployees)
  }, [employees, searchTerm, filters, activeFilters, sortBy]);

  // Handle search input change
  const handleSearchChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Handle quick filter click
  const handleQuickFilter = (filter: { label?: string; value: any; type: any; }) => {
    // Check if filter is already active
    const isAlreadyActive = activeFilters.some(
      activeFilter => activeFilter.type === filter.type && activeFilter.value === filter.value
    );

    if (!isAlreadyActive) {
      setActiveFilters(prev => [...prev, filter]);
    }
  };

  // Remove active filter
  const removeActiveFilter = (index:number) => {
    setActiveFilters(prev => prev.filter((_, i) => i !== index));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setFilters({ dept: '', projects: '', status: '' });
    setActiveFilters([]);
  };

  // Get initials for avatar
  const getInitials = (name:string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  interface TargetEmployeInfo {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    dept: string;
    projects: string;
    position: string;
    status: string;
  }
  // Show detailed employe card
  const [emplData, setEmplData] = useState<TargetEmployeInfo>()
  
  const showEmplCard = (id:number) => {
    const [targetEmployeInfo] = employees
    .filter(item => item.id == id)
    openModal();
    //console.log(targetEmployeInfo)
    //setEmplData(targetEmployeInfo)
    setEmplData({
      ...targetEmployeInfo,
      phone: unformatPhone(targetEmployeInfo?.phone)
    })
  }

  // Add new employee
  // const addNewEmpl = () => {
  //   setMode('add')
  //   setEmplData('')
  //   openModal()
  // }
  
  // Edit info of current employee
  const editEmpInfo = () => {
    //console.log('editEmpInfo: ', id)
    setMode('edit')
  }

  const handleModal = () => {
    closeModal()
  }

  const handleNotify = (status: string) => {
    showNotification(status as NotificationType)
  }

  return (
    <div className="staff-container">
    
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {
          mode === 'view' ? (
            <StaffViewForm 
              emplData={emplData}
              editEmpInfo={editEmpInfo}
            />
          ) : mode === 'add' ? (
            <StaffAddForm
              emplData={null}
              handleModal={handleModal}
              handleNotify={handleNotify}
              reload={reloadEmplData}
              mode={mode}
            />
          ) : (
            <StaffAddForm
              emplData={emplData ? emplData : null}
              handleModal={handleModal}
              handleNotify={handleNotify}
              reload={reloadEmplData}
              mode={mode}
            />
          )
        }
      </Modal>
    
      <NotificationContainer 
        notifications={notifications}
        removeNotification={removeNotification}
      />

      <div className="staff-content">
        {/* Search Section */}
        <div className="staff-search-section">
          <div className="staff-search-container">
            <div className="staff-search-row">
              <input
                type="text"
                className="staff-search-input"
                placeholder="Search by name, email, phone, dept, or projects..."
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
            <label className="staff-filter-label">department</label>
            <select
              className="staff-content-select"
              value={filters.dept}
              onChange={(e) => handleFilterChange('dept', e.target.value)}
            >
              <option value="">All</option>
              {depts.map(dept => (
                <option key={dept.code} value={dept.code}>{dept.title}</option>
              ))}
            </select>
          </div>

          <div className="staff-filter-group">
            <label className="staff-filter-label">project</label>
            <select
              className="staff-content-select"
              value={filters.projects}
              onChange={(e) => handleFilterChange('projects', e.target.value)}
            >
              <option value="">All</option>
              {projects.map(projects => (
                <option key={projects} value={projects}>{projects}</option>
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
              <option value="">All</option>
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
            <option value="dept">Sort by dept</option>
          </select>
        </div>

        {/* Employee List */}
        <div className="staff-content-items"  >
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map(employee => (
              <div id={employee.id} key={employee.id} className="staff-item" onClick={(item)=>showEmplCard(item.target.id)} >
                <div id={employee.id} className="staff-item-avatar">
                  {getInitials(employee.name)}
                </div>
                <div id={employee.id} className="staff-item-details">
                  <div id={employee.id} className="staff-item-name">{employee.name}</div>
                  <div id={employee.id} className="staff-item-meta">
                    <span id={employee.id} className="staff-item-contact">
                      📧 {employee.email}
                    </span>
                    <span id={employee.id} className="staff-item-contact">
                      {'             '}
                    </span>
                    <span id={employee.id} className="staff-item-contact">
                      📞 {employee.phone}
                    </span>
                    <span id={employee.id} className="staff-item-contact">
                      💼 {employee.position}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="staff-empty-state">
              <div className="staff-empty-icon">👥</div>
              <div className="staff-empty-text">
                No employees found matching your criteria.
              </div>
            {!filters &&
              (<button className="staff-button-clear" onClick={clearAllFilters}>
                Clear All Filters
              </button>)
            }            
            </div>
          )}
        </div>

        {/* Action Buttons 
        <div className="staff-button-container">
          <button className="staff-button-save" onClick={addNewEmpl}>
            <span className="button-text">Add new employee</span>
          </button>
        </div>*/}
      </div>
    </div>
  );
};

export default Staff;
