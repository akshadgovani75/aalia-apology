import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * ============================================================================
 * DEDICATED INTERACTIVE APOLOGY WEBSITE FOR AALIA MADAMM (AALIAA JIII)
 * ============================================================================
 * Complete 7-Screen Interactive Scrapbook Experience:
 * 1. Opening Landing Screen (Heart Kitty + YESSS / NOOO)
 * 2. Crying Cat Reaction Screen (Playful NO response)
 * 3. YAY + Clickable Animated Pink Envelope with Wax Seal
 * 4. Short "Many Different Types of Sorrys" Scrapbook Letter
 * 5. Special Screen for Aalia (5 Interactive Title Badges)
 * 6. Heartfelt Appreciation Card + Animated Teddy Bear Holding a Heart
 * 7. Final Screen ("One Last Thing..." + Replay Our Little Story)
 */

// ============================================================================
// 1. WEB AUDIO & CUSTOM SONG ENGINE ("Aalia's Theme" + MP3 Support + SFX)
// ============================================================================
class CuteSoundEngine {
  constructor() {
    this.ctx = null;
    this.musicPlaying = false;
    this.sfxMuted = false;
    this.musicTimer = null;
    this.step = 0;
    this.audioEl = null;
    this.useCustomAudio = false;
    this.customSongTitle = "Aalia's Theme — Music Box Lullaby";
    this.onStateChange = null;
  }

  initContext() {
    try {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch (e) {
      // Safely ignore restricted audio context errors
    }
  }

  playTone(freq, duration = 0.25, type = 'sine', volume = 0.08, delay = 0) {
    if (!this.ctx || !freq) return;
    try {
      const now = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(volume, now + 0.035);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.03);
    } catch (e) {
      // Ignore oscillator playback errors
    }
  }

  playChime(delay = 0) {
    if (!this.ctx) return;
    this.playTone(1567.98, 0.22, 'sine', 0.018, delay); // G6 soft sparkle chime
  }

  playClick() {
    if (this.sfxMuted) return;
    this.initContext();
    this.playTone(587.33, 0.12, 'sine', 0.08, 0); // D5
    this.playTone(880.0, 0.16, 'triangle', 0.06, 0.05); // A5
  }

  playSadMeow() {
    if (this.sfxMuted) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.45);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {}
  }

  playEnvelopeOpen() {
    if (this.sfxMuted) return;
    this.initContext();
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    notes.forEach((n, idx) => {
      this.playTone(n, 0.35, 'sine', 0.08, idx * 0.08);
    });
  }

  playHeartPop() {
    if (this.sfxMuted) return;
    this.initContext();
    this.playTone(740, 0.1, 'sine', 0.07, 0);
    this.playTone(987.77, 0.18, 'sine', 0.07, 0.05);
  }

  setCustomSong(url, title) {
    this.stopMusic(this.onStateChange);
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl.src = '';
    }
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = 0.65;
    audio.onerror = () => {
      this.useCustomAudio = false;
      this.customSongTitle = "Aalia's Theme — Music Box Lullaby";
      if (this.musicPlaying) {
        this.startSynthLoop();
      }
    };
    this.audioEl = audio;
    this.useCustomAudio = true;
    this.customSongTitle = title || 'Our Special Song 🎵';
    this.startMusic(this.onStateChange);
  }

  startSynthLoop() {
    this.initContext();
    if (this.musicTimer) clearInterval(this.musicTimer);

    const chords = [
      { bass: 174.61, arp: [349.23, 440.0, 523.25, 659.25] }, // Fmaj7
      { bass: 146.83, arp: [293.66, 349.23, 440.0, 523.25] }, // Dm7
      { bass: 116.54, arp: [233.08, 293.66, 349.23, 440.0] }, // Bbmaj7
      { bass: 130.81, arp: [261.63, 349.23, 392.0, 523.25] }, // Csus4 -> C
    ];

    const leadMelody = [
      659.25, 0, 698.46, 659.25, 587.33, 523.25, 440.0, 0,
      587.33, 0, 659.25, 587.33, 523.25, 440.0, 392.0, 0,
      466.16, 523.25, 587.33, 698.46, 659.25, 587.33, 523.25, 440.0,
      523.25, 0, 587.33, 523.25, 440.0, 0, 392.0, 0,
      880.0, 0, 783.99, 698.46, 659.25, 587.33, 523.25, 0,
      698.46, 0, 659.25, 587.33, 523.25, 440.0, 440.0, 0,
      587.33, 659.25, 698.46, 783.99, 698.46, 659.25, 587.33, 523.25,
      440.0, 0, 392.0, 0, 349.23, 0, 0, 0,
    ];

    const playStep = () => {
      if (!this.musicPlaying || this.useCustomAudio) return;
      const idx = this.step % leadMelody.length;
      const barIndex = Math.floor(idx / 8) % chords.length;
      const beatInBar = idx % 8;
      const chord = chords[barIndex];

      if (beatInBar === 0) {
        this.playTone(chord.bass, 1.8, 'sine', 0.045, 0);
      } else if (beatInBar === 4) {
        this.playTone(chord.bass * 1.5, 1.3, 'sine', 0.028, 0);
      }

      const arpNote = chord.arp[beatInBar % chord.arp.length];
      this.playTone(arpNote, 0.55, 'triangle', 0.024, 0);

      const lead = leadMelody[idx];
      if (lead > 0) {
        this.playTone(lead, 0.72, 'sine', 0.055, 0);
        this.playTone(lead * 2, 0.35, 'sine', 0.012, 0.01);
      }

      if (beatInBar === 6) {
        this.playChime(0.02);
      }

      this.step += 1;
    };

    playStep();
    this.musicTimer = setInterval(playStep, 390);
  }

  startMusic(onStateChange) {
    if (onStateChange) this.onStateChange = onStateChange;
    if (this.musicPlaying) return;
    this.musicPlaying = true;
    if (this.onStateChange) this.onStateChange(true, this.customSongTitle);

    if (this.useCustomAudio && this.audioEl) {
      this.audioEl.play().catch(() => {
        this.useCustomAudio = false;
        this.customSongTitle = "Aalia's Theme — Music Box Lullaby";
        if (this.onStateChange) this.onStateChange(true, this.customSongTitle);
        this.startSynthLoop();
      });
    } else {
      this.startSynthLoop();
    }
  }

  stopMusic(onStateChange) {
    if (onStateChange) this.onStateChange = onStateChange;
    this.musicPlaying = false;
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
    if (this.audioEl) {
      try {
        this.audioEl.pause();
      } catch (e) {}
    }
    if (this.onStateChange) this.onStateChange(false, this.customSongTitle);
  }

  toggleMusic(onStateChange) {
    if (this.musicPlaying) {
      this.stopMusic(onStateChange);
    } else {
      this.startMusic(onStateChange);
    }
  }

  toggleSfx(onSfxChange) {
    this.sfxMuted = !this.sfxMuted;
    if (onSfxChange) onSfxChange(this.sfxMuted);
  }
}

const soundEngine = new CuteSoundEngine();

