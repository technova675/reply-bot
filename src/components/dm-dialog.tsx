
'use client';

import { useState } from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send } from 'lucide-react';
import type { Job } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

type DmDialogProps = {
  job: Job;
  onSendDM: (jobId: string, dmText: string) => Promise<boolean | void>;
  isSending: boolean;
  onDmSent: () => void;
};

export default function DmDialog({ job, onSendDM, isSending, onDmSent }: DmDialogProps) {
  const [dmText, setDmText] = useState('');
  const { toast } = useToast();

  const handleSend = async () => {
    if (!dmText.trim()) {
      toast({
        variant: 'destructive',
        description: 'Message cannot be empty.',
      });
      return;
    }
    const success = await onSendDM(job.id, dmText);
    if (success) {
      onDmSent(); // Close the dialog on success
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Send DM to {job.userData.name}</DialogTitle>
        <DialogDescription>
          Craft your message below. Click send when you're ready.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Textarea
          id="dm-message"
          placeholder={`Type your message to @${job.userData.url.split('/').pop() || ''}...`}
          className="col-span-3 min-h-[120px]"
          value={dmText}
          onChange={(e) => setDmText(e.target.value)}
          disabled={isSending}
        />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="secondary" disabled={isSending}>
            Cancel
          </Button>
        </DialogClose>
        <Button onClick={handleSend} disabled={isSending || !dmText.trim()}>
          {isSending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          Send
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
