import Header_app from "../components/Header";
import { useState } from "react";
import "@/assets/css/core.css";
import WebcamCapture from "../components/WebcamCapture";
import RegistrationForm from "../components/RegistrationForm";

function App() {
  const [photoValid, setPhotoValid] = useState(false);
  const [photoSrc, setPhotoSrc] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
  });

  const handlePhotoValidated = (isValid, src) => {
    setPhotoValid(isValid);
    setPhotoSrc(src);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!photoValid) {
      alert("Por favor, asegúrate de que la foto sea válida.");
      return;
    }
  
    // Simular envío (espera de 1 segundo)
    try {
      console.log("Simulando envío...");
      console.log("Datos enviados:", formData);
      
      // Simular espera como si enviara
      await new Promise((resolve) => setTimeout(resolve, 1000));
  
      alert("Registro simulado exitoso!");
      // Redirigir a /success
      window.location.href = "/success";
    } catch (error) {
      console.error("Error en la simulación:", error);
      alert("Error en la simulación del registro.");
    }
  };
  

  return (
    <>
      <Header_app />

      <div className="principal_content">
        <div className="card_info">
          <p>Considera que para una buena fotografia:</p>
          <ul>
            <li>El rostro debe estar centrado y completamente visible.</li>
            <li>Debe existir una iluminación adecuada.</li>
            <li>No deben usarse accesorios como gorras o lentes oscuros.</li>
          </ul>
        </div>
        <WebcamCapture onPhotoValidated={handlePhotoValidated} />

        <RegistrationForm
          photoValid={photoValid}
          photoSrc={photoSrc}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </>
  );
}

export default App;
