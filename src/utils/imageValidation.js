export const createImageFromSrc = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export const checkEyeAlignment = (landmarks) => {
  const leftEye = landmarks.getLeftEye();
  const rightEye = landmarks.getRightEye();

  // Calcular el centro de cada ojo
  const leftEyeCenter = getCenterPoint(leftEye);
  const rightEyeCenter = getCenterPoint(rightEye);

  // Comprobar si los ojos están al mismo nivel (horizontal)
  const eyeHeightDifference = Math.abs(leftEyeCenter.y - rightEyeCenter.y);
  const eyeDistance = Math.sqrt(
    Math.pow(rightEyeCenter.x - leftEyeCenter.x, 2) +
      Math.pow(rightEyeCenter.y - leftEyeCenter.y, 2)
  );

  // Si la diferencia de altura es mayor al 10% de la distancia entre ojos
  if (eyeHeightDifference > eyeDistance * 0.1) {
    return {
      valid: false,
      message:
        "La cabeza está inclinada. Mantenga la cabeza nivelada mirando directamente a la cámara.",
    };
  }

  return { valid: true };
};

export const getCenterPoint = (points) => {
  const sumX = points.reduce((sum, point) => sum + point.x, 0);
  const sumY = points.reduce((sum, point) => sum + point.y, 0);
  return {
    x: sumX / points.length,
    y: sumY / points.length,
  };
};

export const checkNeutralExpression = (expressions) => {
  // Verificar si hay alguna expresión dominante que no sea neutral
  if (expressions.happy > 0.4) {
    return {
      valid: false,
      message: "Por favor mantenga una expresión neutral sin sonreír.",
    };
  }

  if (
    expressions.angry > 0.4 ||
    expressions.disgusted > 0.4 ||
    expressions.fearful > 0.4
  ) {
    return {
      valid: false,
      message: "Por favor mantenga una expresión facial neutral.",
    };
  }

  if (expressions.surprised > 0.5) {
    return {
      valid: false,
      message: "Evite expresiones de sorpresa. Mantenga una expresión neutral.",
    };
  }

  return { valid: true };
};

export const validateBrightness = (img) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  let brightness = 0;
  const step = 20;
  for (let i = 0; i < data.length; i += step * 4) {
    brightness += 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
  }
  brightness = brightness / (data.length / (step * 4));

  if (brightness < 60) {
    return {
      valid: false,
      message:
        "La imagen está demasiado oscura. Asegúrese de tener buena iluminación frontal.",
    };
  }

  if (brightness > 200) {
    return {
      valid: false,
      message: "La imagen está sobreexpuesta. Reduzca la iluminación directa.",
    };
  }

  return { valid: true };
};

export const validateContrast = (img) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  let min = 255;
  let max = 0;

  // Sample pixels to find min and max brightness
  const step = 20;
  for (let i = 0; i < data.length; i += step * 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const brightness = 0.34 * r + 0.5 * g + 0.16 * b;

    if (brightness < min) min = brightness;
    if (brightness > max) max = brightness;
  }

  const contrast = max - min;

  if (contrast < 40) {
    return {
      valid: false,
      message:
        "La imagen tiene poco contraste. Mejore la iluminación para distinguir mejor los rasgos faciales.",
    };
  }

  if (contrast > 300) {
    return {
      valid: false,
      message:
        "La imagen tiene demasiado contraste 300 . Utilice iluminación más uniforme.",
    };
  }

  return { valid: true };
};

