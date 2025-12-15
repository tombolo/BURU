import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { LabelPairedFileArrowDownCaptionRegularIcon } from '@deriv/quill-icons/LabelPaired';
import { LabelPairedMoonCaptionRegularIcon } from '@deriv/quill-icons/LabelPaired';
import { LabelPairedExclamationCaptionRegularIcon } from '@deriv/quill-icons/LabelPaired';
import './freebots.scss';

const FreeBots = observer(() => {
    const { load_modal, dashboard } = useStore();
    const { handleFileChange } = load_modal;
    const [loadingBotId, setLoadingBotId] = useState<number | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);

    // Bot files mapping with empty strings (will be populated with actual content when loaded)
    const botXmlMap: Record<string, string> = {
        // Hurmy Bots
        'hurmy/BeginnersBestBotV1.xml': '',
        'hurmy/Dollardispenser.xml': '',
        'hurmy/HITnRUNPRO.xml': '',
        'hurmy/MarketExecutorAI.xml': '',
        'hurmy/PrinteddollarsBot.xml': '',
        'hurmy/RECOVERYAUTORobot.xml': '',
        
        // Legacy Bots
        'legacy/AUTO102BYLEGACYHUB.xml': '',
        'legacy/EVENEVEN_ODDODDBot.xml': '',
        'legacy/EnhancedAutoSwitchOver2bot.xml': '',
        'legacy/ODDODDEVENEVENBOT.xml': '',
        'legacy/OVERDESTROYERBYLEGACY.xml': '',
        'legacy/Under7_8_AIBOT.xml': '',
        'legacy/UnderoverAutoswitch.xml': '',
        'legacy/legacyQ1.xml': '',
        'legacy/legacyv1speedbot.xml': '',
        'legacy/stakelist101.xml': '',
        
        // Master Bots
        'master/AUTOV1BYSTATESFX.xml': '',
        'master/Derivwizard.xml': '',
        'master/ENHANCEDV1BYSTATEFX.xml': '',
        'master/MasterG8ByStateFx.xml': '',
        'master/Metrov4EvenandOddDigitBotUpdated.xml': '',
        'master/OVERDESTROYERBYSTATEFX.xml': '',
        'master/STATEHNR.xml': '',
        'master/STATEXV1.xml': '',
        'master/V4EvenandOddDigitBot.xml': ''
    };

    const bots = [
        // Hurmy Bots
        { number: 1, name: 'Beginners Best Bot V1', file: 'hurmy/BeginnersBestBotV1.xml', description: 'Perfect for beginners, this bot offers a balanced approach to trading.', icon: '1' },
        { number: 2, name: 'Dollar Dispenser', file: 'hurmy/Dollardispenser.xml', description: 'Automated trading bot focused on consistent profit generation.', icon: '2' },
        { number: 3, name: 'HITnRUN PRO', file: 'hurmy/HITnRUNPRO.xml', description: 'Quick in-and-out trading strategy for fast market movements.', icon: '3' },
        { number: 4, name: 'Market Executor AI', file: 'hurmy/MarketExecutorAI.xml', description: 'AI-powered trading bot that executes trades based on market conditions.', icon: '4' },
        { number: 5, name: 'Printed Dollars Bot', file: 'hurmy/PrinteddollarsBot.xml', description: 'Consistent profit strategy with built-in risk management.', icon: '5' },
        { number: 6, name: 'Recovery Auto Robot', file: 'hurmy/RECOVERYAUTORobot.xml', description: 'Specialized bot for recovery strategies after losses.', icon: '6' },
        
        // Legacy Bots
        { number: 7, name: 'AUTO 102 Legacy', file: 'legacy/AUTO102BYLEGACYHUB.xml', description: 'Legacy auto-trading bot with proven 102 strategy.', icon: '7' },
        { number: 8, name: 'Even/Odd Pattern Bot', file: 'legacy/EVENEVEN_ODDODDBot.xml', description: 'Trading bot focusing on even/odd number patterns.', icon: '8' },
        { number: 9, name: 'Enhanced Auto Switch', file: 'legacy/EnhancedAutoSwitchOver2bot.xml', description: 'Advanced switching strategy between different trading approaches.', icon: '9' },
        { number: 10, name: 'Odd/Even Pattern Bot', file: 'legacy/ODDODDEVENEVENBOT.xml', description: 'Specialized in odd/even number pattern recognition.', icon: '10' },
        { number: 11, name: 'Over Destroyer', file: 'legacy/OVERDESTROYERBYLEGACY.xml', description: 'Aggressive strategy for over/under market conditions.', icon: '11' },
        { number: 12, name: 'Under 7/8 AI Bot', file: 'legacy/Under7_8_AIBOT.xml', description: 'AI-powered bot for under 7/8 digit options.', icon: '12' },
        { number: 13, name: 'Under/Over Auto Switch', file: 'legacy/UnderoverAutoswitch.xml', description: 'Automatically switches between under/over strategies.', icon: '13' },
        { number: 14, name: 'Legacy Q1', file: 'legacy/legacyQ1.xml', description: 'First quarter legacy strategy bot.', icon: '14' },
        { number: 15, name: 'Legacy Speed Bot', file: 'legacy/legacyv1speedbot.xml', description: 'High-speed trading from the legacy collection.', icon: '15' },
        { number: 16, name: 'Stake List 101', file: 'legacy/stakelist101.xml', description: 'Advanced staking strategy with 101 variations.', icon: '16' },
        
        // Master Bots
        { number: 17, name: 'AUTO V1 State FX', file: 'master/AUTOV1BYSTATESFX.xml', description: 'State-based FX trading automation.', icon: '17' },
        { number: 18, name: 'Deriv Wizard', file: 'master/Derivwizard.xml', description: 'Advanced trading strategies for derivative markets.', icon: '18' },
        { number: 19, name: 'Enhanced V1 State FX', file: 'master/ENHANCEDV1BYSTATEFX.xml', description: 'Enhanced version of state-based FX trading.', icon: '19' },
        { number: 20, name: 'Master G8', file: 'master/MasterG8ByStateFx.xml', description: 'Premium G8 currency trading strategy.', icon: '20' },
        { number: 21, name: 'Metro V4 Even/Odd', file: 'master/Metrov4EvenandOddDigitBotUpdated.xml', description: 'Updated version of the popular even/odd strategy.', icon: '21' },
        { number: 22, name: 'Over Destroyer State FX', file: 'master/OVERDESTROYERBYSTATEFX.xml', description: 'State-based over/under trading strategy.', icon: '22' },
        { number: 23, name: 'State HNR', file: 'master/STATEHNR.xml', description: 'State-based hit and run trading strategy.', icon: '23' },
        { number: 24, name: 'State XV1', file: 'master/STATEXV1.xml', description: 'Experimental V1 state trading strategy.', icon: '24' },
        { number: 25, name: 'V4 Even/Odd Digit Bot', file: 'master/V4EvenandOddDigitBot.xml', description: 'Version 4 of the even/odd digit trading bot.', icon: '25' }
    ];

    const handleBotSelect = async (filename: string, botIndex: number) => {
        setLoadError(null);
        setLoadingBotId(botIndex);
        dashboard.setActiveTab(1);

        try {
            // Dynamically import the XML file from free-bots directory
            const xmlModule = await import(`../free-bots/${filename}`);
            const xmlContent = xmlModule.default;

            if (!xmlContent) {
                throw new Error(`XML content not found for ${filename}`);
            }

            let attempts = 0;
            const maxAttempts = 50;

            const tryLoadBot = () => {
                if (!window.Blockly?.derivWorkspace) {
                    attempts++;
                    if (attempts > maxAttempts) {
                        setLoadError('Blockly workspace not available after multiple attempts');
                        setLoadingBotId(null);
                        return;
                    }
                    setTimeout(tryLoadBot, 100);
                    return;
                }

                try {
                    if (!xmlContent.includes('<xml') || !xmlContent.includes('</xml>')) {
                        throw new Error('Invalid XML format');
                    }

                    window.Blockly.derivWorkspace.asyncClear();
                    const xml = window.Blockly.utils.xml.textToDom(xmlContent);
                    window.Blockly.Xml.domToWorkspace(xml, window.Blockly.derivWorkspace);
                    window.Blockly.derivWorkspace.strategy_to_load = xmlContent;
                    window.Blockly.derivWorkspace.cleanUp();
                    console.log(`Successfully loaded bot: ${filename}`);
                    setLoadingBotId(null);
                } catch (error) {
                    console.error('Error loading bot:', error);
                    setLoadError(`Failed to load bot: ${error instanceof Error ? error.message : 'Unknown error'}`);
                    setLoadingBotId(null);
                }
            };

            tryLoadBot();
        } catch (error) {
            console.error('Error importing XML file:', error);
            setLoadError(`Could not load bot: XML file "${filename}" not found`);
            setLoadingBotId(null);
        }
    };

    useEffect(() => {
        const cards = document.querySelectorAll('.free-bots__card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                (card as HTMLElement).style.opacity = '1';
                (card as HTMLElement).style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }, []);

    return (
        <div className='free-bots'>
            
            {loadError && (
                <div className='free-bots__error-message'>
                    <LabelPairedExclamationCaptionRegularIcon height='20px' width='20px' fill='var(--status-danger)' />
                    <span>{loadError}</span>
                </div>
            )}
            <div className='free-bots__scroll-container'>
                <div className='bot-list-container'>
                    <div className='free-bots__grid'>
                        {bots.map((bot, index) => (
                            <div
                                key={index}
                                className='free-bots__card premium'
                                style={{
                                    opacity: 0,
                                    transform: 'translateY(20px)',
                                    transition: 'all 0.4s ease-out',
                                }}
                            >
                                <div className='premium-tag'>
                                    <span>PREMIUM</span>
                                    <div className='premium-glow'></div>
                                </div>
                                <div className='free-bots__card-icon'>{bot.number}</div>
                                <div className='free-bots__card-content'>
                                    <h3>{bot.name}</h3>
                                    <p>{bot.description}</p>
                                    <button
                                        className={`free-bots__download-btn ${loadingBotId === index ? 'loading' : ''}`}
                                        onClick={() => handleBotSelect(bot.file, index)}
                                        disabled={loadingBotId !== null}
                                    >
                                        {loadingBotId === index ? (
                                            <span>Loading...</span>
                                        ) : (
                                            <>
                                                <LabelPairedFileArrowDownCaptionRegularIcon height='16px' width='16px' />
                                                <span>Load Bot</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default FreeBots;