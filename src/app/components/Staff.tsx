import React, { useState, MouseEvent, useMemo } from 'react';
import '../styles/Staff.css';
import '../globals.css';

import Modal from './Modal';
import StaffAddForm from './StaffAddForm';
import StaffViewForm from './StaffViewForm';
import { useModal } from '../hooks/useModal';
import { useEmployee } from '../hooks/useEmployee';
import useNotification from '../hooks/useNotification';
import NotificationContainer from './NotificationContainer';

export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  dept: string | null;
  projects: string | null;
  position: string | null;
  status: string | null;
  location: string | null;
  hiredate: string | null;
}

interface Filters {
  dept?: string;
  projects?: string;
  status?: string;
}

interface FilterTag {
  type: string;
  value: string;
  label?: string;
}

interface QuickFilter {
  label: string;
  value: string;
  type: string;
}

interface DeptOption {
  title: string;
  code: string;
}

// interface TargetEmployeInfo {
//   id: number;
//   name: string;
//   email: string;
//   phone: string;
//   dept: string;
//   projects: string;
//   position: string;
//   status: string;
//   location?: string;
//   hiredate?: string;
// }

type Mode = "view" | "edit";
type NotificationType = 'success' | 'error' | 'warning' | 'info';

const Staff = () => {
  const [mode, setMode] = useState<Mode>("view");
  
  const { notifications, addNotification, removeNotification } = useNotification();

  const showNotification = (type: NotificationType, style = 'default') => {
    const messages: Record<NotificationType, string> = {
      success: 'Employee record was updated.',
      error: 'Something went wrong. Please try again.',
      warning: ' ',
      info: 'Employee record was deleted.'
    };
    addNotification(messages[type], { type, style});
  }; 

  const { employees, reloadEmplData } = useEmployee();

  //console.log('Staff: ', employees)
  const { isModalOpen, open, close } = useModal();
  const openModal = () => {
    open();
  }
  const closeModal = () => {
    close();
    setTimeout(() => { setMode('view') }, 500);
  }

  // State for filters and search
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({});
  const [activeFilters, setActiveFilters] = useState<FilterTag[]>([]);
  const [sortBy, setSortBy] = useState<string>('name');
  //const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);

  const depts: DeptOption[] = [
    { title: 'Clinical', code: 'CLN' },
    { title: 'Data managment', code: 'DM' },
    { title: 'Medical writing', code: 'MW' },
  ];
  
  const projects: string[] = ['3456', '9872', '2900'];
  const statusOptions: string[] = ['Active', 'On Leave', 'Inactive'];

  // Quick filter options
  const quickFilters: QuickFilter[] = [
    { label: 'Clinical', value: 'CLN', type: 'dept' },
    { label: 'Active', value: 'Active', type: 'status' },
    { label: '9872', value: '9872', type: 'projects' }
  ];

  // Filter employees based on search and filters
// Replace useEffect with useMemo
const filteredEmployees = useMemo(() => {
  const employeeArray: Employee[] = Array.isArray(employees) ? employees : [];
  let results: Employee[] = [...employeeArray];

  // Apply search term
  if (searchTerm && results.length > 0) {
    const term = searchTerm.toLowerCase();
    results = results.filter((employee: Employee) =>
      employee.name.toLowerCase().includes(term) ||
      employee.email.toLowerCase().includes(term) ||
      (employee.phone?.toLowerCase() || '').includes(term) ||
      (employee.dept?.toLowerCase() || '').includes(term) ||
      (employee.projects?.toLowerCase() || '').includes(term)
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
    results = results.filter(employee => 
      employee[filter.type as keyof Employee] === filter.value
    );
  });

  // Apply sorting
  const sortedResults = [...results].sort((a: Employee, b: Employee) => {
    if (sortBy === 'name') {
      return (a.name || '').localeCompare(b.name || '');
    } else if (sortBy === 'dept') {
      return (a.dept || '').localeCompare(b.dept || '');
    }
    return 0;
  });
  
  //console.log('filteredEmployees: ', sortedResults);
  return sortedResults;
}, [employees, searchTerm, filters, activeFilters, sortBy]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter changes
  const handleFilterChange = (filterType: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Handle quick filter click
  const handleQuickFilter = (filter: QuickFilter) => {
    // Check if filter is already active
    const isAlreadyActive = activeFilters.some(
      activeFilter => activeFilter.type === filter.type && activeFilter.value === filter.value
    );

    if (!isAlreadyActive) {
      setActiveFilters(prev => [...prev, filter]);
    }
  };

  // Remove active filter
  const removeActiveFilter = (index: number) => {
    setActiveFilters(prev => prev.filter((_, i) => i !== index));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setFilters({});
    setActiveFilters([]);
  };

  // Get initials for avatar
  const getInitials = (name: string): string => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(part => part[0] || '')
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Show detailed employee card
  //const [emplData, setEmplData] = useState<TargetEmployeInfo | undefined>(undefined);
  const [emplData, setEmplData] = useState<Employee>();
  
  const showEmplCard = (id: number, e: MouseEvent) => {
    e.stopPropagation();
    
    // Find current employe
    const employee = employees.find((item: Employee) => item.id === id);
    
    //console.log('Staff showEmplCard: ', employee)
    if (!employee) {
      console.error('Employee not found with id:', id);
      return;
    }
    
    openModal();

    // const unformatPh = employee.phone ? unformatPhone(employee.phone) : '';

    // // Transform Employee to TargetEmployeInfo with non-nullable strings
    // const transformedData: Employee = {
    //   id: employee.id,
    //   name: employee.name,
    //   email: employee.email,
    //   phone: unformatPh || '',
    //   dept: employee.dept || '',
    //   projects: employee.projects || '',
    //   position: employee.position || '',
    //   status: employee.status || '',
    //   location: employee.location || '',
    //   hiredate: employee.hiredate || '',
    // };

    // setEmplData(transformedData);
    setEmplData(employee);
  }

  // Edit info of current employee
  const editEmpInfo = () => {
    setMode('edit');
  }

  const handleModal = () => {
    closeModal();
  }

  const handleNotify = (status: string) => {
    showNotification(status as NotificationType);
  }

  const employeesCount = Array.isArray(employees) ? employees.length : 0;

  return (
    <div className="staff-container">
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {mode === 'view' ? (
          <StaffViewForm 
            emplData={emplData as Employee}
            editEmpInfo={editEmpInfo}
          />
        ) : (
          <StaffAddForm
            emplData={emplData}
            handleModal={handleModal}
            handleNotify={handleNotify}
            reload={reloadEmplData}
            mode={mode}
          />
        )}
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
                    {filter.label || filter.value}
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
              value={filters.dept || ''}
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
              value={filters.projects || ''}
              onChange={(e) => handleFilterChange('projects', e.target.value)}
            >
              <option value="">All</option>
              {projects.map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
          </div>

          <div className="staff-filter-group">
            <label className="staff-filter-label">Status</label>
            <select
              className="staff-content-select"
              value={filters.status || ''}
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
            Showing {filteredEmployees.length} of {employeesCount} employees
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
        <div className="staff-content-items">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map(employee => (
              <div 
                key={employee.id} 
                className="staff-item" 
                onClick={(e) => showEmplCard(employee.id, e)}
              >
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
                      📞 {employee.phone || 'N/A'}
                    </span>
                    <span className="staff-item-contact">
                      💼 {employee.position || 'N/A'}
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
              {activeFilters.length > 0 && (
                <button className="staff-button-clear" onClick={clearAllFilters}>
                  Clear All Filters
                </button>
              )}            
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Staff;