export const validateSharpness = (img) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;

  // Simple edge detection to estimate sharpness
  let totalEdgeStrength = 0;
  const step = 10; // Skip pixels for performance

  for (let y = step; y < height - step; y += step) {
    for (let x = step; x < width - step; x += step) {
      const idx = (y * width + x) * 4;
      const idxRight = (y * width + (x + step)) * 4;
      const idxDown = ((y + step) * width + x) * 4;

      // Calculate horizontal and vertical gradients
      const gradientX =
        Math.abs(data[idx] - data[idxRight]) +
        Math.abs(data[idx + 1] - data[idxRight + 1]) +
        Math.abs(data[idx + 2] - data[idxRight + 2]);

      const gradientY =
        Math.abs(data[idx] - data[idxDown]) +
        Math.abs(data[idx + 1] - data[idxDown + 1]) +
        Math.abs(data[idx + 2] - data[idxDown + 2]);

      totalEdgeStrength += Math.sqrt(
        gradientX * gradientX + gradientY * gradientY
      );
    }
  }

  // Normalize by number of examined pixels
  const pixelCount = (width / step - 1) * (height / step - 1);
  const averageEdgeStrength = totalEdgeStrength / pixelCount;

  if (averageEdgeStrength < 15) {
    return {
      valid: false,
      message:
        "La imagen está desenfocada. Asegúrese de que la cámara esté enfocada y manténgase quieto.",
    };
  }

  return { valid: true };
};

export const validateFacialShadows = (img, landmarks) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Get left and right cheek points to analyze
  const leftCheek = {
    x: Math.round(landmarks.positions[1].x),
    y: Math.round(landmarks.positions[1].y),
  };
  const rightCheek = {
    x: Math.round(landmarks.positions[17].x),
    y: Math.round(landmarks.positions[17].y),
  };

  // Calculate brightness for a small area around each cheek
  const radius = 5;
  let leftBrightness = 0;
  let rightBrightness = 0;
  let leftCount = 0;
  let rightCount = 0;

  // Sample pixels in left cheek region
  for (let y = leftCheek.y - radius; y <= leftCheek.y + radius; y++) {
    for (let x = leftCheek.x - radius; x <= leftCheek.x + radius; x++) {
      if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
        const idx = (y * canvas.width + x) * 4;
        leftBrightness +=
          0.34 * data[idx] + 0.5 * data[idx + 1] + 0.16 * data[idx + 2];
        leftCount++;
      }
    }
  }

  // Sample pixels in right cheek region
  for (let y = rightCheek.y - radius; y <= rightCheek.y + radius; y++) {
    for (let x = rightCheek.x - radius; x <= rightCheek.x + radius; x++) {
      if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
        const idx = (y * canvas.width + x) * 4;
        rightBrightness +=
          0.34 * data[idx] + 0.5 * data[idx + 1] + 0.16 * data[idx + 2];
        rightCount++;
      }
    }
  }

  // Calculate average brightness for each region
  leftBrightness = leftBrightness / leftCount;
  rightBrightness = rightBrightness / rightCount;

  // Calculate difference in brightness between left and right sides
  const brightnessDifference = Math.abs(leftBrightness - rightBrightness);

  if (brightnessDifference > 50) {
    const darkerSide =
      leftBrightness < rightBrightness ? "izquierdo" : "derecho";
    return {
      valid: false,
      message: `Se detectan sombras en el lado ${darkerSide} del rostro. Utilice iluminación frontal uniforme.`,
    };
  }

  return { valid: true };
};

