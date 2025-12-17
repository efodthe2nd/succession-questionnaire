'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

// Whisper model status
type ModelStatus = 'idle' | 'loading' | 'ready' | 'error';
type RecordingStatus = 'idle' | 'recording' | 'transcribing';

interface UseWhisperOptions {
  onTranscript?: (text: string) => void;
  appendToExisting?: boolean;
}

interface UseWhisperReturn {
  // States
  isRecording: boolean;
  isTranscribing: boolean;
  isModelLoading: boolean;
  isModelReady: boolean;
  modelLoadProgress: number;
  error: string | null;

  // Actions
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>;
  loadModel: () => Promise<void>;
}

// Global model instance (shared across all hook instances)
let whisperPipeline: any = null;
let modelLoadPromise: Promise<any> | null = null;

export function useWhisper(options: UseWhisperOptions = {}): UseWhisperReturn {
  const { onTranscript } = options;

  const [modelStatus, setModelStatus] = useState<ModelStatus>(whisperPipeline ? 'ready' : 'idle');
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>('idle');
  const [modelLoadProgress, setModelLoadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Load the Whisper model
  const loadModel = useCallback(async () => {
    if (whisperPipeline) {
      setModelStatus('ready');
      return;
    }

    if (modelLoadPromise) {
      try {
        await modelLoadPromise;
        setModelStatus('ready');
      } catch {
        // Error already handled
      }
      return;
    }

    setModelStatus('loading');
    setModelLoadProgress(0);
    setError(null);

    try {
      modelLoadPromise = (async () => {
        // Dynamic import to avoid SSR issues
        const transformers = await import('@huggingface/transformers');

        // Use whisper-tiny for faster loading (~40MB)
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
      console.error('Failed to load Whisper model:', err);
      setError('Failed to load speech recognition model. Please try again.');
      setModelStatus('error');
      modelLoadPromise = null;
    }
  }, []);

  // Start recording audio
  const startRecording = useCallback(async () => {
    setError(null);

    // Load model if not ready
    if (!whisperPipeline) {
      await loadModel();
    }

    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });
      streamRef.current = stream;

      // Create MediaRecorder
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

      mediaRecorder.start(1000); // Collect data every second
      setRecordingStatus('recording');
    } catch (err: any) {
      console.error('Failed to start recording:', err);
      if (err.name === 'NotAllowedError') {
        setError('Microphone access was denied. Please allow microphone access to use voice input.');
      } else {
        setError('Failed to start recording. Please check your microphone.');
      }
    }
  }, [loadModel]);

  // Stop recording and transcribe
  const stopRecording = useCallback(async (): Promise<string | null> => {
    if (!mediaRecorderRef.current || recordingStatus !== 'recording') {
      return null;
    }

    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current!;

      mediaRecorder.onstop = async () => {
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }

        setRecordingStatus('transcribing');

        try {
          // Create audio blob
          const audioBlob = new Blob(audioChunksRef.current, {
            type: mediaRecorder.mimeType
          });

          if (!whisperPipeline) {
            throw new Error('Model not loaded');
          }

          // Convert blob to URL for the pipeline
          const audioUrl = URL.createObjectURL(audioBlob);

          // Transcribe with Whisper
          const result = await whisperPipeline(audioUrl, {
            chunk_length_s: 30,
            stride_length_s: 5,
            return_timestamps: false,
          });

          // Clean up the URL
          URL.revokeObjectURL(audioUrl);

          const transcript = result.text?.trim() || '';

          if (transcript && onTranscript) {
            onTranscript(transcript);
          }

          setRecordingStatus('idle');
          resolve(transcript);
        } catch (err) {
          console.error('Transcription failed:', err);
          setError('Failed to transcribe audio. Please try again.');
          setRecordingStatus('idle');
          resolve(null);
        }
      };

      mediaRecorder.stop();
    });
  }, [recordingStatus, onTranscript]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
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
    isModelReady: modelStatus === 'ready',
    modelLoadProgress,
    error,
    startRecording,
    stopRecording,
    loadModel,
  };
}
