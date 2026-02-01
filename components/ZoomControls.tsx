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
        <div className="fixed top-28 right-1/4 z-[9999] flex flex-row gap-2 bg-white/90 backdrop-blur-sm rounded-xl p-2 shadow-lg border-2 border-[#0C4A6E]">
            <button
                onClick={zoomIn}
                disabled={zoomLevel >= maxZoom}
                className="clay-button clay-green p-2 hover:scale-105 active:scale-95 transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
                title="Zoom In (Cmd/Ctrl +)"
            >
                <ZoomIn size={18} className="text-[#064E3B]" />
            </button>

            <button
                onClick={zoomOut}
                disabled={zoomLevel <= minZoom}
                className="clay-button clay-blue p-2 hover:scale-105 active:scale-95 transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
                title="Zoom Out (Cmd/Ctrl -)"
            >
                <ZoomOut size={18} className="text-[#0C4A6E]" />
            </button>

            <button
                onClick={resetZoom}
                disabled={zoomLevel === 1}
                className="clay-button bg-white p-1.5 hover:scale-105 active:scale-95 transition-transform disabled:opacity-30 disabled:cursor-not-allowed border-[#0C4A6E]"
                title="Reset Zoom (Cmd/Ctrl 0)"
            >
                <RotateCcw size={16} className="text-[#0C4A6E]" />
            </button>

            <div className="flex items-center px-2 border-l-2 border-[#0C4A6E]/20">
                <span className="text-sm font-black text-[#0C4A6E]">{percentage}%</span>
            </div>
        </div>
    );
};

export default ZoomControls;