const validateBackground = (img, faceBox) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Sample background pixels (avoiding face region)
  const samples = [];
  const step = 20; // Aumentado para reducir la sensibilidad a pequeñas variaciones

  // Definir un área más grande alrededor de la cara para excluir
  const margin = 20; // Margen aumentado

  // Variables para análisis de color
  let totalPixels = 0;
  let whitishPixels = 0;
  let darkPixels = 0;

  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      // Skip pixels inside the face box (with a margin)
      if (
        x >= faceBox.x - margin &&
        x <= faceBox.x + faceBox.width + margin &&
        y >= faceBox.y - margin &&
        y <= faceBox.y + faceBox.height + margin
      ) {
        continue;
      }

      const idx = (y * canvas.width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      samples.push({ r, g, b });

      // Analizar si el pixel es claro o oscuro
      const pixelBrightness = 0.34 * r + 0.5 * g + 0.16 * b;
      totalPixels++;

      if (pixelBrightness > 200) {
        whitishPixels++;
      } else if (pixelBrightness < 60) {
        darkPixels++;
      }
    }
  }

  // Si no hay suficientes muestras para análisis
  if (samples.length < 10) {
    return {
      valid: true, // Asumimos válido si no hay suficientes muestras
      message:
        "No se pudo analizar el fondo adecuadamente debido al tamaño de la imagen.",
    };
  }

  // Calculate average background color and standard deviation
  const avg = {
    r: samples.reduce((sum, pixel) => sum + pixel.r, 0) / samples.length,
    g: samples.reduce((sum, pixel) => sum + pixel.g, 0) / samples.length,
    b: samples.reduce((sum, pixel) => sum + pixel.b, 0) / samples.length,
  };

  const variance = {
    r:
      samples.reduce((sum, pixel) => sum + Math.pow(pixel.r - avg.r, 2), 0) /
      samples.length,
    g:
      samples.reduce((sum, pixel) => sum + Math.pow(pixel.g - avg.g, 2), 0) /
      samples.length,
    b:
      samples.reduce((sum, pixel) => sum + Math.pow(pixel.b - avg.b, 2), 0) /
      samples.length,
  };

  const stdDev = {
    r: Math.sqrt(variance.r),
    g: Math.sqrt(variance.g),
    b: Math.sqrt(variance.b),
  };

  // Calculate overall standard deviation of background - usando un enfoque más tolerante
  const overallStdDev = (stdDev.r + stdDev.g + stdDev.b) / 3;

  // Check if background is too dark
  const backgroundBrightness = 0.34 * avg.r + 0.5 * avg.g + 0.16 * avg.b;

  // Calcular porcentaje de píxeles blancos y oscuros
  const whitePercentage = (whitishPixels / totalPixels) * 100;
  const darkPercentage = (darkPixels / totalPixels) * 100;

  // Sistema de puntuación para la validación
  let issues = [];
  let score = 100;

  // Evaluar la uniformidad con un umbral más alto
  if (overallStdDev > 150) {
    score -= 40;
    issues.push("El fondo parece no ser uniforme.");
  } else if (overallStdDev > 120) {
    score -= 20;
    issues.push("El fondo muestra algunas variaciones.");
  }

  // Evaluar el brillo con criterios más flexibles
  if (backgroundBrightness < 70) {
    score -= 30;
    issues.push("El fondo es demasiado oscuro.");
  } else if (backgroundBrightness < 80) {
    score -= 15;
    issues.push("El fondo es un poco oscuro.");
  }

  // Evaluar si hay demasiados píxeles oscuros o colores mezclados
  if (darkPercentage > 40) {
    score -= 20;
    issues.push("Hay demasiadas áreas oscuras en el fondo.");
  }

  // Evaluación final basada en el puntaje
  if (score >= 70) {
    return { valid: true };
  } else {
    let message = "La foto necesita mejoras: ";
    message += issues.join(" ");
    message += " Recomendamos usar un fondo liso y claro para mejor resultado.";

    return {
      valid: false,
      message: message,
      score: score, // Opcional: devolver el puntaje para depuración
    };
  }
};
export const detectAccessories = (img, landmarks) => {
  // This is a simplified approach - a real implementation would use more sophisticated methods

  // Check for potential eyeglasses by analyzing eye region brightness
  const leftEye = landmarks.getLeftEye();
  const rightEye = landmarks.getRightEye();
  const eyeBrowLeft = landmarks.getLeftEyeBrow();
  const eyeBrowRight = landmarks.getRightEyeBrow();

  // Calculate area between eyebrows and eyes to check for glasses frames
  const topY = Math.min(
    ...eyeBrowLeft.map((p) => p.y),
    ...eyeBrowRight.map((p) => p.y)
  );

  const bottomY = Math.max(
    ...leftEye.map((p) => p.y),
    ...rightEye.map((p) => p.y)
  );

  const leftX = Math.min(
    ...leftEye.map((p) => p.x),
    ...eyeBrowLeft.map((p) => p.x)
  );

  const rightX = Math.max(
    ...rightEye.map((p) => p.x),
    ...eyeBrowRight.map((p) => p.x)
  );

  // Create a canvas and get eye region data
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  // Detect potential glasses by looking for horizontal edges in eye region
  const margin = 10;
  const eyeRegion = ctx.getImageData(
    Math.max(0, leftX - margin),
    Math.max(0, topY - margin),
    Math.min(canvas.width - 1, rightX + margin) - Math.max(0, leftX - margin),
    Math.min(canvas.height - 1, bottomY + margin) - Math.max(0, topY - margin)
  );

  const data = eyeRegion.data;
  const width = eyeRegion.width;

  // Simple edge detection in eye region
  let horizontalEdges = 0;

  for (let y = 1; y < eyeRegion.height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      const idxUp = ((y - 1) * width + x) * 4;
      const idxDown = ((y + 1) * width + x) * 4;

      // Calculate vertical gradient
      const gradientY =
        Math.abs(data[idxUp] - data[idxDown]) +
        Math.abs(data[idxUp + 1] - data[idxDown + 1]) +
        Math.abs(data[idxUp + 2] - data[idxDown + 2]);

      if (gradientY > 100) {
        horizontalEdges++;
      }
    }
  }

  // Normalize by area
  const normalizedEdges =
    horizontalEdges / (eyeRegion.width * eyeRegion.height);

  if (normalizedEdges > 0.08) {
    return {
      valid: false,
      message:
        "Se detectaron posibles lentes o gafas. Para fotos oficiales, retire las gafas a menos que sean necesarias por razones médicas.",
    };
  }

  // Check for potential head covering by analyzing top of head
  // This is just a simple example - real implementation would be more sophisticated
  const jaw = landmarks.getJawOutline();
  const topOfHead = jaw[0].y - (jaw[16].y - jaw[8].y);

  // Sample pixels above the estimated top of head
  const samples = [];
  const step = 5;
  const sampleHeight = 20;

  for (
    let y = Math.max(0, topOfHead - sampleHeight);
    y < Math.max(0, topOfHead);
    y += step
  ) {
    for (let x = jaw[0].x; x <= jaw[16].x; x += step) {
      if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
        const idx = (y * canvas.width + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        samples.push({ r, g, b });
      }
    }
  }

  // This is a simplified approach and might not be reliable
  // A real implementation would need more sophisticated methods

  return { valid: true };
};

