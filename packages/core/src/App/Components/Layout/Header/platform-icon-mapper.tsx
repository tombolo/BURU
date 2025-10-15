import React from 'react';
import { 
    CustomDerivTraderIcon, 
    CustomDerivBotIcon,
    CustomDerivTraderIconCompact,
    CustomDerivBotIconCompact 
} from './custom-platform-icons';

type PlatformIconProps = {
    icon: string;
    width?: number;
    height?: number;
    className?: string;
    description?: string;
    compact?: boolean;
};

export const PlatformIconMapper: React.FC<PlatformIconProps> = ({ 
    icon, 
    width = 120, 
    height = 25, 
    className = '',
    compact = false 
}) => {
    // Map icon names to custom icons
    const iconMap: { [key: string]: React.ReactElement } = {
        'IcRebrandingDerivTrader': compact ? (
            <CustomDerivTraderIconCompact width={width} height={height} className={className} />
        ) : (
            <CustomDerivTraderIcon width={width} height={height} className={className} />
        ),
        'IcRebrandingDerivBot': compact ? (
            <CustomDerivBotIconCompact width={width} height={height} className={className} />
        ) : (
            <CustomDerivBotIcon width={width} height={height} className={className} />
        ),
    };

    // Return custom icon if available, otherwise return a fallback
    return iconMap[icon] || (
        <div className={`platform-icon-fallback ${className}`} style={{ width, height }}>
            <span>{icon}</span>
        </div>
    );
};

// Helper function to check if icon should use custom component
export const shouldUseCustomIcon = (iconName: string): boolean => {
    return iconName === 'IcRebrandingDerivTrader' || iconName === 'IcRebrandingDerivBot';
};

export default PlatformIconMapper;

