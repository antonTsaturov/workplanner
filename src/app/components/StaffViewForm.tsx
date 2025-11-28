import React from 'react';
import '../styles/StaffViewForm.css';
import { formatPhone } from '../utils/format';


const StaffViewForm = ({ emplData, editEmpInfo }) => {
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  
  return (
    <div className="employee-view-container">
      <div className="employee-view-content">
        <h2 className="employee-view-title">Employee Information</h2>
        
        <div className="employee-view-content-columns">
          {/* Personal Information */}
          <div className="employee-info-group">
            <label className="employee-info-label">Full Name</label>
            <div className="employee-info-value">
              {emplData?.name || <span className="employee-info-value-empty">Not specified</span>}
            </div>
          </div>

          <div className="employee-info-group">
            <label className="employee-info-label">Position</label>
            <div className="employee-info-value">
              {emplData?.position || <span className="employee-info-value-empty">Not specified</span>}
            </div>
          </div>

          <div className="employee-info-group">
            <label className="employee-info-label">Department</label>
            <div className="employee-info-value">
              {emplData?.dept || <span className="employee-info-value-empty">Not specified</span>}
            </div>
          </div>

          <div className="employee-info-group">
            <label className="employee-info-label">ID number</label>
            <div className="employee-info-value">
              {emplData?.id || <span className="employee-info-value-empty">Not assigned</span>}
            </div>
          </div>

          <div className="employee-info-group">
            <label className="employee-info-label">Email</label>
            <div className="employee-info-value">
              {emplData?.email || <span className="employee-info-value-empty">Not specified</span>}
            </div>
          </div>

          <div className="employee-info-group">
            <label className="employee-info-label">Phone</label>
            <div className="employee-info-value">
              {emplData?.phone ? formatPhone(emplData.phone) : <span className="employee-info-value-empty">Not specified</span>}
            </div>
          </div>

          <div className="employee-info-group">
            <label className="employee-info-label">Hire Date</label>
            <div className="employee-info-value">
              {emplData?.hiredate ? formatDate(emplData.hiredate) : <span className="employee-info-value-empty">Not specified</span>}
            </div>
          </div>

          <div className="employee-info-group">
            <label className="employee-info-label">Status</label>
            <div className="employee-info-value">
              {emplData?.status == 'Active' ? (
                <span className="employee-status-active">Active</span>
              ) : emplData?.status == 'Inactive' ? (
                <span className="employee-status-inactive">Inactive</span>
              ) : (
                <span className="employee-info-value-empty">Not specified</span>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="employee-info-group">
          <label className="employee-info-label">Location</label>
          <div className="employee-info-value" style={{ minHeight: 'auto', padding: '0.875rem' }}>
            {emplData?.location ? (
              <div style={{ whiteSpace: 'pre-line' }}>{emplData.location}</div>
            ) : (
              <span className="employee-info-value-empty">Not specified</span>
            )}
          </div>
        </div>
        <div className="employee-info-group">  
          <label className="employee-info-label">Assigned projects</label>
          <div className="employee-info-value" style={{ minHeight: 'auto', padding: '0.875rem' }}>
            {emplData?.projects ? (
              <div style={{ whiteSpace: 'pre-line' }}>
                {
                  emplData.projects.includes(',') 
                  ? JSON.parse(emplData.projects).join(', ')
                  : <span className="employee-status-active">{emplData.projects.replace(/[^a-zA-Z0-9]/g, "")}</span>
                }
              </div>
            ) : (
              <span className="employee-info-value-empty">Not specified</span>
            )}
          </div>
        </div>

        {/* <div className="employee-info-group">
          <label className="employee-info-label">Notes</label>
          <div className="employee-info-value" style={{ minHeight: 'auto', padding: '0.875rem' }}>
            {employee?.notes ? (
              <div style={{ whiteSpace: 'pre-line' }}>{employee.notes}</div>
            ) : (
              <span className="employee-info-value-empty">No additional notes</span>
            )}
          </div>
        </div> */}

        {/* Action Buttons */}
        <div className="employee-view-actions">
          <button 
            className="employee-view-button-edit" 
            onClick={()=> {editEmpInfo(emplData?.id)}}
            type="button"
          >
            Edit Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffViewForm;
