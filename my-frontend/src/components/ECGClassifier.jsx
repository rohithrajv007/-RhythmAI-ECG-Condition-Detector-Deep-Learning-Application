import { useState, useRef, useEffect } from 'react';

const ECGClassifier = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [animateResults, setAnimateResults] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const fileInputRef = useRef(null);

  const API_BASE_URL = 'http://localhost:5000';

  // Pulse animation for heart icon
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseAnimation(false);
      setTimeout(() => setPulseAnimation(true), 100);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const conditionDescriptions = {
    'Normal': 'Normal heart rhythm with regular electrical activity.',
    'Left Bundle Branch Block': 'Electrical conduction delay in the left bundle branch of the heart.',
    'Right Bundle Branch Block': 'Electrical conduction delay in the right bundle branch of the heart.',
    'Premature Atrial Contraction': 'Early heartbeats originating from the atria.',
    'Premature Ventricular Contractions': 'Early heartbeats originating from the ventricles.',
    'Ventricular Fibrillation': 'Life-threatening irregular heart rhythm requiring immediate medical attention.'
  };

  const getSeverityColor = (condition) => {
    const severity = {
      'Normal': 'text-green-600 bg-gradient-to-br from-green-50 to-green-100 border-green-300 shadow-green-100',
      'Left Bundle Branch Block': 'text-yellow-700 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300 shadow-yellow-100',
      'Right Bundle Branch Block': 'text-yellow-700 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300 shadow-yellow-100',
      'Premature Atrial Contraction': 'text-orange-700 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300 shadow-orange-100',
      'Premature Ventricular Contractions': 'text-red-700 bg-gradient-to-br from-red-50 to-red-100 border-red-300 shadow-red-100',
      'Ventricular Fibrillation': 'text-red-800 bg-gradient-to-br from-red-100 to-red-150 border-red-400 shadow-red-200'
    };
    return severity[condition] || 'text-gray-600 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const processFile = (file) => {
    // Reset previous states
    setPrediction(null);
    setError('');

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a PNG, JPG, or JPEG image file.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size should be less than 10MB.');
      return;
    }

    setSelectedFile(file);

    // Create image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) {
      setError('Please select an image file first.');
      return;
    }

    setLoading(true);
    setError('');
    setPrediction(null);
    setAnimateResults(false);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.error) {
        setError(result.error);
      } else {
        setPrediction(result);
        setTimeout(() => setAnimateResults(true), 300);
      }
    } catch (err) {
      console.error('Error:', err);
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Unable to connect to the server. Please make sure the Flask backend is running on http://localhost:5000');
      } else {
        setError('An error occurred while processing the image. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setImagePreview('');
    setPrediction(null);
    setError('');
    setAnimateResults(false);
    setShowImageModal(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-100 to-pink-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-teal-100 to-green-200 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200 w-full relative z-10">
        <div className="w-full px-8 py-6">
          <div className="flex items-center justify-center gap-4">
            <div className={`bg-gradient-to-br from-red-500 to-pink-600 p-4 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-110 hover:rotate-3 ${pulseAnimation ? 'animate-pulse' : ''}`}>
              <span className="text-white text-3xl filter drop-shadow-lg">❤️</span>
            </div>
            <div className="text-center">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent transform hover:scale-105 transition-all duration-300 hover:text-indigo-700">
                 RhythmAI: ECG Condition Detector
              </h1>
              <p className="text-gray-600 mt-2 text-xl font-medium">AI-powered ECG analysis and classification</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-8 py-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 h-full">
          {/* Left Column - Upload Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden h-fit transform hover:scale-[1.02] transition-all duration-500 hover:shadow-3xl">
            <div className="p-10">
              <div className="text-center mb-10">
                <div className="transform hover:scale-110 hover:rotate-12 transition-all duration-300 mb-6">
                  <span className="text-7xl block filter drop-shadow-lg">📊</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-3 hover:text-indigo-700 transition-colors duration-300">Upload ECG Image</h2>
                <p className="text-gray-600 text-xl leading-relaxed">Select an ECG image to analyze for heart rhythm classification</p>
              </div>

              {/* File Upload Area */}
              <div 
                className={`border-3 border-dashed rounded-2xl p-16 text-center transition-all duration-500 min-h-[240px] relative overflow-hidden ${
                  dragOver 
                    ? 'border-indigo-500 bg-indigo-50 scale-105 shadow-2xl' 
                    : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50 hover:scale-[1.02]'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  onChange={handleFileInputChange}
                  className="hidden"
                  id="file-upload"
                />
                
                <label htmlFor="file-upload" className="cursor-pointer relative z-10">
                  {!imagePreview ? (
                    <div className="transform hover:scale-110 transition-all duration-300">
                      <div className="transform hover:rotate-12 transition-all duration-300 mb-6">
                        <span className="text-8xl block filter drop-shadow-lg">📁</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-700 mb-3 hover:text-indigo-600 transition-colors duration-300">
                        {dragOver ? 'Drop your ECG image here!' : 'Click to select ECG image'}
                      </p>
                      <p className="text-gray-500 text-lg">
                        Supports PNG, JPG, JPEG (max 10MB)
                      </p>
                    </div>
                  ) : (
                    <div className="transform hover:scale-110 transition-all duration-300">
                      <div className="transform hover:bounce transition-all duration-300 mb-6">
                        <span className="text-8xl block filter drop-shadow-lg animate-bounce">✅</span>
                      </div>
                      <p className="text-2xl font-bold text-green-700 mb-3">
                        Image selected successfully
                      </p>
                      <p className="text-gray-600 text-lg font-medium">
                        {selectedFile?.name}
                      </p>
                    </div>
                  )}
                </label>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-10 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 transform hover:scale-[1.02] transition-all duration-500 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <span className="text-3xl">🖼️</span>
                      Image Preview
                    </h3>
                    <button
                      onClick={() => setShowImageModal(true)}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg flex items-center gap-2"
                    >
                      <span className="text-lg">🔍</span>
                      Full View
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <div className="relative group cursor-pointer" onClick={() => setShowImageModal(true)}>
                      <img
                        src={imagePreview}
                        alt="ECG Preview"
                        className="max-w-full max-h-80 rounded-xl shadow-2xl border-4 border-white transform group-hover:scale-105 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 transform scale-0 group-hover:scale-100 transition-all duration-300">
                          <span className="text-2xl">🔍</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-6 mt-10">
                <button
                  onClick={uploadImage}
                  disabled={!selectedFile || loading}
                  className="flex-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-5 px-10 rounded-2xl transition-all duration-500 flex items-center justify-center gap-3 shadow-2xl disabled:shadow-none text-xl transform hover:scale-105 hover:-translate-y-1 disabled:hover:scale-100 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin text-2xl">⏳</span>
                      <span className="animate-pulse">Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">📊</span>
                      Analyze ECG
                    </>
                  )}
                </button>

                {selectedFile && (
                  <button
                    onClick={resetUpload}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-5 px-10 rounded-2xl transition-all duration-500 flex items-center gap-3 text-xl transform hover:scale-105 hover:-translate-y-1 shadow-xl"
                  >
                    <span className="text-xl">🔄</span>
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Results Section */}
          <div className="space-y-10">
            {/* Error Display */}
            {error && (
              <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded-2xl p-10 shadow-2xl transform hover:scale-[1.02] transition-all duration-500 animate-pulse">
                <div className="flex items-center gap-4">
                  <span className="text-5xl animate-bounce">⚠️</span>
                  <div>
                    <h3 className="font-bold text-red-800 text-2xl mb-2">Error Detected</h3>
                    <p className="text-red-700 text-xl leading-relaxed">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Results Section */}
            {prediction && (
              <div className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden transform transition-all duration-1000 ${animateResults ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-80 translate-y-4'}`}>
                <div className="p-10">
                  <div className="flex items-center gap-4 mb-10">
                    <span className="text-6xl animate-bounce">✅</span>
                    <h2 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Analysis Complete</h2>
                  </div>

                  <div className="grid gap-10">
                    {/* Prediction Card */}
                    <div className={`border-3 rounded-2xl p-10 ${getSeverityColor(prediction.predicted_class)} shadow-2xl transform hover:scale-[1.02] transition-all duration-500 relative overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                      <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                          <span className="text-3xl">🎯</span>
                          Predicted Condition
                        </h3>
                        <div className="space-y-4">
                          <p className="text-3xl font-bold transform hover:scale-105 transition-all duration-300">{prediction.predicted_class}</p>
                          <p className="opacity-90 text-xl font-semibold">
                            Confidence: {prediction.confidence}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Confidence Visualization */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-10 shadow-xl transform hover:scale-[1.02] transition-all duration-500">
                      <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                        <span className="text-3xl">📈</span>
                        Confidence Level
                      </h3>
                      <div className="space-y-6">
                        <div className="flex justify-between text-xl font-semibold">
                          <span>Confidence Score</span>
                          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{prediction.confidence}</span>
                        </div>
                        <div className="w-full bg-gray-300 rounded-full h-6 shadow-inner relative overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-6 rounded-full transition-all duration-2000 ease-out shadow-lg relative"
                            style={{ width: animateResults ? prediction.confidence : '0%' }}
                          >
                            <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-10 shadow-xl transform hover:scale-[1.02] transition-all duration-500">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <span className="text-3xl">📚</span>
                        About This Condition
                      </h3>
                      <p className="text-gray-800 leading-relaxed text-xl font-medium">
                        {conditionDescriptions[prediction.predicted_class] || 'No description available for this condition.'}
                      </p>
                      {prediction.predicted_class === 'Ventricular Fibrillation' && (
                        <div className="mt-8 p-8 bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-400 rounded-xl shadow-xl animate-pulse">
                          <p className="text-red-800 font-bold text-xl flex items-center gap-3">
                            <span className="text-2xl animate-bounce">⚠️</span>
                            This condition requires immediate medical attention!
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-gradient-to-br from-amber-50 to-yellow-100 border-2 border-amber-300 rounded-2xl p-8 shadow-xl">
                      <p className="text-amber-900 text-lg leading-relaxed flex items-start gap-3">
                        <span className="text-2xl mt-1">⚖️</span>
                        <span>
                          <strong>Disclaimer:</strong> This AI model is for educational and research purposes only. 
                          Always consult with qualified healthcare professionals for medical diagnosis and treatment.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder when no results */}
            {!prediction && !error && (
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden transform hover:scale-[1.02] transition-all duration-500">
                <div className="p-16 text-center">
                  <div className="transform hover:scale-110 hover:rotate-12 transition-all duration-500 mb-8">
                    <span className="text-8xl block filter drop-shadow-lg animate-pulse">🔬</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6 hover:text-indigo-600 transition-colors duration-300">Ready for Analysis</h3>
                  <p className="text-gray-600 text-xl leading-relaxed">
                    Upload an ECG image to see detailed analysis results and classification
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && imagePreview && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 animate-fadeIn overflow-hidden"
          onClick={() => setShowImageModal(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-6 right-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300 z-20"
          >
            <span className="text-2xl font-bold">✕</span>
          </button>

          {/* Header */}
          <div className="absolute top-6 left-6 z-20">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-3xl">🖼️</span>
                ECG Image - Full View
              </h3>
              <p className="text-gray-200 mt-1">{selectedFile?.name}</p>
            </div>
          </div>

          {/* Download Button */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
            <a
              href={imagePreview}
              download={selectedFile?.name || 'ecg-image'}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-2xl flex items-center gap-3"
            >
              <span className="text-xl">💾</span>
              Download Image
            </a>
          </div>

          {/* Full Image Container */}
          <div 
            className="w-full h-full flex items-center justify-center p-20 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imagePreview}
              alt="ECG Full View"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border-2 border-white/20"
              style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }}
            />
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from { 
            opacity: 0; 
            transform: scale(0.8) translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }
      `}</style>
    </div>
  );
};

export default ECGClassifier;