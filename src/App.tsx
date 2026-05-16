import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  Upload,
  Dog,
  Cat,
  Activity,
  History,
  LogOut,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Play,
  FileText,
  User as UserIcon,
  Plus,
  MessageSquare,
  Send,
  Trash2,
  Settings,
  Zap,
  ShieldAlert,
  ArrowLeft,
  Utensils,
  Syringe,
  Pencil,
  Calendar,
  Clock,
  Bell,
  Flame,
  Copy,
  Share2,
  Menu,
  X,
  Camera
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from './lib/AuthContext';

// ─────────────────────────────────────────────────────────────────────────────
// API URL Strategy (commercial app):
//
//   Native - dev build  (vite build --mode development):
//     import.meta.env.DEV = true  →  10.0.2.2:3000  (your PC via emulator alias)
//
//   Native - release build  (vite build):
//     import.meta.env.DEV = false  →  Cloud Run  (production backend, has API key)
//
//   Web browser preview  (npm run dev):
//     VITE_API_BASE_URL from .env  →  localhost:3000
//
//   The Gemini API key is NEVER in the bundle — it lives only on the server.
// ─────────────────────────────────────────────────────────────────────────────
const CLOUD_RUN_URL = 'https://ais-dev-ffaggajiuq-nw.a.run.app';
const API_BASE_URL = CLOUD_RUN_URL;

console.log("[API] Production Base URL:", API_BASE_URL);

