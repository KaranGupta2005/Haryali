import React, { useState } from 'react';
import { Upload, Sparkles, CheckCircle } from 'lucide-react';

const ParaliClassifier = () => {
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        analyzeImage();
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    setAnalyzing(true);
    setResults(null);
    
    setTimeout(() => {
      setAnalyzing(false);
      setResults({
        quality: 'Premium Grade',
        moisture: '12%',
        density: 'High',
        contamination: 'Low',
        estimatedYield: '2.3 tonnes',
        priceRange: '₹4,500-5,200/tonne'
      });
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="holographic-line" style={{top: '10%', animationDelay: '0s'}}></div>
        <div className="holographic-line" style={{top: '30%', animationDelay: '1s'}}></div>
        <div className="holographic-line" style={{top: '50%', animationDelay: '2s'}}></div>
        <div className="holographic-line" style={{top: '70%', animationDelay: '1.5s'}}></div>
        <div className="holographic-line" style={{top: '90%', animationDelay: '0.5s'}}></div>
      </div>

      {/* Floating orbs */}
      <div className="floating-orb" style={{top: '20%', left: '10%', animationDelay: '0s'}}></div>
      <div className="floating-orb" style={{top: '60%', right: '15%', animationDelay: '2s'}}></div>
      <div className="floating-orb" style={{bottom: '20%', left: '20%', animationDelay: '4s'}}></div>

      <div className="max-w-6xl w-full relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="text-green-600 w-8 h-8" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-emerald-600">
              AI Quality Analyzer
            </h1>
          </div>
          <p className="text-green-800 text-lg">Upload parali image for instant quality assessment</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
          {/* Circular Upload Area */}
          <div className="relative">
            <div className="circular-upload-container">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="imageUpload"
              />
              <label
                htmlFor="imageUpload"
                className="circular-upload cursor-pointer"
              >
                {!image ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Upload className="w-16 h-16 text-green-600 mb-4" />
                    <span className="text-green-800 text-lg font-medium">Click to Upload</span>
                    <span className="text-green-600 text-sm mt-2">JPG, PNG up to 10MB</span>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={image}
                      alt="Uploaded parali"
                      className="w-full h-full object-cover"
                    />
                    {analyzing && (
                      <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
                        <div className="scanning-beam"></div>
                        <span className="text-green-700 font-semibold text-lg z-10">Analyzing...</span>
                      </div>
                    )}
                  </div>
                )}
              </label>
              
              {/* Rotating ring */}
              {(analyzing || results) && (
                <div className="rotating-ring"></div>
              )}
            </div>
          </div>

          {/* Results Panel */}
          <div className="flex-1 max-w-md w-full">
            {results && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="text-green-600 w-6 h-6" />
                  <h2 className="text-2xl font-bold text-green-900">Analysis Complete</h2>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="result-pill">
                    <span className="pill-label">Quality</span>
                    <span className="pill-value">{results.quality}</span>
                  </div>
                  
                  <div className="result-pill">
                    <span className="pill-label">Moisture</span>
                    <span className="pill-value">{results.moisture}</span>
                  </div>
                  
                  <div className="result-pill">
                    <span className="pill-label">Density</span>
                    <span className="pill-value">{results.density}</span>
                  </div>
                  
                  <div className="result-pill">
                    <span className="pill-label">Contamination</span>
                    <span className="pill-value text-green-600">{results.contamination}</span>
                  </div>
                  
                  <div className="result-pill col-span-2">
                    <span className="pill-label">Est. Yield</span>
                    <span className="pill-value">{results.estimatedYield}</span>
                  </div>
                  
                  <div className="result-pill col-span-2 bg-gradient-to-r from-green-100 to-emerald-100 border-green-400">
                    <span className="pill-label">Price Range</span>
                    <span className="pill-value text-green-700 text-xl">{results.priceRange}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setImage(null);
                    setResults(null);
                  }}
                  className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300"
                >
                  Analyze Another
                </button>
              </div>
            )}

            {!results && !analyzing && (
              <div className="text-center text-green-700 space-y-3">
                <p className="text-lg">Waiting for image upload...</p>
                <div className="flex justify-center gap-2">
                  <div className="pulse-dot"></div>
                  <div className="pulse-dot" style={{animationDelay: '0.2s'}}></div>
                  <div className="pulse-dot" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .circular-upload-container {
          position: relative;
          width: 320px;
          height: 320px;
        }

        .circular-upload {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(134, 239, 172, 0.3), rgba(167, 243, 208, 0.3));
          border: 3px dashed rgba(22, 163, 74, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          overflow: hidden;
          backdrop-filter: blur(10px);
        }

        .circular-upload:hover {
          border-color: rgba(22, 163, 74, 0.8);
          background: linear-gradient(135deg, rgba(134, 239, 172, 0.4), rgba(167, 243, 208, 0.4));
          transform: scale(1.02);
        }

        .rotating-ring {
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          border-radius: 50%;
          border: 3px solid transparent;
          border-top-color: #16a34a;
          border-right-color: #10b981;
          animation: rotate 3s linear infinite;
        }

        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .scanning-beam {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, transparent, #16a34a, transparent);
          animation: scan 2s ease-in-out infinite;
        }

        @keyframes scan {
          0%, 100% { top: 0%; opacity: 0; }
          50% { top: 100%; opacity: 1; }
        }

        .result-pill {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(22, 163, 74, 0.2);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          transition: all 0.3s ease;
        }

        .result-pill:hover {
          background: rgba(255, 255, 255, 0.8);
          border-color: rgba(22, 163, 74, 0.4);
          transform: translateY(-2px);
        }

        .pill-label {
          font-size: 12px;
          color: #15803d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .pill-value {
          font-size: 18px;
          font-weight: 600;
          color: #14532d;
        }

        .holographic-line {
          position: absolute;
          left: -100%;
          width: 200%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(22, 163, 74, 0.4), transparent);
          animation: slide 6s linear infinite;
        }

        @keyframes slide {
          0% { left: -100%; opacity: 0; }
          50% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }

        .floating-orb {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(134, 239, 172, 0.3), transparent);
          filter: blur(40px);
          animation: float 8s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.1); }
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #16a34a;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ParaliClassifier;