import React, { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

const ZoomControls: React.FC = () => {
    const [zoomLevel, setZoomLevel] = useState(() => {
        const saved = localStorage.getItem('zoomLevel');
        return saved ? parseFloat(saved) : 1;
    });

    const minZoom = 0.5;
    const maxZoom = 2;
    const step = 0.1;

    useEffect(() => {
        localStorage.setItem('zoomLevel', zoomLevel.toString());
        document.documentElement.style.setProperty('--zoom-scale', zoomLevel.toString());
    }, [zoomLevel]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && (e.key === '+' || e.key === '=')) {
                e.preventDefault();
                zoomIn();
            } else if ((e.metaKey || e.ctrlKey) && e.key === '-') {
                e.preventDefault();
                zoomOut();
            } else if ((e.metaKey || e.ctrlKey) && e.key === '0') {
                e.preventDefault();
                resetZoom();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [zoomLevel]);

    const zoomIn = () => {
        setZoomLevel(prev => Math.min(prev + step, maxZoom));
    };

    const zoomOut = () => {
        setZoomLevel(prev => Math.max(prev - step, minZoom));
    };

    const resetZoom = () => {
        setZoomLevel(1);
    };

    const percentage = Math.round(zoomLevel * 100);

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-2xl border-4 border-[#0C4A6E]">
            <button
                onClick={zoomIn}
                disabled={zoomLevel >= maxZoom}
                className="clay-button clay-green p-3 hover:scale-110 active:scale-95 transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
                title="Zoom In (Cmd/Ctrl +)"
            >
                <ZoomIn size={24} className="text-[#064E3B]" />
            </button>

            <div className="text-center py-1">
                <span className="text-sm font-black text-[#0C4A6E]">{percentage}%</span>
            </div>

            <button
                onClick={zoomOut}
                disabled={zoomLevel <= minZoom}
                className="clay-button clay-blue p-3 hover:scale-110 active:scale-95 transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
                title="Zoom Out (Cmd/Ctrl -)"
            >
                <ZoomOut size={24} className="text-[#0C4A6E]" />
            </button>

            <button
                onClick={resetZoom}
                disabled={zoomLevel === 1}
                className="clay-button bg-white p-2 hover:scale-110 active:scale-95 transition-transform disabled:opacity-30 disabled:cursor-not-allowed border-[#0C4A6E]"
                title="Reset Zoom (Cmd/Ctrl 0)"
            >
                <RotateCcw size={20} className="text-[#0C4A6E]" />
            </button>
        </div>
    );
};

export default ZoomControls;
