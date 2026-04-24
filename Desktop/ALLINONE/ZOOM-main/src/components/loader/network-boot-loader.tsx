import { BrandLogo } from '@/components/layout/app-logo/BrandLogo';
import { useEffect, useRef, useState } from 'react';
import './network-boot-loader.scss';

type NetworkBootLoaderProps = {
    /** Primary status line (e.g. localized loading message). */
    message?: string;
    /** Optional secondary hint under the main message. */
    hint?: string;
};

export default function NetworkBootLoader({ message, hint }: NetworkBootLoaderProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [loadPercent, setLoadPercent] = useState(0);
    const primary = message?.trim();
    const secondary = hint?.trim();

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadPercent((prev) => {
                if (prev >= 100) return 100;
                return prev + Math.random() * 12;
            });
        }, 700);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Forex candles data
        let candles: Array<{ open: number; high: number; low: number; close: number; time: number }> = [];
        const candleCount = 40;
        const basePrice = 1.1000;

        for (let i = 0; i < candleCount; i++) {
            const open = basePrice + (Math.random() - 0.5) * 0.02;
            const close = open + (Math.random() - 0.5) * 0.015;
            const high = Math.max(open, close) + Math.random() * 0.01;
            const low = Math.min(open, close) - Math.random() * 0.01;
            candles.push({ open, high, low, close, time: i });
        }

        let frameCount = 0;
        let animationId: number;

        const drawForexChart = () => {
            // Fade effect
            ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            frameCount++;

            // Update candles
            if (frameCount % 12 === 0 && candles.length > 0) {
                const lastCandle = candles[candles.length - 1];
                const open = lastCandle.close + (Math.random() - 0.5) * 0.008;
                const close = open + (Math.random() - 0.5) * 0.012;
                const high = Math.max(open, close) + Math.random() * 0.008;
                const low = Math.min(open, close) - Math.random() * 0.008;

                candles.push({ open, high, low, close, time: frameCount / 12 });

                if (candles.length > candleCount) {
                    candles.shift();
                }
            }

            // Calculate price range
            const prices = candles.flatMap((c) => [c.high, c.low]);
            const maxPrice = Math.max(...prices);
            const minPrice = Math.min(...prices);
            const priceRange = maxPrice - minPrice || 0.01;

            // Chart dimensions
            const chartLeft = canvas.width * 0.1;
            const chartRight = canvas.width * 0.9;
            const chartTop = canvas.height * 0.15;
            const chartBottom = canvas.height * 0.85;
            const chartWidth = chartRight - chartLeft;
            const chartHeight = chartBottom - chartTop;

            // Draw grid lines (subtle)
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.08)';
            ctx.lineWidth = 1;

            // Vertical grid
            for (let i = 0; i < candles.length; i += Math.max(1, Math.floor(candles.length / 8))) {
                const x = chartLeft + (i / candles.length) * chartWidth;
                ctx.beginPath();
                ctx.moveTo(x, chartTop);
                ctx.lineTo(x, chartBottom);
                ctx.stroke();
            }

            // Horizontal grid
            for (let i = 0; i <= 5; i++) {
                const y = chartTop + (i / 5) * chartHeight;
                ctx.beginPath();
                ctx.moveTo(chartLeft, y);
                ctx.lineTo(chartRight, y);
                ctx.stroke();
            }

            // Draw candlesticks
            candles.forEach((candle, index) => {
                const x = chartLeft + (index / candles.length) * chartWidth;
                const candleWidth = Math.max(2, chartWidth / candles.length * 0.6);

                const getY = (price: number) => {
                    return chartBottom - ((price - minPrice) / (priceRange + 0.001)) * chartHeight;
                };

                const openY = getY(candle.open);
                const closeY = getY(candle.close);
                const highY = getY(candle.high);
                const lowY = getY(candle.low);

                const isGreen = candle.close >= candle.open;
                const bodyColor = isGreen ? 'rgba(251, 191, 36, 0.6)' : 'rgba(30, 58, 138, 0.6)';
                const wickColor = isGreen ? 'rgba(251, 191, 36, 0.4)' : 'rgba(30, 58, 138, 0.4)';

                // Draw wick
                ctx.strokeStyle = wickColor;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(x, highY);
                ctx.lineTo(x, lowY);
                ctx.stroke();

                // Draw body
                const bodyTop = Math.min(openY, closeY);
                const bodyBottom = Math.max(openY, closeY);
                const bodyHeight = Math.max(1, bodyBottom - bodyTop);

                ctx.fillStyle = bodyColor;
                ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
            });

            // Draw simple floating circles
            const circleCount = 6;
            for (let i = 0; i < circleCount; i++) {
                const angle = (frameCount * 0.01 + (i / circleCount) * Math.PI * 2);
                const radius = 100 + Math.sin(frameCount * 0.005) * 30;
                const cx = canvas.width / 2 + Math.cos(angle) * radius;
                const cy = canvas.height / 2 + Math.sin(angle) * radius;

                const size = 8 + Math.sin(frameCount * 0.03 + i) * 3;
                ctx.fillStyle = `rgba(251, 191, 36, ${0.3 + Math.sin(frameCount * 0.04 + i) * 0.2})`;
                ctx.beginPath();
                ctx.arc(cx, cy, size, 0, Math.PI * 2);
                ctx.fill();
            }

            animationId = requestAnimationFrame(drawForexChart);
        };

        drawForexChart();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div
            className='network-boot'
            role='status'
            aria-live='polite'
            aria-busy='true'
            data-testid='dt_network_boot_loader'
        >
            {/* Background */}
            <div className='network-boot__bg' aria-hidden />

            {/* Forex Chart Canvas */}
            <canvas ref={canvasRef} className='network-boot__canvas' aria-hidden />

            {/* Card */}
            <div className='network-boot__card network-boot__card--simple'>
                {/* Logo */}
                <div className='network-boot__logo-section'>
                    <BrandLogo width={140} height={40} className='network-boot__logo' />
                </div>

                {/* Simple Spinner */}
                <div className='network-boot__simple-spinner' aria-hidden />

                {/* Loading Text */}
                <div className='network-boot__loading-section'>
                    <h2 className='network-boot__loading-text'>Loading</h2>
                    <p className='network-boot__loading-subtext'>Please wait...</p>
                </div>

                {/* Progress Bar */}
                <div className='network-boot__progress-bar-container'>
                    <div className='network-boot__progress-bar'>
                        <div
                            className='network-boot__progress-bar-fill'
                            style={{ width: `${loadPercent}%` }}
                            aria-hidden
                        />
                    </div>
                    <span className='network-boot__progress-text'>{Math.round(loadPercent)}%</span>
                </div>

                {/* Messages */}
                {primary && <p className='network-boot__message'>{primary}</p>}
                {secondary && <p className='network-boot__hint'>{secondary}</p>}

                {/* Footer */}
                <div className='network-boot__footer'>
                    <p className='network-boot__powered-by'>
                        Powered by <span className='network-boot__deriv-brand'>TraderGo</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
