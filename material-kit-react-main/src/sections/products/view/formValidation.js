export const validateForm = (formData) => {
    const errors = {};
  
    Object.keys(formData).forEach((key) => {
      if (!formData[key].trim()) {
        errors[key] = 'Ce champ est requis';
      }
    });
  
    return errors;
  };