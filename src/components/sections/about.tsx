
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Linkedin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getGeneralSettings, type TeamMember, type GeneralSettings } from '@/services/settings';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useEffect } from 'react';


const defaultTeam: TeamMember[] = [
  {
    name: 'Alex Andersen',
    title: 'Lead Developer & Arkitekt',
    description: 'Specialist i skalerbare systemer og komplekse integrationer. Elsker at bygge robuste løsninger.',
    imageUrl: 'https://picsum.photos/200/200?random=8',
    linkedinUrl: '#',
    aiHint: 'male portrait',
  },
  {
    name: 'Maria Jensen',
    title: 'AI & Data Specialist',
    description: 'Transformerer data til forretningsværdi gennem machine learning og intelligente automatiseringer.',
    imageUrl: 'https://picsum.photos/200/200?random=9',
    linkedinUrl: '#',
    aiHint: 'female portrait',
  },
  {
    name: 'Jesper Nielsen',
    title: 'Digital Strateg & Projektleder',
    description: 'Sikrer at teknologien understøtter forretningsmålene og at projekter leveres til tiden.',
    imageUrl: 'https://picsum.photos/200/200?random=10',
    linkedinUrl: '#',
    aiHint: 'man portrait',
  },
];

const defaultAboutText = "Digifly er et agilt konsulenthus grundlagt af erfarne teknologer med en passion for at skabe flow. Vi tror på, at de rigtige digitale løsninger kan frigøre potentiale og drive markant vækst. Vores mission er at være jeres betroede partner på den digitale rejse – fra idé til implementering og skalering.";

export default function AboutSection() {
    const isMobile = useIsMobile();
    const [settings, setSettings] = useState<GeneralSettings | null>(null);

    useEffect(() => {
        getGeneralSettings().then(setSettings);
    }, []);

    const team = settings?.teamMembers && settings.teamMembers.length > 0 ? settings.teamMembers : defaultTeam;
    const aboutText = settings?.aboutText || defaultAboutText;
    const title = settings?.aboutSectionTitle || "Hvem er Digifly?";

    const titleStyle: React.CSSProperties = {
        fontSize: settings?.aboutSectionTitleSize ? `${settings.aboutSectionTitleSize}px` : undefined,
    };
    const textStyle: React.CSSProperties = {
        fontSize: settings?.aboutTextSize ? `${settings.aboutTextSize}px` : undefined,
    };
    
    const sectionStyle: React.CSSProperties = {};
    if (settings?.sectionPadding?.about) {
        const padding = settings.sectionPadding.about;
        sectionStyle.paddingTop = `${isMobile ? padding.topMobile : padding.top}px`;
        sectionStyle.paddingBottom = `${isMobile ? padding.bottomMobile : padding.bottom}px`;
    }

    return (
        <section id="om-os" className="bg-secondary" style={sectionStyle}>
            <div className="container mx-auto max-w-7xl px-4 md:px-6">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24 items-center">
                    <div className="text-center lg:text-left">
                        <h2 
                        className={cn("text-h2 font-bold tracking-tight", settings?.aboutSectionTitleColor || "text-black")}
                        style={titleStyle}
                        >
                        {title}
                        </h2>
                        <p 
                        className={cn("mt-6 text-body", settings?.aboutTextColor || "text-muted-foreground")}
                        style={textStyle}
                        >
                        {aboutText}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-8">
                        {team.map((member) => (
                        <div key={member.name} className="flex items-start space-x-4">
                            <Avatar className="w-16 h-16 border-2 border-primary">
                            <AvatarImage src={member.imageUrl} alt={`${member.name} - ${member.title}`} data-ai-hint={member.aiHint} />
                            <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <div>
                                <h3 className="text-h3 font-semibold">{member.name}</h3>
                                <p className="text-sm text-primary">{member.title}</p>
                                </div>
                                <Button asChild variant="ghost" size="icon">
                                <Link href={member.linkedinUrl} target="_blank" aria-label={`${member.name} on LinkedIn`}>
                                    <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary" />
                                </Link>
                                </Button>
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">{member.description}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

