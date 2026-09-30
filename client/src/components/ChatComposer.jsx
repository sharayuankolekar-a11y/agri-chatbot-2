import React, { useState, useRef, useEffect } from 'react';
import { Camera, FolderPlus, Mic, MicOff, Send, X, Sprout, ShieldCheck, Droplets, FlaskConical, Bug, Sun } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ChatComposer({ onSend, isLoading }) {
  const { language, t, speechLocale, currentLanguage } = useLanguage();
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const langLabel = currentLanguage?.nativeName || currentLanguage?.name || 'English';

  const categoryChips = [
    { key: 'crop', label: t('hero.cmdCrop') || 'Crop', icon: Sprout, query: 'Which crop is best suited for my soil and seasonal condition?' },
    { key: 'disease', label: t('hero.cmdDisease') || 'Disease', icon: ShieldCheck, query: 'How do I identify and treat leaf spot fungal infection on tomatoes?' },
    { key: 'irrigation', label: t('hero.cmdWater') || 'Irrigation', icon: Droplets, query: 'What is the ideal drip irrigation schedule during flowering stage?' },
    { key: 'fertilizer', label: t('hero.cmdFertilizer') || 'Fertilizer', icon: FlaskConical, query: 'What is the recommended NPK fertilizer ratio for tillering stage?' },
    { key: 'pest', label: t('hero.cmdPest') || 'Pest', icon: Bug, query: 'How to make organic neem oil spray for controlling aphids?' },
    { key: 'weather', label: t('hero.cmdWeather') || 'Weather', icon: Sun, query: 'What precautions should I take before heavy rainfall?' }
  ];

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setText(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setSpeechError(t('composer.speechError'));
        setIsRecording(false);
        setTimeout(() => setSpeechError(''), 4000);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [t]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setSpeechError(t('composer.notSupported'));
      setTimeout(() => setSpeechError(''), 4000);
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.lang = speechLocale || 'en-IN';
        recognitionRef.current.start();
        setIsRecording(true);
        setSpeechError('');
      } catch (err) {
        console.warn('Speech start error:', err);
        setIsRecording(false);
      }
    }
  };

  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setImagePreview(uploadEvent.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if ((!text.trim() && !imagePreview) || isLoading) return;

    const currentText = text;
    const currentImage = imagePreview;

    try {
      const res = await onSend({
        queryText: currentText,
        image: currentImage,
        language: language
      });

      if (res !== false) {
        setText('');
        setImagePreview(null);
      }
    } catch (err) {
      console.error('Submission error:', err);
    }
  };

  const handleChipClick = async (query) => {
    if (isLoading) return;
    try {
      await onSend({
        queryText: query,
        image: null,
        language: language
      });
    } catch (err) {
      console.error('Chip click submission error:', err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full space-y-3 select-none-or-normal">
      
      {/* Speech Error Banner */}
      {speechError && (
        <div className="p-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold text-center shadow-sm">
          {speechError}
        </div>
      )}

      {/* Voice Recording Indicator */}
      {isRecording && (
        <div className="px-3.5 py-1.5 rounded-full bg-[#14532D] text-white text-xs font-bold flex items-center justify-center gap-2 mx-auto w-max shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>● {t('composer.listening')}</span>
        </div>
      )}

      {/* Attached Image Preview */}
      {imagePreview && (
        <div className="relative inline-block p-2 rounded-2xl bg-white border border-[#1F7A4D]/20 shadow-lg">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100">
            <img src={imagePreview} alt="Crop Upload Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => setImagePreview(null)}
              className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition-colors"
              aria-label={t('composer.remove')}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="text-[10px] font-semibold text-[#1F7A4D] block text-center mt-1">
            {t('composer.imageAttached')}
          </span>
        </div>
      )}

      {/* FLOATING FARM COMMAND CONSOLE */}
      <form onSubmit={handleSubmit} className="w-full">
        <div className={`p-2.5 sm:p-3 rounded-full bg-[#FFFDF6] dark:bg-[#091A13] border transition-all duration-300 shadow-lg shadow-black/10 flex items-center gap-2 ${
          isFocused
            ? 'border-[#1F7A4D] ring-4 ring-[#4B8A3A]/15'
            : 'border-[#DCCFB0] hover:border-[#1F7A4D]/50'
        }`}>
          
          {/* Hidden File Inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageFile}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageFile}
            className="hidden"
          />

          {/* Input Text Area */}
          <div className="flex-1 min-w-0 pl-3">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={t('composer.placeholder') || 'Ask AgriSphere about your farm...'}
              className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none text-xs sm:text-sm font-semibold"
            />
          </div>

          {/* Inside Input Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 pr-1">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="px-2.5 py-1.5 rounded-full text-slate-600 dark:text-slate-300 hover:text-[#1F7A4D] hover:bg-[#1F7A4D]/10 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title={t('composer.camera')}
            >
              <Camera className="w-4 h-4 text-[#1F7A4D]" />
              <span className="hidden sm:inline">{t('composer.camera')}</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 rounded-full text-slate-600 dark:text-slate-300 hover:text-[#1F7A4D] hover:bg-[#1F7A4D]/10 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title={t('composer.upload')}
            >
              <FolderPlus className="w-4 h-4 text-[#1F7A4D]" />
              <span className="hidden sm:inline">{t('composer.upload')}</span>
            </button>

            <button
              type="button"
              onClick={toggleRecording}
              className={`px-2.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 text-xs font-semibold ${
                isRecording
                  ? 'bg-[#1F7A4D] text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-[#1F7A4D] hover:bg-[#1F7A4D]/10'
              }`}
              title={`Voice (${langLabel})`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#1F7A4D]" />}
              <span className="hidden sm:inline">{t('composer.voice')}</span>
            </button>

            {/* Circular Green Send Button */}
            <button
              type="submit"
              disabled={(!text.trim() && !imagePreview) || isLoading}
              aria-label={t('composer.send')}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1F7A4D] hover:bg-[#14532D] disabled:opacity-40 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      </form>

      {/* CATEGORY PILL CHIPS (Directly below composer) */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {categoryChips.map((chip) => {
          const Icon = chip.icon;
          return (
            <button
              key={chip.key}
              onClick={() => handleChipClick(chip.query)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFFDF6]/95 dark:bg-[#091A13] border border-[#DCCFB0] hover:border-[#1F7A4D] text-slate-800 dark:text-slate-200 hover:text-[#1F5C3A] dark:hover:text-emerald-400 text-xs font-semibold shadow-sm transition-all hover:-translate-y-px"
            >
              <Icon className="w-3.5 h-3.5 text-[#1F7A4D]" />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
}
