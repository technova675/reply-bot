
// Reply suggestions: dynamic fetch from n8n
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, RotateCw, Pencil, Save, Send, History, ArrowRight } from 'lucide-react';
import { getSuggestions } from '@/lib/actions'; 
import type { ReplySuggestion } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type SuggestionRowProps = {
  suggestionText: string;
  index: number;
  saveSuggestion: (payload: { index: number; text: string }) => Promise<{ ok: boolean; err?: string }>;
  postId: string;
  userName: string;
  setIsSendingReply: (isSending: boolean) => void;
  onReplySent: () => void;
};


function SuggestionRow({ suggestionText, index, saveSuggestion, postId, userName, setIsSendingReply, onReplySent }: SuggestionRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(suggestionText);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isLongText = suggestionText.length > 100;
  const shouldClamp = isLongText && !isExpanded && !isEditing;

  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus();
      textareaRef.current?.select();
    }
  }, [isEditing]);
  
  useEffect(() => {
    setEditedText(suggestionText);
    setIsEditing(false);
  }, [suggestionText]);

  const handleSaveClick = async () => {
    if (!editedText.trim()) {
      setSaveError("Suggestion cannot be empty.");
      return;
    }
    setSaveError(null);

    const result = await saveSuggestion({ index, text: editedText });
    if (result.ok) {
      setIsEditing(false);
      toast({
        description: "Suggestion saved!",
        duration: 2000,
      });
    } else {
      setSaveError(result.err || "Save failed");
    }
  };

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditedText(suggestionText);
    setSaveError(null);
  }, [suggestionText]);

  const handleSendClick = async () => {
    setIsSendingReply(true);

    try {
      const response = await fetch('https://krishnavir.app.n8n.cloud/webhook/dfe48fe3-a1d9-464a-902d-bbad8ec939b8', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: editedText, postId: postId, userName: userName }),
      });

      if (response.ok) {
        toast({
          description: "Suggestion sent!",
          duration: 2000,
        });
        onReplySent(); // Triggers re-fetch on the parent page
      } else {
        toast({
          variant: "destructive",
          description: "Failed to send suggestion.",
          duration: 3000,
        });
        setIsSendingReply(false); // Hide loader on failure
      }
    } catch (error) {
      console.error("Error sending suggestion to webhook:", error);
      toast({
        variant: "destructive",
        description: "An error occurred.",
        duration: 3000,
      });
      setIsSendingReply(false); // Hide loader on error
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        if (isEditing) handleCancel();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isEditing) {
        handleCancel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEditing, handleCancel]);

  return (
    <div ref={wrapperRef} className="group flex gap-4 rounded-lg p-2 transition-all duration-200">
      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-primary/20 text-sm font-bold text-primary">{index + 1}</div>
      <div className="flex-1">
        {isEditing ? (
          <div className="flex flex-col">
            <Textarea
              ref={textareaRef}
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="text-sm"
              rows={3}
            />
            {saveError && <p className="text-xs text-destructive mt-1">{saveError}</p>}
          </div>
        ) : (
          <>
            <p className={cn("text-sm transition-all duration-300", { "line-clamp-3": shouldClamp })}>
              {editedText}
            </p>
            {isLongText && (
              <Button variant="link" size="sm" className="px-0 h-auto text-primary" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? 'Show less' : 'Show more'}
              </Button>
            )}
          </>
        )}
      </div>
      <div className="flex flex-row items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {isEditing ? (
            <Tooltip>
              <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 cursor-pointer transition-transform duration-150 ease-in-out hover:-translate-y-0.5 focus:ring-2 focus:ring-ring"
                    aria-label={`Save suggestion ${index + 1}`}
                    onClick={handleSaveClick}>
                    <Save size={16} />
                  </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save</p>
              </TooltipContent>
            </Tooltip>
        ) : (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 cursor-pointer transition-transform duration-150 ease-in-out hover:-translate-y-0.5 focus:ring-2 focus:ring-ring"
                  aria-label={`Send suggestion ${index + 1}`}
                  onClick={handleSendClick}>
                  <Send size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reply</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 cursor-pointer transition-transform duration-150 ease-in-out hover:-translate-y-0.5 focus:ring-2 focus:ring-ring"
                  aria-label={`Edit suggestion ${index + 1}`}
                  onClick={handleEditClick}>
                  <Pencil size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit</p>
              </TooltipContent>
            </Tooltip>
          </>
        )}
      </div>
    </div>
  );
}