// ============================================================================
// 2. CUSTOM INLINE SVG ILLUSTRATIONS
// ============================================================================

const CuteHeartKittySVG = () => (
  <svg
    viewBox="0 0 240 220"
    className="w-44 h-40 sm:w-52 sm:h-48 mx-auto drop-shadow-md animate-float-slow select-none"
    aria-label="Cute cartoon kitty holding a pink heart"
  >
    <circle cx="120" cy="115" r="82" fill="#FFF0F5" opacity="0.85" />
    {/* Tail */}
    <path
      d="M168 165 Q205 150 198 122 Q193 108 182 118 Q175 126 184 134 Q190 142 165 154"
      fill="#FFFFFF"
      stroke="#5C4033"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    {/* Left & Right Ears */}
    <path
      d="M68 85 L56 36 L102 64 Z"
      fill="#FFFFFF"
      stroke="#5C4033"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    <path d="M72 78 L64 47 L93 65 Z" fill="#FFB6C1" />
    <path
      d="M172 85 L184 36 L138 64 Z"
      fill="#FFFFFF"
      stroke="#5C4033"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    <path d="M168 78 L176 47 L147 65 Z" fill="#FFB6C1" />

    {/* Little Pink Bow on Right Ear */}
    <g transform="translate(154, 48) rotate(18)">
      <path
        d="M0 0 C-14 -10 -18 10 0 4 C18 10 14 -10 0 0 Z"
        fill="#FF6B9D"
        stroke="#5C4033"
        strokeWidth="2.5"
      />
      <circle cx="0" cy="2" r="4.5" fill="#FFE066" stroke="#5C4033" strokeWidth="2" />
    </g>

    {/* Kitty Head & Body */}
    <ellipse cx="120" cy="158" rx="48" ry="42" fill="#FFFFFF" stroke="#5C4033" strokeWidth="3.5" />
    <ellipse cx="120" cy="100" rx="58" ry="46" fill="#FFFFFF" stroke="#5C4033" strokeWidth="3.5" />

    {/* Whiskers */}
    <line x1="52" y1="98" x2="72" y2="101" stroke="#5C4033" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="50" y1="109" x2="71" y2="108" stroke="#5C4033" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="188" y1="98" x2="168" y2="101" stroke="#5C4033" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="190" y1="109" x2="169" y2="108" stroke="#5C4033" strokeWidth="2.5" strokeLinecap="round" />

    {/* Rosy Cheeks */}
    <ellipse cx="85" cy="110" rx="10" ry="6" fill="#FF9EBB" opacity="0.7" />
    <ellipse cx="155" cy="110" rx="10" ry="6" fill="#FF9EBB" opacity="0.7" />

    {/* Big Sparkling Eyes */}
    <circle cx="95" cy="96" r="7.5" fill="#4A3228" />
    <circle cx="92.5" cy="93.5" r="2.8" fill="#FFFFFF" />
    <circle cx="97" cy="98" r="1.3" fill="#FFFFFF" />

    <circle cx="145" cy="96" r="7.5" fill="#4A3228" />
    <circle cx="142.5" cy="93.5" r="2.8" fill="#FFFFFF" />
    <circle cx="147" cy="98" r="1.3" fill="#FFFFFF" />

    {/* Cute Nose & Plead Mouth */}
    <ellipse cx="120" cy="105" rx="4" ry="2.8" fill="#FF7AA2" />
    <path
      d="M112 112 Q116 117 120 112 Q124 117 128 112"
      fill="none"
      stroke="#5C4033"
      strokeWidth="2.5"
      strokeLinecap="round"
    />

    {/* Big Pink Heart Held by Kitty */}
    <g className="animate-heartbeat" style={{ transformOrigin: '120px 158px' }}>
      <path
        d="M120 186 C120 186 84 162 84 139 C84 126 95 119 106 123 C113 125 118 131 120 135 C122 131 127 125 134 123 C145 119 156 126 156 139 C156 162 120 186 120 186 Z"
        fill="#FF6B9D"
        stroke="#5C4033"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M96 134 Q101 128 108 131"
        fill="none"
        stroke="#FFD6E4"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>

    {/* Little Paws Holding the Heart */}
    <ellipse cx="90" cy="153" rx="11" ry="8" fill="#FFFFFF" stroke="#5C4033" strokeWidth="3" />
    <ellipse cx="150" cy="153" rx="11" ry="8" fill="#FFFFFF" stroke="#5C4033" strokeWidth="3" />

    {/* Floating Mini Hearts */}
    <path
      d="M42 62 C42 62 31 54 31 47 C31 43 35 41 38 42 C40 43 41 45 42 46 C43 45 44 43 46 42 C49 41 53 43 53 47 C53 54 42 62 42 62 Z"
      fill="#FF85A1"
      className="animate-pulse"
    />
    <path
      d="M198 68 C198 68 189 62 189 56 C189 53 192 51 195 52 C196 53 197 54 198 55 C199 54 200 53 201 52 C204 51 207 53 207 56 C207 62 198 68 198 68 Z"
      fill="#FF85A1"
      className="animate-pulse"
    />
  </svg>
);

