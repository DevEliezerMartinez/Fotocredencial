# 📸 Fotocredencial-app (Photo Credential App for UNE University)

A modern web app for capturing and validating student photos at UNE (Universidad UNE), with real-time face detection and a smooth user experience.

## 🚀 Tech Stack
- **Frontend Framework:** React 19 + Vite
- **Key Dependencies:**
  - face-api.js (face detection)
  - react-webcam (camera)
  - react-router-dom (routing)
  - axios (HTTP requests)
- **Development Tools:**
  - ESLint + React plugins
  - TypeScript support

## 🎯 Main Features
- Capture student photos using webcam
- Face detection & validation (via face-api.js)
- Student info registration form
- Image validation & feedback

## 📂 Project Structure
- src/components/ → Reusable UI (WebcamCapture, RegistrationForm, Header)
- src/pages/ → Main pages (Welcome, Core, Success)
- src/assets/ → Fonts (Gotham), CSS, images
- src/utils/ → Utility functions (e.g., image validation)

## 🛠️ Getting Started

1. **Clone the repository**
```bash
git clone https://github.com/your-username/fotocredencial-app.git
cd fotocredencial-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm run dev
```

4. **Open the app**
Visit `http://localhost:5173` in your browser.

## ✅ Ready to go! / ¡Listo para usar!