type ReplySuggestionsProps = {
  postId: string;
  userName: string;
  setIsSendingReply: (isSending: boolean) => void;
  onReplySent: () => void;
};


export default function ReplySuggestions({ postId, userName, setIsSendingReply, onReplySent }: ReplySuggestionsProps) {
  const [suggestionHistory, setSuggestionHistory] = useState<ReplySuggestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSuggestions = useCallback(async () => {
    if (!userName) return;
    setIsLoading(true);
    try {
        const newSuggestions = await getSuggestions(postId, userName);
        setSuggestionHistory(newSuggestions);
        setCurrentIndex(0);
    } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        setSuggestionHistory([]);
    } finally {
        setIsLoading(false);
    }
  }, [postId, userName]);
  
  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  const handleRegenerate = () => {
     fetchSuggestions();
  };

  const handlePrevious = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % suggestionHistory.length);
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  const handleSaveSuggestion = async ({ index, text }: { index: number; text: string }): Promise<{ ok: boolean; err?: string }> => {
    console.log(`Saving suggestion ${index}: ${text}`);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (Math.random() > 0.8) {
      console.error("Simulated save failure");
      return { ok: false, err: "Could not connect to the server." };
    }

    setSuggestionHistory(currentHistory => {
        const newHistory = [...currentHistory];
        const currentBatch = newHistory[currentIndex];
        if (currentBatch && currentBatch.content) {
            const newContent = [...currentBatch.content];
            newContent[index] = text;
            newHistory[currentIndex] = { ...currentBatch, content: newContent };
        }
        return newHistory;
    });

    return { ok: true };
  };

  const currentSuggestions = suggestionHistory[currentIndex]?.content || [];

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold font-headline">Reply Suggestions</CardTitle>
          <CardDescription>AI-powered suggestions for your reply</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 min-h-[240px]">
          {isLoading ? (
              <div className="flex justify-center items-center h-full min-h-[240px]">
                  <Loader2 className="animate-spin text-muted-foreground" size={24} />
              </div>
          ) : (
              currentSuggestions.length > 0 ? (
                  currentSuggestions.map((suggestionText, index) => (
                      <SuggestionRow 
                        key={`${currentIndex}-${index}`} 
                        suggestionText={suggestionText} 
                        index={index} 
                        saveSuggestion={handleSaveSuggestion} 
                        postId={postId} 
                        userName={userName}
                        setIsSendingReply={setIsSendingReply}
                        onReplySent={onReplySent}
                      />
                  ))
              ) : (
                  <div className="flex justify-center items-center h-full text-sm text-muted-foreground min-h-[240px]">
                      No suggestions available.
                  </div>
              )
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-4">
            <p className="text-xs text-muted-foreground text-center">Generated by AI • {currentSuggestions?.length || 0} suggestions</p>
            <div className="flex gap-2">
                {suggestionHistory.length >= 2 && (
                    <Button onClick={handlePrevious} variant="outline" disabled={isLoading || currentIndex === suggestionHistory.length - 1}>
                      <History size={16} className="mr-2" />
                      Previous
                    </Button>
                )}
                <Button onClick={handleRegenerate} disabled={isLoading} className="flex-grow">
                  {isLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : <RotateCw size={16} className="mr-2" />}
                  Re-Generate
                </Button>
                 {suggestionHistory.length >= 2 && (
                    <Button onClick={handleNext} variant="outline" disabled={isLoading || currentIndex === 0}>
                      Next
                      <ArrowRight size={16} className="ml-2" />
                    </Button>
                )}
            </div>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}