const CryingKittySVG = () => (
  <svg
    viewBox="0 0 240 220"
    className="w-44 h-40 sm:w-52 sm:h-48 mx-auto drop-shadow-md animate-wobble select-none"
    aria-label="Adorable crying cat animation"
  >
    <circle cx="120" cy="118" r="82" fill="#EEF6FF" opacity="0.9" />

    {/* Droopy Ears */}
    <path
      d="M68 88 L46 52 L98 68 Z"
      fill="#FFFFFF"
      stroke="#5C4033"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    <path d="M70 81 L55 58 L91 69 Z" fill="#FFC2D1" />
    <path
      d="M172 88 L194 52 L142 68 Z"
      fill="#FFFFFF"
      stroke="#5C4033"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    <path d="M170 81 L185 58 L149 69 Z" fill="#FFC2D1" />

    {/* Body & Head */}
    <ellipse cx="120" cy="162" rx="46" ry="38" fill="#FFFFFF" stroke="#5C4033" strokeWidth="3.5" />
    <ellipse cx="120" cy="104" rx="58" ry="46" fill="#FFFFFF" stroke="#5C4033" strokeWidth="3.5" />

    {/* Worried Eyebrows */}
    <path d="M82 82 Q93 76 103 83" fill="none" stroke="#5C4033" strokeWidth="3" strokeLinecap="round" />
    <path d="M158 82 Q147 76 137 83" fill="none" stroke="#5C4033" strokeWidth="3" strokeLinecap="round" />

    {/* Teary Puppy Eyes */}
    <circle cx="94" cy="98" r="8.5" fill="#4A3228" />
    <circle cx="91" cy="95" r="3.2" fill="#FFFFFF" />
    <circle cx="97" cy="101" r="1.8" fill="#FFFFFF" />

    <circle cx="146" cy="98" r="8.5" fill="#4A3228" />
    <circle cx="143" cy="95" r="3.2" fill="#FFFFFF" />
    <circle cx="149" cy="101" r="1.8" fill="#FFFFFF" />

    {/* Waterfall Tears */}
    <path
      d="M86 105 Q78 130 82 162"
      fill="none"
      stroke="#7CC6FE"
      strokeWidth="6"
      strokeLinecap="round"
      className="animate-tear-flow"
    />
    <path
      d="M154 105 Q162 130 158 162"
      fill="none"
      stroke="#7CC6FE"
      strokeWidth="6"
      strokeLinecap="round"
      className="animate-tear-flow"
    />
    <path d="M62 115 C62 115 55 125 62 129 C69 125 62 115 62 115 Z" fill="#7CC6FE" className="animate-bounce" />
    <path d="M178 115 C178 115 171 125 178 129 C185 125 178 115 178 115 Z" fill="#7CC6FE" className="animate-bounce" />

    {/* Pink Nose & Quivering Mouth */}
    <ellipse cx="120" cy="108" rx="4" ry="2.8" fill="#FF7AA2" />
    <path
      d="M107 121 Q113 115 120 121 Q127 115 133 121"
      fill="none"
      stroke="#5C4033"
      strokeWidth="2.8"
      strokeLinecap="round"
    />

    {/* Paws Wiping Tears */}
    <ellipse cx="95" cy="144" rx="12" ry="9" fill="#FFFFFF" stroke="#5C4033" strokeWidth="3" />
    <ellipse cx="145" cy="144" rx="12" ry="9" fill="#FFFFFF" stroke="#5C4033" strokeWidth="3" />

    {/* Little Cracked Heart */}
    <g transform="translate(120, 173)">
      <path
        d="M0 16 C0 16 -22 2 -22 -11 C-22 -19 -15 -23 -8 -20 C-4 -18 -1 -15 0 -12 C1 -15 4 -18 8 -20 C15 -23 22 -19 22 -11 C22 2 0 16 0 16 Z"
        fill="#FF8FA3"
        stroke="#5C4033"
        strokeWidth="2.5"
      />
      <polyline points="0,-11 -3,-3 3,3 -1,12" fill="none" stroke="#5C4033" strokeWidth="2.2" strokeLinecap="round" />
    </g>
  </svg>
);

