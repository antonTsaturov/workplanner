'use client'

import '../styles/UserSettings.css';
import { useTranslations } from 'next-intl';
import ChangePassword from './settings/ChangePassword' ;

const UserSettings = () => {
  
  const t = useTranslations('userSettings');
  
  return (
    <div className="settings-form-container">
      <form className="settings-form-content">
        <div className="settings-form-title">
          <h3>{t('title')}</h3>
        </div>
        
        <ChangePassword />
      
      </form>
    </div>
  )
}

export default UserSettings;
