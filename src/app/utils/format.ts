export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}
  
export function formatTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}


const symbols = ['+', ' ', '-', '(', ')'];

export const formatPhone = (phone, e) => {
  if (e.code != 'Backspace' || !e ) {
    if (phone.length == 1 && !phone.includes('+','8')) return `+7 (`
    if (phone.length == 7 ) return `${phone}) `
    if (phone.length == 12 || phone.length == 15) return `${phone}-`
  } else if (e.code = 'Backspace')  {
    return `${phone}`;
  }
}

export const unformatPhone = (phone) => {
  const phoneArr = phone.split('');
  for (let i = 0; i < phoneArr.length; i++) {
    if (i == 1 && phoneArr.length > 10) phoneArr[i] = 8;
    if (symbols.includes(phoneArr[i])) phoneArr[i] = '';
  }
  return phoneArr.join('');
}

//export const formatDuration = (hours) => {
  //const totalMinutes = hours * 60;
  //const hoursPart = Math.floor(totalMinutes / 60);
  //const minutesPart = Math.round(totalMinutes % 60);
  //return `${hoursPart}h ${minutesPart}m`;
//};

export function formatDuration(duration) {
  const durationFloat = parseFloat(duration) * 60
  const hours = Math.floor(durationFloat / 60);
  const minutes = durationFloat % 60;
  return `${hours}h ${minutes}m`;
}
