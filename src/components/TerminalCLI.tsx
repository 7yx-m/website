"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playTypingSound } from '@/lib/audio';
import { BlogEditor } from './BlogEditor';
import { PhotoUploader } from './PhotoUploader';

const NEOFETCH = `
   _   _ ____       ___  ____  
  | \\ | / ___|     / _ \\/ ___| 
  |  \\| \\___ \\    | | | \\___ \\ 
  | |\\  |___) |   | |_| |___) |
  |_| \\_|____/     \\___/|____/ 

  OS: NS-OS v1.0.0
  KERNEL: Next.js 15.5 / React 19
  UPTIME: 99.9%
  SHELL: NS-Terminal 
  STATUS: SYSTEM STABLE
`;

const COMMANDS: Record<string, string | (() => string)> = {
  help: 'AVAILABLE: help, clear, ls, cd [section], whoami, status, neofetch, sudo, login, logout, newpost, uploadphoto, analytics',
  whoami: 'Neekson Shrestha // Student Developer // Building in C++ & Python.',
  ls: 'projects, blog, photography, about',
  neofetch: () => NEOFETCH,
  sudo: 'ERROR: PRIVILEGE ESCALATION DENIED. INCIDENT LOGGED.',
};

export const TerminalCLI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [history, setHistory] = useState<string[]>(['NS-OS [Version 1.0.0]', '(c) 2026 Neekson Shrestha. All rights reserved.', '', 'Type "help" to begin.']);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/auth/')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setIsAdmin(true);
          setHistory(prev => [...prev, 'SESSION RESTORED: ADMIN ACCESS ACTIVE.']);
        }
      })
      .catch(() => {
        // Silent fail on session restoration check
      });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !showEditor && !showPhotoUpload) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, showEditor, showPhotoUpload]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    playTypingSound();
  };

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawInput = input.trim();
    const cmd = rawInput.toLowerCase();
    
    if (isAuthenticating) {
      try {
        const res = await fetch('/api/auth/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: rawInput }),
        });
        
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          if (res.ok) {
            setIsAdmin(true);
            setHistory(prev => [...prev, '******', 'ACCESS GRANTED. WELCOME ADMIN.', 'Type "newpost" or "uploadphoto" to manage content.']);
          } else {
            setHistory(prev => [...prev, '******', `ERROR: ${data.error || 'UNSPECIFIED_FAILURE'}`]);
          }
        } else {
          setHistory(prev => [...prev, '******', `ERROR: SERVER_ERROR // STATUS: ${res.status}`]);
        }
      } catch (err) {
        setHistory(prev => [...prev, '******', 'ERROR: NETWORK_FAILURE // API_UNREACHABLE']);
      } finally {
        setIsAuthenticating(false);
        setInput('');
      }
      return;
    }

    if (cmd === '') return;

    if (cmd === 'analytics') {
      const res = await fetch('/api/analytics/');
      const data = await res.json();
      const stats = Object.entries(data).map(([k, v]) => `${k.toUpperCase()}: ${v} PINGS`).join('\n');
      setHistory(prev => [...prev, '> analytics', '--- SYSTEM TRAFFIC ---', stats, '--- END LOG ---']);
      setInput('');
      return;
    }

    if (cmd === 'status') {
      const res = await fetch('/api/analytics/');
      const data = await res.json();
      setHistory(prev => [...prev, '> status', `SYSTEM: STABLE // TOTAL_TRAFFIC: ${data.total || 0} // LATENCY: 12ms`]);
      setInput('');
      return;
    }

    if (cmd === 'login') {
      setHistory(prev => [...prev, '> login', 'ENTER ADMINISTRATIVE ACCESS KEY:']);
      setIsAuthenticating(true);
      setInput('');
      return;
    }

    if (cmd === 'logout') {
      await fetch('/api/auth/', { method: 'DELETE' });
      setIsAdmin(false);
      setHistory(prev => [...prev, '> logout', 'ADMIN SESSION TERMINATED.']);
      setInput('');
      return;
    }

    if (cmd === 'newpost') {
      if (!isAdmin) {
        setHistory(prev => [...prev, '> newpost', 'ERROR: AUTHENTICATION REQUIRED.']);
      } else {
        setShowEditor(true);
      }
      setInput('');
      return;
    }

    if (cmd === 'uploadphoto') {
      if (!isAdmin) {
        setHistory(prev => [...prev, '> uploadphoto', 'ERROR: AUTHENTICATION REQUIRED.']);
      } else {
        setShowPhotoUpload(true);
      }
      setInput('');
      return;
    }

    if (cmd === 'clear') {
      setHistory([]);
    } else if (COMMANDS[cmd]) {
      const result = COMMANDS[cmd];
      const output = typeof result === 'function' ? result() : result;
      setHistory(prev => [...prev, `> ${rawInput}`, output]);
    } else if (cmd.startsWith('cd ')) {
      const target = cmd.split(' ')[1];
      const sections = ['projects', 'blog', 'photography', 'about'];
      if (sections.includes(target)) {
        document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
        setHistory(prev => [...prev, `> ${rawInput}`, `NAVIGATING TO /${target}...`]);
        setIsOpen(false);
      } else {
        setHistory(prev => [...prev, `> ${rawInput}`, `DIRECTORY NOT FOUND: ${target}`]);
      }
    } else {
      setHistory(prev => [...prev, `> ${rawInput}`, `COMMAND NOT FOUND: ${cmd}`]);
    }
    
    setInput('');
  };

  const renderInputLine = () => {
    if (isAuthenticating) {
      return (
        <form onSubmit={handleCommand} className="p-sys-sm bg-pure-white/10 border-t border-pure-white/20 flex items-center gap-sys-sm ring-1 ring-pure-white/20">
          <span className="text-pure-white animate-pulse">🔑</span>
          <input
            ref={inputRef}
            type="password"
            value={input}
            onChange={handleInputChange}
            className="flex-1 bg-transparent border-none outline-none text-pure-white caret-pure-white"
            placeholder="TYPE_ACCESS_KEY..."
            autoFocus
            onBlur={(e) => {
              if (isAuthenticating) e.target.focus();
            }}
          />
        </form>
      );
    }

    return (
      <form onSubmit={handleCommand} className="p-sys-sm bg-pure-white/5 border-t border-pure-white/20 flex items-center gap-sys-sm">
        <span className="text-pure-white">➜</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          className="flex-1 bg-transparent border-none outline-none text-pure-white caret-pure-white placeholder:text-pure-white/10"
          placeholder="EXECUTE COMMAND..."
          autoFocus
        />
      </form>
    );
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-8 right-8 z-50 px-4 py-2 border border-pure-white/20 bg-obsidian/80 backdrop-blur-md text-pure-white hover:border-pure-white transition-all font-mono text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.05)]"
      >
        [ EXECUTE_TERMINAL: ` ]
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            className="fixed inset-x-4 md:inset-x-24 bottom-12 top-24 z-[100] bg-obsidian/95 border border-pure-white shadow-[0_0_80px_rgba(255,255,255,0.15)] flex flex-col font-mono overflow-hidden"
          >
            {showEditor ? (
              <BlogEditor onClose={() => setShowEditor(false)} onSuccess={(slug) => {
                setShowEditor(false);
                setHistory(prev => [...prev, `SUCCESS: LOG PUBLISHED AS /blog/${slug}`]);
              }} />
            ) : showPhotoUpload ? (
              <PhotoUploader onClose={() => setShowPhotoUpload(false)} onSuccess={() => {
                setShowPhotoUpload(false);
                setHistory(prev => [...prev, 'SUCCESS: IMAGE UPLOADED AND RENAMED VIA CAPTION.']);
              }} />
            ) : (
              <>
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
                
                <div className="flex items-center justify-between p-sys-sm border-b border-pure-white/20 bg-pure-white/5">
                  <div className="flex items-center gap-sys-xs">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${isAdmin ? 'bg-pure-white' : 'bg-pure-white/40'}`} />
                    <span className="text-[10px] uppercase tracking-[0.4em] text-pure-white">
                      NS-OS v1.0.0 // {isAdmin ? 'ROOT_ACCESS' : 'GUEST_ACCESS'}
                    </span>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="text-pure-white/40 hover:text-pure-white transition-colors text-sm">
                    [ CLOSE ]
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-sys-md text-sm space-y-sys-xs selection:bg-pure-white selection:text-obsidian">
                  {history.map((line, i) => (
                    <div key={i} className={line.startsWith('>') ? 'text-pure-white/40' : 'text-pure-white leading-relaxed'}>
                      {line.split('\n').map((l, j) => (
                        <div key={j} className={l.trim() === '' ? 'h-sys-xs' : ''}>{l}</div>
                      ))}
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>

                {renderInputLine()}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
