'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks';
import { PrivacyLevel } from '@/lib/types';

const HEALTH_GOALS = [
  { id: 'weight-loss', label: 'Weight Loss', icon: '⬇️' },
  { id: 'energy', label: 'More Energy', icon: '⚡' },
  { id: 'sleep', label: 'Better Sleep', icon: '😴' },
  { id: 'strength', label: 'Strength Building', icon: '💪' },
  { id: 'mental-wellness', label: 'Mental Wellness', icon: '🧘' },
  { id: 'flexibility', label: 'Flexibility', icon: '🤸' },
];

const DIETARY_OPTIONS = [
  { id: 'vegan', label: 'Vegan', icon: '🌱' },
  { id: 'vegetarian', label: 'Vegetarian', icon: '🥬' },
  { id: 'gluten-free', label: 'Gluten-Free', icon: '🌾' },
  { id: 'nut-allergy', label: 'Nut Allergy', icon: '🥜' },
  { id: 'halal', label: 'Halal', icon: '✨' },
  { id: 'kosher', label: 'Kosher', icon: '✡️' },
  { id: 'diabetic-friendly', label: 'Diabetic-Friendly', icon: '💉' },
  { id: 'dairy-free', label: 'Dairy-Free', icon: '🥛' },
];

const LIMITATION_PRESETS = [
  'Mobility impairment', 'Chronic pain', 'Back issues', 'Knee problems', 'Visual impairment', 'Heart condition', 'None',
];

const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

interface ChatMessage { role: 'user' | 'bot'; text: string; }

const TOTAL_STEPS = 7;

