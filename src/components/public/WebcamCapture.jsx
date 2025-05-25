import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import placeholder from "@/assets/img/Camera_placeholder.png";
import reload from "@/assets/img/reload.svg";
import * as faceapi from "face-api.js";
import {
  checkEyeAlignment,
  validateBrightness,
  validateContrast,
  validateSharpness,
  validateFacialShadows,
  detectAccessories,
  checkNeutralExpression,
  flipImageHorizontally,
  createImageFromSrc,
} from "@/utils/imageValidation";

const WebcamCapture = ({ onPhotoValidated }) => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [validationMessage, setValidationMessage] = useState("");
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [showCamera, setShowCamera] = useState(true);
  const [validationStatus, setValidationStatus] = useState("");
  const [validationState, setValidationState] = useState(""); // "", "process", "success", "error"

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = `${import.meta.env.BASE_URL}/models`;

      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        setModelsLoaded(true);
      } catch (error) {
        console.error("Error detallado:", {
          error,
          message: "Verifica: 1. Ruta de modelos 2. Integridad de archivos",
          expectedPath: `${window.location.origin}${
            import.meta.env.BASE_URL
          }models`,
        });
        setValidationMessage("Error al cargar modelos de detección facial.");
      }
    };
    loadModels();
  }, []);

  const capture = async () => {
    if (!modelsLoaded || isProcessing) return;

    setIsProcessing(true);
    setValidationStatus(
      "Esto tomará solo unos segundos, estamos validando tu imagen..."
    );
    setValidationState("process");
    setValidationMessage("");

    const originalImageSrc = webcamRef.current.getScreenshot();
    const flippedImageSrc = await flipImageHorizontally(originalImageSrc);

    // Procesar la imagen para cumplir con los requisitos
    const processedImage = await processImageToRequirements(flippedImageSrc);

    setImgSrc(processedImage);
    setShowCamera(false);

    try {
      const validationResult = await performValidations(flippedImageSrc);
      setValidationMessage(validationResult.message);
      setValidationState(validationResult.valid ? "success" : "error");

      if (validationResult.valid) {
        setValidationStatus(
          "¡Genial! Tu imagen cumple con los requisitos, puedes tomar otra o enviarla."
        );
      } else {
        setValidationStatus(validationResult.message);
      }

      // Convertir la imagen procesada a File para envío al backend
      const photoFile = await dataURLToFile(processedImage, 'webcam-photo.jpg');

      // Llamar al callback con los tres parámetros: válido, imagen para mostrar, archivo para envío
      onPhotoValidated &&
        onPhotoValidated(validationResult.valid, processedImage, photoFile);
    } catch (error) {
      console.error("Error durante la validación:", error);
      setValidationMessage("Ocurrió un error al procesar la imagen.");
      setValidationStatus("Ocurrió un error al procesar la imagen.");
      setValidationState("error");
      onPhotoValidated && onPhotoValidated(false, null, null);
    } finally {
      setIsProcessing(false);
    }
  };

  // Función para convertir dataURL a File
  const dataURLToFile = (dataURL, filename) => {
    return new Promise((resolve) => {
      // Separar el header del data
      const [header, data] = dataURL.split(',');
      const mime = header.match(/:(.*?);/)[1];
      
      // Convertir base64 a bytes
      const byteString = atob(data);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      
      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }
      
      // Crear el File
      const file = new File([arrayBuffer], filename, { 
        type: mime,
        lastModified: Date.now()
      });
      
      resolve(file);
    });
  };

  const processImageToRequirements = async (imageSrc) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Crear un canvas para redimensionar y ajustar la imagen
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Ajustar a 184x230 (relación 4:5)
        canvas.width = 184;
        canvas.height = 230;

        // Dibujar la imagen redimensionada
        ctx.drawImage(img, 0, 0, 184, 230);

        // Convertir a JPG con la calidad deseada
        const processedImage = canvas.toDataURL("image/jpeg", 0.99);

        resolve(processedImage);
      };
      img.src = imageSrc;
    });
  };

  const resetCamera = () => {
    setImgSrc(null);
    setShowCamera(true);
    setValidationMessage("");
    setValidationStatus("");
    setValidationState("");
    // Resetear también el callback para limpiar los datos
    onPhotoValidated && onPhotoValidated(false, null, null);
  };

  const performValidations = async (imageSrc) => {
    if (!modelsLoaded) {
      return {
        valid: false,
        message: "Los modelos aún no se han cargado correctamente.",
      };
    }

    const img = await createImageFromSrc(imageSrc);
    const detections = await faceapi
      .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    if (!detections || detections.length === 0) {
      return {
        valid: false,
        message: "No se detectó ningún rostro en la imagen.",
      };
    }

    if (detections.length > 1) {
      return {
        valid: false,
        message:
          "Se detectaron múltiples rostros. Por favor asegúrese de estar solo/a en la imagen.",
      };
    }

    const detection = detections[0];
    const { width, height } = img;
    const box = detection.detection.box;
    const landmarks = detection.landmarks;
    const expressions = detection.expressions;

    // Generar overlay de depuración si está activado
    let overlay = null;

    // Validar tamaño del rostro
    const faceArea = box.width * box.height;
    const imageArea = width * height;
    const faceRatio = faceArea / imageArea;

    if (faceRatio < 0.15) {
      return {
        valid: false,
        message:
          "El rostro es demasiado pequeño. Acerque su rostro a la cámara.",
        overlay,
      };
    }

    if (faceRatio > 0.65) {
      return {
        valid: false,
        message:
          "El rostro está demasiado cerca. Aléjese ligeramente de la cámara.",
        overlay,
      };
    }

    // Validar centrado del rostro
    const centerX = width / 2;
    const centerY = height / 2;
    const faceCenterX = box.x + box.width / 2;
    const faceCenterY = box.y + box.height / 2;
    const offsetX = Math.abs(centerX - faceCenterX) / width;
    const offsetY = Math.abs(centerY - faceCenterY) / height;

    if (offsetX > 0.15 || offsetY > 0.15) {
      const horizontalDirection =
        faceCenterX < centerX ? "derecha" : "izquierda";
      const verticalDirection = faceCenterY < centerY ? "abajo" : "arriba";

      return {
        valid: false,
        message: `El rostro no está centrado. Muévase hacia la ${horizontalDirection}${
          offsetY > 0.15 ? ` y hacia ${verticalDirection}` : ""
        }.`,
        overlay,
      };
    }

    // Validar alineación de la cabeza
    const eyeAlignmentResult = checkEyeAlignment(landmarks);
    if (!eyeAlignmentResult.valid) {
      return {
        ...eyeAlignmentResult,
        overlay,
      };
    }

    // Validar expresión facial
    const expressionResult = checkNeutralExpression(expressions);
    if (!expressionResult.valid) {
      return {
        ...expressionResult,
        overlay,
      };
    }

    // Validar brillo y contraste
    const brightnessResult = validateBrightness(img);
    if (!brightnessResult.valid) {
      return {
        ...brightnessResult,
        overlay,
      };
    }

    // Validar contraste
    const contrastResult = validateContrast(img);
    if (!contrastResult.valid) {
      return {
        ...contrastResult,
        overlay,
      };
    }

    // Validar nitidez
    const sharpnessResult = validateSharpness(img);
    if (!sharpnessResult.valid) {
      return {
        ...sharpnessResult,
        overlay,
      };
    }

    // Validar sombras faciales
    const shadowResult = validateFacialShadows(img, landmarks);
    if (!shadowResult.valid) {
      return {
        ...shadowResult,
        overlay,
      };
    }

    // Validar presencia de accesorios (aproximación)
    const accessoriesResult = detectAccessories(img, landmarks);
    if (!accessoriesResult.valid) {
      return {
        ...accessoriesResult,
        overlay,
      };
    }

    return {
      valid: true,
      message:
        "Validación exitosa. La fotografía cumple con los requisitos para un documento oficial.",
      overlay,
    };
  };
  
  return (
    <div className="camera-container">
      {modelsLoaded ? (
        <>
          {showCamera && (
            <label className="switch_camera">
              <input
                type="checkbox"
                checked={cameraEnabled}
                onChange={() => setCameraEnabled(!cameraEnabled)}
              />
              <span className="slider"></span>

              {cameraEnabled ? (
                <span>Apagar camara</span>
              ) : (
                <span> Encender camara</span>
              )}
            </label>
          )}

          <div className="camera-wrapper">
            {showCamera ? (
              cameraEnabled ? (
                <Webcam
                  style={{ transform: "scaleX(-1)" }} // Esto voltea horizontalmente
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width={340}
                  height={340}
                  videoConstraints={{
                    width: 360,
                    height: 360,
                    facingMode: "user",
                  }}
                />
              ) : (
                <div className="camera-placeholder">
                  <img src={placeholder} alt="" />
                </div>
              )
            ) : (
              <div className="camera-placeholder">
                <img
                  src={imgSrc}
                  alt="Foto capturada"
                  className="captured-image"
                  width={340}
                  height={340}
                />
              </div>
            )}

            {showCamera && cameraEnabled ? (
              <button
                onClick={capture}
                disabled={isProcessing || !modelsLoaded}
                className="capture_btn"
              >
                {isProcessing ? "..." : ""}
              </button>
            ) : (
              !showCamera && (
                <button onClick={resetCamera} className="retry_btn">
                  <img src={reload} />
                  Intentar de nuevo
                </button>
              )
            )}

            {showCamera && showGrid && cameraEnabled && (
              <div className="grid-overlay">
                <div className="vertical-line" style={{ left: "33.33%" }} />
                <div className="vertical-line" style={{ left: "66.66%" }} />
                <div className="horizontal-line" style={{ top: "33.33%" }} />
                <div className="horizontal-line" style={{ top: "66.66%" }} />
              </div>
            )}
          </div>

          <div className="actions">
            {showCamera && cameraEnabled && (
              <label>
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={() => setShowGrid(!showGrid)}
                />{" "}
                Mostrar cuadrícula
              </label>
            )}
          </div>

          {/* Estado de validación */}
          <div className={`validation-status ${validationState}`}>
            {validationStatus}
          </div>
        </>
      ) : (
        <p>Cargando modelos de validación facial...</p>
      )}
    </div>
  );
};

export default WebcamCapture;