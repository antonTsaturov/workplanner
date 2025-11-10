'use client'

import '../styles/StaffForm.css';
import '../styles/ProjectsInput.css';

import { useState, useEffect } from 'react';
import { handleFetch } from '../lib/fetch'

interface StaffAddFormProps {
  emplData: {
    id: number,
    name: string,
    email: string,
    phone: string,
    dept: string,
    project: string,
    position: string,
    status: string,
    hireDate: string,
  };
  handleModal: () => void;
  handleNotify: () => void;
  reload: () => void;
}

interface FormErrors {
    name?: string;
    email?: string;
    dept?: string;
    phone?: string;
    location?: string;
    projects?: string;
    position?: string;
    status?: string;
    hireDate?: string;
}

const StaffAddForm = ({emplData, handleModal, handleNotify, reload}:StaffAddFormProps) => {

  const [projects, setProjects] = useState([])

  const [formData, setFormData] = useState({
    name:'',
    email: '',
    dept: '',
    phone: '',
    location: '',
    projects: '',
    position: '',
    status: '',
    hireDate: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const checkEmail = async (email) => {
    
    if (!/^[a-zA-Z._0-9^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return;
    }
    
    try {
      const response = await handleFetch('staff', 'GET', email);
      //return response.check
      console.log('checkEmail: ', response.check)
      if (response.check == false) {
        setErrors(prev => ({
          ...prev,
          email: response.message
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          email: ''
        }));
        
      }
      
    } catch (err) {
      console.log('checkEmail error: ', err)
    }
    
  }
  
  // Validation rules
  const validateField = (name: string, value: string): string => {
    const containNumberRegex = /[0-9]/g;
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Must be at least 2 characters';
        if (!/^[a-zA-Zа-яА-Яё\s\-']+$/.test(value.trim())) return 'Name not valid';
        return '';
      
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[a-zA-Z._0-9^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email';
        if ( value == false) return 'Employee with same email exist'
        return '';
      
      case 'dept':
        if (!value.trim()) return 'Department is required';
        if (value.trim().length < 2) return 'Must be at least 2 characters';
        if (value.trim().match(containNumberRegex)) return 'Department not valid';
        return '';
      
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$|^[\+]?[(]?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) return 'Please enter a valid number';
        return '';
      
      case 'location':
        if (!value.trim()) return 'Location is required';
        if (value.trim().length < 2) return 'Must be at least 2 characters';
        if (value.trim().match(containNumberRegex)) return 'Location not valid';
        return '';
      
      case 'projects':
        // Projects is optional, no validation required
        return '';
      
      case 'position':
        if (!value.trim()) return 'Position is required';
        if (value.trim().length < 2) return 'Must be at least 2 characters';
        if (value.trim().match(containNumberRegex)) return 'Position not valid';
        return '';
      
      case 'status':
        if (!value.trim()) return 'Status is required';
        if (!['Active', 'Inactive'].includes(value)) return 'Status must be selected';
        return '';
      
      case 'hireDate':
        if (!value.trim()) return 'Hire date is required';
        const date = new Date(value);
        if (isNaN(date.getTime())) return 'Please enter a valid date';
        if (date > new Date()) return 'Date cannot be in the future';
        return '';
      
      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
    
  };

  const [fillCount, setFillCount] = useState(0)

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate field immediately after change if it's been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }

    // Check how much fields are filled
    const filled = Object.values(formData).filter(item => 
      item.length > 0 
    )
    setFillCount(filled.length)
    
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate field on blur
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    if (name == 'email') {
      checkEmail(value)
    }
    console.log(formData)
  };


  const getInputClassName = (fieldName: string): string => {
    const baseClass = fieldName === 'status' ? 'staff-form-select' : 'staff-form-input';
    if (errors[fieldName as keyof FormErrors] && touched[fieldName]) {
      return `${baseClass} input-error`;
    }
    return baseClass;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched on submit
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validate entire form
    if (!validateForm()) {
      console.log('Form has validation errors');
      return;
    }

    console.log('Form data is valid:', formData);
    
    try {
      const response = await handleFetch('staff', 'POST', formData);
      
    if (!response.error) {
      console.log(response)
      setTimeout(()=> {handleModal()}, 800 )
      setTimeout(()=> {handleNotify('success')}, 700 )
      reload()
    } else {
      console.log('response error: ', response.message)
      setTimeout(()=> {handleNotify('error')}, 500 )
    }

    } catch (err) {
      setTimeout(()=> {handleNotify('error')}, 500 )
      console.log('response error: ', err)
    }
  };

  // Add CSS for error states (add this to your StaffForm.css)
  const errorStyles = `
    .input-error {
      border-color: #ef4444 !important;
      box-shadow: 0 0 0 3px rgb(239 68 68 / 0.1) !important;
    }
    
    .error-message {
      color: #ef4444;
      font-size: 0.75rem;
      margin-top: 0.25rem;
      display: block;
    }
    
    .staff-form-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      margin-bottom: 0.5rem;
    }
  `;

  const [projectInputValue, setProjectInputValue] = useState('')
  
  const handleProjectInputChange = (e) => {
    setProjectInputValue(e.target.value);
  };

  
  const addProject = (prj) => {
    if (prj && !projects.includes(prj)) {
      setProjects([...projects, prj]);
      setProjectInputValue('');
      setFormData(prev => ({
        ...prev,
        projects: [...prev.projects, prj]
      }));

    }
  };

  const removeProject = (indexToRemove) => {
    setProjects(projects.filter((_, index) => index !== indexToRemove));
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects.filter((_, index) => index !== indexToRemove)]
    }));
  };
  
  const handleInputKeyDown = (e) => {
    const keycodes = ['Enter', 'Space', 'Comma', 'Period']
    if (keycodes.includes(e.code)) {
      e.preventDefault();
      addProject(projectInputValue.trim());
    } else if (e.key === 'Backspace' && projectInputValue === '' && projects.length > 0) {
      removeProject(projects.length - 1);
    }
  };


  return (
    <div className="staff-form-container">
      <style>{errorStyles}</style>
      
      <form className="staff-form-content" noValidate>
        <div className="staff-form-title">
          <h3>Add new employee</h3>
        </div>
        
        <div className="staff-form-content-columns">
          {/* First Column */}
          <div>
            <label className="staff-form-label">Name *</label>
            <input
              className={getInputClassName('name')}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              onBlur={handleBlur}
              placeholder="Enter full name"
            />
            <span className="error-message">{errors.name && touched.name ? errors.name : null}</span>

            <label className="staff-form-label">Email *</label>
            <input
              className={getInputClassName('email')}
              type='email'
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              onBlur={handleBlur}
              placeholder="employee@company.com"
            />
            <span className="error-message">{errors.email && touched.email ? errors.email : null}</span>

            <label className="staff-form-label">dept *</label>
            <input
              className={getInputClassName('dept')}
              type='text'
              name="dept"
              value={formData.dept}
              onChange={handleFormChange}
              onBlur={handleBlur}
              placeholder="e.g., Engineering, Marketing"
            />
            <span className="error-message">{errors.dept && touched.dept ? errors.dept : null}</span>
          </div>

          {/* Second Column */}
          <div>
            <label className="staff-form-label">Phone *</label>
            <input
              className={getInputClassName('phone')}
              type='tel'
              name='phone'
              value={formData.phone}
              onChange={handleFormChange}
              onBlur={handleBlur}
              placeholder="+1 (555) 123-4567"
            />
            <span className="error-message">{errors.phone && touched.phone ? errors.phone : null}</span>

            <label className="staff-form-label">Location *</label>
            <input
              className={getInputClassName('location')}
              type='text'
              name="location"
              value={formData.location}
              onChange={handleFormChange}
              onBlur={handleBlur}
              placeholder="City, State or Office location"
            />
            <span className="error-message">{errors.location && touched.location ? errors.location : null}</span>

            <label className="staff-form-label">Position *</label>
            <input
              className={getInputClassName('position')}
              type='text'
              name="position"
              value={formData.position}
              onChange={handleFormChange}
              onBlur={handleBlur}
              placeholder="e.g., Senior Developer"
            />
            <span className="error-message">{errors.position && touched.position ? errors.position : null}</span>

          </div>

          {/* Third Column */}
          <div>

            <label className="staff-form-label">Status *</label>
            <select
              className={getInputClassName('status')}
              name="status"
              value={formData.status}
              onChange={handleFormChange}
              onBlur={handleBlur}
            >
              <option value="">Select status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <span className="error-message">{errors.status && touched.status ? errors.status : null}</span>

            <label className="staff-form-label">Hire date *</label>
            <input
              className={getInputClassName('hireDate')}
              type='date'
              name="hireDate"
              value={formData.hireDate}
              onChange={handleFormChange}
              onBlur={handleBlur}
            />
            <span className="error-message">{errors.hireDate && touched.hireDate ? errors.hireDate : null}</span>
          </div>
        </div>  
        
        <label className="staff-form-label">Projects</label>
        <div className="projects-input-container"> 
          {projects.map((item, index) => (
            <div key={item} className="project-item">
              <span className="project-text">{item}</span>
              <button
                type="button"
                className="project-remove"
                onClick={() => removeProject(index)}
              >
                ×
              </button>
            </div>
          ))}            
          <input
            //className={getInputClassName('projects')}
            className="projects-input"
            type='text'
            name="projects"
            //value={formData.projects}
            value={projectInputValue}
            //onChange={handleFormChange}
            onChange={handleProjectInputChange}
            onBlur={handleBlur}
            placeholder="Projects (optional)"
            onKeyDown={handleInputKeyDown}
          />
        </div>
        <span className="error-message">{errors.projects && touched.projects  ? errors.projects : null}</span>
        
        <div className="event-button-container">
          <button 
            type="submit" 
            onClick={submit} 
            className="event-button-save"
            disabled={ fillCount < 8 }//&& Object.values(errors).length > 0
          >
            <h4 className="button-text">
              Save
            </h4>
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffAddForm;
