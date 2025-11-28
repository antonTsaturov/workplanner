'use client'

import '../styles/StaffAddForm.css';
import '../styles/ProjectsInput.css';

import Loader from './Loader';

import { useState, useEffect } from 'react';
import { handleFetch } from '../lib/fetch';
import { formatPhone, unformatPhone } from '../utils/format';

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
    hiredate: string,
    password: string,
  };
  handleModal: () => void;
  handleNotify: () => void;
  reload: () => void;
  mode: string;
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
    hiredate?: string;
    password: string;
}

function fastFormatPhone(phone) {
  // Remove all non-digit characters
  const cleaned = phone.toString().replace(/\D/g, '');
  
  // Check if it's a Russian number starting with 8 or 7
  if (cleaned.length === 11 && (cleaned.startsWith('8') || cleaned.startsWith('7'))) {
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`;
  }
  
  // Return original if doesn't match expected format
  return phone;
}


const StaffAddForm = ({ emplData, handleModal, handleNotify, reload, mode }:StaffAddFormProps) => {
  
  //console.log('StaffAddForm: ', emplData)
  const [projects, setProjects] = useState([])

  const [formData, setFormData] = useState(!emplData ? {
    name: '',
    email: '',
    dept: '',
    phone: '',
    location: '',
    projects: '',
    position: '',
    status: '',
    hiredate: '',
    password: 'null',
  } : {
    name: emplData?.name,
    email: emplData?.email,
    dept: emplData?.dept,
    phone: emplData?.phone,
    location: emplData?.location,
    projects: emplData?.projects,
    position: emplData?.position,
    status: emplData?.status,
    hiredate: emplData?.hiredate,
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
        if (!/^[a-zA-Zа-яА-Яё\s\-']+$/.test(value.trim())) return 'Name not valid';
        if (value.trim().length < 2) return 'Must be at least 2 characters';
        return '';
      
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^(?!.*\.\.)(?!.*\.$)(?!^\.)[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@(?!.*\.\.)(?!.*\.$)(?!^\.)[a-zA-Z0-9.-]{1,253}\.[a-zA-Z]{2,}$/i.test(value)) return 'Please enter a valid email';
        if ( value == false) return 'Employee with same email exist'
        return '';
      
      case 'dept':
        if (!value.trim()) return 'Department is required';
        if (value.trim().length < 2) return 'Must be at least 2 characters';
        if (value.trim().match(containNumberRegex)) return 'Department not valid';
        return '';
      
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        if (unformatPhone(value.trim()).length < 11) return 'Phone number too short';
        const phoneRegex = /\+\d\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}/;
        if (!value.trim().match(phoneRegex)) return 'Format mistakes';
        return '';
      
      case 'location':
        if (!value.trim()) return 'Location is required';
        if (value.trim().match(containNumberRegex)) return 'Location not valid';
        if (value.trim().length < 3) return 'Location name too short';
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
      
      case 'hiredate':
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
      item?.length > 0 
    )
    setFillCount(filled.length)
    console.log(formData)
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
  
  const [e, setE] = useState(false)
  const handleKeyDown = (e) => {
    // Разрешаем: цифры, Backspace, Delete, Tab, Arrow keys
    if (
      !/[0-9]/.test(e.key) &&
      e.key !== 'Backspace' &&
      e.key !== 'Delete' &&
      e.key !== 'Tab' &&
      e.key !== 'ArrowLeft' &&
      e.key !== 'ArrowRight'
    ) {
      e.preventDefault();
    }
  };
  
  return (
    <div className="staff-form-container">
      <style>{errorStyles}</style>
      
      <form className="staff-form-content" noValidate>
        <div className="staff-form-title">
          <h3>{`${mode === 'add' ?'Add new employee' : 'Edit employee info'}`}</h3>
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
              disabled
              value={formData.email}
              onChange={handleFormChange}
              onBlur={handleBlur}
              placeholder="employee@company.com"
            />
            <span className="error-message">{errors.email && touched.email ? errors.email : null}</span>

            <label className="staff-form-label">Department *</label>
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
              inputMode="numeric"
              pattern="[0-9]*"
              value={formatPhone(formData.phone, e) || ''}
              //value={formData.phone}
              maxLength={18}
              onChange={handleFormChange}
              onBlur={handleBlur}
              onKeyDown={(e)=>{
                setE(e)
                handleKeyDown(e)
              }}
              placeholder="+ 7 (***) ***-**-**"
            />
            <span className="error-message">{errors.phone && touched.phone ? errors.phone : null}</span>

            <label className="staff-form-label">Location *</label>
            <input
              className={getInputClassName('location')}
              type='text'
              name="location"
              value={formData.location || ''}
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
              value={formData.position || ''}
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
              value={formData.status || ''}
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
              className={getInputClassName('hiredate')}
              type='date'
              name="hiredate"
              value={formData.hiredate || ''}
              onChange={handleFormChange}
              onBlur={handleBlur}
            />
            <span className="error-message">{errors.hiredate && touched.hiredate ? errors.hiredate : null}</span>
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
