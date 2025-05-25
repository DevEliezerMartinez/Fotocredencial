import React, { useState } from "react";
import { Button, Input, notification } from "antd";
import "@/assets/css/registration.css";
import { sendInfo } from "@/api/studentValidation";
const { TextArea } = Input;
import { useNavigate } from "react-router-dom";

const RegistrationForm = ({
  photoValid,
  photoSrc,
  handleSubmit,
  studentData,
  photoFile, // Asegúrate de pasar el archivo de foto como prop
}) => {
  const [showIncidentInput, setShowIncidentInput] = useState(false);
  const [incidentDescription, setIncidentDescription] = useState("");

  // Determinar si los botones deben estar deshabilitados
  const buttonsDisabled = !photoValid || !photoSrc;
  const navigate = useNavigate();

  const handleCorrectInfo = async () => {
    console.log("Información confirmada como correcta");

    // Validar que photoFile existe
    if (!photoFile) {
      alert("No se ha capturado ninguna fotografía válida.");
      return;
    }

    try {
      // Obtener id_alumno de studentData o usar un valor por defecto
      const alumno_id = studentData.alumno_id;

      console.log("Enviando datos:", {
        matricula: studentData.matricula,
        alumno_id: alumno_id,
        photoFile: photoFile,
        photoFileType: typeof photoFile,
      });

      // Enviar datos con mensaje genérico para confirmación
      const response = await sendInfo(
        studentData.matricula,
        photoFile,
        alumno_id,
        "datos confirmados" // Mensaje genérico cuando la información es correcta
      );

      // Mostrar notificación de éxito
      notification.success({
        message: "Registro exitoso",
        description:
          "Tu información ha sido confirmada y registrada correctamente.",
        showProgress: true,
        duration: 3,
      });

      // Esperar 3 segundos antes de redirigir
      setTimeout(() => {
        navigate("/registro-exito", {
          state: {
            matricula: studentData.matricula,
            id_alumno: alumno_id,
            incidentDescription: "datos confirmados",
          },
        });
      }, 3000);

      if (handleSubmit) {
        handleSubmit({
          type: "confirm",
          data: studentData,
          apiResponse: response,
        });
      }

      console.log("Datos enviados correctamente:", response);
    } catch (error) {
      console.error("Error al enviar datos:", error);
      alert(
        "Ocurrió un error al enviar los datos. Por favor intenta nuevamente."
      );
    }
  };

  const handleReportIncident = () => {
    setShowIncidentInput(true);
  };

  const handleSubmitIncident = async () => {
    if (!incidentDescription.trim()) {
      alert("Por favor describe la incidencia");
      return;
    }

    // Validar que photoFile existe
    if (!photoFile) {
      alert("No se ha capturado ninguna fotografía válida.");
      return;
    }

    try {
      // Obtener id_alumno de studentData o usar un valor por defecto
      const alumno_id = studentData.alumno_id;

      console.log("Enviando incidencia:", {
        matricula: studentData.matricula,
        id_alumno: alumno_id,
        photoFile: photoFile,
        photoFileType: typeof photoFile,
        incidentDescription: incidentDescription,
      });

      // Enviar datos CON incidentDescription (los 4 parámetros)
      const response = await sendInfo(
        studentData.matricula,
        photoFile,
        alumno_id,
        incidentDescription // Solo se envía cuando hay incidencia
      );

      // Verificar si la respuesta fue exitosa
      if (response.status === "success") {
        // Mostrar notificación de éxito
        notification.success({
          message: "Incidencia reportada",
          description: "Tu incidencia ha sido registrada correctamente.",
          duration: 3,
        });

        // Esperar 3 segundos antes de redirigir
        setTimeout(() => {
          navigate("/registro-exito", {
            state: {
              matricula: studentData.matricula,
              id_alumno: alumno_id,
              incidentDescription: incidentDescription,
            },
          });
        }, 3000);
      }

      if (handleSubmit) {
        handleSubmit({
          type: "incident",
          data: studentData,
          description: incidentDescription,
          apiResponse: response,
        });
      }

      console.log("Incidencia reportada:", incidentDescription);
      setShowIncidentInput(false);
      setIncidentDescription("");
    } catch (error) {
      console.error("Error al reportar incidencia:", error);
      alert(
        "Ocurrió un error al reportar la incidencia. Por favor intenta nuevamente."
      );
    }
  };

  const handleCancelIncident = () => {
    setShowIncidentInput(false);
    setIncidentDescription("");
  };

  return (
    <div className="registration-form">
      {studentData ? (
        <div className="student-data-display">
          <div className="student-info">
            <p>
              <strong>Nombre:</strong> {studentData.nombre || "No disponible"}
            </p>
            <p>
              <strong>Apellido paterno:</strong>{" "}
              {studentData.apellido_p || "No disponible"}
            </p>
            <p>
              <strong>Apellido materno:</strong>{" "}
              {studentData.apellido_m || "No disponible"}
            </p>
            <p>
              <strong>Email:</strong> {studentData.correo || "No disponible"}
            </p>
            <p>
              <strong>Matrícula:</strong>{" "}
              {studentData.matricula || "No disponible"}
            </p>
            <p>
              <strong>Carrera:</strong> {studentData.carrera || "No disponible"}
            </p>
            <p>
              <strong>Plantel:</strong> {studentData.plantel || "No disponible"}
            </p>
          </div>

          {!showIncidentInput ? (
            <div className="action-buttons">
              <Button
                type="primary"
                size="large"
                onClick={handleCorrectInfo}
                style={{ marginRight: "12px" }}
                disabled={buttonsDisabled}
              >
                Mi información es correcta
              </Button>

              <Button
                type="default"
                size="large"
                danger
                onClick={handleReportIncident}
                disabled={buttonsDisabled}
              >
                Levantar incidencia
              </Button>
            </div>
          ) : (
            <div className="incident-section">
              <h4>Describe la incidencia</h4>
              <TextArea
                value={incidentDescription}
                onChange={(e) => setIncidentDescription(e.target.value)}
                placeholder="Describe qué información es incorrecta o qué problema encontraste..."
                rows={4}
                style={{ marginBottom: "16px" }}
              />

              <div className="incident-buttons">
                <Button
                  type="primary"
                  size="large"
                  onClick={handleSubmitIncident}
                  style={{ marginRight: "12px" }}
                >
                  Enviar incidencia
                </Button>

                <Button
                  type="default"
                  size="large"
                  onClick={handleCancelIncident}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="no-data-message">
          <p>No se encontraron datos del estudiante.</p>
          <p>Por favor, toma una fotografía válida para continuar.</p>
        </div>
      )}

      <div className={`validation-status`}>
        Una vez que tomes tu fotografía revisa tus datos!
      </div>
    </div>
  );
};

export default RegistrationForm;
