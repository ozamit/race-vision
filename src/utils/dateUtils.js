// Formats ISO string to "dd/mm/yyyy hh:mm AM/PM" in local timezone
export const formatDate = (isoDate) => {
    const cleanIsoDate = isoDate.replace('Z', '');
    const date = new Date(cleanIsoDate);
  
    const simplifiedDate = date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  
    const simplifiedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  
    return `${simplifiedDate} ${simplifiedTime}`;
  };
  
  // Converts ISO date with GMT offset to local user time (dd/mm/yyyy HH:mm)
  export const convertToUserLocalTime = (isoDate, gmtOffset) => {
    const eventDate = new Date(isoDate);
    const [hours, minutes] = gmtOffset.split(':').map(Number);
    const totalOffsetMinutes = hours * 60 + minutes;
  
    eventDate.setMinutes(eventDate.getMinutes() - totalOffsetMinutes);
  
    const day = String(eventDate.getDate()).padStart(2, '0');
    const month = String(eventDate.getMonth() + 1).padStart(2, '0');
    const year = eventDate.getFullYear();
    const hour = String(eventDate.getHours()).padStart(2, '0');
    const minute = String(eventDate.getMinutes()).padStart(2, '0');
  
    return `${day}/${month}/${year} ${hour}:${minute}`;
  };
  