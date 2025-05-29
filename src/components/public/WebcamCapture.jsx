import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { Button } from "antd";
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
  
  // Nuevos estados para manejo de cámara
  const [cameraPermission, setCameraPermission] = useState(null); // null, "granted", "denied", "prompt"
  const [cameraError, setCameraError] = useState(null);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [hasUserMedia, setHasUserMedia] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = `${import.meta.env.BASE_URL}/models`;

      try {
        console.log("🔄 Iniciando carga de modelos de face-api.js...");
        console.log("📂 Ruta de modelos:", MODEL_URL);

        console.log("⏳ Cargando TinyFaceDetector...");
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        console.log("✅ TinyFaceDetector cargado exitosamente");

        console.log("⏳ Cargando FaceLandmark68Net...");
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        console.log("✅ FaceLandmark68Net cargado exitosamente");

        console.log("⏳ Cargando FaceExpressionNet...");
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        console.log("✅ FaceExpressionNet cargado exitosamente");

        setModelsLoaded(true);
        console.log("🎉 Todos los modelos de face-api.js se cargaron correctamente");
      } catch (error) {
        console.error("❌ Error cargando modelos de face-api.js:", error);
        console.error("🔍 Detalles del error:", {
          error,
          message: "Verifica: 1. Ruta de modelos 2. Integridad de archivos",
          expectedPath: `${window.location.origin}${
            import.meta.env.BASE_URL
          }models`,
        });
        console.error("📋 Archivos esperados en la carpeta models:");
        console.error("- tiny_face_detector_model-weights_manifest.json");
        console.error("- tiny_face_detector_model-shard1");
        console.error("- face_landmark_68_model-weights_manifest.json");
        console.error("- face_landmark_68_model-shard1");
        console.error("- face_expression_model-weights_manifest.json");
        console.error("- face_expression_model-shard1");
        setValidationMessage("Error al cargar modelos de detección facial.");
      }
    };
    loadModels();
  }, []);

  // Verificar permisos de cámara al montar el componente
  useEffect(() => {
    checkCameraPermissions();
    checkUserMediaSupport();
  }, []);

  const checkUserMediaSupport = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasUserMedia(false);
      setCameraError("Tu navegador no soporta acceso a la cámara.");
    } else {
      setHasUserMedia(true);
    }
  };

  const checkCameraPermissions = async () => {
    if (!navigator.permissions) {
      // Si no hay API de permisos, intentamos acceder directamente
      setCameraPermission("unknown");
      return;
    }

    try {
      const permission = await navigator.permissions.query({ name: 'camera' });
      setCameraPermission(permission.state);
      
      // Escuchar cambios en permisos
      permission.addEventListener('change', () => {
        setCameraPermission(permission.state);
      });
    } catch (error) {
      console.warn("No se pudieron verificar los permisos de cámara:", error);
      setCameraPermission("unknown");
    }
  };

  const requestCameraPermission = async (forceRequest = false) => {
    if (!hasUserMedia) {
      setCameraError("Tu navegador no soporta acceso a la cámara.");
      return false;
    }

    setIsRequestingPermission(true);
    setCameraError(null);

    try {
      console.log("🎥 Solicitando permisos de cámara...", forceRequest ? "(forzado)" : "");
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 360,
          height: 360,
          facingMode: "user"
        }
      });

      console.log("✅ Permisos de cámara otorgados");
      
      // Detener el stream inmediatamente, solo queríamos verificar permisos
      stream.getTracks().forEach(track => track.stop());
      
      setCameraPermission("granted");
      setCameraEnabled(true);
      setIsRequestingPermission(false);
      return true;
    } catch (error) {
      setIsRequestingPermission(false);
      console.error("❌ Error al solicitar permisos de cámara:", error);
      
      if (error.name === 'NotAllowedError') {
        setCameraPermission("denied");
        if (forceRequest) {
          setCameraError("Los permisos siguen bloqueados. Por favor, haz clic en el ícono de la cámara en la barra de direcciones de tu navegador y permite el acceso, luego recarga la página.");
        } else {
          setCameraError("Permisos de cámara denegados. Por favor, permite el acceso a la cámara en la configuración de tu navegador.");
        }
      } else if (error.name === 'NotFoundError') {
        setCameraError("No se encontró ninguna cámara disponible.");
      } else if (error.name === 'NotReadableError') {
        setCameraError("La cámara está siendo utilizada por otra aplicación.");
      } else if (error.name === 'OverconstrainedError') {
        setCameraError("La configuración de cámara solicitada no es compatible.");
      } else {
        setCameraError(`Error al acceder a la cámara: ${error.message}`);
      }
      return false;
    }
  };

  const handleCameraToggle = async () => {
    if (!cameraEnabled) {
      if (cameraPermission === "denied") {
        // Intentar solicitar permisos nuevamente
        console.log("🔄 Intentando volver a solicitar permisos de cámara...");
        const granted = await requestCameraPermission(true);
        if (!granted) return;
      } else if (cameraPermission !== "granted") {
        const granted = await requestCameraPermission();
        if (!granted) return;
      } else {
        setCameraEnabled(true);
      }
    } else {
      setCameraEnabled(false);
    }
  };

  const handleWebcamError = (error) => {
    console.error("Error de Webcam:", error);
    setCameraEnabled(false);
    
    if (error.name === 'NotAllowedError') {
      setCameraPermission("denied");
      setCameraError("Permisos de cámara denegados. Por favor, permite el acceso a la cámara.");
    } else if (error.name === 'NotFoundError') {
      setCameraError("No se encontró ninguna cámara disponible.");
    } else if (error.name === 'NotReadableError') {
      setCameraError("La cámara está siendo utilizada por otra aplicación.");
    } else {
      setCameraError(`Error de cámara: ${error.message || "Error desconocido"}`);
    }
  };

  const capture = async () => {
    if (!modelsLoaded || isProcessing) return;

    setIsProcessing(true);
    setValidationStatus(
      "Esto tomará solo unos segundos, estamos validando tu imagen..."
    );
    setValidationState("process");
    setValidationMessage("");

    try {
      const originalImageSrc = webcamRef.current.getScreenshot();
      
      if (!originalImageSrc) {
        throw new Error("No se pudo capturar la imagen de la cámara");
      }

      const flippedImageSrc = await flipImageHorizontally(originalImageSrc);

      // Procesar la imagen para cumplir con los requisitos
      const processedImage = await processImageToRequirements(flippedImageSrc);

      setImgSrc(processedImage);
      setShowCamera(false);

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
      console.error("Error durante la captura/validación:", error);
      const errorMessage = "Ocurrió un error al procesar la imagen. Inténtalo de nuevo.";
      setValidationMessage(errorMessage);
      setValidationStatus(errorMessage);
      setValidationState("error");
      onPhotoValidated && onPhotoValidated(false, null, null);
    } finally {
      setIsProcessing(false);
    }
  };

  // Función para convertir dataURL a File
  const dataURLToFile = (dataURL, filename) => {
    return new Promise((resolve, reject) => {
      try {
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
      } catch (error) {
        reject(error);
      }
    });
  };

  const processImageToRequirements = async (imageSrc) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
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
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => reject(new Error("No se pudo cargar la imagen"));
      img.src = imageSrc;
    });
  };

  const resetCamera = () => {
    setImgSrc(null);
    setShowCamera(true);
    setValidationMessage("");
    setValidationStatus("");
    setValidationState("");
    setCameraError(null);
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

    try {
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
    } catch (error) {
      console.error("Error en validaciones:", error);
      return {
        valid: false,
        message: "Error al procesar la validación facial. Inténtalo de nuevo.",
      };
    }
  };

  const renderCameraButton = () => {
    if (!hasUserMedia) {
      return (
        <div className="camera-error">
          <p>Tu navegador no soporta acceso a la cámara.</p>
        </div>
      );
    }

    if (cameraPermission === "denied" && !isRequestingPermission) {
      return (
        <div className="camera-permission-denied">
          <p>Permisos de cámara denegados.</p>
          <p>Puedes intentar de nuevo o recargar la página si los permisos siguen bloqueados.</p>
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Button 
              type="primary" 
              onClick={() => requestCameraPermission(true)}
              loading={isRequestingPermission}
            >
              Intentar de nuevo
            </Button>
            <Button 
              type="dashed" 
              onClick={() => window.location.reload()}
            >
              Recargar página
            </Button>
          </div>
        </div>
      );
    }

    return (
      <label className="switch_camera">
        <input
          type="checkbox"
          checked={cameraEnabled}
          onChange={handleCameraToggle}
          disabled={isRequestingPermission}
        />
        <span className="slider"></span>
        {isRequestingPermission ? (
          <span>Solicitando permisos...</span>
        ) : cameraEnabled ? (
          <span>Apagar cámara</span>
        ) : (
          <span>Encender cámara</span>
        )}
      </label>
    );
  };
  
  return (
    <div className="camera-container">
      {modelsLoaded ? (
        <>
          {showCamera && renderCameraButton()}

          {/* Mostrar errores de cámara */}
          {cameraError && (
            <div className="camera-error">
              <p>{cameraError}</p>
            </div>
          )}

          <div className="camera-wrapper">
            {showCamera ? (
              cameraEnabled ? (
                <Webcam
                  style={{ transform: "scaleX(-1)" }}
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
                  onUserMediaError={handleWebcamError}
                />
              ) : (
                <div className="camera-placeholder">
                  <img src={placeholder} alt="Placeholder de cámara" />
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

            {showCamera && cameraEnabled && !cameraError ? (
              <button
                onClick={capture}
                disabled={isProcessing || !modelsLoaded}
                className="capture_btn"
              >
                {isProcessing ? "Procesando..." : "Capturar"}
              </button>
            ) : (
              !showCamera && (
                <button onClick={resetCamera} className="retry_btn">
                  <img src={reload} alt="Reintentar" />
                  Intentar de nuevo
                </button>
              )
            )}

            {showCamera && showGrid && cameraEnabled && !cameraError && (
              <div className="grid-overlay">
                <div className="vertical-line" style={{ left: "33.33%" }} />
                <div className="vertical-line" style={{ left: "66.66%" }} />
                <div className="horizontal-line" style={{ top: "33.33%" }} />
                <div className="horizontal-line" style={{ top: "66.66%" }} />
              </div>
            )}
          </div>

          <div className="actions">
            {showCamera && cameraEnabled && !cameraError && (
              <label>
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={() => setShowGrid(!showGrid)}
                />
                {" "}
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