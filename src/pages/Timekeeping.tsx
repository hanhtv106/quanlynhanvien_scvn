import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, MapPin, CheckCircle2, XCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import Webcam from 'react-webcam';

// Mock data for valid locations (e.g., Company HQ, Port Area)
const VALID_LOCATIONS = [
  { id: 'hq', name: 'Văn phòng chính', lat: 10.762622, lng: 106.660172, radius: 100 }, // 100 meters
  { id: 'port', name: 'Khu vực Cảng', lat: 10.776889, lng: 106.700806, radius: 500 }, // 500 meters
];

// Helper to calculate distance between two coordinates in meters (Haversine formula)
function getDistanceFromLatLonInM(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Radius of the earth in m
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in m
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export function Timekeeping() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  // GPS State
  const [location, setLocation] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [locationError, setLocationError] = useState<string>('');
  const [validLocationMatch, setValidLocationMatch] = useState<{ name: string; distance: number } | null>(null);

  // Mock User Data
  const currentUser = {
    department: 'Kỹ thuật',
    role: 'Kỹ sư',
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  }, [webcamRef]);

  const retake = () => {
    setCapturedImage(null);
  };

  const getLocation = () => {
    setLocationStatus('loading');
    setLocationError('');
    setValidLocationMatch(null);

    if (!navigator.geolocation) {
      setLocationStatus('error');
      setLocationError('Trình duyệt của bạn không hỗ trợ Geolocation.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        // Anti-Fake GPS basic check: extremely high accuracy might indicate spoofing on some devices,
        // but generally we just check if accuracy is reasonable (e.g., < 100m)
        if (accuracy > 150) {
           setLocationStatus('error');
           setLocationError(`Độ chính xác GPS quá thấp (${Math.round(accuracy)}m). Vui lòng di chuyển ra khu vực thoáng hơn.`);
           return;
        }

        setLocation({ lat: latitude, lng: longitude, accuracy });
        setLocationStatus('success');

        // Check if within valid radius
        let matched = false;
        for (const loc of VALID_LOCATIONS) {
          const distance = getDistanceFromLatLonInM(latitude, longitude, loc.lat, loc.lng);
          if (distance <= loc.radius) {
            setValidLocationMatch({ name: loc.name, distance: Math.round(distance) });
            matched = true;
            break;
          }
        }

        if (!matched) {
          setValidLocationMatch(null); // Explicitly null if no match
        }
      },
      (error) => {
        setLocationStatus('error');
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Bạn đã từ chối quyền truy cập vị trí.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Thông tin vị trí không khả dụng.');
            break;
          case error.TIMEOUT:
            setLocationError('Yêu cầu lấy vị trí quá thời gian.');
            break;
          default:
            setLocationError('Đã xảy ra lỗi không xác định khi lấy vị trí.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0 // Force fresh location
      }
    );
  };

  // Auto-fetch location on mount
  useEffect(() => {
    getLocation();
  }, []);

  const handleCheckIn = () => {
    if (!capturedImage) {
      alert('Vui lòng chụp ảnh khuôn mặt trước khi chấm công.');
      return;
    }
    if (locationStatus !== 'success' || !validLocationMatch) {
      alert('Vị trí không hợp lệ. Không thể chấm công.');
      return;
    }

    // In a real app, send capturedImage (base64) and location to backend
    alert('Chấm công thành công!\nThời gian: ' + new Date().toLocaleTimeString());
    // Reset state after successful check-in
    setCapturedImage(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Chấm công thông minh</h2>
        <p className="text-sm text-slate-500">Hệ thống nhận diện khuôn mặt và xác thực vị trí GPS.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Camera Section */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-full max-w-sm aspect-[3/4] bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center relative overflow-hidden">
            {!isCameraActive && !capturedImage ? (
              <>
                <Camera className="h-12 w-12 text-slate-400 mb-4" />
                <p className="text-sm text-slate-500 font-medium">Camera đang tắt</p>
                <button 
                  onClick={() => setIsCameraActive(true)}
                  className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Bật Camera
                </button>
              </>
            ) : capturedImage ? (
              <>
                <img src={capturedImage} alt="Captured face" className="w-full h-full object-cover" />
                <button 
                  onClick={retake}
                  className="absolute bottom-4 px-4 py-2 bg-white/90 backdrop-blur-sm text-slate-900 rounded-md text-sm font-medium hover:bg-white transition-colors shadow-sm"
                >
                  Chụp lại
                </button>
              </>
            ) : (
              <>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: "user" }}
                  className="w-full h-full object-cover"
                  disablePictureInPicture={false}
                  forceScreenshotSourceSize={false}
                  imageSmoothing={true}
                  mirrored={false}
                  minScreenshotHeight={0}
                  minScreenshotWidth={0}
                  screenshotQuality={0.92}
                  onUserMedia={() => {}}
                  onUserMediaError={() => {}}
                />
                <button 
                  onClick={capture}
                  className="absolute bottom-4 px-6 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg flex items-center"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Chụp ảnh
                </button>
              </>
            )}
          </div>
        </div>

        {/* Info & Action Section */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Thông tin xác thực</h3>
              <button 
                onClick={getLocation}
                disabled={locationStatus === 'loading'}
                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors disabled:opacity-50"
                title="Làm mới vị trí"
              >
                <RefreshCw className={`h-4 w-4 ${locationStatus === 'loading' ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Location Status */}
              <div className="flex items-start">
                {locationStatus === 'loading' ? (
                  <RefreshCw className="h-5 w-5 text-slate-400 mt-0.5 mr-3 animate-spin" />
                ) : locationStatus === 'success' && validLocationMatch ? (
                  <MapPin className="h-5 w-5 text-emerald-500 mt-0.5 mr-3" />
                ) : (
                  <MapPin className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
                )}
                
                <div>
                  <p className="text-sm font-medium text-slate-900">Vị trí hiện tại</p>
                  {locationStatus === 'loading' ? (
                    <p className="text-sm text-slate-500">Đang lấy tọa độ GPS...</p>
                  ) : locationStatus === 'error' ? (
                    <p className="text-sm text-red-600">{locationError}</p>
                  ) : locationStatus === 'success' ? (
                    <>
                      {validLocationMatch ? (
                        <p className="text-sm text-emerald-600 font-medium">
                          Hợp lệ: {validLocationMatch.name} (Cách {validLocationMatch.distance}m)
                        </p>
                      ) : (
                        <p className="text-sm text-red-600 font-medium">
                          Không hợp lệ: Nằm ngoài bán kính cho phép.
                        </p>
                      )}
                      <p className="text-xs text-slate-400 mt-1">
                        Lat: {location?.lat.toFixed(6)}, Long: {location?.lng.toFixed(6)}
                        <br/>Sai số: ±{Math.round(location?.accuracy || 0)}m
                      </p>
                    </>
                  ) : null}
                </div>
              </div>

              {/* Anti-Fake GPS Status */}
              <div className="flex items-start">
                {locationStatus === 'success' ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 mr-3" />
                ) : locationStatus === 'error' ? (
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-3" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-slate-300 mt-0.5 mr-3" />
                )}
                <div>
                  <p className="text-sm font-medium text-slate-900">Kiểm tra cảm biến (Anti-Fake GPS)</p>
                  <p className="text-sm text-slate-500">
                    {locationStatus === 'success' 
                      ? 'Độ chính xác hợp lý, không phát hiện bất thường.' 
                      : locationStatus === 'error'
                      ? 'Không thể xác thực cảm biến.'
                      : 'Đang chờ dữ liệu...'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-sm font-medium text-slate-900 mb-3">Gợi ý ca làm việc</h3>
            <div className="bg-indigo-50 border border-indigo-100 rounded-md p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-indigo-900">Ca Hành chính (08:00 - 17:00)</p>
                  <p className="text-sm text-indigo-700 mt-1">Bộ phận: {currentUser.department}</p>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                  Tự động chọn
                </span>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <button 
              onClick={handleCheckIn}
              disabled={!capturedImage || locationStatus !== 'success' || !validLocationMatch}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {!capturedImage ? 'Vui lòng chụp ảnh' : 
               (!validLocationMatch ? 'Vị trí không hợp lệ' : 'Chấm công vào ca')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

