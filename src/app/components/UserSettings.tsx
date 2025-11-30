'use client'

import '../styles/UserSettings.css';
import { useTranslations } from 'next-intl';

import { validateField } from '../utils/validateField';

import Loader from './Loader';

import { useState, useRef, useEffect, useCallback } from 'react';

import { handleFetch } from '../lib/fetch'


const eyeOpen = <img src="/assets/eye.svg" alt="Show password" style={{heigth:'24px', width:'24px'}}/>
const eyeClosed = <img src="/assets/eye_closed.svg" alt="Show password" style={{heigth:'24px', width:'24px'}}/>


const CustomPasswordInput = ({reset = false, onBlur, handleValue, value: externalValue, onChange, maskChar = '●', maskWhileTyping = true, ...props }) => {
    
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
    
    useEffect(() => {
        if (reset) {
            const emptyValue = '';
            setInternalValue(emptyValue);
            setDisplayValue('');
            setRevealOnFocus(false);
            setIsFocused(false);
            
            // Notify parent about reset
            handleValue?.(emptyValue);
            onChange?.(emptyValue);
        }
    }, [reset, handleValue, onChange]);

    const handleFocus = useCallback(() => {
        setIsFocused(true);
    }, []);

    const handleBlur = useCallback(() => {
        setIsFocused(false);
        onBlur(event)
    }, []);

const handleChange = useCallback((e) => {
    // If reset is active, ignore changes
    if (reset) return;
    
    const newValue = e.target.value;
    
    // If masking while typing, need to correct the value
    let processedValue = newValue;
    
    if (maskWhileTyping && isFocused) {
        // When masking during input we get masked characters
        // Need to determine if it was adding or deleting characters
        
        if (newValue.length > actualValue.length) {
            // Adding a character - determine which one
            const addedChar = newValue[newValue.length - 1];
            processedValue = actualValue + addedChar;
        } else if (newValue.length < actualValue.length) {
            // Deleting a character
            processedValue = actualValue.slice(0, -1);
        }
    }

    if (externalValue !== undefined) {
        // Controlled mode
        onChange?.(processedValue);
    } else {
        // Uncontrolled mode
        setInternalValue(processedValue);
    }
}, [externalValue, onChange, actualValue, maskWhileTyping, isFocused, reset]);
  
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
  
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [opacity, setOpacity] = useState(1)
  const [reset, setReset] = useState(false)
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});


  const [formData, setFormData] = useState({
      current: '',
      newpass: '',
      confirm: ''
  });
  
  const handleValue = (name, value) => {
    setReset(false)
    if (value.length == 0) {
      return
    }
    setError('')
    setMessage('')
    setReset(false)
    
    setFormData(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }
  
  const handleBlur = (name, event) => {
    console.log('Blurred with value:', event.target.value);
    setMessage('');
    setError('');
    if (event.target.value == 0) {
      return
    }
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate field on blur
    const error = validateField(name, formData[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };
  
  const submitEvent = async (e) => {
    e.preventDefault();
    setReset(true)
    setOpacity(0.4)
    
    if (formData.newpass !== formData.confirm) {
      setOpacity(1)
      setErrors(prev => ({
        ...prev,
        newpass: ' not match',
        confirm: ' not match',
      }));
      return;
    }
    
    if (formData.newpass.length == 0 && formData.current.length == 0 && formData.confirm.length == 0) {
      setOpacity(1)
      setErrors({
        current: ' is empty',
        newpass: ' is empty',
        confirm: ' is empty',
      });
      setTouched(({
        current: true,
        newpass: true,
        confirm: true,
      }));
      return
    }
    
    if (formData.newpass === formData.current) {
      setOpacity(1)
      setErrors({
        current: " can't be the same",
        newpass: " can't be the same",
      });
      setTouched(({
        current: true,
        newpass: true,
      }));
      return
    }

    if (errors.newpass.length == 0 && errors.current.length == 0 && errors.confirm.length == 0) {
      const response = await handleFetch('password', 'PUT', formData);
      
      if (!response.error) {
        setOpacity(1)
        console.log('Success response: ', response.message)
        setMessage(response.message)

        //handleModal()
        //setTimeout(()=> {handleNotify('success')}, 400 )
      } else {
        setOpacity(1)
        console.log('Error response: ', response.error)
        
        setError(response.error == 'Wrong email or password' ? 'Wrong password' : response.error)
        throw new Error(`HTTP error! status: ${response}`);

        //setTimeout(()=> {handleNotify('error')}, 500 )
      }
      
      // Reset form
      setReset(true)

    }
  }
  
  
  return (
  
      <div className="event-form-container">
        <form className="event-form-content">
          <div className="event-form-title">
            <h3>{t('title')}</h3>
          </div>
          
          <div className="event-form-content-column" style={{opacity: opacity}}>
            <div className="event-form-subtitle">
              <h4 className="border-bottom-line">{t('subtitle')}</h4>
            </div>
            
            <div>
              <label className="event-form-label">{t('current')}
                <span className="error">
                  {errors.current && touched.current ? errors.current : null}
                </span>
              </label>
              <CustomPasswordInput
                handleValue={(value) => handleValue('current', value)}
                onBlur={ (event) => handleBlur('current', event)}
                reset={reset}
              />
              
              <label className="event-form-label">{t('new')}
                <span className="error">
                  {errors.newpass && touched.newpass ? errors.newpass : null}
                </span>
              
              </label>
              <CustomPasswordInput
                handleValue={(value) => handleValue('newpass', value)}
                onBlur={ (event) => handleBlur('newpass', event)}
                reset={reset}
              />
              
              <label className="event-form-label">{t('confirm')}
                <span className="error">
                  {errors.confirm && touched.confirm ? errors.confirm : null}
                </span>

              </label>
              <CustomPasswordInput
                handleValue={(value) => handleValue('confirm', value)}
                onBlur={ (event) => handleBlur('confirm', event)}
                reset={reset}
              />
            </div>
            
            {error ? (
              <div style={{color:'red', fontSize:12}}>
                {error}
              </div>
              )
              : (
              <div style={{color:'green', fontSize:12}}>
                {message}
              </div>
              )
            }
            
            <div className="event-button-container">
            {
              opacity < 1 ? (<div><Loader /></div>) : null
            }
            
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
