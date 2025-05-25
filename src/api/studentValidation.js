// src/utils/studentValidation.js
import apiClient from "@/lib/axios";

export const validateByEmail = async (email) => {
  const response = await apiClient.post("students/validate/email", {
    email,
  });
  return response.data;
};

export const validateByStudentId = async (matricula) => {
  const response = await apiClient.post("students/validate/matricula", {
    matricula: matricula.toString(),
  });
  return response.data;
};

// src/utils/studentValidation.js
export const sendInfo = async (
  matricula,
  photoFile,
  id_alumno,
  msgIncidence = null
) => {
  try {
    const formData = new FormData();
    formData.append("image", photoFile);
    formData.append("matricula", matricula);
    formData.append("id_alumno", id_alumno);

    if (msgIncidence) {
      formData.append("msg_incidence", msgIncidence);
    }

    const response = await apiClient.post(
      "students/registros",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al enviar información:", error);
    throw error;
  }
};
