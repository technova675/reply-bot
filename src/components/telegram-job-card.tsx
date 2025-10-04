
'use client';

import { useState, useEffect } from 'react';
import type { TelegramJob } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Building, MapPin, DollarSign, Calendar, ArrowRight, ExternalLink, CalendarDays } from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';

type TelegramJobCardProps = {
  job: TelegramJob;
};

const InfoRow = ({ icon: Icon, text }: { icon: React.ElementType, text: string | undefined }) => {
    if (!text) return null;
    return (
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span>{text}</span>
        </div>
    );
};

export default function TelegramJobCard({ job }: TelegramJobCardProps) {
  const { Job_Title, Company_Name, Job_Location, Job_Salary, Apply_link, date, Application_Deadline, display_url } = job;
  const [timeAgo, setTimeAgo] = useState('');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    if (date) {
      try {
        const parsedDate = new Date(date);
        setTimeAgo(formatDistanceToNowStrict(parsedDate, { addSuffix: true }));
      } catch (error) {
        console.error("Error formatting date for Telegram Job:", error);
      }
    }
    if (Application_Deadline) {
      try {
        const parsedDate = new Date(Application_Deadline);
        setDeadline(`Apply by ${parsedDate.toLocaleDateString()}`);
      } catch (error) {
        console.error("Error formatting application deadline:", error);
      }
    }
  }, [date, Application_Deadline]);

  // The Job_Title often contains markdown for bolding (**), let's remove it for clean display.
  const cleanJobTitle = Job_Title.replace(/\*\*/g, '');

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-lg">
                <Briefcase className="w-6 h-6" />
            </div>
            <div className="flex-1">
                 <CardTitle className="text-lg font-bold leading-tight">{cleanJobTitle}</CardTitle>
                 <p className="text-sm text-muted-foreground mt-1">{Company_Name}</p>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <InfoRow icon={MapPin} text={Job_Location} />
        <InfoRow icon={DollarSign} text={Job_Salary} />
        <InfoRow icon={CalendarDays} text={deadline} />
        {timeAgo && <InfoRow icon={Calendar} text={`Posted ${timeAgo}`} />}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button asChild className="w-full">
            <a href={Apply_link} target="_blank" rel="noopener noreferrer">
                Apply Now <ArrowRight className="ml-2 h-4 w-4" />
            </a>
        </Button>
        {display_url && (
            <Button asChild variant="outline" className="w-full sm:w-auto">
                <a href={display_url} target="_blank" rel="noopener noreferrer" aria-label="View original job posting">
                   <ExternalLink className="h-4 w-4" />
                </a>
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
