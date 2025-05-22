import React, { useState } from "react";
import "@/assets/css/registration.css";

const RegistrationForm = ({
  photoValid,
  photoSrc,
  formData,
  handleInputChange,
  handleSubmit,
}) => {
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre es obligatorio";
      isValid = false;
    }

    if (!formData.apellidos.trim()) {
      errors.apellidos = "Los apellidos son obligatorios";
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = "El email es obligatorio";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "El formato de email es inválido";
      isValid = false;
    }

    

    

    setFormErrors(errors);
    return isValid;
  };

  const handleLocalSubmit = (e) => {
    e.preventDefault();

    if (!photoValid) {
      alert("Necesitas una foto válida para registrarte");
      return;
    }

    if (validateForm()) {
      handleSubmit(e); // delega el envío real al padre (App)
    }
  };

  return (
    <div className="registration-form">
      <h2>Datos de registro</h2>
      <form onSubmit={handleLocalSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            disabled={!photoValid}
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            className={formErrors.nombre ? "error" : ""}
          />
          {formErrors.nombre && (
            <span className="error-message">{formErrors.nombre}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="apellidos">Apellidos</label>
          <input
            disabled={!photoValid}
            type="text"
            id="apellidos"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleInputChange}
            className={formErrors.apellidos ? "error" : ""}
          />
          {formErrors.apellidos && (
            <span className="error-message">{formErrors.apellidos}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            disabled={!photoValid}
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={formErrors.email ? "error" : ""}
          />
          {formErrors.email && (
            <span className="error-message">{formErrors.email}</span>
          )}
        </div>

        <button type="submit" className="submit-btn" disabled={!photoValid}>
          Enviar
        </button>
      </form>

      <div className={`validation-status`}>
        Una vez que tomes tu fotografia revisa tus datos!
      </div>
    </div>
  );
};

export default RegistrationForm;
