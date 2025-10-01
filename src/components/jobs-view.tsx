
'use client';

import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { BadgeCheck, MoreHorizontal, Siren } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const GrowgamiAvatar = () => {
    const avatar = PlaceHolderImages.find(p => p.id === 'growgami-avatar');
    if (!avatar) return null;
    return (
        <Avatar className="w-12 h-12">
            <AvatarImage src={avatar.imageUrl} alt="Growgami Avatar" />
            <AvatarFallback>G</AvatarFallback>
        </Avatar>
    )
};

const HelloThereImage = () => {
    const image = PlaceHolderImages.find(p => p.id === 'hello-there-meme');
    if (!image) return null;
    return (
         <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border">
            <Image 
                src={image.imageUrl} 
                alt="Hello There" 
                layout="fill" 
                objectFit="cover" 
                data-ai-hint={image.imageHint}
            />
        </div>
    )
};

const ChatAvatar = () => {
    const avatar = PlaceHolderImages.find(p => p.id === 'chat-avatar');
    if (!avatar) return null;
    return (
        <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0">
             <Image src={avatar.imageUrl} alt="Chat Avatar" width={32} height={32} className="rounded-full" data-ai-hint={avatar.imageHint} />
        </div>
    )
};

const ChatBubble = ({ text }: { text: string }) => (
    <div className="bg-muted text-foreground p-3 rounded-lg rounded-bl-none max-w-sm">
        <p>{text}</p>
    </div>
);

export default function JobsView() {
    return (
        <div className="p-4 border-b border-border">
            <div className="flex justify-between items-start mb-2">
                <div className="flex gap-4">
                    <GrowgamiAvatar />
                    <div>
                        <div className="flex items-center gap-1">
                            <span className="font-bold">Growgami</span>
                            <BadgeCheck className="w-4 h-4 text-primary" />
                        </div>
                        <p className="text-muted-foreground">@Growgami</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <MoreHorizontal size={20} />
                </Button>
            </div>
            
            <div className="space-y-3 mb-4">
                <p className="flex items-center gap-2">we are hiring <Siren className="w-5 h-5 text-red-500" /></p>
                <p>Growgami is looking for social media manager(s)</p>
                <p>interested in joining the team? fill out the form below</p>
            </div>

            <div className="border border-border rounded-2xl p-4 bg-card relative overflow-hidden">
                <div 
                    className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/20"
                    style={{
                        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                        transform: 'rotate(45deg)',
                    }}
                ></div>
                 <div 
                    className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10"
                    style={{
                        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                        transform: 'rotate(15deg)',
                    }}
                ></div>

                <div className="relative z-10 space-y-4">
                    <HelloThereImage />

                    <div className="space-y-3">
                        <div className="flex items-end gap-3">
                            <ChatAvatar />
                            <div className="space-y-2">
                                <ChatBubble text="hey there! welcome to growgami." />
                                <ChatBubble text="we're all about unfolding potential in web3. kinda like origami, but with growth." />
                                <ChatBubble text="before we match you with clients & work, let's get to know you a bit." />
                            </div>
                        </div>
                        <div className="flex items-end gap-3">
                             <ChatAvatar />
                            <div className="bg-muted text-foreground p-3 rounded-lg rounded-bl-none">
                                <p>ready?</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-6 py-2">
                            Let's go!
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
