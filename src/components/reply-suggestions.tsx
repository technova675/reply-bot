
// Reply suggestions: dynamic fetch from n8n
"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, RotateCw, Pencil, Save } from 'lucide-react';
import { getSuggestions } from '@/lib/actions'; 
import type { ReplySuggestion } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type SuggestionRowProps = {
  suggestion: { text: string };
  index: number;
  saveSuggestion: (payload: { index: number; text: string }) => Promise<{ ok: boolean; err?: string }>;
  postId: string;
};


function SuggestionRow({ suggestion, index, saveSuggestion, postId }: SuggestionRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(suggestion.text);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isLongText = suggestion.text.length > 100;
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

  const handleCancel = () => {
    setIsEditing(false);
    setEditedText(suggestion.text);
    setSaveError(null);
  };

  const handleTextClick = async () => {
    try {
      const response = await fetch('https://krishnavir.app.n8n.cloud/webhook/dfe48fe3-a1d9-464a-902d-bbad8ec939b8', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: editedText, postId: postId }),
      });

      if (response.ok) {
        toast({
          description: "Suggestion sent!",
          duration: 2000,
        });
      } else {
        toast({
          variant: "destructive",
          description: "Failed to send suggestion.",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error sending suggestion to webhook:", error);
      toast({
        variant: "destructive",
        description: "An error occurred.",
        duration: 3000,
      });
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
  }, [isEditing]);

  return (
    <div ref={wrapperRef} className="group flex cursor-pointer gap-4 rounded-lg p-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
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
            <p className={cn("text-sm transition-all duration-300 cursor-pointer", { "line-clamp-3": shouldClamp })} onClick={handleTextClick}>
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
      <div className="flex flex-col items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        {isEditing ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 cursor-pointer transition-transform duration-150 ease-in-out hover:-translate-y-0.5 focus:ring-2 focus:ring-ring"
            aria-label={`Save suggestion ${index + 1}`}
            onClick={handleSaveClick}>
            <Save size={16} />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 cursor-pointer transition-transform duration-150 ease-in-out hover:-translate-y-0.5 focus:ring-2 focus:ring-ring"
            aria-label={`Edit suggestion ${index + 1}`}
            onClick={handleEditClick}>
            <Pencil size={16} />
          </Button>
        )}
      </div>
    </div>
  );
}

type ReplySuggestionsProps = {
  postId: string;
  initialSuggestions?: ReplySuggestion[];
};


export default function ReplySuggestions({ postId, initialSuggestions = [] }: ReplySuggestionsProps) {
  const [suggestions, setSuggestions] = useState<ReplySuggestion[]>(initialSuggestions);
  const [isLoading, setIsLoading] = useState(initialSuggestions.length === 0);

  const fetchSuggestions = async () => {
    setIsLoading(true);
    const newSuggestions = await getSuggestions(postId);
    setSuggestions(newSuggestions);
    setIsLoading(false);
  };
  
  useEffect(() => {
    if (initialSuggestions.length === 0) {
      fetchSuggestions();
    }
  }, [postId, initialSuggestions.length]);

  const handleRegenerate = () => {
     fetchSuggestions();
  };

  const handleSaveSuggestion = async ({ index, text }: { index: number; text: string }): Promise<{ ok: boolean; err?: string }> => {
    // This is a placeholder for a real save operation.
    // In a real app, this would be a server action.
    console.log(`Saving suggestion ${index}: ${text}`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate a random failure
    if (Math.random() > 0.8) {
      console.error("Simulated save failure");
      return { ok: false, err: "Could not connect to the server." };
    }

    setSuggestions(currentSuggestions => 
      currentSuggestions.map((s, i) => i === index ? { ...s, text } : s)
    );
    return { ok: true };
  };

  return (
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
            suggestions && suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                    <SuggestionRow key={index} suggestion={suggestion} index={index} saveSuggestion={handleSaveSuggestion} postId={postId} />
                ))
            ) : (
                <div className="flex justify-center items-center h-full text-sm text-muted-foreground min-h-[240px]">
                    No suggestions available.
                </div>
            )
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-4">
          <p className="text-xs text-muted-foreground text-center">Generated by AI • {suggestions?.length || 0} suggestions</p>
          <Button onClick={handleRegenerate} disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : <RotateCw size={16} className="mr-2" />}
            Re-Generate
          </Button>
      </CardFooter>
    </Card>
  );
}
