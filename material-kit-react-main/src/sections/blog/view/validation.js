// validation.js
export const validateCine = (value) => {
    if (value.trim().length < 6) {
      return 'CINE doit contenir au moins 6 caractères';
    }
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    if (!alphanumericRegex.test(value)) {
      return 'CINE ne doit contenir que des lettres et des chiffres';
    }
    return ''
};  
  
  
  export const validateEmail = (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      return "L'email n'est pas valide";
    }
    return '';
  };
  
  const alphabeticRegex = /^[a-zA-ZÀ-ÿ]+$/;

  export const validateFirstName = (value) => {
    if (value.trim().length <= 3) {
      return 'Le prénom doit contenir plus de 3 caractères';
    }
    if (!alphabeticRegex.test(value)) {
      return 'Le prénom ne doit contenir que des lettres';
    }
    return '';
  };
  
  export const validateLastName = (value) => {
    if (value.trim().length <= 3) {
      return 'Le nom doit contenir plus de 3 caractères';
    }
    if (!alphabeticRegex.test(value)) {
      return 'Le nom ne doit contenir que des lettres';
    }
    return '';
  };
  
  
  export const validateBirthdate = (value) => {
    if (!value) {
      return 'La date de naissance est requise';
    }
    // Add any specific validation logic for birthdate here
    return '';
  };
  
  export const validateAge = (value) => {
    if (!value || Number.isNaN(value) || value <= 0) {
      return "L'âge doit être un nombre positif";
    }
    return '';
  };
  
  export const validateAddress = (value) => {
    if (!value.trim()) {
      return "L'adresse est requise";
    }
    // Add any specific validation logic for address here
    return '';
  };
  
  export const validatePhoneNumber = (value) => {
    const phonePattern = /^\+?[0-9]\d{1,14}$/;
    if (!phonePattern.test(value)) {
      return 'Le numéro de téléphone n’est pas valide';
    }
    return '';
  };
  
  export const validateGender = (value) => {
    if (!value) {
      return 'Le genre est requis';
    }
    return '';
  };
  
  export const validateSpeciality = (value) => {
    if (!value) {
      return 'La spécialité est requise';
    }
    return '';
  };
  
  export const validateRoom = (value) => {
    if (!value) {
      return 'La salle est requise';
    }
    return '';
  };
  
  export const validatePatient = (value) => {
    if (!value.trim()) {
      return 'Le patient est requis';
    }
    return '';
  };
  
  export const validateAppointmentDate = (value) => {
    if (!value) {
      return 'La date de rendez-vous est requise';
    }
  
    const selectedDate = new Date(value);
    const now = new Date();
  
    if (selectedDate < now) {
      return 'La date de rendez-vous doit être égale ou postérieure à la date actuelle';
    }
  
    return '';
  };
  