'use client'

import '../styles/UserSettings.css';
import { useTranslations } from 'next-intl';

import { validateField } from '../utils/validateField';

import { useState, useRef, useEffect, useCallback } from 'react';

  const eyeOpen = <img src="/assets/eye.svg" alt="Show password" style={{heigth:'24px', width:'24px'}}/>
  const eyeClosed = <img src="/assets/eye_closed.svg" alt="Show password" style={{heigth:'24px', width:'24px'}}/>


const CustomPasswordInput = ({handleValue, value: externalValue, onChange, maskChar = '●', maskWhileTyping = true, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(externalValue || '');
    const [displayValue, setDisplayValue] = useState('');
    const inputRef = useRef(null);
    const [revealOnFocus, setRevealOnFocus] = useState(false);   // Показывать оригинал при фокусе

    

    // Используем внешнее значение если оно передано, иначе внутреннее
    const actualValue = externalValue !== undefined ? externalValue : internalValue;
    
    
    // Функция для применения маски
    const applyMask = useCallback((value) => {
        return maskChar.repeat(value.length);
    }, [maskChar]);

    // Обновление отображаемого значения
    useEffect(() => {
        if ( revealOnFocus) {
            // При фокусе показываем оригинальное значение
            setDisplayValue(actualValue);
        } else if (maskWhileTyping && !isFocused) {
            // При потере фокуса маскируем
            setDisplayValue(applyMask(actualValue));
        } else if (maskWhileTyping && isFocused) {
            // Во время ввода маскируем (симуляция реального поля пароля)
            setDisplayValue(applyMask(actualValue));
            
        } else {
            // Без маскировки при вводе
            setDisplayValue(actualValue);
        }
        // Всегда передавать немаскированное значение родителю
        handleValue(internalValue)

    }, [actualValue, isFocused, maskWhileTyping, revealOnFocus, applyMask]);

    const handleFocus = useCallback(() => {
        setIsFocused(true);
    }, []);

    const handleBlur = useCallback(() => {
        setIsFocused(false);
    }, []);

    const handleChange = useCallback((e) => {
        const newValue = e.target.value;
        
        // Если маскируем во время ввода, нужно корректировать значение
        let processedValue = newValue;
        
        if (maskWhileTyping && isFocused) {
            // При маскировке во время ввода мы получаем маскированные символы
            // Нужно определить, было ли это добавление или удаление символов
            
            if (newValue.length > actualValue.length) {
                // Добавление символа - определяем какой именно
                const addedChar = newValue[newValue.length - 1];
                processedValue = actualValue + addedChar;
            } else if (newValue.length < actualValue.length) {
                // Удаление символа
                processedValue = actualValue.slice(0, -1);
            }
        }

        if (externalValue !== undefined) {
            // Контролируемый режим
            onChange?.(processedValue);
        } else {
            // Неконтролируемый режим
            setInternalValue(processedValue);
        }
    }, [externalValue, onChange, actualValue, maskWhileTyping, isFocused]);
  
  const toggleVisibility = () => {
    revealOnFocus ? setRevealOnFocus(false) : setRevealOnFocus(true);
   // console.log()
  }

  return (
    <div className="custom-password-wrapper">
      <input
        type="text"
        value={displayValue}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        className="event-form-input"
        ref={inputRef}
        style={{
          fontFamily: 'monospace',
          letterSpacing: '2px',
          fontSize: '16px'
        }}
      />
      <button
        type="button"
        className="password-toggle-btn"
        onClick={toggleVisibility}
      >
        {revealOnFocus ? eyeOpen : eyeClosed}

      </button>
    </div>
  );
};
//
const UserSettings = () => {
  
  const t = useTranslations('userSettings');
  
  const [error, setError] = useState('')
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});


  const [formData, setFormData] = useState({
      current: '',
      newpass: '',
      confirm: ''
  });
  
  const handleValue = (name, value) => {
    if (value.length == 0) {
      return
    }
    setError('')
    setFormData(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
    //console.log(error)
  }
  
  const submitEvent = (e) => {
    e.preventDefault();
    
    if (formData.newpass !== formData.confirm) {
      setErrors(prev => ({
        ...prev,
        newpass: ' not match',
        confirm: ' not match',
      }));
    }
    if (formData.newpass.length < 1 || formData.confirm.length < 1 || formData.confirm.current < 1) {
      setErrors({
        current: ' is empty',
        newpass: ' is empty',
        confirm: ' is empty',
      });
    }
    
    
  }
  
  
  return (
  
      <div className="event-form-container">
        <form className="event-form-content">
          <div className="event-form-title">
            <h3>{t('title')}</h3>
          </div>
          
          <div className="event-form-content-column">
            <div className="event-form-subtitle">
              <h4 className="border-bottom-line">{t('subtitle')}</h4>
            </div>
          
            
            <div>
              <label className="event-form-label">{t('current')}
                <span className="error">
                  {errors.current ? errors.current : null}
                </span>
              </label>
              <CustomPasswordInput
                handleValue={(value) => handleValue('current', value)}
              />
              
              <label className="event-form-label">{t('new')}
                <span className="error">
                  {errors.newpass ? errors.newpass : null}
                </span>
              
              </label>
              <CustomPasswordInput
                handleValue={(value) => handleValue('newpass', value)}
              />
              
              <label className="event-form-label">{t('confirm')}
                <span className="error">
                  {errors.confirm ? errors.confirm : null}
                </span>

              </label>
              <CustomPasswordInput
                handleValue={(value) => handleValue('confirm', value)}
              />
            </div>
            
            <div style={{color:'red', fontSize:12}}>
              {error}
            </div>
            
            <div className="event-button-container">
              <button
                onClick={submitEvent}
                className="event-button-save" 
              >
                  <h4 className="button-text">{t('save')}</h4>
              </button>
            </div>
          </div>
        </form>
      </div>
  )
}

export default UserSettings;
