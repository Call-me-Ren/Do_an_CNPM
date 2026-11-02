import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
}

export const QRScannerModal: React.FC<Props> = ({ isOpen, onClose, onScanSuccess }) => {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerRegionId = 'qr-reader-region';

  useEffect(() => {
    if (!isOpen) return;

    let isSubscribed = true;

    const startScanner = async () => {
      try {
        const scanner = new Html5Qrcode(scannerRegionId);
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            if (isSubscribed) {
              onScanSuccess(decodedText);
              stopScanner();
            }
          },
          () => {
            // scan error ignored
          }
        );
      } catch (err) {
        if (isSubscribed) {
          console.error(err);
          setErrorMessage(t('cameraPermissionNeeded'));
        }
      }
    };

    const timer = setTimeout(() => {
      startScanner();
    }, 300);

    return () => {
      isSubscribed = false;
      clearTimeout(timer);
      stopScanner();
    };
  }, [isOpen]);

  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    } catch (e) {
      console.warn('Error stopping scanner:', e);
    }

    // Force release all active camera media streams on the browser/device
    if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
      try {
        const streamContainer = document.getElementById(scannerRegionId);
        const videos = streamContainer ? streamContainer.querySelectorAll('video') : document.querySelectorAll('video');
        videos.forEach((video) => {
          if (video.srcObject) {
            const stream = video.srcObject as MediaStream;
            stream.getTracks().forEach((track) => {
              track.stop();
            });
            video.srcObject = null;
          }
        });
      } catch (err) {
        console.warn('Error clearing camera tracks:', err);
      }
    }
  };

  const handleManualClose = () => {
    stopScanner();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative flex flex-col items-center p-5 text-white">
        <button
          type="button"
          onClick={handleManualClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4 text-amber-400 font-semibold text-sm">
          <Camera className="w-4 h-4" />
          <span>{t('scanQR')}</span>
        </div>

        {/* QR Scanner Container */}
        <div className="w-full aspect-square bg-black rounded-2xl overflow-hidden relative border-2 border-dashed border-amber-500/50 flex items-center justify-center">
          <div id={scannerRegionId} className="w-full h-full"></div>
          {errorMessage && (
            <div className="p-4 text-center text-red-400 text-xs flex flex-col items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-400 mt-4 text-center">
          {t('cameraGuide')}
        </p>
      </div>
    </div>
  );
};