const TrainingChallengeCard = ({ challenge, onCompleteDay }: { challenge: any, onCompleteDay?: (day: number) => void }) => {
  if (!challenge) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900 p-4 lg:p-8 rounded-3xl border border-zinc-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-zinc-800 rounded-2xl flex items-center justify-center">
          <Flame className="w-5 h-5 lg:w-6 lg:h-6 text-gold-400" />
        </div>
        <div>
          <h3 className="text-lg lg:text-xl font-black font-serif text-gold-400">{challenge.title}</h3>
          <p className="text-xs lg:text-sm text-zinc-400">7-Day Training Challenge</p>
        </div>
      </div>

      <p className="text-sm lg:text-base text-zinc-400 mb-8 leading-relaxed">{challenge.description}</p>

      <div className="space-y-4">
        {challenge.days?.map((day: any, idx: number) => {
          const isCompleted = challenge.completedDays?.includes(day.day);
          return (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-4 lg:p-6 rounded-2xl border transition-all ${isCompleted
                  ? 'bg-zinc-800 border-emerald-100'
                  : 'bg-zinc-950 border-zinc-800 hover:border-gold-500/50'
                }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] lg:text-xs font-bold uppercase tracking-widest ${isCompleted ? 'text-emerald-600' : 'text-zinc-500'}`}>
                  Day {day.day}
                </span>
                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  >
                    <CheckCircle2 className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-600" />
                  </motion.div>
                )}
              </div>
              <p className={`font-bold text-base lg:text-lg mb-1 ${isCompleted ? 'text-emerald-900' : 'text-zinc-100'}`}>
                {day.exercise}
              </p>
              <p className={`text-xs lg:text-sm ${isCompleted ? 'text-emerald-700' : 'text-zinc-400'}`}>
                <span className="font-semibold">Goal:</span> {day.goal}
              </p>

              {!isCompleted && onCompleteDay && (
                <button
                  onClick={() => onCompleteDay(day.day)}
                  className="mt-4 w-full py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-xl text-sm font-bold hover:bg-zinc-950 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.4)] active:scale-95"
                >
                  Mark as Completed
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

const SubscriptionPage = ({ message, onUpgrade, onRestore, onClose, isSandbox, onWatchAd, isWatchingAd, type, onShowTerms, onShowPrivacy }: { message: string, onUpgrade: (pkg?: any) => void, onRestore: () => void, onClose: () => void, isSandbox?: boolean, onWatchAd?: () => void, isWatchingAd?: boolean, type?: 'analysis' | 'chat' | 'upgrade', onShowTerms: () => void, onShowPrivacy: () => void }) => {
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(true);

  useEffect(() => {
    const fetchOfferings = async () => {
      if (!Capacitor.isNativePlatform()) {
        setIsLoadingPackages(false);
        return;
      }
      try {
        const offerings = await Purchases.getOfferings();
        if (offerings.current && offerings.current.availablePackages) {
          setPackages(offerings.current.availablePackages);
        }
      } catch (err) {
        console.error("Failed to fetch offerings", err);
      } finally {
        setIsLoadingPackages(false);
      }
    };
    fetchOfferings();
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-end lg:items-center justify-center p-0 lg:p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="bg-zinc-900 rounded-t-[32px] lg:rounded-[32px] p-8 max-w-md w-full shadow-2xl border border-zinc-800 overflow-hidden"
      >
        <div className="flex justify-center mb-4 lg:hidden">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
        </div>

        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-gold-500/10 rounded-2xl flex items-center justify-center">
              <Zap className="w-8 h-8 text-gold-400" />
            </div>
            {isSandbox && (
              <span className="bg-gold-500/20 text-gold-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                Sandbox Mode
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:bg-zinc-950 rounded-full transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <h3 className="text-2xl font-black font-serif text-gold-400 mb-3">
          Unlock Pawsitive Behavior Pro
        </h3>
        <p className="text-zinc-400 mb-8 leading-relaxed">
          {message || "Get unlimited access to behavioral analyses, expert chats, and advanced training tools."}
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            </div>
            Unlimited Video Analyses
          </div>
          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            </div>
            Unlimited Expert Chat Follow-ups
          </div>
          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            </div>
            Priority AI Processing
          </div>
        </div>

        <div className="space-y-3">
          {isLoadingPackages ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-gold-500" />
            </div>
          ) : packages.length > 0 ? (
            packages.map((pkg) => (
              <button
                key={pkg.identifier}
                onClick={() => onUpgrade(pkg)}
                className="w-full py-4 mb-3 bg-gold-500 text-white font-bold rounded-2xl hover:bg-gold-600 transition-all shadow-[0_10px_40px_rgba(0,0,0,0.6)] shadow-gold-500/20 flex flex-col items-center justify-center gap-1"
              >
                <span>{pkg.packageType === 'ANNUAL' ? 'Yearly Pro' : 'Monthly Pro'}</span>
                <span className="text-xs font-normal opacity-90">{pkg.product.priceString} {pkg.packageType === 'ANNUAL' ? '/ year' : '/ month'}</span>
              </button>
            ))
          ) : (
            <button
              onClick={() => onUpgrade()}
              className="w-full py-4 bg-gold-500 text-white font-bold rounded-2xl hover:bg-gold-600 transition-all shadow-[0_10px_40px_rgba(0,0,0,0.6)] shadow-gold-500/20 flex items-center justify-center gap-2"
            >
              Subscribe for $9.99/mo
            </button>
          )}

          {onWatchAd && type !== 'upgrade' && (
            <button
              onClick={onWatchAd}
              disabled={isWatchingAd}
              className="w-full py-3 bg-zinc-800 text-zinc-300 font-bold rounded-2xl hover:bg-zinc-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isWatchingAd ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Play className="w-5 h-5" />
              )}
              Watch Ad for 1 Free {type === 'chat' ? 'Chat' : 'Analysis'}
            </button>
          )}

          <button
            onClick={onRestore}
            className="w-full py-3 text-zinc-400 font-bold hover:bg-zinc-950 rounded-2xl transition-all text-sm"
          >
            Restore Purchases
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] text-zinc-500 font-medium">
          <button onClick={onShowTerms} className="hover:text-gold-400 underline">Terms of Use (EULA)</button>
          <button onClick={onShowPrivacy} className="hover:text-gold-400 underline">Privacy Policy</button>
        </div>
      </motion.div>
    </div>
  );
};

const ConsistencyChart = ({ activityLog }: { activityLog: any[] }) => {
  // activityLog is an array of timestamps
  const data = [...activityLog]
    .sort((a, b) => a.toMillis() - b.toMillis())
    .reduce((acc: any[], curr, idx) => {
      const date = new Date(curr.toMillis()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      acc.push({
        date,
        sessions: idx + 1,
        target: 30
      });
      return acc;
    }, []);

  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center bg-zinc-950 rounded-2xl border border-dashed border-zinc-800">
        <p className="text-zinc-500 text-sm">Start training to see your progress!</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-zinc-900 p-3 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] border border-zinc-800">
                    <p className="text-xs font-bold text-zinc-500 uppercase mb-1">{payload[0].payload.date}</p>
                    <p className="text-sm font-bold text-gold-400">Total Sessions: {payload[0].value}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="sessions"
            stroke="#f59e0b"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorSessions)"
          />
          <Line
            type="monotone"
            dataKey="target"
            stroke="#94a3b8"
            strokeDasharray="5 5"
            dot={false}
            strokeWidth={1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const StreakHeader = ({ streak, activityLog }: { streak: number, activityLog: any[] }) => {
  const today = new Date().toDateString();
  const hasUploadedToday = activityLog.some(ts => new Date(ts.toMillis()).toDateString() === today);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6 bg-zinc-900 p-4 lg:p-6 rounded-3xl border border-zinc-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)] mb-8">
      <div className="relative w-16 h-16 lg:w-20 lg:h-20">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle className="text-slate-100 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent" />
          <motion.circle
            className="text-gold-500 stroke-current"
            strokeWidth="8"
            strokeDasharray={251.2}
            initial={{ strokeDashoffset: 251.2 }}
            animate={{ strokeDashoffset: hasUploadedToday ? 0 : 251.2 }}
            transition={{ duration: 1, ease: "easeOut" }}
            strokeLinecap="round"
            cx="50" cy="50" r="40" fill="transparent"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={hasUploadedToday ? {
              scale: [1, 1.2, 1],
              filter: ["drop-shadow(0 0 0px rgba(245, 158, 11, 0))", "drop-shadow(0 0 8px rgba(245, 158, 11, 0.5))", "drop-shadow(0 0 0px rgba(245, 158, 11, 0))"]
            } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Flame className={`w-6 h-6 lg:w-8 lg:h-8 ${hasUploadedToday ? 'text-gold-500' : 'text-slate-300'}`} />
          </motion.div>
        </div>
      </div>
      <div className="text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <h2 className="text-2xl lg:text-3xl font-black font-serif text-zinc-100">🔥 {streak} Day Streak</h2>
          {hasUploadedToday && (
            <span className="bg-gold-500/20 text-gold-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              Daily Goal Met
            </span>
          )}
        </div>
        <p className="text-sm text-zinc-400 mt-1">
          {hasUploadedToday
            ? "Great job! You've completed your training for today."
            : "Keep the momentum going! Upload a video to maintain your streak."}
        </p>
      </div>
    </div>
  );
};
import {
  signInWithGoogle,
  logout,
  db,
  auth,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  storage,
  ref,
  uploadBytesResumable,
  uploadString,
  getDownloadURL,
  addDoc,
  getDocs,
  updateDoc,
  setDoc,
  deleteDoc,
  doc,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  handleFirestoreError,
  OperationType,
  increment
} from './lib/firebase';
import { rewardedAdService } from './lib/adService';
import { Capacitor } from '@capacitor/core';
import { Purchases } from '@revenuecat/purchases-capacitor';
import { Share } from '@capacitor/share';
import { Camera as CapCamera } from '@capacitor/camera';

export default function App() {
  const { user, userData, loading, isAdmin, setUserData } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'upload' | 'history' | 'pets' | 'settings' | 'reminders' | 'challenges'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [userQuestion, setUserQuestion] = useState('');
  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [selectedPetForAnalyses, setSelectedPetForAnalyses] = useState<any | null>(null);
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [pets, setPets] = useState<any[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState<{ type: 'analysis' | 'chat' | 'upgrade', message: string } | null>(null);
  const [paywallCooldown, setPaywallCooldown] = useState(false);

  // Upload/Recording state
  const [showUploadTypeModal, setShowUploadTypeModal] = useState(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [isCameraPreview, setIsCameraPreview] = useState(false);
  const [recordingTimeLeft, setRecordingTimeLeft] = useState(30);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const isCancelledRef = useRef(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<'user' | 'environment'>('user');
  const [isStopping, setIsStopping] = useState(false);
  const chunksRef = useRef<Blob[]>([]);

  // Challenges state
  const [challenges, setChallenges] = useState<any[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [isProcessingChallenge, setIsProcessingChallenge] = useState(false);

  // Referral state
  const [referralInput, setReferralInput] = useState('');
  const [isSubmittingReferral, setIsSubmittingReferral] = useState(false);

  // Pet management state
  const [isAddingPet, setIsAddingPet] = useState(false);
  const [editingPetId, setEditingPetId] = useState<string | null>(null);
  const [petImageFile, setPetImageFile] = useState<File | null>(null);
  const [isUploadingPetImage, setIsUploadingPetImage] = useState(false);
  const [newPet, setNewPet] = useState({
    name: '',
    species: 'dog',
    breed: '',
    age: '',
    personality: '',
    photoUrl: '',
    diet: '',
    vaccinations: ''
  });

  // Auth states
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'google' | 'forgot'>('google');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Confirmation state
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: 'pet' | 'analysis' | 'reminder' | 'challenge';
    id: string;
    name: string;
  } | null>(null);

  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  const [isSandbox, setIsSandbox] = useState(false);

  // Initialize RevenueCat
  useEffect(() => {
    if (user) {
      console.log("[Auth] User is authenticated, proceeding with app setup.");
    }
  }, [user]);

  // Handle Notifications cleanup
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Reminders state
  const [reminders, setReminders] = useState<any[]>([]);
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [editingReminderId, setEditingReminderId] = useState<string | null>(null);
  const [newReminder, setNewReminder] = useState({
    petId: '',
    title: '',
    type: 'vaccination',
    dueDate: '',
    completed: false
  });

  // Settings state
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUploadingProfilePic, setIsUploadingProfilePic] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [settingsName, setSettingsName] = useState('');
  const [showBotModal, setShowBotModal] = useState(false);
  const [showFairUseModal, setShowFairUseModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [isBotVerified, setIsBotVerified] = useState(false);
  const [routingInfo, setRoutingInfo] = useState<{ modelToUse: string; isHeavyUser: boolean; usageStats: any } | null>(null);
  const [userStats, setUserStats] = useState<any>(null);

  const updateStreak = async (userId: string) => {
    const statsRef = doc(db, 'user_stats', userId);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let stats = userStats;
    if (!stats) {
      // Fallback if state hasn't loaded yet
      stats = {
        current_streak: 0,
        total_sessions: 0,
        activity_log: [],
        last_upload_date: null
      };
    }

    let newStreak = stats.current_streak || 0;
    const lastUpload = stats.last_upload_date ? new Date(stats.last_upload_date.toMillis()) : null;

    if (!lastUpload) {
      newStreak = 1;
    } else {
      const lastUploadDay = new Date(lastUpload.getFullYear(), lastUpload.getMonth(), lastUpload.getDate());
      const diffDays = Math.floor((today.getTime() - lastUploadDay.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day
        newStreak += 1;
      } else if (diffDays > 1) {
        // Streak broken
        const diffHours = (now.getTime() - lastUpload.getTime()) / (1000 * 60 * 60);
        if (diffHours > 36) {
          newStreak = 1;
        }
      } else if (diffDays === 0) {
        // Already uploaded today, streak stays same
      }
    }

    try {
      await updateDoc(statsRef, {
        current_streak: newStreak,
        total_sessions: (stats.total_sessions || 0) + 1,
        last_upload_date: Timestamp.now(),
        activity_log: [...(stats.activity_log || []), Timestamp.now()]
      });
    } catch (err: any) {
      if (err.code === 'not-found' || !stats.total_sessions) {
        try {
          await setDoc(statsRef, {
            current_streak: 1,
            total_sessions: 1,
            last_upload_date: Timestamp.now(),
            activity_log: [Timestamp.now()]
          });
        } catch (setErr) {
          handleFirestoreError(setErr, OperationType.CREATE, `user_stats/${userId}`);
        }
      } else {
        handleFirestoreError(err, OperationType.UPDATE, `user_stats/${userId}`);
      }
    }
  };

  useEffect(() => {
    if (user) {
      setSettingsName(user.displayName || '');
    }
  }, [user]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Returns today's date string in Eastern Time (America/New_York), e.g. "2026-05-02"
  const getEasternDateString = (): string => {
    return new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
  };

  // Returns the effective daily analysis count for free-tier limiting.
  // If the stored date doesn't match today's Eastern date, the count is 0 (reset).
  const getEffectiveDailyAnalysesCount = (ud: any): number => {
    if (!ud) return 0;
    const todayET = getEasternDateString();
    if (ud.dailyAnalysesDate === todayET) {
      return ud.dailyAnalysesCount || 0;
    }
    return 0; // New Eastern day — count resets
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (paywallCooldown && !showLimitModal) {
      timer = setTimeout(() => {
        const isPro = userData?.subscriptionTier === 'pro';
        const freeLimit = 3;
        const dailyCount = getEffectiveDailyAnalysesCount(userData);
        if (!isPro && dailyCount >= freeLimit && (userData?.bonusAnalyses || 0) <= 0) {
          setShowLimitModal({
            type: 'analysis',
            message: `Ready to learn more? Upgrade to Pro or watch a quick ad to continue analyzing your pet's behavior.`
          });
        }
      }, 10000); // Re-show after 10 seconds
    }
    return () => clearTimeout(timer);
  }, [paywallCooldown, showLimitModal, userData]);

  useEffect(() => {
    if (!user) return;

    // Listen for analyses
    const qAnalyses = query(
      collection(db, 'analyses'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeAnalyses = onSnapshot(qAnalyses, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAnalyses(docs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'analyses');
    });

    // Listen for pets
    const qPets = query(
      collection(db, 'pets'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribePets = onSnapshot(qPets, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPets(docs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'pets');
    });

    // Listen for reminders
    const qReminders = query(
      collection(db, 'reminders'),
      where('userId', '==', user.uid),
      orderBy('dueDate', 'asc')
    );

    const unsubscribeReminders = onSnapshot(qReminders, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReminders(docs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'reminders');
    });

    // Listen for challenges
    const qChallenges = query(
      collection(db, 'challenges'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeChallenges = onSnapshot(qChallenges, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChallenges(docs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'challenges');
    });

    // Listen for user stats
    const unsubscribeStats = onSnapshot(doc(db, 'user_stats', user.uid), (snapshot) => {
      if (snapshot.exists()) {
        setUserStats(snapshot.data());
      } else {
        // Initialize stats if they don't exist
        setUserStats({
          current_streak: 0,
          total_sessions: 0,
          activity_log: [],
          last_upload_date: null
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `user_stats/${user.uid}`);
    });

    return () => {
      unsubscribeAnalyses();
      unsubscribePets();
      unsubscribeReminders();
      unsubscribeChallenges();
      unsubscribeStats();
    };
  }, [user]);

  // Listen for chat messages when an analysis is selected
  useEffect(() => {
    if (!selectedAnalysis?.id || !user) {
      setChatMessages([]);
      return;
    }

    const qMessages = query(
      collection(db, 'analyses', selectedAnalysis.id, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribeMessages = onSnapshot(qMessages, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChatMessages(docs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `analyses/${selectedAnalysis.id}/messages`);
    });

    return () => unsubscribeMessages();
  }, [selectedAnalysis, user]);

  // Recording logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecordingVideo && recordingTimeLeft > 0) {
      timer = setTimeout(() => {
        setRecordingTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isRecordingVideo && recordingTimeLeft === 0) {
      stopRecording();
    }
    return () => clearTimeout(timer);
  }, [isRecordingVideo, recordingTimeLeft]);

  const startCameraPreview = async () => {
    try {
      isCancelledRef.current = false;
      if (Capacitor.isNativePlatform()) {
        const permissions = await CapCamera.checkPermissions();
        if (permissions.camera !== 'granted') {
          const result = await CapCamera.requestPermissions({ permissions: ['camera'] });
          if (result.camera !== 'granted') {
            setNotification({ message: 'Camera permission is required to record video.', type: 'error' });
            return;
          }
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: cameraFacingMode }, 
        audio: true 
      });
      
      setIsCameraPreview(true);
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.muted = true;
        }
      }, 50);
    } catch (err) {
      console.error("Failed to start camera preview:", err);
      setNotification({ message: 'Could not access camera/microphone.', type: 'error' });
    }
  };

  const startRecording = async () => {
    try {
      if (!videoRef.current || !videoRef.current.srcObject) {
        await startCameraPreview();
      }
      
      const stream = videoRef.current!.srcObject as MediaStream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      isCancelledRef.current = false;
      mediaRecorder.onstop = () => {
        setIsStopping(false);
        if (isCancelledRef.current) {
          console.log("[Recording] Cancelled, not processing.");
          return;
        }

        const recordedMimeType = mediaRecorder.mimeType;
        const fallbackMimeType = 'video/webm';
        const finalMimeType = recordedMimeType || fallbackMimeType;
        
        console.log("[Recording] Stop event. Recorder Mime:", recordedMimeType, "Final Mime:", finalMimeType);

        const extension = finalMimeType.includes('mp4') ? 'mp4' : 'webm';
        const blob = new Blob(chunksRef.current, { type: finalMimeType });
        
        console.log("[Recording] Blob created. Size:", blob.size, "Type:", blob.type);

        if (blob.size === 0) {
          setNotification({ message: 'Recording failed: No data captured.', type: 'error' });
          setIsRecordingVideo(false);
          return;
        }

        const file = new File([blob], `recording_${Date.now()}.${extension}`, { type: finalMimeType });
        processUploadFile(file);
        
        // Small delay before closing modal for smoother transition
        setTimeout(() => {
          setIsRecordingVideo(false);
        }, 800);
      };

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start();
      setIsRecordingVideo(true);
      setRecordingTimeLeft(30);
    } catch (err) {
      console.error("Failed to start recording:", err);
      setNotification({ message: 'Recording failed to start.', type: 'error' });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      setIsStopping(true);
      mediaRecorderRef.current.stop();
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsRecordingVideo(false);
    setIsCameraPreview(false);
    setCameraFacingMode('environment'); // Reset to default for next time
  };

  const cancelRecording = () => {
    isCancelledRef.current = true;
    stopRecording();
  };

  const toggleCamera = async () => {
    const newMode = cameraFacingMode === 'user' ? 'environment' : 'user';
    setCameraFacingMode(newMode);
    
    if (isRecordingVideo) {
      // If flipping while recording, we must mark it as cancelled BEFORE stopping tracks
      // because stopping tracks will trigger the MediaRecorder's onstop event.
      isCancelledRef.current = true;
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch (e) {
          console.log("Error stopping recorder during flip:", e);
        }
      }
      setIsRecordingVideo(false);
    }

    // Stop current stream tracks to free up the camera for the new mode
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => {
        track.stop();
        console.log("[Camera] Track stopped for flip:", track.label);
      });
      videoRef.current.srcObject = null;
    }
    
    // Restart preview with new mode
    try {
      console.log("[Camera] Requesting new stream with mode:", newMode);
      const newStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: newMode }, 
        audio: true 
      });
      
      setIsCameraPreview(true); // Ensure we stay in preview mode
      
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.muted = true;
        await videoRef.current.play().catch(e => console.log("Video play error after flip:", e));
      }
      console.log("[Camera] Successfully switched to", newMode);
    } catch (err) {
      console.error("Failed to flip camera:", err);
      setNotification({ message: 'Failed to switch camera.', type: 'error' });
      // If flip fails, we might be left with no stream. Let's try to recover default.
      setIsCameraPreview(false);
    }
  };

  const handleInitiateUpload = () => {
    if (!user || !userData) return;

    const isPro = userData.subscriptionTier === 'pro';
    const freeLimit = 3;
    const dailyCount = getEffectiveDailyAnalysesCount(userData);
    if (!isPro && dailyCount >= freeLimit && (userData.bonusAnalyses || 0) <= 0) {
      setShowLimitModal({
        type: 'analysis',
        message: `You've reached today's free limit of ${freeLimit} analyses. It resets at midnight Eastern Time, or upgrade to Pro for unlimited access!`
      });
      return;
    }

    setShowUploadTypeModal(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processUploadFile(file);
      e.target.value = ''; // Clear input
    }
  };

  const processUploadFile = async (file: File) => {
    if (!user || !userData) return;

    // Commercial limit: 50MB max for raw upload
    if (file.size > 50 * 1024 * 1024) {
      alert("File is too large. Please upload a video smaller than 50MB.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    setUploadStatus('Preparing media...');

    const selectedPet = pets.find(p => p.id === selectedPetId);
    const petContext = selectedPet ? `
      Pet Context:
      - Name: ${selectedPet.name}
      - Species: ${selectedPet.species}
      - Breed: ${selectedPet.breed || 'Unknown'}
      - Age: ${selectedPet.age || 'Unknown'}
      - Personality: ${selectedPet.personality || 'Unknown'}
    ` : '';

    const formData = new FormData();
    formData.append('media', file);
    formData.append('userId', user.uid);
    formData.append('petContext', petContext);
    if (userQuestion.trim()) {
      formData.append('userQuestion', userQuestion.trim());
    }

    console.log("[API] Attempting upload to:", `${API_BASE_URL}/api/process`);
    console.log("[API] File details:", file.name, file.size, file.type);

    try {
      setUploadStatus('Processing analysis...');
      setUploadProgress(40);

      let mediaUrl: string;
      let result: any;

      const response = await fetch(`${API_BASE_URL}/api/process`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const responseText = await response.text();

      if (!response.ok) {
        const errorData = JSON.parse(responseText);
        if (errorData.code === "SOFT_PAUSE") {
          setShowBotModal(true);
          throw new Error(errorData.message);
        }
        throw new Error(responseText || `Server error (${response.status})`);
      }

      const data = JSON.parse(responseText);
      mediaUrl = data.mediaUrl;
      result = data.geminiResult;
      setRoutingInfo({
        modelToUse: data.modelToUse,
        isHeavyUser: data.isHeavyUser,
        usageStats: data.usageStats
      });

      setUploadStatus('Finalizing report...');
      setUploadProgress(90);

      // Step 4: Save results to Firestore
      console.log("[Firestore] Saving analysis record...");
      try {
        const analysisRef = await addDoc(collection(db, 'analyses'), {
          userId: user.uid,
          petId: selectedPetId || null,
          petName: selectedPet?.name || 'My Pet',
          mediaUrl,
          mediaType: file.type.startsWith('video') ? 'video' : 'audio',
          status: 'completed',
          userQuestion: userQuestion || null,
          result,
          createdAt: Timestamp.now()
        });

        // If a training challenge was generated, save it separately for the Challenges tab
        if (result.trainingChallenge) {
          await addDoc(collection(db, 'challenges'), {
            userId: user.uid,
            petId: selectedPetId || null,
            petName: selectedPet?.name || 'My Pet',
            analysisId: analysisRef.id,
            title: result.trainingChallenge.title,
            description: result.trainingChallenge.description,
            days: result.trainingChallenge.days,
            completedDays: [], // Track progress
            status: 'active',
            createdAt: Timestamp.now()
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'analyses');
      }

      // Update user analysis count and consume bonus if used
      try {
        const userRef = doc(db, 'users', user.uid);
        const isPro = userData.subscriptionTier === 'pro';
        const now = new Date();
        const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const todayET = getEasternDateString();
        const currentDailyCount = getEffectiveDailyAnalysesCount(userData);

        const updates: any = {
          analysesCount: increment(1),
          [`monthlyUsage.${monthKey}`]: increment(1),
          // Daily ET counter — reset to 1 if it's a new day, otherwise increment
          dailyAnalysesDate: todayET,
          dailyAnalysesCount: currentDailyCount + 1,
        };

        // If we were at or over the free daily limit, consume a bonus instead
        if (!isPro && currentDailyCount >= 3) {
          if ((userData.bonusAnalyses || 0) > 0) {
            updates.bonusAnalyses = increment(-1);
          }
        }

        await updateDoc(userRef, updates);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
      }

      // Update streak and stats
      await updateStreak(user.uid);

      console.log("[Process] All steps completed successfully.");
      setUploadStatus('Complete!');
      setUploadProgress(100);
      setUserQuestion('');
      setSelectedPetId('');

      // Clear the file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      setTimeout(() => {
        setIsUploading(false);
        setActiveTab('dashboard');
      }, 500);
    } catch (error: any) {
      console.error("Upload failed:", error);
      setNotification({ message: error.message || "Upload failed. Please try again.", type: 'error' });
      setIsUploading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedAnalysis || isSendingMessage || !user || !userData) return;

    // Check subscription limits for chat
    const isPro = userData.subscriptionTier === 'pro';
    if (!isPro) {
      const userMessagesCount = chatMessages.filter(m => m.role === 'user').length;
      const freeLimit = 2;

      if (userMessagesCount >= freeLimit) {
        if ((userData.bonusChats || 0) > 0) {
          // Consume a bonus chat
          try {
            await updateDoc(doc(db, 'users', user.uid), {
              bonusChats: increment(-1)
            });
          } catch (error) {
            console.error("Failed to consume bonus chat:", error);
          }
        } else {
          setShowLimitModal({
            type: 'chat',
            message: `Free tier users are limited to ${freeLimit} follow-up question(s) per analysis. Upgrade to Pro or watch an ad for +1 chat!`
          });
          return;
        }
      }
    }

    setIsSendingMessage(true);
    const messageContent = newMessage.trim();
    setNewMessage('');

    try {
      // 1. Save user message to Firestore
      const userMsgPath = `analyses/${selectedAnalysis.id}/messages`;
      await addDoc(collection(db, 'analyses', selectedAnalysis.id, 'messages'), {
        analysisId: selectedAnalysis.id,
        userId: user.uid,
        role: 'user',
        content: messageContent,
        createdAt: Timestamp.now()
      });

      // 2. Get AI response
      const history = chatMessages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const petContext = selectedAnalysis.petId ? `Analyzing behavior for ${selectedAnalysis.petName}.` : '';
      const analysisContext = `Original Analysis Result: ${JSON.stringify(selectedAnalysis.result)}`;

      const chatResponse = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history,
          messageContent,
          petContext,
          analysisContext
        })
      });

      if (!chatResponse.ok) {
        throw new Error(`Chat API error (${chatResponse.status})`);
      }

      const chatData = await chatResponse.json();
      const aiResponse = chatData.text || "I'm sorry, I couldn't process that request.";

      // 3. Save AI response to Firestore
      await addDoc(collection(db, 'analyses', selectedAnalysis.id, 'messages'), {
        analysisId: selectedAnalysis.id,
        role: 'assistant',
        content: aiResponse,
        createdAt: Timestamp.now()
      });

    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `analyses/${selectedAnalysis.id}/messages`);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleUpgrade = async (selectedPackage?: any) => {
    if (!user) return;

    if (!Capacitor.isNativePlatform()) {
      alert("In-app purchases are only available in the mobile app.");
      setUploadStatus('');
      return;
    }

    try {
      setUploadStatus('Opening secure checkout...');

      let packageToBuy = selectedPackage;

      if (!packageToBuy) {
        // Fallback to getting the monthly package if none selected
        const offerings = await Purchases.getOfferings();
        if (offerings.current && offerings.current.monthly) {
          packageToBuy = offerings.current.monthly;
        }
      }

      if (packageToBuy) {
        const { customerInfo } = await Purchases.purchasePackage({ aPackage: packageToBuy });

        console.log("[RevenueCat] Purchase completed. CustomerInfo:", customerInfo);

        // Check for 'pro' entitlement
        const isPro = !!customerInfo.entitlements.active.pro;
        const hasAnyEntitlement = Object.keys(customerInfo.entitlements.active).length > 0;

        if (isPro || hasAnyEntitlement) {
          const entitlementName = isPro ? 'Pro' : Object.keys(customerInfo.entitlements.active)[0];

          // Sync with backend (for logging/webhook purposes)
          try {
            console.log("[RevenueCat] Syncing subscription with backend for user:", user.uid);
            fetch(`${API_BASE_URL}/api/sync-subscription`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ app_user_id: user.uid })
            }).catch(e => console.error("Backend sync error:", e));
          } catch (syncErr) {
            console.error("[RevenueCat] Sync network error:", syncErr);
          }

          // Update Firestore directly from the frontend
          try {
            await updateDoc(doc(db, 'users', user.uid), {
              status: "pro",
              subscriptionTier: "pro",
              is_subscriber: true,
              updatedAt: Timestamp.now(),
            });
            console.log("[Firestore] Subscription updated successfully");
          } catch (fsError) {
            console.error("[Firestore] Failed to update subscription:", fsError);
          }

          setNotification({
            message: `Welcome to ${entitlementName}! Your account has been upgraded.`,
            type: 'success'
          });

          // Optimistic update to clear paywall immediately
          if (userData) {
            setUserData({ ...userData, subscriptionTier: 'pro', is_subscriber: true });
          }

          setShowLimitModal(null);
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#4f46e5', '#818cf8', '#c7d2fe']
          });
        } else {
          console.warn("[RevenueCat] Purchase successful but no active entitlement found in customerInfo.");
          setNotification({
            message: "Purchase successful! Your account will be updated shortly.",
            type: "success"
          });
          // We still close the modal because the purchase was technically successful
          setShowLimitModal(null);
        }
      } else {
        throw new Error("No active subscription offerings found.");
      }
    } catch (error: any) {
      if (!error.userCancelled) {
        console.error("[RevenueCat] Purchase error:", error);
        setNotification({
          message: error.message || 'Failed to initiate purchase. Please try again.',
          type: 'error'
        });
      }
    } finally {
      setUploadStatus('');
    }
  };

  const handleRestorePurchases = async () => {
    if (!user) return;

    if (!Capacitor.isNativePlatform()) {
      alert("In-app purchases are only available in the mobile app.");
      return;
    }

    setIsRestoring(true);
    try {
      const { customerInfo } = await Purchases.restorePurchases();
      const isPro = !!customerInfo.entitlements.active.pro;
      const hasAnyEntitlement = Object.keys(customerInfo.entitlements.active).length > 0;

      if (isPro || hasAnyEntitlement) {
        const entitlementName = isPro ? 'Pro' : Object.keys(customerInfo.entitlements.active)[0];

        // Sync with backend immediately
        try {
          console.log("[RevenueCat] Syncing restored purchases with backend for user:", user.uid);
          const response = await fetch(`${API_BASE_URL}/api/sync-subscription`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ app_user_id: user.uid })
          });

          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            const result = await response.json();
            if (result.success) {
              console.log("[RevenueCat] Restore sync successful:", result);
            } else {
              console.error("[RevenueCat] Restore sync failed with error:", result);
            }
          } else {
            const text = await response.text();
            console.error("[RevenueCat] Restore sync returned non-JSON response:", text.substring(0, 200));
          }
        } catch (syncErr) {
          console.error("[RevenueCat] Restore sync network error:", syncErr);
        }

        setNotification({ message: `Purchases restored! You are now ${entitlementName}.`, type: 'success' });

        // Optimistic update to clear paywall immediately
        if (userData) {
          setUserData({ ...userData, subscriptionTier: 'pro', is_subscriber: true });
        }

        setShowLimitModal(null);
      } else {
        setNotification({ message: 'No active subscription found to restore.', type: 'error' });
      }
    } catch (error: any) {
      console.error("[RevenueCat] Restore error:", error);
      setNotification({ message: 'Failed to restore purchases.', type: 'error' });
    } finally {
      setIsRestoring(false);
    }
  };

  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const handleWatchAd = (type: 'analysis' | 'chat' | 'upgrade') => {
    if (!user || !userData || type === 'upgrade') return;

    // Check daily limit for analysis ads
    if (type === 'analysis') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const lastAdDate = userData.lastAdAnalysisDate ? new Date(userData.lastAdAnalysisDate.toMillis()) : null;
      const lastAdDay = lastAdDate ? new Date(lastAdDate.getFullYear(), lastAdDate.getMonth(), lastAdDate.getDate()).getTime() : 0;

      const currentDailyCount = (today > lastAdDay) ? 0 : (userData.dailyAdAnalysesCount || 0);

      if (currentDailyCount >= 3) {
        setNotification({ message: 'Daily limit for free analysis ads reached (3/3). Reset at midnight.', type: 'error' });
        return;
      }
    }

    setIsWatchingAd(true);

    rewardedAdService.loadAd('ca-app-pub-3940256099942544/5224354917', {
      onAdLoaded: () => {
        rewardedAdService.showAd({
          onUserEarnedReward: async (reward) => {
            console.log("[Reward] User earned reward:", reward);
            try {
              const userRef = doc(db, 'users', user.uid);
              const now = Timestamp.now();
              const nowDate = new Date();
              const today = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate()).getTime();
              const lastAdDate = userData.lastAdAnalysisDate ? new Date(userData.lastAdAnalysisDate.toMillis()) : null;
              const lastAdDay = lastAdDate ? new Date(lastAdDate.getFullYear(), lastAdDate.getMonth(), lastAdDate.getDate()).getTime() : 0;

              if (type === 'analysis') {
                const currentDailyCount = (today > lastAdDay) ? 0 : (userData.dailyAdAnalysesCount || 0);
                await updateDoc(userRef, {
                  bonusAnalyses: (userData.bonusAnalyses || 0) + 1,
                  dailyAdAnalysesCount: currentDailyCount + 1,
                  lastAdAnalysisDate: now
                });
                setNotification({ message: `Reward earned! +1 Analysis granted (${currentDailyCount + 1}/3 today).`, type: 'success' });
              } else if (type === 'chat') {
                await updateDoc(userRef, {
                  bonusChats: (userData.bonusChats || 0) + 1
                });
                setNotification({ message: 'Reward earned! +1 Chat granted.', type: 'success' });
              }
              setShowLimitModal(null);
            } catch (error) {
              console.error("Failed to grant reward:", error);
              setNotification({ message: 'Failed to grant reward. Please try again.', type: 'error' });
            }
          },
          onAdClosed: () => {
            setIsWatchingAd(false);
          },
          onAdFailedToLoad: (err) => {
            setIsWatchingAd(false);
            setNotification({ message: 'Failed to load ad. Please try again later.', type: 'error' });
          }
        });
      },
      onAdFailedToLoad: (err) => {
        setIsWatchingAd(false);
        setNotification({ message: 'Ad failed to load. Please try again.', type: 'error' });
      },
      onUserEarnedReward: () => { } // Handled in showAd
    });
  };

  const handleSavePet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPet.name || !user) return;

    try {
      let photoUrl = newPet.photoUrl;
      if (petImageFile) {
        setIsUploadingPetImage(true);
        const fileName = `pets/${user.uid}/${Date.now()}_${petImageFile.name}`;
        const storageRef = ref(storage, fileName);
        const uploadTask = await uploadBytesResumable(storageRef, petImageFile);
        photoUrl = await getDownloadURL(uploadTask.ref);
      }

      if (editingPetId) {
        await updateDoc(doc(db, 'pets', editingPetId), {
          ...newPet,
          photoUrl,
          updatedAt: Timestamp.now()
        });
        setNotification({ message: 'Pet profile updated successfully!', type: 'success' });
      } else {
        await addDoc(collection(db, 'pets'), {
          userId: user.uid,
          ...newPet,
          photoUrl,
          createdAt: Timestamp.now()
        });
        setNotification({ message: 'Pet profile added successfully!', type: 'success' });
      }

      setIsAddingPet(false);
      setEditingPetId(null);
      setPetImageFile(null);
      setNewPet({
        name: '',
        species: 'dog',
        breed: '',
        age: '',
        personality: '',
        photoUrl: '',
        diet: '',
        vaccinations: ''
      });
    } catch (error) {
      console.error("Failed to save pet:", error);
      setNotification({ message: `Failed to ${editingPetId ? 'update' : 'add'} pet profile`, type: 'error' });
    } finally {
      setIsUploadingPetImage(false);
    }
  };

  const handleDeletePet = async (petId: string) => {
    console.log(`[Firestore] Attempting to delete pet: ${petId}`);
    try {
      await deleteDoc(doc(db, 'pets', petId));
      console.log(`[Firestore] Pet deleted successfully: ${petId}`);
      setNotification({ message: 'Pet profile deleted successfully', type: 'success' });
    } catch (error) {
      console.error("Failed to delete pet:", error);
      setNotification({ message: 'Failed to delete pet profile. Please check your permissions.', type: 'error' });
      handleFirestoreError(error, OperationType.DELETE, `pets/${petId}`);
    } finally {
      setDeleteConfirmation(null);
    }
  };

  const handleDeleteAnalysis = async (analysisId: string) => {
    console.log(`[Firestore] Attempting to delete analysis: ${analysisId}`);
    try {
      await deleteDoc(doc(db, 'analyses', analysisId));
      console.log(`[Firestore] Analysis deleted successfully: ${analysisId}`);
      setNotification({ message: 'Analysis deleted successfully', type: 'success' });
      if (selectedAnalysis?.id === analysisId) {
        setSelectedAnalysis(null);
      }
    } catch (error) {
      console.error("Failed to delete analysis:", error);
      setNotification({ message: 'Failed to delete analysis. Please check your permissions.', type: 'error' });
      handleFirestoreError(error, OperationType.DELETE, `analyses/${analysisId}`);
    } finally {
      setDeleteConfirmation(null);
    }
  };

  const handleDeleteReminder = async (reminderId: string) => {
    console.log(`[Firestore] Attempting to delete reminder: ${reminderId}`);
    try {
      await deleteDoc(doc(db, 'reminders', reminderId));
      console.log(`[Firestore] Reminder deleted successfully: ${reminderId}`);
      setNotification({ message: 'Reminder deleted successfully', type: 'success' });
    } catch (error) {
      console.error("Failed to delete reminder:", error);
      setNotification({ message: 'Failed to delete reminder. Please check your permissions.', type: 'error' });
      handleFirestoreError(error, OperationType.DELETE, `reminders/${reminderId}`);
    } finally {
      setDeleteConfirmation(null);
    }
  };

  const handleDeleteChallenge = async (challengeId: string) => {
    console.log(`[Firestore] Attempting to delete challenge: ${challengeId}`);
    try {
      await deleteDoc(doc(db, 'challenges', challengeId));
      console.log(`[Firestore] Challenge deleted successfully: ${challengeId}`);
      setNotification({ message: 'Training challenge deleted successfully', type: 'success' });
      if (selectedChallenge?.id === challengeId) {
        setSelectedChallenge(null);
      }
    } catch (error) {
      console.error("Failed to delete challenge:", error);
      setNotification({ message: 'Failed to delete challenge. Please check your permissions.', type: 'error' });
      handleFirestoreError(error, OperationType.DELETE, `challenges/${challengeId}`);
    } finally {
      setDeleteConfirmation(null);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setAuthError('');
    try {
      await signInWithGoogle();
    } catch (error: any) {
      console.error("Google Sign In Error:", error);
      if (error.code === 'auth/cancelled-popup-request') {
        setAuthError("A login popup is already open or was blocked. Please check your browser's popup settings.");
      } else if (error.code === 'auth/popup-closed-by-user') {
        setAuthError("Login popup was closed before completion. Please try again.");
      } else {
        setAuthError(error.message || "Failed to sign in with Google.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (authMode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName });
      } else if (authMode === 'forgot') {
        if (!email) {
          setAuthError('Please enter your email address first.');
          return;
        }
        await sendPasswordResetEmail(auth, email);
        setNotification({ message: 'Success! Please check your inbox (and spam folder) for the reset link.', type: 'success' });
        setAuthMode('login');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      setAuthError(error.message);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !settingsName.trim()) return;
    setIsUpdatingProfile(true);
    try {
      await updateProfile(user, { displayName: settingsName.trim() });
      setNotification({ message: 'Profile updated successfully!', type: 'success' });
    } catch (error: any) {
      setNotification({ message: error.message || 'Failed to update profile', type: 'error' });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploadingProfilePic(true);
    try {
      const storageRef = ref(storage, `users/${user.uid}/profile_${Date.now()}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        () => { },
        (error) => {
          console.error("Profile picture upload failed:", error);
          setNotification({ message: 'Failed to upload image', type: 'error' });
          setIsUploadingProfilePic(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateProfile(user, { photoURL: downloadURL });

          // Force a re-render by updating the user object reference slightly or just relying on auth state change
          // In many cases, Firebase Auth doesn't trigger a re-render for profile updates alone,
          // so we might need to manually trigger it if we had a local user state, but we use useAuth.
          // We'll just show a success message.
          setNotification({ message: 'Profile picture updated!', type: 'success' });
          setIsUploadingProfilePic(false);
        }
      );
    } catch (error) {
      console.error("Error initiating upload:", error);
      setNotification({ message: 'Failed to start upload', type: 'error' });
      setIsUploadingProfilePic(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setIsSendingReset(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      setNotification({ message: 'Password reset email sent!', type: 'success' });
    } catch (error: any) {
      setNotification({ message: error.message || 'Failed to send reset email', type: 'error' });
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleSaveReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newReminder.petId || !newReminder.title || !newReminder.dueDate) return;

    const selectedPet = pets.find(p => p.id === newReminder.petId);

    try {
      if (editingReminderId) {
        await updateDoc(doc(db, 'reminders', editingReminderId), {
          petName: selectedPet?.name || 'Pet',
          ...newReminder,
          updatedAt: Timestamp.now()
        });
        setNotification({ message: 'Reminder updated successfully!', type: 'success' });
      } else {
        await addDoc(collection(db, 'reminders'), {
          userId: user.uid,
          petName: selectedPet?.name || 'Pet',
          ...newReminder,
          createdAt: Timestamp.now()
        });
        setNotification({ message: 'Reminder added successfully!', type: 'success' });
      }

      setIsAddingReminder(false);
      setEditingReminderId(null);
      setNewReminder({
        petId: '',
        title: '',
        type: 'vaccination',
        dueDate: '',
        completed: false
      });
    } catch (error) {
      console.error("Failed to save reminder:", error);
      setNotification({ message: `Failed to ${editingReminderId ? 'update' : 'add'} reminder`, type: 'error' });
    }
  };

  const handleToggleReminder = async (reminderId: string, completed: boolean) => {
    try {
      await updateDoc(doc(db, 'reminders', reminderId), {
        completed: !completed
      });

      if (!completed) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4f46e5', '#10b981', '#f59e0b']
        });
      }
    } catch (error) {
      console.error("Failed to update reminder:", error);
    }
  };

  const handleReferralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralInput.trim() || !user || !userData || isSubmittingReferral) return;
    if (userData.referredBy) {
      setNotification({ message: "You have already used a referral code.", type: 'error' });
      return;
    }

    setIsSubmittingReferral(true);
    try {
      // 1. Find the referrer
      const q = query(collection(db, 'users'), where('referralCode', '==', referralInput.trim().toUpperCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setNotification({ message: "Invalid referral code.", type: 'error' });
        setIsSubmittingReferral(false);
        return;
      }

      const referrerDoc = querySnapshot.docs[0];
      const referrerId = referrerDoc.id;

      if (referrerId === user.uid) {
        setNotification({ message: "You cannot refer yourself!", type: 'error' });
        setIsSubmittingReferral(false);
        return;
      }

      // 2. Reward the referrer (+5 bonus analyses)
      await updateDoc(doc(db, 'users', referrerId), {
        bonusAnalyses: increment(5)
      });

      // 3. Reward the current user (+2 bonus analyses)
      await updateDoc(doc(db, 'users', user.uid), {
        bonusAnalyses: increment(2),
        referredBy: referrerId
      });

      setNotification({ message: "Referral code applied! You received +2 bonus analyses.", type: 'success' });
      setReferralInput('');
    } catch (error) {
      console.error("Referral error:", error);
      setNotification({ message: "Failed to apply referral code.", type: 'error' });
    } finally {
      setIsSubmittingReferral(false);
    }
  };

  const handleShareAnalysis = async (analysis: any) => {
    if (!analysis) return;

    const shareData = {
      title: `Pawsitive Behavior Analysis: ${analysis.petName || 'My Pet'}`,
      text: `Check out this behavioral analysis for ${analysis.petName || 'my pet'}! Emotional State: ${analysis.result?.emotionalState || 'Unknown'}.`,
      url: window.location.href,
    };

    try {
      if (Capacitor.isNativePlatform()) {
        await Share.share({
          title: shareData.title,
          text: shareData.text,
          url: shareData.url,
          dialogTitle: 'Share Behavioral Analysis',
        });
      } else if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        setNotification({ message: "Analysis summary copied to clipboard!", type: 'success' });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleShareChallenge = async (challenge: any) => {
    if (!challenge) return;

    const progress = challenge.completedDays?.length || 0;
    const statusText = challenge.status === 'completed'
      ? `fully completed the "${challenge.title}" challenge!`
      : `completed ${progress}/7 days of the "${challenge.title}" challenge!`;

    const shareData = {
      title: `Pawsitive Behavior Training: ${challenge.petName || 'My Pet'}`,
      text: `My pet ${challenge.petName || 'my pet'} has ${statusText} Check out Pawsitive Behavior for custom pet training!`,
      url: window.location.href,
    };

    try {
      if (Capacitor.isNativePlatform()) {
        await Share.share({
          title: shareData.title,
          text: shareData.text,
          url: shareData.url,
          dialogTitle: 'Share Challenge Progress',
        });
      } else if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        setNotification({ message: "Challenge progress copied to clipboard!", type: 'success' });
      }
    } catch (error) {
      console.error("Error sharing challenge:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center gap-6 relative z-10"
        >
          <div className="w-24 h-24 bg-gold-500 rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(212,175,55,0.15)] border border-gold-400/20">
            <Dog className="w-12 h-12 text-white" />
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-black font-serif tracking-[0.2em] text-gold-400 uppercase">Pawsitive Behavior</h1>
            <p className="text-[10px] tracking-[0.5em] uppercase text-gold-600/70 mt-3 font-bold">Pet Analysis</p>
          </div>

          <div className="mt-12 flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-bounce" />
          </div>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gold-500 rounded-3xl flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.6)] shadow-indigo-200">
              <Dog className="w-12 h-12 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-black font-serif tracking-tight text-gold-400">Pawsitive Behavior</h1>
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600 mt-2 font-bold">Pet Analysis</p>
            <p className="text-zinc-400 text-lg">Professional AI behavior analysis for your beloved pets.</p>
          </div>

          {authMode === 'google' ? (
            <div className="space-y-4">
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoggingIn}
                className={`w-full flex items-center justify-center gap-3 bg-zinc-900 border border-zinc-800 text-zinc-300 px-6 py-4 rounded-2xl font-medium transition-all shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] active:scale-[0.98] ${isLoggingIn ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-950'}`}
              >
                {isLoggingIn ? (
                  <div className="w-5 h-5 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/layout/google.svg" className="w-5 h-5" alt="Google" />
                )}
                {isLoggingIn ? 'Signing in...' : 'Sign in with Google'}
              </button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-zinc-800"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-zinc-900 px-2 text-zinc-500">Or continue with</span>
                </div>
              </div>
              <button
                onClick={() => setAuthMode('login')}
                className="w-full flex items-center justify-center gap-3 bg-zinc-800 border border-zinc-700 text-zinc-100 px-6 py-4 rounded-2xl font-medium hover:bg-zinc-700 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.4)] active:scale-[0.98]"
              >
                Sign in with Email
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('forgot')}
                className="text-xs font-bold text-gold-500 hover:text-gold-400 uppercase tracking-widest pt-2"
              >
                Forgot Password?
              </button>
            </div>
          ) : (
            <form onSubmit={handleEmailAuth} className="space-y-4 text-left">
              {authMode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase">Full Name</label>
                  <input
                    required
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder-zinc-600 focus:ring-2 focus:ring-gold-500 outline-none"
                    placeholder="John Doe"
                  />
                </div>
              )}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-400 uppercase">Email Address</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder-zinc-600 focus:ring-2 focus:ring-gold-500 outline-none"
                  placeholder="name@example.com"
                />
              </div>
              {authMode !== 'forgot' && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-zinc-400 uppercase">Password</label>
                    {authMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setAuthMode('forgot')}
                        className="text-sm font-black text-gold-400 hover:text-gold-300 transition-colors uppercase tracking-widest underline decoration-2 underline-offset-4"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder-zinc-600 focus:ring-2 focus:ring-gold-500 outline-none"
                    placeholder="••••••••"
                  />
                </div>
              )}

              {authError && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertCircle className="w-4 h-4" />
                    Authentication Error
                  </div>
                  <p className="opacity-90">{authError}</p>
                  <p className="text-xs pt-2 border-t border-red-100">
                    Tip: If popups are blocked, try opening the app in a <a href={window.location.href} target="_blank" rel="noopener noreferrer" className="underline font-bold">new tab</a>.
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gold-500 text-white px-6 py-4 rounded-2xl font-bold hover:bg-gold-600 transition-all shadow-lg shadow-gold-500/20 active:scale-[0.98]"
              >
                {authMode === 'login' ? 'Sign In' : authMode === 'signup' ? 'Create Account' : 'Send Reset Link'}
              </button>

              <div className="text-center space-y-4">
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
                  className="text-gold-400 text-sm font-medium hover:underline"
                >
                  {authMode === 'signup' ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                </button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-zinc-800"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-zinc-900 px-2 text-zinc-500">Or</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAuthMode('google')}
                  className="text-zinc-400 text-sm font-medium hover:underline"
                >
                  Back to Google Sign In
                </button>
              </div>
            </form>
          )}

          <p className="text-xs text-zinc-500">
            By signing in, you agree to our <button type="button" onClick={() => setShowTermsModal(true)} className="hover:text-gold-400 underline">Terms of Service</button> and <button type="button" onClick={() => setShowPrivacyModal(true)} className="hover:text-gold-400 underline">Privacy Policy</button>.
          </p>
        </motion.div>

        {/* Terms of Use Modal */}
        <AnimatePresence>
          {showTermsModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-zinc-900 rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-zinc-800 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black font-serif text-gold-400">Terms of Use (EULA)</h2>
                  <button onClick={() => setShowTermsModal(false)} className="p-2 text-zinc-500 hover:bg-zinc-800 rounded-full transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6 text-zinc-400 text-sm leading-relaxed">
                  <p className="italic">Last Updated: April 2026</p>

                  <div>
                    <h4 className="font-black font-serif text-gold-400 mb-1">1. Acceptance of Terms</h4>
                    <p>By accessing and using Pawsitive Behavior, you agree to be bound by these Terms of Use. If you do not agree, please do not use the application.</p>
                  </div>

                  <div>
                    <h4 className="font-black font-serif text-gold-400 mb-1">2. Medical Disclaimer</h4>
                    <p>Pawsitive Behavior provides AI-driven behavioral analysis for educational and training purposes only. It is NOT a substitute for professional veterinary or trainer's advice, diagnosis, or treatment. Always consult a qualified veterinarian for medical concerns.</p>
                  </div>

                  <div>
                    <h4 className="font-black font-serif text-gold-400 mb-1">3. User Content</h4>
                    <p>You retain ownership of the videos and audio you upload. By uploading, you grant Pawsitive Behavior a license to process this media solely for the purpose of providing the analysis service.</p>
                  </div>

                  <div>
                    <h4 className="font-black font-serif text-gold-400 mb-1">4. Subscriptions and Billing</h4>
                    <p>Premium features require a subscription. Payments are processed securely through your device's app store (Apple App Store or Google Play). Subscriptions automatically renew unless canceled at least 24 hours before the end of the current period.</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowTermsModal(false)}
                  className="w-full mt-8 py-4 bg-zinc-800 text-zinc-100 font-bold rounded-2xl hover:bg-zinc-700 transition-all"
                >
                  Close
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Privacy Policy Modal */}
        <AnimatePresence>
          {showPrivacyModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-zinc-900 rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-zinc-800 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black font-serif text-gold-400">Privacy Policy</h2>
                  <button onClick={() => setShowPrivacyModal(false)} className="p-2 text-zinc-500 hover:bg-zinc-800 rounded-full transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6 text-zinc-400 text-sm leading-relaxed">
                  <p className="italic">Last Updated: April 2026</p>

                  <div>
                    <h4 className="font-black font-serif text-gold-400 mb-1">1. Information We Collect</h4>
                    <p>We collect information you provide directly to us, including your email address, pet profiles (name, breed, age), and the media (video/audio) you upload for analysis.</p>
                  </div>

                  <div>
                    <h4 className="font-black font-serif text-gold-400 mb-1">2. How We Use Your Information</h4>
                    <p>Your media is processed using advanced AI models to provide behavioral insights. We do not use your personal videos to train public AI models. Your data is used strictly to deliver and improve your personal experience within the app.</p>
                  </div>

                  <div>
                    <h4 className="font-black font-serif text-gold-400 mb-1">3. Data Storage and Security</h4>
                    <p>Your data is securely stored using industry-standard cloud infrastructure. We implement robust security measures to protect your personal information from unauthorized access.</p>
                  </div>

                  <div>
                    <h4 className="font-black font-serif text-gold-400 mb-1">4. Data Deletion</h4>
                    <p>You can delete your pet profiles, analyses, or your entire account at any time from within the app. Deleting an item permanently removes it from our active servers.</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="w-full mt-8 py-4 bg-zinc-800 text-zinc-100 font-bold rounded-2xl hover:bg-zinc-700 transition-all"
                >
                  Close
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <header className="lg:hidden bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center">
            <Dog className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black font-serif text-xl text-gold-400 leading-none">Pawsitive Behavior</span>
            <span className="text-[8px] tracking-[0.2em] uppercase text-gold-600 font-bold">Pet Analysis</span>
          </div>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-zinc-400 hover:bg-zinc-950 rounded-lg"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed inset-0 z-40 lg:relative lg:z-0
        w-full lg:w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 hidden lg:flex items-center gap-3">
          <div className="w-10 h-10 bg-gold-500 rounded-xl flex items-center justify-center">
            <Dog className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black font-serif text-2xl text-gold-400 leading-none">Pawsitive Behavior</span>
            <span className="text-[9px] tracking-[0.2em] uppercase text-gold-600 font-bold mt-1">Pet Analysis</span>
          </div>
        </div>

        <nav className="flex-1 px-4 pt-20 pb-6 lg:py-0 space-y-2 overflow-y-auto">
          <NavItem
            active={activeTab === 'dashboard'}
            onClick={() => { setActiveTab('dashboard'); setSelectedAnalysis(null); setIsSidebarOpen(false); }}
            icon={<Activity className="w-5 h-5" />}
            label="Dashboard"
          />
          <NavItem
            active={activeTab === 'upload'}
            onClick={() => { setActiveTab('upload'); setSelectedAnalysis(null); setIsSidebarOpen(false); }}
            icon={<Upload className="w-5 h-5" />}
            label="New Analysis"
          />
          <NavItem
            active={activeTab === 'history'}
            onClick={() => { setActiveTab('history'); setSelectedAnalysis(null); setIsSidebarOpen(false); }}
            icon={<History className="w-5 h-5" />}
            label="History"
          />
          <NavItem
            active={activeTab === 'pets'}
            onClick={() => { setActiveTab('pets'); setSelectedAnalysis(null); setIsSidebarOpen(false); }}
            icon={<Dog className="w-5 h-5" />}
            label="My Pets"
          />
          <NavItem
            active={activeTab === 'reminders'}
            onClick={() => { setActiveTab('reminders'); setSelectedAnalysis(null); setIsSidebarOpen(false); }}
            icon={<Bell className="w-5 h-5" />}
            label="Reminders"
          />
          <NavItem
            active={activeTab === 'challenges'}
            onClick={() => { setActiveTab('challenges'); setSelectedAnalysis(null); setIsSidebarOpen(false); }}
            icon={<Flame className="w-5 h-5" />}
            label="Training Challenges"
          />
          <NavItem
            active={activeTab === 'settings'}
            onClick={() => { setActiveTab('settings'); setSelectedAnalysis(null); setIsSidebarOpen(false); }}
            icon={<Settings className="w-5 h-5" />}
            label="Settings"
          />
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950 mb-4">
            {user.photoURL ? (
              <img src={user.photoURL} className="w-10 h-10 rounded-full border-2 border-white shadow-[0_4px_20px_rgba(0,0,0,0.4)]" alt="" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center border-2 border-white shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                <UserIcon className="w-5 h-5 text-gold-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-100 truncate">{user.displayName || 'User'}</p>
              <p className="text-xs text-zinc-400 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-black font-serif text-gold-400">
              {selectedAnalysis ? 'Analysis Report' :
                activeTab === 'dashboard' ? 'Dashboard' :
                  activeTab === 'upload' ? 'New Analysis' :
                    activeTab === 'settings' ? 'Settings' :
                      activeTab === 'reminders' ? 'Reminders' :
                        activeTab === 'challenges' ? 'Training Challenges' :
                          'Report History'}
            </h2>
            <p className="text-zinc-400 mt-1 text-sm lg:text-base">
              {selectedAnalysis ? `Report for ${selectedAnalysis.petName || 'My Pet'}` : `Welcome back, ${(user.displayName || 'User').split(' ')[0]}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {activeTab === 'dashboard' && !selectedAnalysis && (
              <button
                onClick={() => setActiveTab('upload')}
                className="w-full sm:w-auto bg-gold-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gold-600 transition-all shadow-lg shadow-gold-500/20 flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                New Analysis
              </button>
            )}
            {selectedAnalysis && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleShareAnalysis(selectedAnalysis)}
                  className="flex-1 sm:flex-none bg-zinc-900 text-zinc-400 border border-zinc-800 px-4 py-2.5 rounded-xl font-medium hover:bg-zinc-950 transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button
                  onClick={() => setSelectedAnalysis(null)}
                  className="flex-1 sm:flex-none text-zinc-400 hover:text-zinc-100 font-medium flex items-center justify-center gap-2 px-4 py-2.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              </div>
            )}
          </div>
        </header>

        <AnimatePresence mode="wait">
          {selectedAnalysis ? (
            <motion.div
              key="analysis-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 pb-20"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {/* Non-Pet Warning */}
                  {selectedAnalysis.result?.isDogOrCat === false && (
                    <div className="bg-red-500/10 border border-red-500/50 p-8 rounded-3xl text-center space-y-4">
                      <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                      </div>
                      <h3 className="text-xl font-black font-serif text-red-500">Analysis Limited</h3>
                      <p className="text-zinc-400 leading-relaxed">
                        {selectedAnalysis.result?.userQuestionAnswer || "Our AI behaviorist only specializes in canine (dog) and feline (cat) behavior. This media does not appear to contain a dog or a cat."}
                      </p>
                      <button 
                        onClick={() => setSelectedAnalysis(null)}
                        className="bg-zinc-800 text-zinc-100 px-6 py-2 rounded-xl font-bold hover:bg-zinc-700 transition-all"
                      >
                        Try Another Video
                      </button>
                    </div>
                  )}

                  {/* Media Player */}
                  {selectedAnalysis.mediaUrl && (
                    <div className="bg-black rounded-3xl overflow-hidden shadow-2xl aspect-video relative group">
                      {selectedAnalysis.mediaType === 'video' ? (
                        <video
                          src={selectedAnalysis.mediaUrl}
                          controls
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900">
                          <Activity className="w-16 h-16 text-indigo-500 animate-pulse mb-4" />
                          <audio src={selectedAnalysis.mediaUrl} controls className="w-2/3" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* User Question & Answer */}
                  {selectedAnalysis.result?.isDogOrCat !== false && selectedAnalysis.userQuestion && (
                    <div className="bg-gold-500 p-8 rounded-3xl text-white shadow-[0_10px_40px_rgba(0,0,0,0.6)] shadow-gold-500/20 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <MessageSquare className="w-24 h-24" />
                      </div>
                      <h3 className="text-sm font-bold uppercase tracking-wider opacity-80 mb-2">Your Initial Question</h3>
                      <p className="text-2xl font-medium mb-8 leading-tight">"{selectedAnalysis.userQuestion}"</p>
                      <div className="bg-zinc-900/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                        <h4 className="text-xs font-bold uppercase tracking-wider opacity-80 mb-3">AI Behaviorist Answer</h4>
                        <p className="text-white/90 leading-relaxed text-lg">
                          {selectedAnalysis.result?.userQuestionAnswer || "No specific answer provided."}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Observations */}
                  {selectedAnalysis.result?.isDogOrCat !== false && (
                    <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                      <h3 className="text-xl font-black font-serif text-gold-400 mb-6 flex items-center gap-3">
                        <Activity className="w-6 h-6 text-gold-400" />
                        Detailed Observations
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedAnalysis.result?.observations?.map((obs: any, i: number) => (
                          <div key={i} className="p-5 bg-zinc-950 rounded-2xl border border-zinc-800 hover:border-indigo-200 transition-colors">
                            <p className="font-bold text-gold-400 text-xs uppercase tracking-widest mb-2">{obs.event}</p>
                            <p className="text-zinc-300 leading-relaxed">{obs.meaning}</p>
                          </div>
                        )) || <p className="text-zinc-400 italic">No detailed observations recorded.</p>}
                      </div>
                    </div>
                  )}

                  {/* Action Steps */}
                  {selectedAnalysis.result?.isDogOrCat !== false && (
                    <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                      <h3 className="text-xl font-black font-serif text-gold-400 mb-6 flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                        Recommended Action Steps
                      </h3>
                      <div className="space-y-4">
                        {selectedAnalysis.result?.actionSteps?.map((step: string, i: number) => (
                          <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-zinc-950 transition-colors">
                            <div className="w-8 h-8 bg-emerald-500/20 text-emerald-700 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm">
                              {i + 1}
                            </div>
                            <span className="text-zinc-300 text-lg leading-relaxed">{step}</span>
                          </div>
                        )) || <p className="text-zinc-400 italic">No specific action steps provided.</p>}
                      </div>
                    </div>
                  )}

                  {/* Training Challenge */}
                  {selectedAnalysis.result?.isDogOrCat !== false && selectedAnalysis.result?.trainingChallenge && (
                    <TrainingChallengeCard challenge={selectedAnalysis.result.trainingChallenge} />
                  )}
                </div>

                <div className="space-y-8">
                  {/* Emotional State Card */}
                  {selectedAnalysis.result?.isDogOrCat !== false && (
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl text-white shadow-[0_10px_40px_rgba(0,0,0,0.6)] shadow-gold-500/20">
                      <h3 className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">Primary Emotional State</h3>
                      <p className="text-4xl font-black font-serif tracking-tight">
                        {selectedAnalysis.result?.emotionalState || 'Unknown'}
                      </p>
                    </div>
                  )}

                  {/* Follow-up Chat */}
                  <div className="bg-zinc-900 rounded-3xl border border-zinc-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex flex-col h-[500px] lg:h-[600px] overflow-hidden">
                    <div className="p-4 lg:p-6 border-b border-zinc-800 bg-zinc-950/50 flex items-center gap-3">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gold-500 rounded-xl flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-black font-serif text-gold-400 text-sm lg:text-base">Follow-up Chat</h3>
                        <p className="text-[10px] lg:text-xs text-zinc-400">Ask more about this behavior</p>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 bg-zinc-950/30">
                      <div className="bg-gold-500/10 p-3 lg:p-4 rounded-2xl rounded-tl-none text-xs lg:text-sm text-indigo-900 border border-gold-500/20">
                        Hello! I'm your AI Behaviorist. Based on the analysis above, do you have any specific questions about your pet's behavior?
                      </div>
                      {chatMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[85%] p-3 lg:p-4 rounded-2xl text-xs lg:text-sm ${msg.role === 'user'
                              ? 'bg-gold-500 text-white rounded-tr-none'
                              : 'bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-tl-none shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
                            }`}>
                            {msg.content}
                          </div>
                        </div>
                      ))}
                      {isSendingMessage && (
                        <div className="flex justify-start">
                          <div className="bg-zinc-900 p-3 lg:p-4 rounded-2xl rounded-tl-none border border-zinc-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                            <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
                          </div>
                        </div>
                      )}
                    </div>

                    <form onSubmit={handleSendMessage} className="p-3 lg:p-4 bg-zinc-900 border-t border-zinc-800 flex gap-2">
                      <input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a follow-up question..."
                        className="flex-1 px-3 lg:px-4 py-2 rounded-xl border border-zinc-800 focus:ring-2 focus:ring-gold-500 outline-none text-xs lg:text-sm"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || isSendingMessage}
                        className="p-2 bg-gold-500 text-white rounded-xl hover:bg-gold-600 transition-all disabled:opacity-50"
                      >
                        <Send className="w-4 h-4 lg:w-5 lg:h-5" />
                      </button>
                    </form>
                  </div>

                  {/* Metadata */}
                  <div className="bg-slate-900 p-6 lg:p-8 rounded-3xl text-white space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-zinc-900/10 rounded-2xl flex items-center justify-center">
                        <FileText className="w-5 h-5 lg:w-6 lg:h-6 text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="text-[10px] lg:text-xs font-bold text-zinc-500 uppercase tracking-widest">Report ID</h4>
                        <p className="text-slate-200 font-mono text-[10px] lg:text-xs">{selectedAnalysis.id}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 lg:gap-6">
                      <div>
                        <h4 className="text-[10px] lg:text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Date</h4>
                        <p className="text-slate-200 font-medium text-sm lg:text-base">
                          {new Date(selectedAnalysis.createdAt?.seconds * 1000).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-[10px] lg:text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Media</h4>
                        <p className="text-slate-200 font-medium capitalize text-sm lg:text-base">{selectedAnalysis.mediaType}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : activeTab === 'challenges' ? (
            <motion.div
              key="challenges"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {selectedChallenge ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => setSelectedChallenge(null)}
                      className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 font-medium"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Challenges
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleShareChallenge(selectedChallenge)}
                        className="flex items-center gap-2 text-gold-400 hover:text-gold-300 font-medium px-4 py-2 rounded-xl hover:bg-gold-500/10 transition-all"
                      >
                        <Share2 className="w-4 h-4" />
                        Share Progress
                      </button>
                      <button
                        onClick={() => setDeleteConfirmation({
                          type: 'challenge',
                          id: selectedChallenge.id,
                          name: selectedChallenge.title
                        })}
                        className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium px-4 py-2 rounded-xl hover:bg-red-50 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Challenge
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <TrainingChallengeCard
                        challenge={selectedChallenge}
                        onCompleteDay={async (day) => {
                          try {
                            const challengeRef = doc(db, 'challenges', selectedChallenge.id);
                            const newCompletedDays = [...(selectedChallenge.completedDays || []), day];
                            const isFullyCompleted = newCompletedDays.length === 7;

                            await updateDoc(challengeRef, {
                              completedDays: newCompletedDays,
                              status: isFullyCompleted ? 'completed' : 'active'
                            });

                            if (isFullyCompleted) {
                              confetti({
                                particleCount: 150,
                                spread: 100,
                                origin: { y: 0.6 },
                                colors: ['#4f46e5', '#10b981', '#f59e0b', '#ef4444']
                              });
                              setNotification({ message: `Challenge Completed! Amazing work!`, type: 'success' });
                            } else {
                              confetti({
                                particleCount: 50,
                                spread: 60,
                                origin: { y: 0.7 },
                                colors: ['#10b981', '#f59e0b']
                              });
                              setNotification({ message: `Day ${day} completed! Keep it up!`, type: 'success' });
                            }

                            // Update local state for immediate feedback
                            setSelectedChallenge({
                              ...selectedChallenge,
                              completedDays: newCompletedDays,
                              status: isFullyCompleted ? 'completed' : 'active'
                            });
                          } catch (error) {
                            handleFirestoreError(error, OperationType.UPDATE, `challenges/${selectedChallenge.id}`);
                          }
                        }}
                      />
                    </div>

                    <div className="space-y-6">
                      <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                        <h4 className="font-black font-serif text-gold-400 mb-4 flex items-center gap-2">
                          <Upload className="w-4 h-4 text-gold-400" />
                          Focused Progress Upload
                        </h4>
                        <p className="text-sm text-zinc-400 mb-6">
                          Upload a video of your pet performing today's exercise for a targeted analysis of their progress.
                        </p>
                        <button
                          onClick={() => {
                            setUserQuestion(`I am working on Day ${selectedChallenge.completedDays.length + 1} of the "${selectedChallenge.title}" challenge. How is my pet doing with this specific exercise?`);
                            setSelectedPetId(selectedChallenge.petId);
                            setActiveTab('upload');
                          }}
                          className="w-full py-3 bg-gold-500 text-white rounded-xl font-bold hover:bg-gold-600 transition-all shadow-lg shadow-gold-500/20 flex items-center justify-center gap-2"
                        >
                          <Play className="w-4 h-4" />
                          Upload Progress Video
                        </button>
                      </div>

                      <div className="bg-slate-900 p-6 rounded-3xl text-white">
                        <h4 className="font-bold mb-2">Why this challenge?</h4>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                          This challenge was custom-generated by our AI Behaviorist based on your analysis of {selectedChallenge.petName}.
                          Consistent daily practice is key to long-term behavioral change.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="bg-gold-500 p-6 lg:p-8 rounded-[32px] text-white relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.6)] shadow-gold-500/20">
                    <div className="relative z-10">
                      <h3 className="text-2xl lg:text-3xl font-black font-serif mb-2">Training Challenges</h3>
                      <p className="text-indigo-100 max-w-md text-sm lg:text-base">
                        Custom 7-day plans generated from your behavioral analyses to help you and your pet reach your goals.
                      </p>
                    </div>
                    <Flame className="absolute -right-8 -bottom-8 w-48 lg:w-64 h-48 lg:h-64 text-white/10 rotate-12" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {challenges.length > 0 ? (
                      challenges.map((challenge) => (
                        <div
                          key={challenge.id}
                          onClick={() => setSelectedChallenge(challenge)}
                          className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:border-indigo-300 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${challenge.status === 'completed' ? 'bg-zinc-800 text-emerald-600' : 'bg-zinc-800 text-gold-400'}`}>
                              {challenge.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Flame className="w-5 h-5" />}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${challenge.status === 'completed' ? 'bg-emerald-500/20 text-emerald-700' : 'bg-gold-500/20 text-amber-700'
                                }`}>
                                {challenge.status}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShareChallenge(challenge);
                                }}
                                className="p-2 text-slate-300 hover:text-gold-400 hover:bg-gold-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                              >
                                <Share2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteConfirmation({
                                    type: 'challenge',
                                    id: challenge.id,
                                    name: challenge.title
                                  });
                                }}
                                className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <h4 className="font-black font-serif text-gold-400 mb-1 group-hover:text-gold-400 transition-colors">{challenge.title}</h4>
                          <p className="text-xs text-zinc-400 mb-4">{challenge.petName}</p>

                          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden mb-4">
                            <div
                              className={`h-full transition-all duration-500 ${challenge.status === 'completed' ? 'bg-zinc-8000' : 'bg-zinc-8000'}`}
                              style={{ width: `${(challenge.completedDays?.length || 0) / 7 * 100}%` }}
                            ></div>
                          </div>

                          <div className="flex items-center justify-between text-xs font-bold text-zinc-500">
                            <span>{challenge.completedDays?.length || 0}/7 Days</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-20 text-center bg-zinc-900 rounded-3xl border border-dashed border-zinc-800">
                        <div className="w-16 h-16 bg-zinc-950 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Flame className="w-8 h-8 text-slate-300" />
                        </div>
                        <h4 className="text-lg font-black font-serif text-gold-400 mb-1">No challenges yet</h4>
                        <p className="text-zinc-400 text-sm max-w-xs mx-auto">
                          Upload a video for analysis to receive your first custom 7-day training challenge!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ) : activeTab === 'dashboard' ? (
            <motion.div
              key="dashboard-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {userStats && (
                <StreakHeader streak={userStats.current_streak || 0} activityLog={userStats.activity_log || []} />
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Total Analyses" value={analyses.length} icon={<Activity className="text-gold-400" />} />
                <StatCard label="Current Streak" value={userStats?.current_streak || 0} icon={<Flame className="text-gold-400" />} />
                <StatCard label="Total Sessions" value={userStats?.total_sessions || 0} icon={<CheckCircle2 className="text-emerald-600" />} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h3 className="text-xl font-black font-serif text-gold-400">Training Consistency</h3>
                        <p className="text-sm text-zinc-400">Cumulative training sessions over time</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                        <div className="w-3 h-3 rounded-full bg-zinc-8000"></div>
                        Sessions
                      </div>
                    </div>
                    <ConsistencyChart activityLog={userStats?.activity_log || []} />
                  </div>

                  <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                    <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                      <h3 className="font-black font-serif text-gold-400">Recent Analyses</h3>
                      <button onClick={() => setActiveTab('history')} className="text-gold-400 text-sm font-medium hover:underline">View All</button>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {analyses.slice(0, 5).map((analysis, idx) => (
                        <motion.div
                          key={analysis.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => setSelectedAnalysis(analysis)}
                          className="p-4 hover:bg-zinc-950 transition-colors flex items-center justify-between cursor-pointer group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center group-hover:bg-gold-500/10 transition-colors">
                              {analysis.mediaType === 'video' ? <Play className="w-6 h-6 text-zinc-500 group-hover:text-gold-400" /> : <Activity className="w-6 h-6 text-zinc-500 group-hover:text-gold-400" />}
                            </div>
                            <div>
                              <p className="font-semibold text-zinc-100 truncate max-w-[200px] group-hover:text-gold-400 transition-colors">
                                {analysis.result?.emotionalState ?
                                  (analysis.result.emotionalState.length > 40 ?
                                    analysis.result.emotionalState.substring(0, 40) + '...' :
                                    analysis.result.emotionalState) :
                                  'New Analysis'}
                              </p>
                              <p className="text-xs text-zinc-400">
                                {analysis.petName || 'My Pet'} • {analysis.createdAt?.seconds ? new Date(analysis.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${analysis.status === 'completed' ? 'bg-zinc-800 text-emerald-700' : 'bg-zinc-800 text-amber-700'
                              }`}>
                              {analysis.status}
                            </span>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
                          </div>
                        </motion.div>
                      ))}
                      {analyses.length === 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="p-12 text-center"
                        >
                          <div className="w-16 h-16 bg-zinc-950 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-slate-300" />
                          </div>
                          <p className="text-zinc-400 font-medium">No analyses yet.</p>
                          <p className="text-xs text-zinc-500 mt-1">Start by uploading a video of your pet!</p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-black font-serif text-gold-400">Upcoming Care</h3>
                      <button onClick={() => setActiveTab('reminders')} className="text-gold-400 text-xs font-bold uppercase tracking-widest hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                      {reminders.filter(r => !r.completed).slice(0, 4).map((reminder, idx) => (
                        <motion.div
                          key={reminder.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-indigo-200 transition-colors group"
                        >
                          <div className={`p-2 rounded-xl transition-colors ${reminder.type === 'vaccination' ? 'bg-gold-500/20 text-gold-400 group-hover:bg-gold-500 group-hover:text-white' :
                              reminder.type === 'medication' ? 'bg-rose-500/20 text-rose-600 group-hover:bg-rose-600 group-hover:text-white' :
                                'bg-gold-500/20 text-gold-400 group-hover:bg-amber-600 group-hover:text-white'
                            }`}>
                            {reminder.type === 'vaccination' ? <Syringe className="w-4 h-4" /> :
                              reminder.type === 'medication' ? <Activity className="w-4 h-4" /> :
                                <Bell className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-black font-serif text-gold-400 truncate group-hover:text-gold-400 transition-colors">{reminder.title}</p>
                            <p className="text-xs text-zinc-400">{reminder.petName} • {new Date(reminder.dueDate).toLocaleDateString()}</p>
                          </div>
                        </motion.div>
                      ))}
                      {reminders.filter(r => !r.completed).length === 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="py-8 text-center"
                        >
                          <Calendar className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                          <p className="text-xs text-zinc-500 font-medium">All caught up!</p>
                          <p className="text-[10px] text-slate-300">No upcoming tasks for today.</p>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div className="bg-amber-600 p-8 rounded-3xl text-white shadow-[0_10px_40px_rgba(0,0,0,0.6)] shadow-amber-100">
                    <h3 className="text-lg font-bold mb-2">Trainer Status</h3>
                    <p className="text-amber-100 text-sm leading-relaxed">
                      Complete 30 sessions and unlock your pet's potential!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : activeTab === 'pets' ? (
            <motion.div
              key="pets"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {selectedPetForAnalyses ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSelectedPetForAnalyses(null)}
                      className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-zinc-400" />
                    </button>
                    <div className="flex items-center gap-4">
                      {selectedPetForAnalyses.photoUrl ? (
                        <img
                          src={selectedPetForAnalyses.photoUrl}
                          alt={selectedPetForAnalyses.name}
                          className="w-12 h-12 rounded-xl object-cover border border-zinc-800"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gold-500/10 rounded-xl flex items-center justify-center">
                          {selectedPetForAnalyses.species === 'dog' ? <Dog className="w-6 h-6 text-gold-400" /> : <Cat className="w-6 h-6 text-gold-400" />}
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-black font-serif text-gold-400">{selectedPetForAnalyses.name}'s History</h3>
                        <p className="text-sm text-zinc-400">All behavioral analyses for {selectedPetForAnalyses.name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                    <div className="divide-y divide-slate-50">
                      {analyses.filter(a => a.petId === selectedPetForAnalyses.id).length > 0 ? (
                        analyses
                          .filter(a => a.petId === selectedPetForAnalyses.id)
                          .map((analysis) => (
                            <div
                              key={analysis.id}
                              onClick={() => setSelectedAnalysis(analysis)}
                              className="p-4 hover:bg-zinc-950 transition-colors flex items-center justify-between cursor-pointer"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">
                                  {analysis.mediaType === 'video' ? <Play className="w-6 h-6 text-zinc-500" /> : <Activity className="w-6 h-6 text-zinc-500" />}
                                </div>
                                <div>
                                  <p className="font-semibold text-zinc-100 truncate max-w-[200px]">
                                    {analysis.result?.emotionalState ?
                                      (analysis.result.emotionalState.length > 40 ?
                                        analysis.result.emotionalState.substring(0, 40) + '...' :
                                        analysis.result.emotionalState) :
                                      'New Analysis'}
                                  </p>
                                  <p className="text-xs text-zinc-400">
                                    {analysis.createdAt?.seconds ? new Date(analysis.createdAt.seconds * 1000).toLocaleString() : 'Just now'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${analysis.status === 'completed' ? 'bg-zinc-800 text-emerald-700' : 'bg-zinc-800 text-amber-700'
                                  }`}>
                                  {analysis.status}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteConfirmation({
                                      type: 'analysis',
                                      id: analysis.id,
                                      name: 'this analysis'
                                    });
                                  }}
                                  className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                <ChevronRight className="w-5 h-5 text-slate-300" />
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="p-12 text-center">
                          <div className="w-16 h-16 bg-zinc-950 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-slate-300" />
                          </div>
                          <p className="text-zinc-400">No analyses found for {selectedPetForAnalyses.name}.</p>
                          <button
                            onClick={() => setActiveTab('upload')}
                            className="mt-4 text-gold-400 font-medium hover:underline"
                          >
                            Upload a video for {selectedPetForAnalyses.name}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black font-serif text-gold-400">My Pet Profiles</h3>
                    <button
                      onClick={() => {
                        setIsAddingPet(true);
                        setEditingPetId(null);
                        setPetImageFile(null);
                        setNewPet({
                          name: '',
                          species: 'dog',
                          breed: '',
                          age: '',
                          personality: '',
                          photoUrl: '',
                          diet: '',
                          vaccinations: ''
                        });
                      }}
                      className="bg-gold-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-gold-600 transition-all flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Pet
                    </button>
                  </div>

                  {isAddingPet && (
                    <div className="bg-zinc-900 p-6 rounded-2xl border border-gold-500/20 shadow-[0_10px_40px_rgba(0,0,0,0.6)] shadow-indigo-50 animate-in fade-in slide-in-from-top-4 duration-300">
                      <h4 className="text-lg font-black font-serif text-gold-400 mb-4">{editingPetId ? 'Edit Pet Profile' : 'Add New Pet'}</h4>
                      <form onSubmit={handleSavePet} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-zinc-400 uppercase">Pet Name</label>
                          <input
                            required
                            value={newPet.name}
                            onChange={e => setNewPet({ ...newPet, name: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-zinc-800 focus:ring-2 focus:ring-gold-500 outline-none"
                            placeholder="e.g., Buddy"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-zinc-400 uppercase">Species</label>
                          <select
                            value={newPet.species}
                            onChange={e => setNewPet({ ...newPet, species: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-zinc-800 focus:ring-2 focus:ring-gold-500 outline-none"
                          >
                            <option value="dog">Dog</option>
                            <option value="cat">Cat</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-zinc-400 uppercase">Breed</label>
                          <input
                            value={newPet.breed}
                            onChange={e => setNewPet({ ...newPet, breed: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-zinc-800 focus:ring-2 focus:ring-gold-500 outline-none"
                            placeholder="e.g., Golden Retriever"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-zinc-400 uppercase">Age</label>
                          <input
                            value={newPet.age}
                            onChange={e => setNewPet({ ...newPet, age: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-zinc-800 focus:ring-2 focus:ring-gold-500 outline-none"
                            placeholder="e.g., 3 years"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-xs font-bold text-zinc-400 uppercase">Profile Picture</label>
                          <div className="flex items-center gap-4">
                            <label className="flex-1">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => setPetImageFile(e.target.files?.[0] || null)}
                              />
                              <div className="w-full px-4 py-2 rounded-lg border border-dashed border-slate-300 hover:border-indigo-400 hover:bg-gold-500/10 transition-all cursor-pointer flex items-center justify-center gap-2 text-sm text-zinc-400">
                                <Upload className="w-4 h-4" />
                                {petImageFile ? petImageFile.name : 'Choose Image'}
                              </div>
                            </label>
                            {(petImageFile || newPet.photoUrl) && (
                              <div className="w-10 h-10 rounded-lg overflow-hidden border border-zinc-800">
                                <img
                                  src={petImageFile ? URL.createObjectURL(petImageFile) : newPet.photoUrl}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-xs font-bold text-zinc-400 uppercase">Dietary Information</label>
                          <textarea
                            value={newPet.diet}
                            onChange={e => setNewPet({ ...newPet, diet: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-zinc-800 focus:ring-2 focus:ring-gold-500 outline-none h-20 resize-none"
                            placeholder="e.g., Grain-free kibble, twice a day..."
                          />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-xs font-bold text-zinc-400 uppercase">Vaccination Records</label>
                          <textarea
                            value={newPet.vaccinations}
                            onChange={e => setNewPet({ ...newPet, vaccinations: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-zinc-800 focus:ring-2 focus:ring-gold-500 outline-none h-20 resize-none"
                            placeholder="e.g., Rabies (2025), DHPP (2024)..."
                          />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-xs font-bold text-zinc-400 uppercase">Personality / Notes</label>
                          <textarea
                            value={newPet.personality}
                            onChange={e => setNewPet({ ...newPet, personality: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-zinc-800 focus:ring-2 focus:ring-gold-500 outline-none h-20 resize-none"
                            placeholder="e.g., Very energetic, afraid of thunder..."
                          />
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingPet(false);
                              setEditingPetId(null);
                            }}
                            className="px-4 py-2 text-zinc-400 font-medium hover:bg-zinc-950 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isUploadingPetImage}
                            className="px-6 py-2 bg-gold-500 text-white font-bold rounded-lg hover:bg-gold-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {isUploadingPetImage ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                              </>
                            ) : (editingPetId ? 'Update Pet' : 'Save Pet')}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pets.map(pet => (
                      <div
                        key={pet.id}
                        onClick={() => setSelectedPetForAnalyses(pet)}
                        className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all relative group cursor-pointer hover:border-indigo-200"
                      >
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingPetId(pet.id);
                              setNewPet({
                                name: pet.name,
                                species: pet.species,
                                breed: pet.breed || '',
                                age: pet.age || '',
                                personality: pet.personality || '',
                                photoUrl: pet.photoUrl || '',
                                diet: pet.diet || '',
                                vaccinations: pet.vaccinations || ''
                              });
                              setIsAddingPet(true);
                              setPetImageFile(null);
                            }}
                            className="p-2 text-slate-300 hover:text-gold-400 hover:bg-gold-500/10 rounded-lg transition-all"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmation({
                                type: 'pet',
                                id: pet.id,
                                name: pet.name
                              });
                            }}
                            className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                          {pet.photoUrl ? (
                            <img
                              src={pet.photoUrl}
                              alt={pet.name}
                              className="w-12 h-12 rounded-xl object-cover border border-zinc-800"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gold-500/10 rounded-xl flex items-center justify-center">
                              {pet.species === 'dog' ? <Dog className="w-6 h-6 text-gold-400" /> : <Cat className="w-6 h-6 text-gold-400" />}
                            </div>
                          )}
                          <div>
                            <h4 className="font-black font-serif text-gold-400">{pet.name}</h4>
                            <p className="text-xs text-zinc-400 capitalize">{pet.species} • {pet.breed || 'Unknown Breed'}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Age</p>
                            <p className="text-sm text-zinc-300">{pet.age || 'Not specified'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Personality</p>
                            <p className="text-sm text-zinc-300 line-clamp-1">{pet.personality || 'No notes added.'}</p>
                          </div>
                          {pet.diet && (
                            <div>
                              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                                <Utensils className="w-2 h-2" /> Diet
                              </p>
                              <p className="text-sm text-zinc-300 line-clamp-1">{pet.diet}</p>
                            </div>
                          )}
                          {pet.vaccinations && (
                            <div>
                              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                                <Syringe className="w-2 h-2" /> Vaccinations
                              </p>
                              <p className="text-sm text-zinc-300 line-clamp-1">{pet.vaccinations}</p>
                            </div>
                          )}
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                          <span className="text-xs font-medium text-gold-400">View History</span>
                          <ChevronRight className="w-4 h-4 text-indigo-400" />
                        </div>
                      </div>
                    ))}
                    {pets.length === 0 && !isAddingPet && (
                      <div className="md:col-span-3 py-20 text-center bg-zinc-900 rounded-3xl border-2 border-dashed border-zinc-800">
                        <Dog className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-zinc-400">No pet profiles yet. Add your first pet to get started!</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          ) : activeTab === 'history' ? (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
            >
              <div className="divide-y divide-slate-50">
                {analyses.map((analysis) => (
                  <div
                    key={analysis.id}
                    onClick={() => setSelectedAnalysis(analysis)}
                    className="p-4 hover:bg-zinc-950 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">
                        {analysis.mediaType === 'video' ? <Play className="w-6 h-6 text-zinc-500" /> : <Activity className="w-6 h-6 text-zinc-500" />}
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-100 truncate max-w-[250px]">
                          {analysis.result?.emotionalState ?
                            (analysis.result.emotionalState.length > 50 ?
                              analysis.result.emotionalState.substring(0, 50) + '...' :
                              analysis.result.emotionalState) :
                            'New Analysis'}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {analysis.petName || 'My Pet'} • {analysis.createdAt?.seconds ? new Date(analysis.createdAt.seconds * 1000).toLocaleString() : 'Just now'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${analysis.status === 'completed' ? 'bg-zinc-800 text-emerald-700' : 'bg-zinc-800 text-amber-700'
                        }`}>
                        {analysis.status}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmation({
                            type: 'analysis',
                            id: analysis.id,
                            name: `${analysis.petName || 'Pet'}'s analysis`
                          });
                        }}
                        className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : activeTab === 'reminders' ? (
            <motion.div
              key="reminders"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black font-serif text-gold-400">Care Reminders</h3>
                <button
                  onClick={() => setIsAddingReminder(true)}
                  className="bg-gold-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-gold-600 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Reminder
                </button>
              </div>

              {isAddingReminder && (
                <div className="bg-zinc-900 p-6 rounded-2xl border border-gold-500/20 shadow-[0_10px_40px_rgba(0,0,0,0.6)] shadow-indigo-50 animate-in fade-in slide-in-from-top-4 duration-300">
                  <h4 className="text-lg font-black font-serif text-gold-400 mb-4">{editingReminderId ? 'Edit Reminder' : 'New Reminder'}</h4>
                  <form onSubmit={handleSaveReminder} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-400 uppercase">Pet</label>
                      <select
                        required
                        value={newReminder.petId}
                        onChange={e => setNewReminder({ ...newReminder, petId: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-zinc-800 focus:ring-2 focus:ring-gold-500 outline-none"
                      >
                        <option value="">Select Pet</option>
                        {pets.map(pet => (
                          <option key={pet.id} value={pet.id}>{pet.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-400 uppercase">Type</label>
                      <select
                        value={newReminder.type}
                        onChange={e => setNewReminder({ ...newReminder, type: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-zinc-800 focus:ring-2 focus:ring-gold-500 outline-none"
                      >
                        <option value="vaccination">Vaccination</option>
                        <option value="medication">Medication</option>
                        <option value="food">Food</option>
                        <option value="grooming">Grooming</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-zinc-400 uppercase">Reminder Title</label>
                      <input
                        required
                        value={newReminder.title}
                        onChange={e => setNewReminder({ ...newReminder, title: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-zinc-800 focus:ring-2 focus:ring-gold-500 outline-none"
                        placeholder="e.g., Annual Rabies Shot"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-400 uppercase">Due Date</label>
                      <input
                        required
                        type="date"
                        value={newReminder.dueDate}
                        onChange={e => setNewReminder({ ...newReminder, dueDate: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-zinc-800 focus:ring-2 focus:ring-gold-500 outline-none"
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingReminder(false);
                          setEditingReminderId(null);
                        }}
                        className="px-4 py-2 text-zinc-400 font-medium hover:bg-zinc-950 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-gold-500 text-white font-bold rounded-lg hover:bg-gold-600 transition-colors"
                      >
                        {editingReminderId ? 'Update Reminder' : 'Save Reminder'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reminders.map(reminder => (
                  <div
                    key={reminder.id}
                    className={`bg-zinc-900 p-6 rounded-2xl border transition-all relative group ${reminder.completed ? 'border-zinc-800 opacity-60' : 'border-zinc-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
                      }`}
                  >
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => {
                          setEditingReminderId(reminder.id);
                          setNewReminder({
                            petId: reminder.petId,
                            title: reminder.title,
                            type: reminder.type,
                            dueDate: reminder.dueDate,
                            completed: reminder.completed
                          });
                          setIsAddingReminder(true);
                        }}
                        className="p-2 text-slate-300 hover:text-gold-400 hover:bg-gold-500/10 rounded-lg transition-all"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmation({ type: 'reminder', id: reminder.id, name: reminder.title })}
                        className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${reminder.completed ? 'bg-zinc-800 text-zinc-500' :
                          reminder.type === 'vaccination' ? 'bg-gold-500/10 text-gold-400' :
                            reminder.type === 'medication' ? 'bg-zinc-800 text-rose-600' :
                              'bg-zinc-800 text-gold-400'
                        }`}>
                        {reminder.type === 'vaccination' ? <Syringe className="w-6 h-6" /> :
                          reminder.type === 'medication' ? <Activity className="w-6 h-6" /> :
                            <Bell className="w-6 h-6" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-black font-serif text-gold-400 truncate ${reminder.completed ? 'line-through' : ''}`}>{reminder.title}</h4>
                        <p className="text-xs text-zinc-400 capitalize">{reminder.petName} • {reminder.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center gap-2 text-zinc-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs font-medium">{new Date(reminder.dueDate).toLocaleDateString()}</span>
                      </div>
                      <button
                        onClick={() => handleToggleReminder(reminder.id, reminder.completed)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${reminder.completed
                            ? 'bg-zinc-800 text-zinc-400'
                            : 'bg-gold-500/10 text-gold-400 hover:bg-gold-500 hover:text-white'
                          }`}
                      >
                        {reminder.completed ? 'Completed' : 'Mark Done'}
                      </button>
                    </div>
                  </div>
                ))}
                {reminders.length === 0 && !isAddingReminder && (
                  <div className="md:col-span-3 py-20 text-center bg-zinc-900 rounded-3xl border-2 border-dashed border-zinc-800">
                    <Bell className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-zinc-400">No care reminders yet. Stay on top of your pet's health!</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : activeTab === 'settings' ? (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto space-y-8"
            >
              <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                <h3 className="text-2xl font-black font-serif text-gold-400 mb-6">Account Settings</h3>

                {userData?.subscriptionTier === 'pro' && (
                  <div className="mb-8 p-6 bg-gold-500/10 rounded-2xl border border-gold-500/20">
                    <h4 className="text-lg font-bold text-indigo-900 mb-2 flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Pro Membership Active
                    </h4>
                    <p className="text-sm text-gold-300">
                      You have unlimited access to all AI Behaviorist features.
                    </p>
                  </div>
                )}

                <div className="space-y-8">
                  {/* Profile Section */}
                  <section className="space-y-4">
                    <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Profile Information</h4>

                    <div className="flex items-center gap-6 mb-6">
                      <div className="relative group">
                        {user?.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt={user.displayName || 'Profile'}
                            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gold-500/20 flex items-center justify-center border-4 border-white shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                            <UserIcon className="w-8 h-8 text-gold-400" />
                          </div>
                        )}
                        <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          {isUploadingProfilePic ? (
                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                          ) : (
                            <Camera className="w-6 h-6 text-white" />
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleProfilePicUpload}
                            disabled={isUploadingProfilePic}
                          />
                        </label>
                      </div>
                      <div>
                        <p className="font-black font-serif text-gold-400">Profile Picture</p>
                        <p className="text-xs text-zinc-400">Click the image to upload a new one.</p>
                      </div>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-400 uppercase">Display Name</label>
                        <input
                          value={settingsName}
                          onChange={(e) => setSettingsName(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-zinc-800 focus:ring-2 focus:ring-gold-500 outline-none transition-all"
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-400 uppercase">Email Address</label>
                        <input
                          disabled
                          value={user?.email || ''}
                          className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-500 outline-none cursor-not-allowed"
                        />
                        <p className="text-[10px] text-zinc-500 italic">Email cannot be changed currently.</p>
                      </div>
                      <button
                        type="submit"
                        disabled={isUpdatingProfile || settingsName === user?.displayName}
                        className="px-6 py-3 bg-gold-500 text-white font-bold rounded-xl hover:bg-gold-600 transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        {isUpdatingProfile && <Loader2 className="w-4 h-4 animate-spin" />}
                        Update Profile
                      </button>
                    </form>
                  </section>

                  <hr className="border-zinc-800" />

                  {/* Subscription Section */}
                  <section className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Subscription Plan</h4>
                      <div className="flex items-center gap-2">
                        {isSandbox && (
                          <span className="bg-gold-500/20 text-gold-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                            Sandbox
                          </span>
                        )}
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${userData?.subscriptionTier === 'pro' ? 'bg-gold-500/20 text-gold-400' : 'bg-zinc-800 text-zinc-400'
                          }`}>
                          {userData?.subscriptionTier === 'pro' ? 'Pro' : 'Free'} Tier
                        </span>
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl border border-zinc-800 bg-zinc-900 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                      <div className="flex items-start justify-between gap-6">
                        <div className="space-y-2">
                          <p className="font-black font-serif text-gold-400">
                            {userData?.subscriptionTier === 'pro' ? 'Pawsitive Behavior Pro' : 'Pawsitive Behavior Free'}
                          </p>
                          <p className="text-sm text-zinc-400 leading-relaxed">
                            {userData?.subscriptionTier === 'pro'
                              ? 'You have unlimited access to behavioral analyses and expert follow-up chats.'
                              : `You have used ${userData?.analysesCount || 0}/3 free analyses. Upgrade for unlimited access.`}
                          </p>
                        </div>
                        {userData?.subscriptionTier !== 'pro' ? (
                          <button
                            onClick={() => setShowLimitModal({ type: 'upgrade', message: "Unlock unlimited analyses and expert chat with Pawsitive Behavior Pro!" })}
                            className="shrink-0 px-6 py-3 bg-gold-500 text-white font-bold rounded-xl hover:bg-gold-600 transition-all shadow-lg shadow-gold-500/20"
                          >
                            Upgrade to Pro
                          </button>
                        ) : (
                          <button
                            onClick={handleRestorePurchases}
                            disabled={isRestoring}
                            className="shrink-0 px-6 py-3 bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold rounded-xl hover:bg-zinc-950 transition-all flex items-center gap-2"
                          >
                            {isRestoring && <Loader2 className="w-4 h-4 animate-spin" />}
                            Restore Purchases
                          </button>
                        )}
                      </div>

                      {userData?.subscriptionTier !== 'pro' && (
                        <div className="mt-6 pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2 text-xs text-zinc-400">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            3 Analyses Total
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-400">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            2 Chats per Analysis
                          </div>
                        </div>
                      )}

                      <div className="mt-4 flex flex-wrap items-center gap-4 text-[10px] text-zinc-500">
                        <button onClick={() => setShowTermsModal(true)} className="hover:text-gold-400 underline">Terms of Use (EULA)</button>
                        <button onClick={() => setShowPrivacyModal(true)} className="hover:text-gold-400 underline">Privacy Policy</button>
                        <button onClick={() => setShowFairUseModal(true)} className="hover:text-gold-400 underline">Fair Use Policy</button>
                      </div>
                    </div>
                  </section>

                  <hr className="border-zinc-800" />

                  {/* Referral Section */}
                  <section className="space-y-4">
                    <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Referral Program</h4>
                    <div className="bg-zinc-800 p-6 rounded-3xl border border-amber-100 space-y-4">
                      <div>
                        <p className="text-sm font-bold text-amber-900 mb-1">Your Referral Code</p>
                        <div className="flex items-center gap-2">
                          <code className="bg-zinc-900 px-4 py-2 rounded-xl border border-gold-500/50 font-mono font-bold text-gold-400 text-lg">
                            {userData?.referralCode || '------'}
                          </code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(userData?.referralCode || '');
                              setNotification({ message: "Referral code copied!", type: 'success' });
                            }}
                            className="p-2 text-gold-400 hover:bg-zinc-900 rounded-lg transition-all"
                          >
                            <Copy className="w-5 h-5" />
                          </button>
                        </div>
                        <p className="text-xs text-amber-700 mt-2">
                          Share this code with friends! They get <span className="font-bold">+2 bonus analyses</span>, and you get <span className="font-bold">+5 bonus analyses</span> when they join.
                        </p>
                      </div>

                      {!userData?.referredBy && (
                        <div className="pt-4 border-t border-gold-500/50">
                          <p className="text-sm font-bold text-amber-900 mb-2">Have a referral code?</p>
                          <form onSubmit={handleReferralSubmit} className="flex gap-2">
                            <input
                              value={referralInput}
                              onChange={(e) => setReferralInput(e.target.value)}
                              placeholder="ENTER CODE"
                              className="flex-1 px-4 py-2 rounded-xl border border-gold-500/50 focus:ring-2 focus:ring-amber-500 outline-none uppercase font-mono"
                            />
                            <button
                              type="submit"
                              disabled={isSubmittingReferral || !referralInput.trim()}
                              className="px-6 py-2 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition-all disabled:opacity-50"
                            >
                              {isSubmittingReferral ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  </section>

                  <hr className="border-zinc-800" />

                  {/* Security Section */}
                  <section className="space-y-4">
                    <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Security</h4>
                    <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-black font-serif text-gold-400">Reset Password</p>
                          <p className="text-sm text-zinc-400">We'll send a password reset link to your email address.</p>
                        </div>
                        <button
                          onClick={handlePasswordReset}
                          disabled={isSendingReset}
                          className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold rounded-xl hover:bg-zinc-950 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.4)] disabled:opacity-50 flex items-center gap-2"
                        >
                          {isSendingReset && <Loader2 className="w-4 h-4 animate-spin" />}
                          Send Link
                        </button>
                      </div>
                    </div>
                  </section>

                  <hr className="border-zinc-800" />

                  {/* Danger Zone */}
                  <section className="space-y-4">
                    <h4 className="text-sm font-bold text-red-400 uppercase tracking-wider">Danger Zone</h4>
                    <button
                      onClick={logout}
                      className="w-full px-6 py-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out of All Devices
                    </button>
                  </section>

                  <div className="pt-8 text-center border-t border-zinc-800 mt-8">
                    <p className="text-sm text-zinc-400">
                      Need help? Contact us at: <a href="mailto:xyz@gmail.com" className="text-gold-400 hover:underline font-bold">xyz@gmail.com</a>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-zinc-900 rounded-3xl border-2 border-dashed border-zinc-800 p-12 text-center">
                {isUploading ? (
                  <div className="space-y-6">
                    <div className="relative w-24 h-24 mx-auto">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle className="text-slate-100 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent" />
                        <circle
                          className="text-gold-400 stroke-current transition-all duration-500"
                          strokeWidth="8"
                          strokeDasharray={251.2}
                          strokeDashoffset={251.2 - (251.2 * uploadProgress) / 100}
                          strokeLinecap="round"
                          cx="50" cy="50" r="40" fill="transparent"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center font-bold text-gold-400">
                        {uploadProgress}%
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-black font-serif text-gold-400">{uploadStatus || 'Analyzing Behavior...'}</h3>
                      <p className="text-zinc-400">Please wait while we process your request.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="w-20 h-20 bg-gold-500/10 rounded-2xl flex items-center justify-center mx-auto">
                      <Upload className="w-10 h-10 text-gold-400" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-black font-serif text-gold-400">Upload Pet Media</h3>
                      <p className="text-zinc-400">Select a video or audio clip of your pet's behavior for analysis.</p>
                    </div>

                    <div className="max-w-md mx-auto space-y-4">
                      <div className="text-left">
                        <label className="block text-sm font-semibold text-zinc-300 mb-1">Select Pet</label>
                        <select
                          value={selectedPetId}
                          onChange={(e) => setSelectedPetId(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-zinc-800 focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all text-sm"
                        >
                          <option value="">General Analysis (No Pet Profile)</option>
                          {pets.map(pet => (
                            <option key={pet.id} value={pet.id}>{pet.name} ({pet.species})</option>
                          ))}
                        </select>
                        {pets.length === 0 && (
                          <p className="text-xs text-gold-400 mt-1">Tip: Add a pet profile first for more accurate results!</p>
                        )}
                      </div>

                      <div className="text-left">
                        <label className="block text-sm font-semibold text-zinc-300 mb-1">Specific Question ("e.g., am I training my dog to sit correctly?)</label>
                        <textarea
                          value={userQuestion}
                          onChange={(e) => setUserQuestion(e.target.value)}
                          placeholder="e.g., Why does my dog bark when the doorbell rings?"
                          className="w-full px-4 py-3 rounded-xl border border-zinc-800 focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all resize-none h-24 text-sm"
                        />
                      </div>

                      <div className="block">
                        <input
                          id="behavior-file-input"
                          type="file"
                          className="hidden"
                          accept="video/*,audio/*"
                          onChange={handleUpload}
                        />
                        <button
                          onClick={handleInitiateUpload}
                          disabled={paywallCooldown}
                          className={`w-full inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold transition-all shadow-lg cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${paywallCooldown
                              ? 'bg-zinc-800 text-zinc-500 shadow-none'
                              : 'bg-gold-500 text-white hover:bg-gold-600 shadow-gold-500/20'
                            }`}
                        >
                          {paywallCooldown ? (
                            <div className="flex items-center gap-2">
                              <Clock className="w-5 h-5" />
                              <span>Limit Reached</span>
                            </div>
                          ) : (
                            'Analyze Behavior'
                          )}
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-500">Supported formats: MP4, MOV, MP3, WAV (Max 50MB)</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmation && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-zinc-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-zinc-800"
            >
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-black font-serif text-gold-400 mb-2">Delete {deleteConfirmation.type}?</h3>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                Are you sure you want to delete <span className="font-black font-serif text-gold-400">"{deleteConfirmation.name}"</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmation(null)}
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-zinc-400 hover:bg-zinc-950 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (deleteConfirmation.type === 'pet') {
                      handleDeletePet(deleteConfirmation.id);
                    } else if (deleteConfirmation.type === 'analysis') {
                      handleDeleteAnalysis(deleteConfirmation.id);
                    } else if (deleteConfirmation.type === 'reminder') {
                      handleDeleteReminder(deleteConfirmation.id);
                    } else if (deleteConfirmation.type === 'challenge') {
                      handleDeleteChallenge(deleteConfirmation.id);
                    }
                  }}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Limit Modal / Subscription Page */}
      <AnimatePresence>
        {showLimitModal && (
          <SubscriptionPage
            message={showLimitModal.message}
            onUpgrade={handleUpgrade}
            onRestore={handleRestorePurchases}
            isSandbox={isSandbox}
            onWatchAd={() => handleWatchAd(showLimitModal.type)}
            isWatchingAd={isWatchingAd}
            type={showLimitModal.type}
            onClose={() => {
              setShowLimitModal(null);
              if (showLimitModal.type === 'analysis') {
                setPaywallCooldown(true);
                setTimeout(() => setPaywallCooldown(false), 5000);
              }
            }}
            onShowTerms={() => {
              setShowLimitModal(null);
              setShowTermsModal(true);
            }}
            onShowPrivacy={() => {
              setShowLimitModal(null);
              setShowPrivacyModal(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* Bot Verification Modal */}
      <AnimatePresence>
        {showBotModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-zinc-900 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldAlert className="w-10 h-10 text-gold-400" />
              </div>
              <h2 className="text-2xl font-black font-serif text-gold-400 mb-4">Verification Required</h2>
              <p className="text-zinc-400 mb-8">
                You've reached a high usage threshold (300+ analyses). To ensure service quality for everyone, please verify you are a human.
              </p>

              <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 mb-8">
                <label className="flex items-center gap-4 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-6 h-6 rounded border-slate-300 text-gold-400 focus:ring-gold-500"
                    onChange={(e) => setIsBotVerified(e.target.checked)}
                  />
                  <span className="text-lg font-medium text-zinc-300 group-hover:text-gold-400 transition-colors">
                    I am not a bot
                  </span>
                </label>
              </div>

              <button
                onClick={() => {
                  if (isBotVerified) {
                    setShowBotModal(false);
                    setNotification({ message: "Verification successful. You can continue.", type: 'success' });
                  }
                }}
                disabled={!isBotVerified}
                className={`w-full py-4 rounded-2xl font-bold transition-all ${isBotVerified
                    ? 'bg-gold-500 text-white shadow-lg shadow-indigo-200 hover:bg-gold-600'
                    : 'bg-slate-200 text-zinc-500 cursor-not-allowed'
                  }`}
              >
                Continue Analysis
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Fair Use Policy Modal */}
      <AnimatePresence>
        {showFairUseModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-zinc-900 rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-zinc-800 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black font-serif text-gold-400">Unlimited Analysis Fair Use Policy</h2>
                <button onClick={() => setShowFairUseModal(false)} className="p-2 text-zinc-500 hover:bg-zinc-800 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6 text-zinc-400 text-sm leading-relaxed">
                <p>
                  To ensure a high-quality experience for all users, our "Unlimited" plan is subject to a Fair Use Policy. This plan is intended for personal, non-commercial use by a single individual.
                </p>

                <div>
                  <h4 className="font-black font-serif text-gold-400 mb-1">Personal Use</h4>
                  <p>Analysis is intended for pets owned by the subscriber. Commercial use (e.g., professional training facilities or shelters) requires a Business License.</p>
                </div>

                <div>
                  <h4 className="font-black font-serif text-gold-400 mb-1">Usage Caps</h4>
                  <p>Accounts exceeding 300 analyses per month or 30 analyses per day may be subject to temporary speed throttling or a transition to our Standard Intelligence model.</p>
                </div>

                <div>
                  <h4 className="font-black font-serif text-gold-400 mb-1">Automated Use</h4>
                  <p>Any attempt to use scripts, bots, or automated tools to submit videos is strictly prohibited and will result in immediate account termination.</p>
                </div>
              </div>

              <button
                onClick={() => setShowFairUseModal(false)}
                className="w-full mt-8 py-4 bg-zinc-800 text-zinc-100 font-bold rounded-2xl hover:bg-zinc-700 transition-all"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Terms of Use Modal */}
      <AnimatePresence>
        {showTermsModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-zinc-900 rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-zinc-800 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black font-serif text-gold-400">Terms of Use (EULA)</h2>
                <button onClick={() => setShowTermsModal(false)} className="p-2 text-zinc-500 hover:bg-zinc-800 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6 text-zinc-400 text-sm leading-relaxed">
                <p className="italic">Last Updated: April 2026</p>

                <div>
                  <h4 className="font-black font-serif text-gold-400 mb-1">1. Acceptance of Terms</h4>
                  <p>By accessing and using Pawsitive Behavior, you agree to be bound by these Terms of Use. If you do not agree, please do not use the application.</p>
                </div>

                <div>
                  <h4 className="font-black font-serif text-gold-400 mb-1">2. Medical Disclaimer</h4>
                  <p>Pawsitive Behavior provides AI-driven behavioral analysis for educational and training purposes only. It is NOT a substitute for professional veterinary or trainer's advice, diagnosis, or treatment. Always consult a qualified veterinarian for medical concerns.</p>
                </div>

                <div>
                  <h4 className="font-black font-serif text-gold-400 mb-1">3. User Content</h4>
                  <p>You retain ownership of the videos and audio you upload. By uploading, you grant Pawsitive Behavior a license to process this media solely for the purpose of providing the analysis service.</p>
                </div>

                <div>
                  <h4 className="font-black font-serif text-gold-400 mb-1">4. Subscriptions and Billing</h4>
                  <p>Premium features require a subscription. Payments are processed securely through your device's app store (Apple App Store or Google Play). Subscriptions automatically renew unless canceled at least 24 hours before the end of the current period.</p>
                </div>
              </div>

              <button
                onClick={() => setShowTermsModal(false)}
                className="w-full mt-8 py-4 bg-zinc-800 text-zinc-100 font-bold rounded-2xl hover:bg-zinc-700 transition-all"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Privacy Policy Modal */}
      <AnimatePresence>
        {showPrivacyModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-zinc-900 rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-zinc-800 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black font-serif text-gold-400">Privacy Policy</h2>
                <button onClick={() => setShowPrivacyModal(false)} className="p-2 text-zinc-500 hover:bg-zinc-800 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6 text-zinc-400 text-sm leading-relaxed">
                <p className="italic">Last Updated: April 2026</p>

                <div>
                  <h4 className="font-black font-serif text-gold-400 mb-1">1. Information We Collect</h4>
                  <p>We collect information you provide directly to us, including your email address, pet profiles (name, breed, age), and the media (video/audio) you upload for analysis.</p>
                </div>

                <div>
                  <h4 className="font-black font-serif text-gold-400 mb-1">2. How We Use Your Information</h4>
                  <p>Your media is processed using advanced AI models to provide behavioral insights. We do not use your personal videos to train public AI models. Your data is used strictly to deliver and improve your personal experience within the app.</p>
                </div>

                <div>
                  <h4 className="font-black font-serif text-gold-400 mb-1">3. Data Storage and Security</h4>
                  <p>Your data is securely stored using industry-standard cloud infrastructure. We implement robust security measures to protect your personal information from unauthorized access.</p>
                </div>

                <div>
                  <h4 className="font-black font-serif text-gold-400 mb-1">4. Data Deletion</h4>
                  <p>You can delete your pet profiles, analyses, or your entire account at any time from within the app. Deleting an item permanently removes it from our active servers.</p>
                </div>
              </div>

              <button
                onClick={() => setShowPrivacyModal(false)}
                className="w-full mt-8 py-4 bg-zinc-800 text-zinc-100 font-bold rounded-2xl hover:bg-zinc-700 transition-all"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-8 left-1/2 z-[110] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[320px] border ${notification.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-red-600 text-white border-red-500'
              }`}
          >
            {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <p className="font-bold text-sm">{notification.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Upload Type Modal */}
      <AnimatePresence>
        {showUploadTypeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-zinc-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-zinc-800"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black font-serif text-gold-400">Media Source</h3>
                <button onClick={() => setShowUploadTypeModal(false)} className="p-2 text-zinc-500 hover:bg-zinc-800 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <button
                  onClick={() => {
                    setShowUploadTypeModal(false);
                    const fileInput = document.getElementById('behavior-file-input');
                    if (fileInput) (fileInput as HTMLInputElement).click();
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-gold-500/50 hover:bg-zinc-900 transition-all text-left"
                >
                  <div className="w-12 h-12 bg-gold-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Upload className="w-6 h-6 text-gold-400" />
                  </div>
                  <div>
                    <p className="font-bold text-zinc-100">Upload Video</p>
                    <p className="text-xs text-zinc-400">Choose from your library</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setShowUploadTypeModal(false);
                    startCameraPreview();
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-gold-500/50 hover:bg-zinc-900 transition-all text-left"
                >
                  <div className="w-12 h-12 bg-gold-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Camera className="w-6 h-6 text-gold-400" />
                  </div>
                  <div>
                    <p className="font-bold text-zinc-100">Record Video</p>
                    <p className="text-xs text-zinc-400">Record right now (max 30s)</p>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Recording Modal */}
      <AnimatePresence>
        {(isRecordingVideo || isCameraPreview) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black flex flex-col"
          >
            <div className="flex-1 relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              
              {/* Circular Reverse Filling Counter */}
              <div className="absolute top-8 right-8 w-16 h-16">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle className="text-white/20 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent" />
                  <circle
                    className="text-red-500 stroke-current transition-all duration-1000 ease-linear"
                    strokeWidth="8"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * (recordingTimeLeft / 30))}
                    strokeLinecap="round"
                    cx="50" cy="50" r="40" fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-lg drop-shadow-md">{recordingTimeLeft}</span>
                </div>
              </div>

              {/* Close Button */}
              <button 
                onClick={cancelRecording}
                className="absolute top-8 left-8 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors backdrop-blur-md"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Flip Camera Button */}
              <button 
                onClick={toggleCamera}
                className="absolute top-8 left-1/2 -translate-x-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors backdrop-blur-md flex items-center gap-2 px-4"
              >
                <Camera className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">{cameraFacingMode === 'user' ? 'Switch to Back' : 'Switch to Front'}</span>
              </button>
              
              <div className="absolute bottom-12 inset-x-0 flex justify-center items-center gap-8">
                {isRecordingVideo ? (
                  <button
                    onClick={stopRecording}
                    disabled={isStopping}
                    className="w-20 h-20 bg-red-500 rounded-full border-4 border-white/20 shadow-[0_0_20px_rgba(239,68,68,0.5)] flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
                  >
                    {isStopping ? (
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    ) : (
                      <div className="w-8 h-8 bg-white rounded-sm" />
                    )}
                  </button>
                ) : (
                  <button
                    onClick={startRecording}
                    className="w-20 h-20 bg-white rounded-full border-4 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    <div className="w-16 h-16 bg-red-500 rounded-full border-4 border-white" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <motion.button
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-serif font-bold text-base ${active
          ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/20'
          : 'text-zinc-400 hover:bg-zinc-950 hover:text-gold-400'
        }`}
    >
      {icon}
      {label}
    </motion.button>
  );
}

function StatCard({ label, value, icon }: { label: string, value: number | string, icon: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-zinc-900 p-4 lg:p-6 rounded-2xl border border-zinc-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-zinc-950 rounded-lg">{icon}</div>
      </div>
      <p className="text-zinc-400 text-xs lg:text-sm font-medium">{label}</p>
      <p className="text-xl lg:text-2xl font-black font-serif text-gold-400 mt-1">{value}</p>
    </motion.div>
  );
}
