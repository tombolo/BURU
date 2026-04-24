import React, { useState, useEffect } from 'react';
import { useStore } from '@/hooks/useStore';
import { DBOT_TABS } from '@/constants/bot-contents';
import { ApiHelpers, api_base } from '@/external/bot-skeleton';
import {
    komFetchTickQuotes,
    komCountDigits,
    getKomPipSize,
} from '@/pages/dashboard/king-of-matches-api';
import './ai-modal.scss';

type ScanResult = {
    symbol: string;
    displayName: string;
    prediction: 'over2' | 'under7';
    predictionValue: 2 | 7;
    over2Count: number;
    under7Count: number;
    totalCount: number;
};

type ModalPhase = 'scanning' | 'results' | 'loading';

interface AIModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AIModal: React.FC<AIModalProps> = ({ isOpen, onClose }) => {
    const store = useStore();
    const [phase, setPhase] = useState<ModalPhase>('scanning');
    const [terminalLines, setTerminalLines] = useState<string[]>([]);
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [stake, setStake] = useState('1');
    const [error, setError] = useState<string | null>(null);
    const [hasStarted, setHasStarted] = useState(false);

    const handleClose = () => {
        // Reset state when closing
        setPhase('scanning');
        setTerminalLines([]);
        setScanResult(null);
        setStake('1');
        setError(null);
        setHasStarted(false);
        onClose();
    };

    useEffect(() => {
        if (isOpen && !hasStarted) {
            setHasStarted(true);
            runScan();
        }
    }, [isOpen, hasStarted]);

    const addTerminalLine = (line: string, delay: number = 300) => {
        return new Promise<void>(resolve => {
            setTimeout(() => {
                setTerminalLines(prev => [...prev, line]);
                resolve();
            }, delay);
        });
    };

    const runScan = async () => {
        try {
            setError(null);
            setTerminalLines([]);

            await addTerminalLine('[SYS] > Initializing TRADERGO AI scanner...');
            await addTerminalLine('[SYS] > Connecting to Deriv synthetic index feed...');

            // Wait for API to be ready
            const deadline = Date.now() + 8000;
            while (Date.now() < deadline && !api_base.api) {
                await new Promise<void>(resolve => setTimeout(resolve, 150));
            }

            if (!api_base.api) {
                await addTerminalLine('[ERROR] Trading connection timeout.');
                setError('Failed to connect to trading feed. Please try again.');
                setPhase('results');
                return;
            }

            // Fetch active symbols using ApiHelpers (same as quick strategy)
            let symbols: any[] = [];
            try {
                const inst = ApiHelpers.instance as any;
                if (inst?.active_symbols?.retrieveActiveSymbols) {
                    await inst.active_symbols.retrieveActiveSymbols(false);
                }

                const allSymbols = inst?.active_symbols?.getSymbolsForBot?.();
                if (!allSymbols || allSymbols.length === 0) {
                    await addTerminalLine('[ERROR] No markets found.');
                    setError('Failed to fetch markets. Please try again.');
                    setPhase('results');
                    return;
                }

                // Filter for volatility indices (synthetic/random_index)
                symbols = allSymbols.filter(
                    (s: any) => s.submarket === 'random_index' || s.group?.includes('Volatility')
                );

                if (symbols.length === 0) {
                    await addTerminalLine('[ERROR] No volatility markets found.');
                    setError('No volatility markets available. Please try again later.');
                    setPhase('results');
                    return;
                }
            } catch (apiErr) {
                console.error('Error fetching symbols:', apiErr);
                await addTerminalLine('[ERROR] Failed to fetch markets.');
                setError('Failed to fetch markets. Please check your connection and try again.');
                setPhase('results');
                return;
            }

            await addTerminalLine(`[MKT] > ${symbols.length} volatility markets detected. Analyzing digit frequencies...`);

            let bestMarket: ScanResult | null = null;
            let bestScore = -1;
            let successCount = 0;

            for (const sym of symbols) {
                try {
                    const displayName = sym.text || sym.value;
                    const symbolValue = sym.value;
                    await addTerminalLine(`[SCAN] Analyzing ${displayName}...`, 150);

                    const quotes = await komFetchTickQuotes(symbolValue, 500);
                    if (!quotes || quotes.length === 0) {
                        await addTerminalLine(`[SCAN] ${displayName} - No data available`, 50);
                        continue;
                    }

                    successCount++;
                    const pipSize = getKomPipSize(symbolValue);
                    const digitFrequencies = komCountDigits(quotes, pipSize);

                    // Calculate counts
                    const over2Count = digitFrequencies.slice(3).reduce((a, b) => a + b, 0);
                    const under7Count = digitFrequencies.slice(0, 7).reduce((a, b) => a + b, 0);
                    const totalCount = digitFrequencies.reduce((a, b) => a + b, 0);

                    if (totalCount === 0) {
                        await addTerminalLine(`[SCAN] ${displayName} - Invalid data`, 50);
                        continue;
                    }

                    const prediction = over2Count >= under7Count ? ('over2' as const) : ('under7' as const);
                    const maxCount = Math.max(over2Count, under7Count);

                    const over2Pct = Math.round((over2Count / totalCount) * 100);
                    const under7Pct = Math.round((under7Count / totalCount) * 100);

                    await addTerminalLine(
                        `        OVER2: ${over2Pct}% | UNDER7: ${under7Pct}% | Best: ${prediction.toUpperCase()}`,
                        50
                    );

                    if (maxCount > bestScore) {
                        bestScore = maxCount;
                        bestMarket = {
                            symbol: symbolValue,
                            displayName,
                            prediction,
                            predictionValue: prediction === 'over2' ? 2 : 7,
                            over2Count,
                            under7Count,
                            totalCount,
                        };
                    }
                } catch (err) {
                    console.error(`Error scanning ${displayName}:`, err);
                    await addTerminalLine(`[SCAN] Error scanning ${displayName}`, 50);
                }
            }

            await addTerminalLine('[RESULT] > Scan complete!', 300);

            if (bestMarket && successCount > 0) {
                const winner = bestMarket.prediction === 'over2' ? bestMarket.over2Count : bestMarket.under7Count;
                const winnerPct = Math.round((winner / bestMarket.totalCount) * 100);
                const predictionLabel = bestMarket.prediction === 'over2' ? 'OVER 2' : 'UNDER 7';

                await addTerminalLine(`[RESULT] > Best market: ${bestMarket.displayName} (${bestMarket.symbol})`);
                await addTerminalLine(`[RESULT] > Dominant pattern: ${predictionLabel} (${winnerPct}%)`);
                await addTerminalLine('[STATUS] > Strategy configured. Enter stake to proceed.');

                setScanResult(bestMarket);
            } else {
                const errorMsg = successCount === 0
                    ? 'No markets could be analyzed. Please try again.'
                    : 'Failed to find best market. Please try again.';
                setError(errorMsg);
                await addTerminalLine('[ERROR] ' + errorMsg);
            }

            setPhase('results');
        } catch (err) {
            console.error('AI Modal scan error:', err);
            setError('An error occurred during scanning. Please try again.');
            await addTerminalLine('[ERROR] Scan failed. Please try again.');
            setPhase('results');
        }
    };

