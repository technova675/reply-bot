"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type DebugDrawerProps = {
  data: any;
};

export default function DebugDrawer({ data }: DebugDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '~') {
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="bg-card/95 backdrop-blur-sm max-h-[40vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-headline text-lg">Debug / Data</CardTitle>
          <div className="flex items-center space-x-2">
            <Label htmlFor="debug-toggle">Close</Label>
            <Switch
              id="debug-toggle"
              checked={isOpen}
              onCheckedChange={setIsOpen}
              aria-label="Toggle debug drawer"
            />
          </div>
        </CardHeader>
        <CardContent>
          <pre className="text-xs whitespace-pre-wrap">
            {JSON.stringify(data, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
