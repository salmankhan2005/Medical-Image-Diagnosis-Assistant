import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  Briefcase,
  ArrowRight,
  Info,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SignInViewProps {
  onBackToLanding: () => void;
}

export const SignInView: React.FC<SignInViewProps> = ({ onBackToLanding }) => {
  const { login } = useApp();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<string>('Retina Specialist');

  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');

  const validateEmail = (val: string) => {
    setEmail(val);
    if (!val) {
      setEmailError('Hospital email is required.');
    } else if (!/\S+@\S+\.\S+/.test(val)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = (val: string) => {
    setPassword(val);
    if (!val) {
      setPasswordError('Password is required.');
    } else if (val.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
    } else {
      setPasswordError('');
    }
  };

  const validateName = (val: string) => {
    setName(val);
    if (!val) {
      setNameError('Full name is required.');
    } else if (val.length < 3) {
      setNameError('Name must be at least 3 characters.');
    } else {
      setNameError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Trigger validations
    validateName(name);
    validateEmail(email);
    validatePassword(password);

    if (nameError || emailError || passwordError || !name || !email || !password) {
      return;
    }

    login(name, email, role);
  };

  const handleDemoBypass = () => {
    setName('Dr. Alex Morgan');
    setEmail('alex.morgan@medvision.org');
    setPassword('demoPass123');
    setRole('Chief of Ophthalmology');
    login('Dr. Alex Morgan', 'alex.morgan@medvision.org', 'Chief of Ophthalmology');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-brand-indigo selection:text-white flex flex-col justify-between overflow-hidden relative">
      {/* Background glow meshes */}
      <div className="absolute top-[20%] left-[-10%] w-[45%] h-[45%] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a03_1px,transparent_1px),linear-gradient(to_bottom,#0f172a03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 h-20 w-full flex items-center justify-between">
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-900 transition-colors"
        >
          <span>← Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-indigo to-teal-400 p-0.5 flex items-center justify-center font-black text-white text-xs">
            M
          </div>
          <span className="font-extrabold text-sm tracking-tight text-slate-900">
            MedVision <span className="text-brand-indigo">AI</span>
          </span>
        </div>
      </header>

      {/* Main Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-bento relative overflow-hidden">
          {/* Subtle inside card glow */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-indigo/5 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-2 text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-brand-indigo text-[10px] font-black tracking-wider uppercase mx-auto">
              <ShieldCheck className="w-3.5 h-3.5" /> Secure Clinician Gateway
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Access Portal</h2>
            <p className="text-slate-500 text-xs leading-relaxed">
              Enter your clinical credentials to access patient scans and telemetry diagnostics.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Dr. Emily Harris"
                  value={name}
                  onChange={(e) => validateName(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${nameError ? 'border-rose-500' : 'border-slate-200'} focus:border-brand-indigo rounded-xl text-xs font-semibold focus:outline-none focus:bg-white text-slate-950 transition-colors`}
                />
              </div>
              {nameError && (
                <p className="text-[10px] text-rose-500 font-bold flex items-center gap-1">
                  <Info className="w-3 h-3" /> {nameError}
                </p>
              )}
            </div>

            {/* Hospital Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Hospital Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="emily.harris@hospitals.org"
                  value={email}
                  onChange={(e) => validateEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${emailError ? 'border-rose-500' : 'border-slate-200'} focus:border-brand-indigo rounded-xl text-xs font-semibold focus:outline-none focus:bg-white text-slate-950 transition-colors`}
                />
              </div>
              {emailError && (
                <p className="text-[10px] text-rose-500 font-bold flex items-center gap-1">
                  <Info className="w-3 h-3" /> {emailError}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => validatePassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${passwordError ? 'border-rose-500' : 'border-slate-200'} focus:border-brand-indigo rounded-xl text-xs font-semibold focus:outline-none focus:bg-white text-slate-950 transition-colors`}
                />
              </div>
              {passwordError && (
                <p className="text-[10px] text-rose-500 font-bold flex items-center gap-1">
                  <Info className="w-3 h-3" /> {passwordError}
                </p>
              )}
            </div>

            {/* Clinical Role */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Clinical Role
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-indigo rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white transition-colors appearance-none"
                >
                  <option value="Retina Specialist">Retina Specialist</option>
                  <option value="Ophthalmology Resident">Ophthalmology Resident</option>
                  <option value="Chief of Ophthalmology">Chief of Ophthalmology</option>
                  <option value="Clinical Research Fellow">Clinical Research Fellow</option>
                </select>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-brand-indigo hover:bg-brand-indigo-dark text-white rounded-xl text-xs font-bold transition-all duration-200 shadow-md shadow-brand-indigo/15 active:scale-98"
              >
                <span>Authorize & Enter Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Demo Bypass */}
          <div className="mt-6 pt-4 border-t border-slate-200 text-center">
            <button
              onClick={handleDemoBypass}
              className="text-[11px] text-slate-500 hover:text-brand-indigo font-bold transition-colors inline-flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal" />
              <span>Use Demo Clinician Credentials</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-slate-500 text-[10px] border-t border-slate-200 bg-white">
        <span>🔒 Secure 256-bit encryption. All diagnostic history protected under HIPAA compliance.</span>
      </footer>
    </div>
  );
};