    const handleLoadStrategy = async () => {
        if (!scanResult || !store) return;

        try {
            // Parse and validate stake - apply ceil validation like quick strategy does
            const stakeParsed = parseFloat(stake);
            const stakeNum = isNaN(stakeParsed) ? 1 : Math.ceil(stakeParsed);
            const { quick_strategy, dashboard } = store;

            // Set strategy type
            quick_strategy.setSelectedStrategy('MARTINGALE');

            // Prepare complete form data - must include all required fields for martingale strategy
            const contractType = scanResult.prediction === 'over2' ? 'DIGITOVER' : 'DIGITUNDER';
            const profitAmount = stakeNum * 1000;  // High profit target allows many trades
            const lossAmount = stakeNum * 500;    // High loss limit for risk management

            const formData = {
                symbol: scanResult.symbol,
                tradetype: 'overunder',
                type: contractType,
                last_digit_prediction: scanResult.predictionValue,
                durationtype: 't',
                duration: '1',
                stake: stakeNum,
                profit: profitAmount,
                loss: lossAmount,
                size: '2',
                unit: '1',
                boolean_max_stake: false,
                max_stake: 10,
                action: 'RUN',
                growth_rate: '0.01',
                tick_count: 0,
                take_profit: 0,
                boolean_tick_count: false,
                max_payout: 0,
                max_ticks: 0,
            };

            // Update the quick strategy store with all form values
            // This ensures the UI displays the correct values
            Object.entries(formData).forEach(([key, value]) => {
                quick_strategy.setValue(key, value);
            });

            // Navigate to bot builder before loading strategy
            dashboard.setActiveTab(DBOT_TABS.BOT_BUILDER);

            // Wait for bot builder to be visible
            await new Promise<void>(resolve => setTimeout(resolve, 300));

            // Submit the strategy which will load it into the bot builder and run it
            await quick_strategy.onSubmit(formData);

            // Close modal after everything is loaded
            handleClose();
        } catch (err) {
            console.error('Error loading strategy:', err);
            setError('Failed to load strategy. Please try again.');
            setPhase('results');
        }
    };

    if (!isOpen) return null;

