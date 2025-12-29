
import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Check, X } from 'lucide-react';

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
  initialValue?: string;
  onCancel: () => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, initialValue, onCancel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx && initialValue) {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0);
        img.src = initialValue;
      }
    }
  }, [initialValue]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.beginPath();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f172a';

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const save = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      onSave(canvas.toDataURL());
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Draw your signature below</span>
        <button onClick={clear} className="text-slate-400 hover:text-red-500 transition-colors p-1" title="Clear Pad">
          <Eraser size={16} />
        </button>
      </div>
      
      <div className="border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden bg-slate-50 cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={500}
          height={200}
          className="w-full h-48 touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onCancel}
          className="flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors text-xs uppercase tracking-widest"
        >
          <X size={14} /> Back
        </button>
        <button
          onClick={save}
          className="flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-colors text-xs uppercase tracking-widest"
        >
          <Check size={14} /> Save Signature
        </button>
      </div>
    </div>
  );
};