export default function OnboardingPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 1: Goals
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  // Step 2: Profile
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');

  // Step 3: Dietary
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);

  // Step 4: Limitations
  const [limitations, setLimitations] = useState('');
  const [limitationPreset, setLimitationPreset] = useState('');

  // Step 5: Medications
  const [medications, setMedications] = useState('');

  // Step 6: Schedule chatbot
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'bot', text: "Hey! Tell me about your typical day — when you wake up, when you work, meals, evenings. I'll find the best windows for meals, movement, and rest. 😊" },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [scheduleDescription, setScheduleDescription] = useState('');
  const [chatDone, setChatDone] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [chatLoading, setChatLoading] = useState(false);

  // Step 7: Privacy
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>('followers');

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const toggleGoal = (id: string) => {
    setSelectedGoals(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const toggleDiet = (id: string) => {
    setDietaryRestrictions(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleLimitationPreset = (preset: string) => {
    setLimitationPreset(preset);
    if (preset === 'None') setLimitations('');
    else setLimitations(prev => prev ? `${prev}, ${preset}` : preset);
  };

  const sendScheduleMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    const newMessages: ChatMessage[] = [...chatMessages, { role: 'user', text: userMsg }];
    setChatMessages(newMessages);
    setChatLoading(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are a friendly health coach assistant helping a user map out their daily schedule to find optimal windows for meals, movement, and rest. 
After 1-2 exchanges, summarize the key time windows you identified and tell them you're done — end your final message with exactly the string: [SCHEDULE_COMPLETE]
Keep responses concise, warm, and practical. Don't ask more than one or two clarifying questions at most.`,
          messages: newMessages.map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.text })),
        }),
      });
      const data = await response.json();
      const botText = data.content?.[0]?.text || "Got it! I've noted your schedule.";
      setChatMessages(prev => [...prev, { role: 'bot', text: botText.replace('[SCHEDULE_COMPLETE]', '') }]);
      setScheduleDescription(userMsg);
      if (botText.includes('[SCHEDULE_COMPLETE]')) setChatDone(true);
    } catch {
      setChatMessages(prev => [...prev, { role: 'bot', text: "Thanks! I've noted your schedule. You can click Continue when ready." }]);
      setScheduleDescription(userMsg);
      setChatDone(true);
    }
    setChatLoading(false);
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 1 && selectedGoals.length === 0) e.goals = 'Select at least one goal';
    if (step === 2) {
      if (!name.trim()) e.name = 'Name is required';
      if (!email.trim()) e.email = 'Email is required';
      if (!gender) e.gender = 'Please select a gender option';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    if (step === 6 && !chatDone && scheduleDescription === '') {
      setErrors({ chat: 'Please tell us about your schedule first' });
      return;
    }
    if (step === TOTAL_STEPS) {
      login({
        email,
        name,
        gender,
        age: age ? parseInt(age) : undefined,
        healthGoals: selectedGoals,
        dietaryPreference: dietaryRestrictions[0] || 'none',
        dietaryRestrictions,
        physicalLimitations: limitations,
        medications,
        scheduleDescription,
        privacyLevel,
      });
      router.push('/dashboard');
      return;
    }
    setErrors({});
    setStep(s => s + 1);
  };

  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen bg-brand-light pb-28">
      {/* Header */}
      <div className="pt-10 px-6 text-center mb-6">
        <div className="text-5xl mb-2">💚</div>
        <h1 className="text-3xl font-bold text-neutral-text">HealthSync</h1>
        <p className="text-neutral-muted text-sm mt-1">Your personalized wellness plan</p>
      </div>

      {/* Progress */}
      <div className="px-6 mb-8">
        <div className="h-2 bg-neutral-border rounded-full overflow-hidden">
          <div className="h-full bg-brand-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between mt-2">
          <p className="text-xs text-neutral-muted">Step {step} of {TOTAL_STEPS}</p>
          <p className="text-xs text-brand-primary font-medium">{Math.round(progress)}%</p>
        </div>
      </div>

      {/* Step 1: Goals */}
      {step === 1 && (
        <div className="px-6 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-neutral-text mb-1">What are your health goals?</h2>
          <p className="text-sm text-neutral-muted mb-4">Pick up to 3</p>
          <div className="grid grid-cols-2 gap-3">
            {HEALTH_GOALS.map(g => (
              <button key={g.id} onClick={() => toggleGoal(g.id)}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${selectedGoals.includes(g.id) ? 'border-brand-primary bg-white shadow-sm' : 'border-neutral-border bg-white hover:border-neutral-muted'}`}>
                <span className="text-2xl">{g.icon}</span>
                <span className="text-xs font-medium text-neutral-text text-center">{g.label}</span>
                {selectedGoals.includes(g.id) && <span className="text-brand-primary text-xs">✓ Selected</span>}
              </button>
            ))}
          </div>
          {errors.goals && <p className="text-red-500 text-xs mt-3">{errors.goals}</p>}
        </div>
      )}

      {/* Step 2: Profile */}
      {step === 2 && (
        <div className="px-6 max-w-md mx-auto space-y-4">
          <h2 className="text-xl font-bold text-neutral-text mb-1">Basic Profile</h2>
          <div>
            <label className="block text-sm font-semibold text-neutral-text mb-2">Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="input-base" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-text mb-2">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="input-base" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-text mb-2">Gender</label>
            <div className="grid grid-cols-2 gap-2">
              {GENDER_OPTIONS.map(g => (
                <button key={g} onClick={() => setGender(g)}
                  className={`py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${gender === g ? 'border-brand-primary bg-brand-light text-brand-dark' : 'border-neutral-border bg-white text-neutral-text'}`}>
                  {g}
                </button>
              ))}
            </div>
            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-text mb-2">Age <span className="text-neutral-muted font-normal">(optional)</span></label>
            <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 28" min="13" max="110" className="input-base" />
          </div>
        </div>
      )}

      {/* Step 3: Dietary */}
      {step === 3 && (
        <div className="px-6 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-neutral-text mb-1">Dietary Restrictions</h2>
          <p className="text-sm text-neutral-muted mb-4">Select all that apply</p>
          <div className="grid grid-cols-2 gap-3">
            {DIETARY_OPTIONS.map(d => (
              <button key={d.id} onClick={() => toggleDiet(d.id)}
                className={`p-3 rounded-xl border-2 flex items-center gap-2 transition-all text-left ${dietaryRestrictions.includes(d.id) ? 'border-brand-primary bg-white' : 'border-neutral-border bg-white hover:border-neutral-muted'}`}>
                <span className="text-xl">{d.icon}</span>
                <span className="text-xs font-medium text-neutral-text">{d.label}</span>
                {dietaryRestrictions.includes(d.id) && <span className="ml-auto text-brand-primary text-xs">✓</span>}
              </button>
            ))}
          </div>
          <p className="text-xs text-neutral-muted mt-4 text-center">You can skip this if you have no restrictions</p>
        </div>
      )}

      {/* Step 4: Limitations */}
      {step === 4 && (
        <div className="px-6 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-neutral-text mb-1">Physical Limitations</h2>
          <p className="text-sm text-neutral-muted mb-4">This helps us filter out unsuitable activities</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {LIMITATION_PRESETS.map(p => (
              <button key={p} onClick={() => handleLimitationPreset(p)}
                className={`px-3 py-1.5 rounded-full text-sm border-2 transition-all ${limitationPreset === p ? 'border-brand-primary bg-brand-light text-brand-dark' : 'border-neutral-border bg-white text-neutral-text'}`}>
                {p}
              </button>
            ))}
          </div>
          <textarea value={limitations} onChange={e => setLimitations(e.target.value)}
            placeholder="Describe any physical limitations or leave blank if none..."
            className="input-base min-h-[100px] resize-none" />
        </div>
      )}

      {/* Step 5: Medications */}
      {step === 5 && (
        <div className="px-6 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-neutral-text mb-1">Medications</h2>
          <p className="text-sm text-neutral-muted mb-2">Optional — used only to flag general exercise contraindications (e.g., beta blockers → avoid high-intensity)</p>
          <textarea value={medications} onChange={e => setMedications(e.target.value)}
            placeholder="e.g. metoprolol, lisinopril, or leave blank..."
            className="input-base min-h-[100px] resize-none" />
          <p className="text-xs text-neutral-muted mt-3">🔒 This stays on your device and is never shared.</p>
        </div>
      )}

      {/* Step 6: Schedule chatbot */}
      {step === 6 && (
        <div className="px-6 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-neutral-text mb-1">Your Daily Schedule</h2>
          <p className="text-sm text-neutral-muted mb-4">Chat with our AI to map out your day</p>
          <div className="bg-white rounded-xl border border-neutral-border h-64 overflow-y-auto p-4 space-y-3 mb-3">
            {chatMessages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${m.role === 'user' ? 'bg-brand-primary text-white rounded-br-sm' : 'bg-neutral-bg text-neutral-text rounded-bl-sm'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-neutral-bg px-4 py-2 rounded-2xl rounded-bl-sm">
                  <span className="text-neutral-muted text-sm">Typing…</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="flex gap-2">
            <input value={chatInput} onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendScheduleMessage()}
              placeholder="e.g. I wake at 7am, desk job 9-5..."
              className="input-base flex-1 py-2" disabled={chatDone} />
            <button onClick={sendScheduleMessage} disabled={chatDone || chatLoading}
              className="btn-primary px-4 disabled:opacity-40">➤</button>
          </div>
          {chatDone && <p className="text-brand-primary text-xs mt-2 text-center">✓ Schedule captured! Click Continue.</p>}
          {errors.chat && <p className="text-red-500 text-xs mt-2">{errors.chat}</p>}
        </div>
      )}

      {/* Step 7: Privacy */}
      {step === 7 && (
        <div className="px-6 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-neutral-text mb-1">Privacy Settings</h2>
          <p className="text-sm text-neutral-muted mb-6">Control who sees your activity. You can change this later in Profile.</p>
          <div className="space-y-3">
            {([
              { level: 'private', icon: '🔒', title: 'Private', desc: 'Only you see your data. No social features.' },
              { level: 'followers', icon: '👥', title: 'Followers Only', desc: 'Share with people you follow. Activity, route, and group features unlocked.' },
              { level: 'everyone', icon: '🌍', title: 'Everyone', desc: 'Fully public. Maximum social engagement.' },
            ] as const).map(opt => (
              <button key={opt.level} onClick={() => setPrivacyLevel(opt.level)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${privacyLevel === opt.level ? 'border-brand-primary bg-white' : 'border-neutral-border bg-white hover:border-neutral-muted'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{opt.icon}</span>
                  <div>
                    <p className="font-semibold text-neutral-text">{opt.title}</p>
                    <p className="text-xs text-neutral-muted mt-0.5">{opt.desc}</p>
                  </div>
                  {privacyLevel === opt.level && <span className="ml-auto text-brand-primary text-lg">✓</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 px-6 py-4 bg-white border-t border-neutral-border flex gap-3 max-w-2xl mx-auto w-full">
        <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}
          className="btn-secondary flex-1 disabled:opacity-40">
          Back
        </button>
        <button onClick={handleNext} className="btn-primary flex-1">
          {step === TOTAL_STEPS ? '🚀 Get My Plan' : 'Continue →'}
        </button>
      </div>
    </div>
  );
}