const AnimatedPinkEnvelopeSVG = ({ isOpen }) => (
  <div className="relative w-64 h-48 sm:w-72 sm:h-52 mx-auto select-none">
    <svg viewBox="0 0 280 200" className="w-full h-full drop-shadow-lg overflow-visible">
      <ellipse cx="140" cy="112" rx="120" ry="72" fill="#FFD6E4" opacity="0.65" />

      {/* Envelope Back Base */}
      <rect
        x="24"
        y="46"
        width="232"
        height="136"
        rx="18"
        fill="#FF85A1"
        stroke="#5C4033"
        strokeWidth="3.5"
      />

      {/* Peeking Letter Card Inside */}
      <g
        style={{
          transform: isOpen ? 'translateY(-38px)' : 'translateY(0px)',
          transition: 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <rect
          x="42"
          y="56"
          width="196"
          height="112"
          rx="12"
          fill="#FFFDF7"
          stroke="#FFC2D1"
          strokeWidth="2.5"
        />
        <line x1="64" y1="78" x2="176" y2="78" stroke="#FFB3C6" strokeWidth="3" strokeLinecap="round" />
        <line x1="64" y1="94" x2="210" y2="94" stroke="#FFD6E4" strokeWidth="3" strokeLinecap="round" />
        <line x1="64" y1="110" x2="190" y2="110" stroke="#FFD6E4" strokeWidth="3" strokeLinecap="round" />
        <text x="140" y="73" textAnchor="middle" fontSize="14" fill="#E63973" fontFamily="Fredoka, sans-serif" fontWeight="bold">
          For Aaliaa Jiii 💌
        </text>
      </g>

      {/* Left & Right Envelope Pocket Flaps */}
      <path
        d="M26 52 L134 126 L26 178 Z"
        fill="#FFA3B8"
        stroke="#5C4033"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M254 52 L146 126 L254 178 Z"
        fill="#FFA3B8"
        stroke="#5C4033"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Bottom Envelope Flap */}
      <path
        d="M26 178 L140 108 L254 178 Q250 182 238 182 L42 182 Q30 182 26 178 Z"
        fill="#FFB8C9"
        stroke="#5C4033"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Animated Top Flap */}
      <g
        style={{
          transformOrigin: '140px 48px',
          transform: isOpen ? 'rotateX(180deg)' : 'rotateX(0deg)',
          transition: 'transform 0.55s ease-in-out',
        }}
      >
        <path
          d="M26 50 Q30 46 42 46 L238 46 Q250 46 254 50 L140 128 Z"
          fill={isOpen ? '#FF7597' : '#FF9EBB'}
          stroke="#5C4033"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
      </g>

      {/* Cute Heart Wax Seal */}
      <g
        style={{
          opacity: isOpen ? 0 : 1,
          transform: isOpen ? 'scale(0.6)' : 'scale(1)',
          transformOrigin: '140px 118px',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
      >
        <circle cx="140" cy="118" r="22" fill="#E63973" stroke="#5C4033" strokeWidth="3" />
        <path
          d="M140 129 C140 129 127 120 127 112 C127 107 131 105 135 106 C137 107 139 109 140 111 C141 109 143 107 145 106 C149 105 153 107 153 112 C153 120 140 129 140 129 Z"
          fill="#FFF0F5"
        />
      </g>
    </svg>
  </div>
);

const TeddyBearHeartSVG = () => (
  <svg
    viewBox="0 0 220 210"
    className="w-40 h-38 sm:w-48 sm:h-44 mx-auto drop-shadow-md animate-float-slow select-none"
    aria-label="Cute teddy bear holding a heart"
  >
    <circle cx="110" cy="112" r="78" fill="#FFF3D6" opacity="0.85" />
    {/* Ears */}
    <circle cx="66" cy="54" r="20" fill="#C68B59" stroke="#5C4033" strokeWidth="3.5" />
    <circle cx="66" cy="54" r="10" fill="#E6B88A" />
    <circle cx="154" cy="54" r="20" fill="#C68B59" stroke="#5C4033" strokeWidth="3.5" />
    <circle cx="154" cy="54" r="10" fill="#E6B88A" />

    {/* Teddy Feet */}
    <ellipse cx="78" cy="184" rx="18" ry="13" fill="#C68B59" stroke="#5C4033" strokeWidth="3.5" />
    <ellipse cx="78" cy="184" rx="10" ry="7" fill="#E6B88A" />
    <ellipse cx="142" cy="184" rx="18" ry="13" fill="#C68B59" stroke="#5C4033" strokeWidth="3.5" />
    <ellipse cx="142" cy="184" rx="10" ry="7" fill="#E6B88A" />

    {/* Teddy Body & Head */}
    <ellipse cx="110" cy="148" rx="46" ry="40" fill="#C68B59" stroke="#5C4033" strokeWidth="3.5" />
    <ellipse cx="110" cy="88" rx="50" ry="42" fill="#C68B59" stroke="#5C4033" strokeWidth="3.5" />

    {/* Snout */}
    <ellipse cx="110" cy="99" rx="20" ry="15" fill="#F5DFC6" stroke="#5C4033" strokeWidth="2.5" />
    <ellipse cx="110" cy="93" rx="6" ry="4" fill="#5C4033" />
    <path d="M103 103 Q110 109 117 103" fill="none" stroke="#5C4033" strokeWidth="2.5" strokeLinecap="round" />

    {/* Eyes & Cheeks */}
    <circle cx="88" cy="82" r="5.5" fill="#3D261C" />
    <circle cx="86.5" cy="80.5" r="2" fill="#FFFFFF" />
    <circle cx="132" cy="82" r="5.5" fill="#3D261C" />
    <circle cx="130.5" cy="80.5" r="2" fill="#FFFFFF" />
    <ellipse cx="77" cy="95" rx="8" ry="5" fill="#FF8FA3" opacity="0.65" />
    <ellipse cx="143" cy="95" rx="8" ry="5" fill="#FF8FA3" opacity="0.65" />

    {/* Heart Held in Center */}
    <g className="animate-heartbeat" style={{ transformOrigin: '110px 148px' }}>
      <path
        d="M110 176 C110 176 75 152 75 130 C75 117 86 110 96 114 C103 116 108 122 110 126 C112 122 117 116 124 114 C134 110 145 117 145 130 C145 152 110 176 110 176 Z"
        fill="#FF5C8A"
        stroke="#5C4033"
        strokeWidth="3"
      />
      <path d="M87 125 Q92 119 98 122" fill="none" stroke="#FFD6E4" strokeWidth="2.8" strokeLinecap="round" />
    </g>

    {/* Arms Hugging Heart */}
    <ellipse cx="78" cy="144" rx="13" ry="10" fill="#C68B59" stroke="#5C4033" strokeWidth="3" />
    <ellipse cx="142" cy="144" rx="13" ry="10" fill="#C68B59" stroke="#5C4033" strokeWidth="3" />
  </svg>
);

const PinkBowSVG = ({ className = 'w-10 h-7' }) => (
  <svg viewBox="0 0 80 54" className={className} aria-hidden="true">
    <path
      d="M40 27 C22 6 4 12 8 30 C12 46 28 38 40 27 Z"
      fill="#FF7597"
      stroke="#5C4033"
      strokeWidth="3"
    />
    <path
      d="M40 27 C58 6 76 12 72 30 C68 46 52 38 40 27 Z"
      fill="#FF7597"
      stroke="#5C4033"
      strokeWidth="3"
    />
    <path d="M35 32 L26 48 L36 44 L40 33 Z" fill="#FF8FA3" stroke="#5C4033" strokeWidth="2.5" />
    <path d="M45 32 L54 48 L44 44 L40 33 Z" fill="#FF8FA3" stroke="#5C4033" strokeWidth="2.5" />
    <circle cx="40" cy="27" r="7.5" fill="#FFE066" stroke="#5C4033" strokeWidth="3" />
  </svg>
);

const CuteFlowerSVG = ({ className = 'w-9 h-9', petalColor = '#FFB3C6' }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <circle cx="32" cy="15" r="10" fill={petalColor} stroke="#5C4033" strokeWidth="2.5" />
    <circle cx="48" cy="27" r="10" fill={petalColor} stroke="#5C4033" strokeWidth="2.5" />
    <circle cx="42" cy="46" r="10" fill={petalColor} stroke="#5C4033" strokeWidth="2.5" />
    <circle cx="22" cy="46" r="10" fill={petalColor} stroke="#5C4033" strokeWidth="2.5" />
    <circle cx="16" cy="27" r="10" fill={petalColor} stroke="#5C4033" strokeWidth="2.5" />
    <circle cx="32" cy="32" r="9" fill="#FFE066" stroke="#5C4033" strokeWidth="2.5" />
  </svg>
);

// ============================================================================
// 3. FLOATING AMBIENT HEARTS & SPARKLES LAYER
// ============================================================================
const FloatingAmbientDecor = () => {
  const items = [
    { id: 1, symbol: '💗', top: '8%', left: '6%', size: 'text-xl', delay: '0s' },
    { id: 2, symbol: '✨', top: '14%', left: '88%', size: 'text-lg', delay: '1.2s' },
    { id: 3, symbol: '🌸', top: '34%', left: '4%', size: 'text-xl', delay: '2.1s' },
    { id: 4, symbol: '💕', top: '48%', left: '92%', size: 'text-xl', delay: '0.7s' },
    { id: 5, symbol: '🎀', top: '72%', left: '7%', size: 'text-lg', delay: '1.8s' },
    { id: 6, symbol: '✨', top: '82%', left: '89%', size: 'text-xl', delay: '2.5s' },
    { id: 7, symbol: '🌷', top: '24%', left: '91%', size: 'text-lg', delay: '3.0s' },
    { id: 8, symbol: '💖', top: '62%', left: '5%', size: 'text-base', delay: '1.4s' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {items.map((item) => (
        <span
          key={item.id}
          style={{
            top: item.top,
            left: item.left,
            animationDelay: item.delay,
          }}
          className={`absolute ${item.size} opacity-65 animate-float-drift select-none`}
        >
          {item.symbol}
        </span>
      ))}
    </div>
  );
};

// ============================================================================
// 4. MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  const [screen, setScreen] = useState('opening');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);

  const [musicOn, setMusicOn] = useState(false);
  const [songTitle, setSongTitle] = useState("Aalia's Theme — Music Box Lullaby");
  const [sfxMuted, setSfxMuted] = useState(false);
  const customAudioInputRef = useRef(null);
  const customAudioUrlRef = useRef(null);

  const [poppedCards, setPoppedCards] = useState({});

  const handleMusicStateUpdate = useCallback((isPlaying, title) => {
    setMusicOn(isPlaying);
    if (title) setSongTitle(title);
  }, []);

  const handleCustomSongUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (customAudioUrlRef.current) {
      URL.revokeObjectURL(customAudioUrlRef.current);
    }
    const url = URL.createObjectURL(file);
    customAudioUrlRef.current = url;
    const cleanName = file.name.replace(/\.[^/.]+$/, '');
    soundEngine.setCustomSong(url, `${cleanName} 🎵`);
  };

  useEffect(() => {
    return () => {
      soundEngine.stopMusic();
      if (customAudioUrlRef.current) {
        URL.revokeObjectURL(customAudioUrlRef.current);
      }
    };
  }, []);

  const navigateTo = useCallback((nextScreen, soundType = 'click') => {
    if (soundType === 'sad') {
      soundEngine.playSadMeow();
    } else if (soundType === 'envelope') {
      soundEngine.playEnvelopeOpen();
    } else {
      soundEngine.playClick();
    }

    setIsTransitioning(true);
    setTimeout(() => {
      setScreen(nextScreen);
      setIsTransitioning(false);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 220);
  }, []);

  const handleEnvelopeClick = () => {
    if (envelopeOpened) return;
    setEnvelopeOpened(true);
    soundEngine.playEnvelopeOpen();
    setTimeout(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setScreen('letter');
        setIsTransitioning(false);
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 240);
    }, 900);
  };

  const handleReplay = () => {
    soundEngine.playEnvelopeOpen();
    setEnvelopeOpened(false);
    setPoppedCards({});
    setIsTransitioning(true);
    setTimeout(() => {
      setScreen('opening');
      setIsTransitioning(false);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 240);
  };

  const journeySteps = [
    { key: 'opening', label: '1' },
    { key: 'yes', label: '2' },
    { key: 'letter', label: '3' },
    { key: 'special', label: '4' },
    { key: 'heartfelt', label: '5' },
    { key: 'final', label: '6' },
  ];

  const currentStepIndex = journeySteps.findIndex((s) => s.key === screen);

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden gingham-bg text-[#5C4033] font-body selection:bg-[#FFB3C6] selection:text-[#4A2C2A]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Fredoka:wght@500;600;700&family=Pacifico&family=Quicksand:wght@500;600;700&display=swap');

        .font-handwritten {
          font-family: 'Caveat', cursive;
        }
        .font-cute {
          font-family: 'Fredoka', sans-serif;
        }
        .font-script {
          font-family: 'Pacifico', cursive;
        }
        .font-body {
          font-family: 'Quicksand', sans-serif;
        }

        .gingham-bg {
          background-color: #FFFDF0;
          background-image:
            linear-gradient(90deg, rgba(255, 224, 130, 0.26) 50%, transparent 50%),
            linear-gradient(rgba(255, 224, 130, 0.26) 50%, transparent 50%);
          background-size: 44px 44px;
        }

        .letter-paper {
          background-color: #FFF9FB;
          background-image:
            radial-gradient(rgba(255, 133, 161, 0.14) 1px, transparent 1px),
            repeating-linear-gradient(
              to bottom,
              transparent 0px,
              transparent 31px,
              rgba(255, 179, 198, 0.42) 32px
            );
          background-size: 20px 20px, 100% 32px;
        }

        .washi-tape {
          background: rgba(255, 182, 193, 0.75);
          background-image: repeating-linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.35),
            rgba(255, 255, 255, 0.35) 6px,
            transparent 6px,
            transparent 12px
          );
          box-shadow: 0 2px 5px rgba(92, 64, 51, 0.12);
        }

        .btn-cute-pink {
          background: linear-gradient(180deg, #FF85A1 0%, #FF5C8A 100%);
          color: #FFFFFF;
          box-shadow: 0 5px 0 #D93B6A, 0 10px 20px rgba(255, 92, 138, 0.32);
          transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
        }
        .btn-cute-pink:hover {
          transform: translateY(-2px);
          filter: brightness(1.04);
        }
        .btn-cute-pink:active {
          transform: translateY(3px);
          box-shadow: 0 2px 0 #D93B6A, 0 5px 12px rgba(255, 92, 138, 0.25);
        }

        .btn-cute-cream {
          background: linear-gradient(180deg, #FFFFFF 0%, #FFF3D6 100%);
          color: #6E473B;
          border: 2.5px solid #F4C2C2;
          box-shadow: 0 5px 0 #E5B2B2, 0 8px 16px rgba(92, 64, 51, 0.12);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .btn-cute-cream:hover {
          transform: translateY(-2px);
        }
        .btn-cute-cream:active {
          transform: translateY(3px);
          box-shadow: 0 2px 0 #E5B2B2;
        }

        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-9px); }
        }
        .animate-float-slow {
          animation: floatSlow 3.4s ease-in-out infinite;
        }

        @keyframes floatDrift {
          0%, 100% { transform: translateY(0px) rotate(-4deg); }
          50% { transform: translateY(-14px) rotate(6deg); }
        }
        .animate-float-drift {
          animation: floatDrift 6s ease-in-out infinite;
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          18% { transform: scale(1.13); }
          32% { transform: scale(0.98); }
          48% { transform: scale(1.09); }
        }
        .animate-heartbeat {
          animation: heartbeat 1.7s ease-in-out infinite;
        }

        @keyframes wobble {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }
        .animate-wobble {
          animation: wobble 2.2s ease-in-out infinite;
        }

        @keyframes tearFlow {
          0%, 100% { opacity: 0.75; }
          50% { opacity: 1; }
        }
        .animate-tear-flow {
          animation: tearFlow 1.2s ease-in-out infinite;
        }

        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.92) translateY(14px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-pop-in {
          animation: popIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .cute-scroll::-webkit-scrollbar {
          width: 7px;
        }
        .cute-scroll::-webkit-scrollbar-track {
          background: #FFE5EC;
          border-radius: 999px;
        }
        .cute-scroll::-webkit-scrollbar-thumb {
          background: #FF85A1;
          border-radius: 999px;
        }

        @keyframes eqBar {
          0%, 100% { transform: scaleY(0.35); }
          50% { transform: scaleY(1); }
        }
        .animate-eq-1 { animation: eqBar 0.65s ease-in-out infinite; }
        .animate-eq-2 { animation: eqBar 0.48s ease-in-out infinite 0.15s; }
        .animate-eq-3 { animation: eqBar 0.58s ease-in-out infinite 0.3s; }

        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 6s linear infinite;
        }
      `}</style>

      {/* Ambient Floating Hearts & Sparkles */}
      <FloatingAmbientDecor />

      {/* ====================================================================
          TOP NAVIGATION & ROMANTIC SONG PLAYER BAR
          ==================================================================== */}
      <header className="sticky top-0 z-30 w-full px-3 sm:px-6 pt-3 pb-2">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between gap-2 bg-white/90 backdrop-blur-md border-2 border-[#FFD6E0] rounded-full px-3.5 py-2 shadow-sm">
            {screen !== 'opening' ? (
              <button
                type="button"
                onClick={() => {
                  if (screen === 'no') navigateTo('opening');
                  else if (screen === 'yes') navigateTo('opening');
                  else if (screen === 'letter') navigateTo('yes');
                  else if (screen === 'special') navigateTo('letter');
                  else if (screen === 'heartfelt') navigateTo('special');
                  else if (screen === 'final') navigateTo('heartfelt');
                }}
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-cute font-semibold text-[#8C4A5E] bg-[#FFF0F5] hover:bg-[#FFE0EB] px-3 py-1.5 rounded-full border border-[#FFC2D1] transition cursor-pointer"
                aria-label="Go to previous screen"
              >
                <span>←</span>
                <span>Back</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-cute font-semibold text-[#D94E78] pl-1">
                <span>🎀</span>
                <span>For Aaliaa Jiii</span>
              </div>
            )}

            {currentStepIndex !== -1 && (
              <div className="flex items-center gap-1.5" aria-label="Story progress">
                {journeySteps.map((step, idx) => (
                  <button
                    key={step.key}
                    type="button"
                    onClick={() => {
                      if (step.key === 'yes') setEnvelopeOpened(false);
                      navigateTo(step.key);
                    }}
                    title={`Step ${step.label}`}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      idx === currentStepIndex
                        ? 'w-6 bg-[#FF5C8A]'
                        : idx < currentStepIndex
                        ? 'w-2.5 bg-[#FF9EBB]'
                        : 'w-2.5 bg-[#FFE0E9]'
                    }`}
                  />
                ))}
              </div>
            )}

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => soundEngine.toggleMusic(handleMusicStateUpdate)}
                className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-cute font-semibold px-3.5 py-1.5 rounded-full border transition cursor-pointer ${
                  musicOn
                    ? 'bg-[#FF5C8A] text-white border-[#D93B6A] shadow-xs'
                    : 'bg-[#FFF8E7] text-[#6E473B] border-[#F3D5A5] hover:bg-[#FFF0CC]'
                }`}
                aria-label={musicOn ? 'Pause Our Song' : 'Play Our Song'}
              >
                {musicOn ? (
                  <span className="inline-flex items-end gap-0.5 h-3.5 mr-0.5" aria-hidden="true">
                    <span className="w-1 h-3.5 bg-white rounded-full animate-eq-1 origin-bottom" />
                    <span className="w-1 h-3.5 bg-white rounded-full animate-eq-2 origin-bottom" />
                    <span className="w-1 h-3.5 bg-white rounded-full animate-eq-3 origin-bottom" />
                  </span>
                ) : (
                  <span>🎵</span>
                )}
                <span>{musicOn ? 'Pause Song' : 'Play Our Song 🎵'}</span>
              </button>

              <button
                type="button"
                onClick={() => soundEngine.toggleSfx(setSfxMuted)}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#FFF0F5] hover:bg-[#FFE0EB] border border-[#FFC2D1] text-sm transition cursor-pointer"
                title={sfxMuted ? 'Unmute cute sound effects' : 'Mute cute sound effects'}
                aria-label={sfxMuted ? 'Unmute sound effects' : 'Mute sound effects'}
              >
                {sfxMuted ? '🔇' : '🔊'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ====================================================================
          MAIN INTERACTIVE CONTENT CONTAINER
          ==================================================================== */}
      <main
        className={`relative z-10 max-w-xl mx-auto px-4 pt-3 pb-12 transition-all duration-300 ${
          isTransitioning ? 'opacity-0 scale-95 translate-y-2' : 'opacity-100 scale-100 translate-y-0'
        }`}
      >
        {/* SCREEN 1: OPENING LANDING SCREEN */}
        {screen === 'opening' && (
          <section className="animate-pop-in relative bg-white/94 backdrop-blur-sm border-4 border-[#FFC2D1] rounded-[2.2rem] p-6 sm:p-8 shadow-[0_14px_35px_rgba(255,133,161,0.24)] text-center">
            <div className="washi-tape w-28 h-6 mx-auto -mt-9 mb-3 rounded-sm rotate-[-2deg]" />

            <div className="inline-flex items-center gap-2 bg-[#FFF0F5] border border-[#FFB3C6] text-[#D93B6A] font-cute font-semibold text-sm sm:text-base px-4 py-1.5 rounded-full mb-3 shadow-2xs">
              <span>pssst... Aalia Madamm! 🎀</span>
            </div>

            <h1 className="font-cute font-bold text-3xl sm:text-4xl md:text-[2.6rem] text-[#E63973] tracking-tight leading-tight drop-shadow-2xs">
              HEYYYY AALIAA JIII!!
            </h1>

            <p className="font-handwritten font-bold text-2xl sm:text-3xl text-[#7A5230] mt-1 mb-3">
              Ek baat sunogi meri madam? 🥺
            </p>

            <div className="my-2">
              <CuteHeartKittySVG />
            </div>

            <div className="bg-[#FFF9DB] border-2 border-dashed border-[#FFE082] rounded-2xl py-3 px-4 my-4">
              <p className="font-body font-bold text-base sm:text-lg text-[#6E473B]">
                I made something special just for you. ✨
              </p>
              <p className="font-cute font-bold text-xl sm:text-2xl text-[#D93B6A] mt-1">
                Will you forgive me? 🥹
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-5 mt-5">
              <button
                type="button"
                onClick={() => {
                  setEnvelopeOpened(false);
                  navigateTo('yes', 'envelope');
                }}
                className="btn-cute-pink w-full sm:w-auto min-w-[168px] font-cute font-bold text-lg sm:text-xl px-7 py-3.5 rounded-full cursor-pointer"
              >
                YESSS 💗
              </button>

              <button
                type="button"
                onClick={() => navigateTo('no', 'sad')}
                className="btn-cute-cream w-full sm:w-auto min-w-[168px] font-cute font-bold text-lg sm:text-xl px-7 py-3.5 rounded-full cursor-pointer"
              >
                NOOO 💔
              </button>
            </div>
          </section>
        )}

        {/* SCREEN 2: NO BUTTON INTERACTION */}
        {screen === 'no' && (
          <section className="animate-pop-in relative bg-white/95 backdrop-blur-sm border-4 border-[#B8D8FF] rounded-[2.2rem] p-6 sm:p-8 shadow-[0_14px_35px_rgba(124,198,254,0.28)] text-center">
            <div className="washi-tape w-28 h-6 mx-auto -mt-9 mb-3 rounded-sm rotate-[2deg]" />

            <CryingKittySVG />

            <h2 className="font-cute font-bold text-2xl sm:text-3xl text-[#E63973] mt-3">
              AREYYY MERI MADAM 😭
            </h2>

            <div className="bg-[#FFF0F5] border-2 border-[#FFC2D1] rounded-2xl p-4 my-4 space-y-1.5">
              <p className="font-body font-bold text-lg sm:text-xl text-[#5C4033]">
                Itni bhi kya narazgi?
              </p>
              <p className="font-handwritten font-bold text-2xl sm:text-3xl text-[#D93B6A]">
                Ek baar aur soch lo naaa 🥺
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigateTo('opening', 'click')}
              className="btn-cute-pink w-full sm:w-auto font-cute font-bold text-lg sm:text-xl px-8 py-3.5 rounded-full cursor-pointer mt-2"
            >
              OKAY, LET ME THINK 💗
            </button>
          </section>
        )}

        {/* SCREEN 3: YES SCREEN (Interactive Pink Envelope) */}
        {screen === 'yes' && (
          <section className="animate-pop-in relative bg-white/94 backdrop-blur-sm border-4 border-[#FFC2D1] rounded-[2.2rem] p-6 sm:p-8 shadow-[0_14px_35px_rgba(255,133,161,0.26)] text-center">
            <div className="washi-tape w-28 h-6 mx-auto -mt-9 mb-3 rounded-sm rotate-[-1.5deg]" />
            <PinkBowSVG className="w-12 h-9 mx-auto mb-1" />

            <h2 className="font-cute font-bold text-3xl sm:text-4xl text-[#E63973]">
              YAYYYYY!! 🥹💗
            </h2>

            <p className="font-body font-bold text-lg sm:text-xl text-[#5C4033] mt-2">
              Aaliaa jiii, you opened my little surprise!
            </p>
            <p className="font-handwritten font-bold text-2xl sm:text-3xl text-[#8C4A5E] mt-1 mb-5">
              There&apos;s something I really want to tell you.
            </p>

            <div
              role="button"
              tabIndex={0}
              onClick={handleEnvelopeClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleEnvelopeClick();
              }}
              aria-label="Tap to open your apology letter envelope"
              className="group cursor-pointer py-3 px-2 rounded-3xl transition-transform hover:scale-[1.03] active:scale-95 focus:outline-none"
            >
              <AnimatedPinkEnvelopeSVG isOpen={envelopeOpened} />
              <div className="mt-3 inline-flex items-center gap-2 bg-[#FFF0F5] group-hover:bg-[#FFE0EB] border-2 border-[#FF85A1] text-[#D93B6A] font-cute font-bold text-sm sm:text-base px-5 py-2 rounded-full shadow-2xs transition">
                <span>{envelopeOpened ? 'Opening your letter... 💌' : 'Tap the envelope to open 💌'}</span>
              </div>
            </div>
          </section>
        )}

        {/* SCREEN 4: SHORT "DIFFERENT TYPES OF SORRYS" SCRAPBOOK LETTER */}
        {screen === 'letter' && (
          <section className="animate-pop-in relative letter-paper border-4 border-[#FF9EBB] rounded-[2rem] p-5 sm:p-8 shadow-[0_16px_38px_rgba(255,117,151,0.25)]">
            <div className="washi-tape w-32 h-6 mx-auto -mt-8 mb-4 rounded-sm rotate-[1deg]" />

            <CuteFlowerSVG className="w-9 h-9 absolute top-3 left-3 opacity-90" petalColor="#FFB3C6" />
            <CuteFlowerSVG className="w-9 h-9 absolute top-3 right-3 opacity-90" petalColor="#FFD6A5" />

            <div className="border-2 border-dashed border-[#FF85A1] rounded-2xl p-4 sm:p-6 bg-white/85">
              <div className="mb-3">
                <p className="font-handwritten font-bold text-3xl sm:text-4xl text-[#D93B6A]">
                  Dear Aaliaa jiii, 💌
                </p>
                <p className="font-handwritten font-bold text-2xl sm:text-3xl text-[#8C4A5E]">
                  Meri madam,
                </p>
              </div>

              <div className="max-h-[55vh] sm:max-h-[60vh] overflow-y-auto pr-1.5 cute-scroll space-y-2.5 my-3">
                {[
                  {
                    badge: 'Official Sorry 📜',
                    text: 'I am really, really, really sorry for my silly mistake!',
                    style: 'bg-[#FFF0F5] border-[#FF9EBB]',
                  },
                  {
                    badge: 'Fun-Gone-Wrong Sorry 🤡',
                    text: 'It was supposed to be a fun mistake, not something that upsets you.',
                    style: 'bg-[#FFF9DB] border-[#FFE082]',
                  },
                  {
                    badge: 'Kaan Pakad Ke Sorry 🙇‍♂️',
                    text: 'Both ears held tight — maafi de do meri madam!',
                    style: 'bg-[#FFE8EF] border-[#FF85A1]',
                  },
                  {
                    badge: 'Puppy-Eyes Sorry 🥺',
                    text: 'Look at my sad face... please forgive me?',
                    style: 'bg-[#FFF4E6] border-[#FFC078]',
                  },
                  {
                    badge: 'Chocolate & Treat Sorry 🍫',
                    text: 'Valid for your favourite snacks whenever you say!',
                    style: 'bg-[#F3F0FF] border-[#D0BFFF]',
                  },
                  {
                    badge: 'Dil Se Sorry ❤️',
                    text: 'No excuses, just a genuine sorry from your favourite troublemaker.',
                    style: 'bg-gradient-to-r from-[#FFE5EC] to-[#FFF0F5] border-[#FF7597]',
                  },
                ].map((item) => (
                  <div
                    key={item.badge}
                    className={`border-2 ${item.style} rounded-xl px-3.5 py-2.5 shadow-2xs transition-transform hover:scale-[1.01]`}
                  >
                    <p className="font-cute font-bold text-sm sm:text-base text-[#D93B6A]">
                      {item.badge}:
                    </p>
                    <p className="font-body font-bold text-sm sm:text-[15px] text-[#4E342E] leading-snug">
                      &ldquo;{item.text}&rdquo;
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-dashed border-[#FFC2D1] font-handwritten">
                <p className="font-bold text-2xl sm:text-3xl text-[#E63973]">
                  Your favourite troublemaker ❤️
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col items-center gap-3">
              <div className="text-sm font-cute text-[#A65E73]">💗 ✨ 🌸 ✨ 💗</div>
              <button
                type="button"
                onClick={() => navigateTo('special', 'click')}
                className="btn-cute-pink w-full sm:w-auto font-cute font-bold text-lg px-7 py-3.5 rounded-full cursor-pointer"
              >
                NEXT SURPRISE 🎀 →
              </button>
            </div>
          </section>
        )}

        {/* SCREEN 5: SPECIAL SCREEN FOR AALIA */}
        {screen === 'special' && (
          <section className="animate-pop-in relative bg-white/94 backdrop-blur-sm border-4 border-[#FFC2D1] rounded-[2.2rem] p-5 sm:p-8 shadow-[0_14px_35px_rgba(255,133,161,0.24)] text-center">
            <div className="washi-tape w-28 h-6 mx-auto -mt-8 mb-3 rounded-sm rotate-[1.5deg]" />
            <PinkBowSVG className="w-11 h-8 mx-auto mb-1" />

            <h2 className="font-cute font-bold text-2xl sm:text-4xl text-[#E63973] mb-1">
              TO MY FAVOURITE PERSON 💗
            </h2>
            <p className="font-body text-xs sm:text-sm font-bold text-[#9C6677] mb-5">
              (Tap any title sticker for a little love pop ✨)
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                { title: 'Aalia Madamm 🎀', bg: 'bg-[#FFF0F5] border-[#FF9EBB]', tilt: '-rotate-1' },
                { title: 'Aaliaa jiii 🥹', bg: 'bg-[#FFF9DB] border-[#FFE082]', tilt: 'rotate-1' },
                { title: 'Meri madam ❤️', bg: 'bg-[#FFE8EF] border-[#FF85A1]', tilt: 'rotate-1' },
                { title: 'My favourite person 💗', bg: 'bg-[#FFF4E6] border-[#FFC078]', tilt: '-rotate-1' },
                {
                  title: 'Pasandida aurat 🌷',
                  bg: 'bg-gradient-to-r from-[#FFE5EC] via-[#FFF0F5] to-[#FFF3CD] border-[#FF7597] sm:col-span-2',
                  tilt: 'rotate-0',
                },
              ].map((badge, index) => {
                const isPopped = poppedCards[index];
                return (
                  <button
                    key={badge.title}
                    type="button"
                    onClick={() => {
                      soundEngine.playHeartPop();
                      setPoppedCards((prev) => ({ ...prev, [index]: !prev[index] }));
                    }}
                    className={`relative border-2 ${badge.bg} ${badge.tilt} rounded-2xl py-3.5 px-4 shadow-2xs transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer ${
                      isPopped ? 'ring-4 ring-[#FF85A1]/40 scale-[1.02]' : ''
                    }`}
                  >
                    <span className="font-cute font-bold text-lg sm:text-xl text-[#5C4033]">
                      {badge.title}
                    </span>
                    {isPopped && (
                      <span className="absolute -top-2.5 -right-2 text-lg animate-bounce">💖</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="bg-[#FFF9FB] border-2 border-dashed border-[#FF9EBB] rounded-2xl p-5 text-left sm:text-center space-y-3 shadow-2xs">
              <p className="font-body font-bold text-base sm:text-lg text-[#5C4033] leading-relaxed">
                Some people are just special, and you are definitely one of those people.
              </p>
              <p className="font-body font-bold text-base sm:text-lg text-[#6E473B] leading-relaxed">
                No matter how silly our conversations get, how much we argue, or how many times I annoy you, you will always be someone I genuinely care about.
              </p>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => navigateTo('heartfelt', 'click')}
                className="btn-cute-pink w-full sm:w-auto font-cute font-bold text-lg px-7 py-3.5 rounded-full cursor-pointer"
              >
                Next: A Little Note From My Heart 🫂 →
              </button>
            </div>
          </section>
        )}

        {/* SCREEN 6: HEARTFELT APPRECIATION CARD + TEDDY BEAR */}
        {screen === 'heartfelt' && (
          <section className="animate-pop-in relative text-center">
            <div className="relative bg-gradient-to-b from-[#FFE5EC] via-[#FFD6E4] to-[#FFC2D1] border-4 border-[#FF7597] rounded-[2.6rem] p-6 sm:p-8 shadow-[0_16px_40px_rgba(255,92,138,0.28)]">
              <div className="w-14 h-14 mx-auto -mt-12 mb-2 bg-[#FF5C8A] border-4 border-white rounded-full flex items-center justify-center text-2xl shadow-md animate-heartbeat">
                💗
              </div>

              <CuteFlowerSVG className="w-9 h-9 absolute top-4 left-4" petalColor="#FFF0F5" />
              <CuteFlowerSVG className="w-9 h-9 absolute top-4 right-4" petalColor="#FFF0F5" />

              <div className="bg-white/94 border-2 border-[#FF8FA3] rounded-[2rem] p-5 sm:p-6 text-left space-y-3.5 shadow-inner">
                <p className="font-handwritten font-bold text-3xl text-[#D93B6A]">
                  Aaliaa jiii,
                </p>

                <p className="font-body font-bold text-[15px] sm:text-base text-[#5C4033] leading-relaxed">
                  I miss our normal conversations, the random talks, the endless laughter, and all those little moments with you.
                </p>

                <p className="font-body font-bold text-[15px] sm:text-base text-[#8C4A5E] leading-relaxed">
                  Honestly, you are one of the sweetest, prettiest, and most genuinely kind people I know. Your smile, your cute attitude, and the way you make even boring days feel special is unmatched.
                </p>

                <p className="font-body font-bold text-[15px] sm:text-base text-[#5C4033] leading-relaxed">
                  You deserve all the happiness, respect, and smiles in the world, meri madam.
                </p>

                <p className="font-body font-bold text-[15px] sm:text-base text-[#5C4033] leading-relaxed">
                  Can&apos;t wait for us to laugh about silly things again! Until then, keep shining and take care of yourself.
                </p>

                <p className="font-cute font-bold text-lg sm:text-xl text-[#D93B6A] pt-1">
                  Sending you a giant virtual hug. 🫂❤️
                </p>
              </div>

              <div className="mt-4">
                <TeddyBearHeartSVG />
              </div>

              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => navigateTo('final', 'click')}
                  className="btn-cute-pink w-full sm:w-auto font-cute font-bold text-lg px-7 py-3.5 rounded-full cursor-pointer"
                >
                  Next: One Last Thing... 🎀 →
                </button>
              </div>
            </div>
          </section>
        )}

        {/* SCREEN 7: FINAL SCREEN */}
        {screen === 'final' && (
          <section className="animate-pop-in relative bg-gradient-to-b from-[#FFFDF7] via-[#FFF0F6] to-[#FFE5EC] border-4 border-[#FF9EBB] rounded-[2.4rem] p-6 sm:p-9 shadow-[0_18px_42px_rgba(255,92,138,0.28)] text-center">
            <div className="washi-tape w-32 h-6 mx-auto -mt-10 mb-4 rounded-sm rotate-[1deg]" />
            <PinkBowSVG className="w-12 h-9 mx-auto mb-2" />

            <span className="inline-block bg-[#FFE082]/60 text-[#7A5230] font-cute font-bold text-xs sm:text-sm tracking-widest px-4 py-1 rounded-full mb-3">
              ONE LAST THING...
            </span>

            <h2 className="font-handwritten font-bold text-3xl sm:text-4xl text-[#D93B6A] mb-4">
              Aalia Madamm,
            </h2>

            <div className="bg-white/88 border-2 border-[#FFC2D1] rounded-2xl p-5 sm:p-6 space-y-3.5 text-[#5C4033] shadow-2xs">
              <p className="font-body font-bold text-base sm:text-lg leading-relaxed">
                Chahe tum abhi naraz ho, chahe mujhe daantna ho, that&apos;s okay.
              </p>

              <p className="font-body font-bold text-base sm:text-lg text-[#8C4A5E] leading-relaxed">
                Bas apna khayal rakhna, meri madam.
              </p>

              <p className="font-body font-bold text-base sm:text-lg leading-relaxed">
                You are and will always be my favourite person.
              </p>

              <p className="font-cute font-bold text-xl sm:text-2xl text-[#E63973] pt-1">
                Hamesha meri pasandida aurat rahogi. ❤️
              </p>
            </div>

            <div className="my-6 px-2">
              <h3 className="font-cute font-bold text-2xl sm:text-3xl md:text-[2rem] text-[#D93B6A] leading-snug">
                THIS LITTLE WEBSITE IS JUST FOR YOU, AALIAA JIII! 🎀
              </h3>
              <p className="font-body font-bold text-sm sm:text-base text-[#7A5230] mt-2">
                Made with a little regret, lots of care, and a sincere sorry.
              </p>
            </div>

            <div className="my-4 flex justify-center">
              <svg
                viewBox="0 0 120 110"
                className="w-20 h-20 animate-heartbeat drop-shadow-md"
                aria-label="Beating pink heart"
              >
                <path
                  d="M60 98 C60 98 12 66 12 34 C12 17 25 6 40 6 C50 6 57 12 60 18 C63 12 70 6 80 6 C95 6 108 17 108 34 C108 66 60 98 60 98 Z"
                  fill="#FF5C8A"
                  stroke="#5C4033"
                  strokeWidth="4"
                />
                <path
                  d="M27 28 Q34 18 44 22"
                  fill="none"
                  stroke="#FFE5EC"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={handleReplay}
                className="btn-cute-pink w-full sm:w-auto font-cute font-bold text-lg sm:text-xl px-8 py-4 rounded-full cursor-pointer"
              >
                REPLAY OUR LITTLE STORY 💗
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}