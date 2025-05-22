// src/utils/studentValidation.js
import apiClient from '../../lib/axios';

export const validateByEmail = async (email) => {
  const response = await apiClient.post('/students/validate-by-email', { email });
  return response.data;
};

export const validateByStudentId = async (studentId) => {
  const response = await apiClient.post('/students/validate-by-student-id', { 
    studentId: studentId.toString() 
  });
  return response.data;
};