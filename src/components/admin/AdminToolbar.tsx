
'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Sparkles } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export function AdminToolbar() {
    const [isVisible, setIsVisible] = useState(false);
    const { theme, typography, buttonSettings } = useTheme();

    useEffect(() => {
        if (localStorage.getItem('ADMIN_TOOLBAR') === '1') {
            setIsVisible(true);
        }
    }, []);

    const handleReloadDesign = async () => {
        try {
            const res = await fetch('/api/design-settings');
            const json = await res.json();
            if (json.ok && json.data) {
                window.dispatchEvent(new CustomEvent('design:updated', { detail: json.data }));
                console.log('AdminToolbar: Design reloaded and event dispatched.');
            }
        } catch (error) {
            console.error('Failed to reload design:', error);
        }
    };
    
    const handleReapplyCss = () => {
        window.dispatchEvent(new CustomEvent('design:updated', { 
            detail: { 
                themeColors: theme.colors, 
                typography: typography, 
                buttonSettings: buttonSettings
            } 
        }));
        console.log('AdminToolbar: CSS variables reapplied.');
    }

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 z-[100] bg-background/80 backdrop-blur-sm border rounded-lg shadow-lg p-2 flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={handleReloadDesign} title="Reload design from server">
                <RefreshCw className="h-4 w-4 mr-2"/>
                Reload
            </Button>
            <Button size="sm" variant="ghost" onClick={handleReapplyCss} title="Re-apply current CSS variables">
                <Sparkles className="h-4 w-4 mr-2" />
                Re-apply
            </Button>
        </div>
    );
}