export const generateDebugOverlay = async (img, detection) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;

  // Draw original image
  ctx.drawImage(img, 0, 0);

  // Draw face detection box
  const box = detection.detection.box;
  ctx.strokeStyle = "lime";
  ctx.lineWidth = 3;
  ctx.strokeRect(box.x, box.y, box.width, box.height);

  // Draw face landmarks
  const landmarks = detection.landmarks;
  ctx.fillStyle = "blue";

  // Draw all landmark points
  landmarks.positions.forEach((point) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  });

  // Label key regions
  ctx.font = "14px Arial";
  ctx.fillStyle = "red";

  // Label eyes
  const leftEye = getCenterPoint(landmarks.getLeftEye());
  const rightEye = getCenterPoint(landmarks.getRightEye());
  ctx.fillText("Left Eye", leftEye.x, leftEye.y - 10);
  ctx.fillText("Right Eye", rightEye.x, rightEye.y - 10);

  // Label nose
  const nose = landmarks.getNose();
  const noseTip = nose[nose.length - 1];
  ctx.fillText("Nose", noseTip.x + 5, noseTip.y);

  // Label mouth
  const mouth = landmarks.getMouth();
  const mouthCenter = getCenterPoint(mouth);
  ctx.fillText("Mouth", mouthCenter.x, mouthCenter.y + 20);

  // Draw a crosshair at the center of the image
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  ctx.strokeStyle = "yellow";
  ctx.beginPath();
  ctx.moveTo(centerX - 20, centerY);
  ctx.lineTo(centerX + 20, centerY);
  ctx.moveTo(centerX, centerY - 20);
  ctx.lineTo(centerX, centerY + 20);
  ctx.stroke();

  // Draw lines to check eye alignment
  ctx.strokeStyle = "cyan";
  ctx.beginPath();
  ctx.moveTo(leftEye.x, leftEye.y);
  ctx.lineTo(rightEye.x, rightEye.y);
  ctx.stroke();

  return canvas.toDataURL("image/jpeg");
};

export const flipImageHorizontally = async (src) => {
  const img = await createImageFromSrc(src);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL("image/jpeg");
};





