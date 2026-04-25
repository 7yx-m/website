let audioCtx: AudioContext | null = null;

export const playTypingSound = () => {
  if (typeof window === 'undefined') return;

  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    // Subtle low-pitched click
    oscillator.frequency.setValueAtTime(100 + Math.random() * 50, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.03);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.03);
  } catch (e) {
    // Silence errors to prevent breaking the UI if audio is blocked
    console.warn("Audio feedback blocked or failed", e);
  }
};