    return (
        <div className='ai-modal-overlay' onClick={handleClose}>
            <div className='ai-modal-container' onClick={e => e.stopPropagation()}>
                {phase === 'scanning' && (
                    <div className='ai-modal__scanner'>
                        <div className='ai-modal__terminal'>
                            <div className='ai-modal__terminal-header'>
                                <span className='ai-modal__terminal-label'>[TRADERGO AI SCANNER]</span>
                            </div>
                            <div className='ai-modal__terminal-content'>
                                {terminalLines.map((line, idx) => (
                                    <div key={idx} className='ai-modal__terminal-line'>
                                        {line}
                                    </div>
                                ))}
                                {phase === 'scanning' && <div className='ai-modal__cursor'>▌</div>}
                            </div>
                        </div>
                    </div>
                )}

                {phase === 'results' && (
                    <div className='ai-modal__results'>
                        <div className='ai-modal__close-btn' onClick={handleClose}>
                            ✕
                        </div>

                        {error ? (
                            <div className='ai-modal__error'>
                                <div className='ai-modal__error-icon'>⚠</div>
                                <div className='ai-modal__error-title'>Scan Failed</div>
                                <div className='ai-modal__error-message'>{error}</div>
                                <button className='ai-modal__retry-btn' onClick={() => {
                                    setPhase('scanning');
                                    setHasStarted(false);
                                    runScan();
                                }}>
                                    ↻ Retry Scan
                                </button>
                            </div>
                        ) : scanResult ? (
                            <>
                                <div className='ai-modal__header'>
                                    <div className='ai-modal__title'>✨ AI Strategy Ready</div>
                                    <div className='ai-modal__strategy-badge'>Martingale</div>
                                </div>

                                <div className='ai-modal__market-box'>
                                    <div className='ai-modal__market-label'>Best Market</div>
                                    <div className='ai-modal__market-name'>{scanResult.displayName}</div>
                                    <div className='ai-modal__market-symbol'>{scanResult.symbol}</div>
                                </div>

                                <div className='ai-modal__prediction-box'>
                                    <div className='ai-modal__prediction-label'>Strategy</div>
                                    <div
                                        className={`ai-modal__prediction-badge ${
                                            scanResult.prediction === 'over2' ? 'over2' : 'under7'
                                        }`}
                                    >
                                        {scanResult.prediction === 'over2' ? 'OVER 2' : 'UNDER 7'}
                                    </div>
                                </div>

                                <div className='ai-modal__contract-type-box'>
                                    <div className='ai-modal__contract-type-label'>Contract Type</div>
                                    <div
                                        className={`ai-modal__contract-type-value ${
                                            scanResult.prediction === 'over2' ? 'over' : 'under'
                                        }`}
                                    >
                                        {scanResult.prediction === 'over2' ? 'OVER' : 'UNDER'}
                                    </div>
                                </div>

                                <div className='ai-modal__stats'>
                                    <div className='ai-modal__stat-row'>
                                        <span className='ai-modal__stat-label'>Over 2:</span>
                                        <div className='ai-modal__stat-bar'>
                                            <div
                                                className='ai-modal__stat-fill over2'
                                                style={{
                                                    width: `${(scanResult.over2Count / scanResult.totalCount) * 100}%`,
                                                }}
                                            />
                                        </div>
                                        <span className='ai-modal__stat-value'>
                                            {Math.round((scanResult.over2Count / scanResult.totalCount) * 100)}%
                                        </span>
                                    </div>
                                    <div className='ai-modal__stat-row'>
                                        <span className='ai-modal__stat-label'>Under 7:</span>
                                        <div className='ai-modal__stat-bar'>
                                            <div
                                                className='ai-modal__stat-fill under7'
                                                style={{
                                                    width: `${(scanResult.under7Count / scanResult.totalCount) * 100}%`,
                                                }}
                                            />
                                        </div>
                                        <span className='ai-modal__stat-value'>
                                            {Math.round((scanResult.under7Count / scanResult.totalCount) * 100)}%
                                        </span>
                                    </div>
                                </div>

                                <div className='ai-modal__stake-section'>
                                    <label className='ai-modal__stake-label'>Stake Amount</label>
                                    <input
                                        type='number'
                                        min='0.1'
                                        step='0.1'
                                        value={stake}
                                        onChange={e => setStake(e.target.value)}
                                        className='ai-modal__stake-input'
                                        placeholder='Enter stake'
                                    />
                                </div>

                                <button
                                    className='ai-modal__load-btn'
                                    onClick={handleLoadStrategy}
                                    disabled={phase === 'loading'}
                                >
                                    {phase === 'loading' ? 'Loading...' : 'LOAD STRATEGY →'}
                                </button>
                            </>
                        ) : (
                            <div className='ai-modal__error'>
                                <div className='ai-modal__error-title'>No Results</div>
                                <div className='ai-modal__error-message'>No markets could be analyzed.</div>
                                <button className='ai-modal__retry-btn' onClick={() => {
                                    setPhase('scanning');
                                    runScan();
                                }}>
                                    Try Again
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIModal;
