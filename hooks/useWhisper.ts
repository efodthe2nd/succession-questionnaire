'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

// Status types
type ModelStatus = 'idle' | 'loading' | 'ready' | 'error' | 'fallback';
type RecordingStatus = 'idle' | 'recording' | 'transcribing';

interface UseWhisperOptions {
  onTranscript?: (text: string) => void;
}

interface UseWhisperReturn {
  isRecording: boolean;
  isTranscribing: boolean;
  isModelLoading: boolean;
  isModelReady: boolean;
  modelLoadProgress: number;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>;
  loadModel: () => Promise<void>;
}

// Global model instance
let whisperPipeline: any = null;
let modelLoadPromise: Promise<any> | null = null;
let useWebSpeechFallback = false;

// Web Speech API types
interface WhisperSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((ev: Event) => void) | null;
  onend: ((ev: Event) => void) | null;
  onresult: ((ev: any) => void) | null;
  onerror: ((ev: any) => void) | null;
}

export function useWhisper(options: UseWhisperOptions = {}): UseWhisperReturn {
  const { onTranscript } = options;

  const [modelStatus, setModelStatus] = useState<ModelStatus>(
    whisperPipeline ? 'ready' : useWebSpeechFallback ? 'fallback' : 'idle'
  );
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>('idle');
  const [modelLoadProgress, setModelLoadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // For Whisper
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // For Web Speech fallback
  const recognitionRef = useRef<WhisperSpeechRecognition | null>(null);
  const accumulatedTextRef = useRef<string>('');
  const shouldRestartRef = useRef<boolean>(false);

  // Load Whisper model with fallback
  const loadModel = useCallback(async () => {
    if (whisperPipeline) {
      setModelStatus('ready');
      return;
    }

    if (useWebSpeechFallback) {
      setModelStatus('fallback');
      return;
    }

    if (modelLoadPromise) {
      try {
        await modelLoadPromise;
        setModelStatus('ready');
      } catch {
        // Will fall back to Web Speech
      }
      return;
    }

    setModelStatus('loading');
    setModelLoadProgress(0);
    setError(null);

    try {
      modelLoadPromise = (async () => {
        const transformers = await import('@huggingface/transformers');
        const transcriber = await transformers.pipeline(
          'automatic-speech-recognition',
          'onnx-community/whisper-tiny.en',
          {
            dtype: 'fp32',
            device: 'wasm',
            progress_callback: (progress: any) => {
              if (progress.status === 'progress' && typeof progress.progress === 'number') {
                setModelLoadProgress(Math.round(progress.progress));
              } else if (progress.status === 'done') {
                setModelLoadProgress(100);
              }
            },
          }
        );
        return transcriber;
      })();

      whisperPipeline = await modelLoadPromise;
      setModelStatus('ready');
      setModelLoadProgress(100);
    } catch (err) {
      console.error('Failed to load Whisper, falling back to Web Speech API:', err);
      useWebSpeechFallback = true;
      modelLoadPromise = null;

      // Check if Web Speech API is available
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        setModelStatus('fallback');
        setModelLoadProgress(100);
      } else {
        setError('Speech recognition is not supported in this browser.');
        setModelStatus('error');
      }
    }
  }, []);

  // Start Web Speech recording with auto-restart on pause
  const startWebSpeechRecording = useCallback(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setError('Speech recognition not supported');
      return;
    }

    const recognition = new SpeechRecognitionAPI() as WhisperSpeechRecognition;
    recognitionRef.current = recognition;
    accumulatedTextRef.current = '';
    shouldRestartRef.current = true;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setRecordingStatus('recording');
    };

    recognition.onend = () => {
      // Auto-restart if we should still be recording
      if (shouldRestartRef.current && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // Ignore errors on restart
        }
      } else {
        setRecordingStatus('idle');
        // Send final accumulated text
        if (accumulatedTextRef.current.trim() && onTranscript) {
          onTranscript(accumulatedTextRef.current.trim());
        }
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') {
        // Auto-restart on no speech
        if (shouldRestartRef.current && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            // Ignore
          }
        }
      } else if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone access.');
        shouldRestartRef.current = false;
        setRecordingStatus('idle');
      }
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        }
      }

      if (finalTranscript) {
        accumulatedTextRef.current += finalTranscript;
      }
    };

    recognition.start();
  }, [onTranscript]);

  // Stop Web Speech recording
  const stopWebSpeechRecording = useCallback((): Promise<string | null> => {
    return new Promise((resolve) => {
      shouldRestartRef.current = false;

      if (recognitionRef.current) {
        const finalText = accumulatedTextRef.current.trim();
        recognitionRef.current.stop();
        recognitionRef.current = null;

        if (finalText && onTranscript) {
          onTranscript(finalText);
        }

        resolve(finalText);
      } else {
        resolve(null);
      }
    });
  }, [onTranscript]);

  // Start recording (Whisper or Web Speech)
  const startRecording = useCallback(async () => {
    setError(null);

    // Load model if not ready
    if (!whisperPipeline && !useWebSpeechFallback) {
      await loadModel();
    }

    // Use Web Speech fallback
    if (useWebSpeechFallback || modelStatus === 'fallback') {
      startWebSpeechRecording();
      return;
    }

    // Use Whisper
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/mp4';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(1000);
      setRecordingStatus('recording');
    } catch (err: any) {
      console.error('Failed to start recording:', err);
      if (err.name === 'NotAllowedError') {
        setError('Microphone access denied. Please allow microphone access.');
      } else {
        setError('Failed to start recording. Please check your microphone.');
      }
    }
  }, [loadModel, modelStatus, startWebSpeechRecording]);

  // Stop recording (Whisper or Web Speech)
  const stopRecording = useCallback(async (): Promise<string | null> => {
    // Web Speech fallback
    if (useWebSpeechFallback || modelStatus === 'fallback') {
      return stopWebSpeechRecording();
    }

    // Whisper
    if (!mediaRecorderRef.current || recordingStatus !== 'recording') {
      return null;
    }

    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current!;

      mediaRecorder.onstop = async () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }

        setRecordingStatus('transcribing');

        try {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: mediaRecorder.mimeType
          });

          if (!whisperPipeline) {
            throw new Error('Model not loaded');
          }

          const audioUrl = URL.createObjectURL(audioBlob);
          const result = await whisperPipeline(audioUrl, {
            chunk_length_s: 30,
            stride_length_s: 5,
            return_timestamps: false,
          });
          URL.revokeObjectURL(audioUrl);

          const transcript = result.text?.trim() || '';

          if (transcript && onTranscript) {
            onTranscript(transcript);
          }

          setRecordingStatus('idle');
          resolve(transcript);
        } catch (err) {
          console.error('Transcription failed:', err);
          setError('Failed to transcribe. Please try again.');
          setRecordingStatus('idle');
          resolve(null);
        }
      };

      mediaRecorder.stop();
    });
  }, [recordingStatus, onTranscript, modelStatus, stopWebSpeechRecording]);

  // Cleanup
  useEffect(() => {
    return () => {
      shouldRestartRef.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  return {
    isRecording: recordingStatus === 'recording',
    isTranscribing: recordingStatus === 'transcribing',
    isModelLoading: modelStatus === 'loading',
    isModelReady: modelStatus === 'ready' || modelStatus === 'fallback',
    modelLoadProgress,
    error,
    startRecording,
    stopRecording,
    loadModel,
  };
}
