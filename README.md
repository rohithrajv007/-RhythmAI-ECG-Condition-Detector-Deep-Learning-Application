# ❤️ RhythmAI: ECG Condition Detector

RhythmAI is an AI-powered full-stack application that classifies ECG (Electrocardiogram) images into various heart rhythm conditions using a deep learning model. Designed with an elegant React frontend and a Flask-based backend, the app provides real-time predictions with confidence levels, educational context, and interactive visual feedback.

---

## 🚀 Features

- 🔒 Upload ECG images securely from your local device
- 🧠 Deep Learning CNN model for accurate condition classification
- 📊 Predictions include confidence scores and medical descriptions
- ⚡ Drag-and-drop image upload with preview & full-view modal
- 🎨 Beautiful animated UI with TailwindCSS
- 🧬 Conditions Detected:
  - Normal
  - Left/Right Bundle Branch Block
  - Premature Atrial Contraction
  - Premature Ventricular Contraction
  - Ventricular Fibrillation

---

## 🖼️ Screenshots



### 🧘 Output View

![ECG Upload Preview](https://github.com/rohithrajv007/-RhythmAI-ECG-Condition-Detector-Deep-Learning-Application/raw/main/Screenshot%202025-07-29%20155651.png)






### 🎯 Prediction Result

![Prediction Result](https://github.com/rohithrajv007/-RhythmAI-ECG-Condition-Detector-Deep-Learning-Application/raw/main/Screenshot%202025-07-29%20155714.png)


---

## 🏗️ System Architecture

Frontend (React + TailwindCSS)
⬇️
Backend (Flask + TensorFlow)
⬇️
Deep Learning Model (.h5)



- **Model**: CNN trained on ECG image data
- **Frontend**: React with styled components and animated UI
- **Backend**: Flask REST API for predictions
- **Deployment-ready**: Works locally or via Render/Netlify

---

## 📁 Project Structure

RhythmAI/
│
├── frontend/
│ └── ECGClassifier.jsx (main UI component)
│
├── backend/
│ ├── app.py (Flask backend)
│ └── model/
│ └── my_ECG_CNN.h5 (trained CNN model)
│
└── README.md
Start the Flask server:

python app.py
Start the development server:


npm run dev
🧠 Model Information
Input: 128x128 ECG image

Output: Predicted heart rhythm class + confidence %

Framework: TensorFlow/Keras

Architecture: CNN with dense layers

🔬 The model is designed for educational and research use only
⚠️ Disclaimer
This tool is not a medical device. It is intended for educational and research purposes only. For any medical diagnosis, please consult a licensed healthcare professional.
👨‍💻 Author
Rohith Raj V
📍 GitHub: rohithrajv007


