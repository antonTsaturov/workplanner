import React from 'react';
import '../styles/StaffViewForm.css';

const StaffViewForm = ({ emplData, employee, onEdit, onBack }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPhone = (phone) => {
    if (!phone) return 'Not specified';
    // Simple phone formatting
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
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
              {emplData?.department || <span className="employee-info-value-empty">Not specified</span>}
            </div>
          </div>

          <div className="employee-info-group">
            <label className="employee-info-label">Employee ID</label>
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
              {emplData?.hireDate ? formatDate(emplData.hireDate) : <span className="employee-info-value-empty">Not specified</span>}
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
          <label className="employee-info-label">Address</label>
          <div className="employee-info-value" style={{ minHeight: 'auto', padding: '0.875rem' }}>
            {emplData?.location ? (
              <div style={{ whiteSpace: 'pre-line' }}>{emplData.location}</div>
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
          {/* <button 
            className="employee-view-button-back" 
            onClick={onBack}
            type="button"
          >
            Back to List
          </button> */}
          <button 
            className="employee-view-button-edit" 
            onClick={onEdit}
            type="button"
          >
            Edit Employee
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffViewForm;