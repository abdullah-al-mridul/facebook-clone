
'use client';

import { Button } from "@/components/ui/button";

const ProfileTab = ({ 
    children, 
    active = false,
    onClick
}: { 
    children: React.ReactNode, 
    active?: boolean,
    onClick: () => void;
}) => (
    <Button 
        variant="ghost" 
        onClick={onClick}
        className={`font-semibold text-base h-full py-4 px-4 rounded-none relative ${active ? 'text-primary' : 'text-muted-foreground'}`}
    >
        {children}
        {active && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary"></div>}
    </Button>
)

type ProfileTabsProps = {
    activeTab: string;
    onTabChange: (tab: string) => void;
};

export default function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
    const tabs = ['Posts', 'About', 'Friends', 'Photos'];
    
    return (
        <div className="px-4 border-t">
            <div className="flex items-center">
                {tabs.map(tab => (
                    <ProfileTab 
                        key={tab} 
                        active={activeTab === tab} 
                        onClick={() => onTabChange(tab)}
                    >
                        {tab}
                    </ProfileTab>
                ))}
            </div>
        </div>
    )
}
