import React, { useState, useRef } from 'react'; // Import useState, useRef
import { Send, Loader2, Mic, Square } from 'lucide-react'; // Import Mic, Square icons
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { experimental_transcribe as transcribe } from 'ai'; // Import transcribe
import {  createElevenLabs } from '@ai-sdk/elevenlabs'; // Import elevenlabs provider

interface ChatInputFormProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  stop: () => void;
  setInput: (value: string) => void; // Add setInput prop
}

export function ChatInputForm({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  stop,
  setInput, // Destructure setInput
}: ChatInputFormProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false); // State for transcription loading
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // --- Audio Recording Logic ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = []; // Clear previous chunks

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' }); // Or appropriate type
        handleTranscription(audioBlob);
        // Clean up stream tracks
        stream.getTracks().forEach(track => track.stop()); 
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      // Handle error (e.g., show a message to the user)
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsTranscribing(true); // Indicate transcription is starting
    }
  };

  // --- Transcription Logic ---
  const handleTranscription = async (audioBlob: Blob) => {
    try {
      // Convert Blob to Uint8Array
      const audioArrayBuffer = await audioBlob.arrayBuffer();
      const audio = new Uint8Array(audioArrayBuffer);

      // Configure ElevenLabs provider (API key is usually set via environment variable)
      // You can also pass the apiKey directly here if needed:
      const elevenlabs = createElevenLabs({ apiKey: process.env.ELEVENLABS_API_KEY || 'sk_a78bcaeef9f36c278bda533009bf76c5867c0b55fdb55fdc' });
      // Ensure ELEVENLABS_API_KEY environment variable is set (.env.local)
      const transcriptionProvider = elevenlabs.transcription('scribe_v1');

      const { text } = await transcribe({
        model: transcriptionProvider,
        audio: audio,
        // Optional provider options:
        // providerOptions: { elevenlabs: { languageCode: 'en' } }, 
      });

      setInput(text); // Set the input field with the transcribed text

    } catch (error) {
      console.error("Error during transcription:", error);
      // Handle transcription error (e.g., show a message)
    } finally {
      setIsTranscribing(false); // Transcription finished (success or error)
    }
  };

  // Toggle recording state
  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="border-t p-4">
      {isLoading && (
        <div className="mb-2 flex justify-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => stop()}
            aria-label="Stop generating response"
          >
            <svg
              className="mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="6" y="6" width="12" height="12" />
            </svg>
            Stop Generating
          </Button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={handleInputChange}
          disabled={isLoading}
          className="flex-1"
          aria-label="Chat message input"
        />
        {/* Microphone Button */}
        <Button 
          type="button" 
          size="icon" 
          variant={isRecording ? "destructive" : "outline"} 
          onClick={handleMicClick} 
          disabled={isLoading || isTranscribing} // Disable while loading response or transcribing
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          {isTranscribing ? (
            <Loader2 className="h-4 w-4 animate-spin" /> // Show loader during transcription
          ) : isRecording ? (
            <Square className="h-4 w-4" /> // Stop icon
          ) : (
            <Mic className="h-4 w-4" /> // Mic icon
          )}
        </Button>
        {/* Send Button */}
        <Button 
          type="submit" 
          size="icon" 
          disabled={isLoading || isRecording || isTranscribing} // Disable while loading, recording, or transcribing
          aria-label="Send message"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
}
