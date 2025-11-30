  import { weakPasswordPatterns } from './passcheck'

  const EMAIL_RGX = /^(?:(?!\.)[a-zA-Z0-9._%+-]+(?<!\.))@(?:(?!-)[a-zA-Z0-9-]+(?<!-)\.)+(?:[a-zA-Z]{2,}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)$/

  export const validateField = (name: string, value: string): string => {
    const restrictedRegex = /[0-9!@#$%^&*()_+{}[]]/g;
    switch (name) {
      case 'name':
        if (!value.trim()) return ' is required.';
        if (value.trim().length < 4) return ' must be at least 4 characters length.';
        if (!/^[a-zA-Zа-яА-Яё\s\-']+$/.test(value.trim())) return ' must contain only letters.';
        return '';
      
      case 'email':
        if (!value.trim()) return ' is required.';
        if (!EMAIL_RGX.test(value)) return ' not valid.';
        return '';
        
      case 'password':
      case 'current':
      case 'newpass':
      case 'confirm':
        //if (!value?.trim()) return ' is required.';
        if (value?.trim().length < 6) return ' must be at least 6 characters long.';
        if (weakPasswordPatterns.keyboardPatterns.test(value?.trim())) return ' not must be a common pattern.';
        if (weakPasswordPatterns.noNumbers.test(value?.trim())) return ' must contain a digits.';
        if (weakPasswordPatterns.noLetters.test(value?.trim())) return ' must contain a letters.';
        return '';
              
      default:
        return '';
    }
  };
