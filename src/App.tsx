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
  Car,
  Wrench,
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
  Camera,
  Mic,
  Square,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from './lib/AuthContext';
import { TRANSLATIONS, SUPPORTED_LANGUAGES, LocaleCode } from './lib/i18n';

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

const getApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    const isAndroidNative = /Android/i.test(navigator.userAgent) && (window.location.protocol.startsWith('capacitor') || window.location.hostname === 'localhost');
    if (isAndroidNative) {
      return 'http://10.0.2.2:8080';
    }
    return 'http://localhost:8080';
  }
  return CLOUD_RUN_URL;
};
const API_BASE_URL = getApiBaseUrl();

console.log("[API] Production Base URL:", API_BASE_URL);

const resolveMediaUrl = (url: string) => {
  if (!url) return url;
  if (url.includes('/api/proxy-media?path=')) {
    const path = url.split('/api/proxy-media?path=')[1];
    return `${API_BASE_URL}/api/proxy-media?path=${path}`;
  }
  return url;
};

const MaintenancePlanCard = ({ challenge, onCompleteDay }: { challenge: any, onCompleteDay?: (day: number) => void }) => {
  if (!challenge) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 p-4 lg:p-8 rounded-3xl border border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-slate-800 rounded-2xl flex items-center justify-center">
          <Flame className="w-5 h-5 lg:w-6 lg:h-6 text-orange-400" />
        </div>
        <div>
          <h3 className="text-lg lg:text-xl font-black font-serif text-orange-400">{challenge.title}</h3>
          <p className="text-xs lg:text-sm text-slate-400">7-Day Maintenance Plan</p>
        </div>
      </div>

      <p className="text-sm lg:text-base text-slate-400 mb-8 leading-relaxed">{challenge.description}</p>

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
                  ? 'bg-slate-800 border-emerald-100'
                  : 'bg-slate-950 border-slate-800 hover:border-orange-500/50'
                }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] lg:text-xs font-bold uppercase tracking-widest ${isCompleted ? 'text-emerald-600' : 'text-slate-500'}`}>
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
              <p className={`font-bold text-base lg:text-lg mb-1 ${isCompleted ? 'text-emerald-900' : 'text-slate-100'}`}>
                {day.exercise}
              </p>
              <p className={`text-xs lg:text-sm ${isCompleted ? 'text-emerald-700' : 'text-slate-400'}`}>
                <span className="font-semibold">Goal:</span> {day.goal}
              </p>

              {!isCompleted && onCompleteDay && (
                <button
                  onClick={() => onCompleteDay(day.day)}
                  className="mt-4 w-full py-2 bg-slate-900 border border-slate-800 text-slate-400 rounded-xl text-sm font-bold hover:bg-slate-950 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.4)] active:scale-95"
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

const SubscriptionPage = ({ message, onUpgrade, onRestore, onClose, isSandbox, onWatchAd, isWatchingAd, type, onShowTerms, onShowPrivacy, t }: { message: string, onUpgrade: (pkg?: any) => void, onRestore: () => void, onClose: () => void, isSandbox?: boolean, onWatchAd?: () => void, isWatchingAd?: boolean, type?: 'analysis' | 'chat' | 'upgrade', onShowTerms: () => void, onShowPrivacy: () => void, t: (key: string, replacements?: any) => string }) => {
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
        className="bg-slate-900 rounded-t-[32px] lg:rounded-[32px] p-8 max-w-md w-full shadow-2xl border border-slate-800 overflow-hidden"
      >
        <div className="flex justify-center mb-4 lg:hidden">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
        </div>

        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center">
              <Zap className="w-8 h-8 text-orange-400" />
            </div>
            {isSandbox && (
              <span className="bg-orange-500/20 text-orange-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                {t('sandbox_mode')}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:bg-slate-950 rounded-full transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <h3 className="text-2xl font-black font-serif text-orange-400 mb-3">
          {t('unlock_pro_title')}
        </h3>
        <p className="text-slate-400 mb-8 leading-relaxed">
          {message || t('unlock_pro_desc_default')}
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            </div>
            {t('pro_feature_1')}
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            </div>
            {t('pro_feature_2')}
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            </div>
            {t('pro_feature_3')}
          </div>
        </div>

        <div className="space-y-3">
          {isLoadingPackages ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
            </div>
          ) : packages.length > 0 ? (
            packages.map((pkg) => (
              <button
                key={pkg.identifier}
                onClick={() => onUpgrade(pkg)}
                className="w-full py-4 mb-3 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-[0_10px_40px_rgba(0,0,0,0.6)] shadow-orange-500/20 flex flex-col items-center justify-center gap-1"
              >
                <span>{pkg.packageType === 'ANNUAL' ? t('yearly_pro') : t('monthly_pro')}</span>
                <span className="text-xs font-normal opacity-90">{pkg.product.priceString} {pkg.packageType === 'ANNUAL' ? t('per_year') : t('per_month')}</span>
              </button>
            ))
          ) : (
            <button
              onClick={() => onUpgrade()}
              className="w-full py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-[0_10px_40px_rgba(0,0,0,0.6)] shadow-orange-500/20 flex items-center justify-center gap-2"
            >
              {t('subscribe_default')}
            </button>
          )}

          {onWatchAd && type !== 'upgrade' && (
            <button
              onClick={onWatchAd}
              disabled={isWatchingAd}
              className="w-full py-3 bg-slate-800 text-slate-300 font-bold rounded-2xl hover:bg-slate-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isWatchingAd ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Play className="w-5 h-5" />
              )}
              {t('watch_ad_free')}{type === 'chat' ? t('chat') : t('analysis')}
            </button>
          )}

          <button
            onClick={onRestore}
            className="w-full py-3 text-slate-400 font-bold hover:bg-slate-950 rounded-2xl transition-all text-sm"
          >
            {t('restore_purchases')}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] text-slate-500 font-medium">
          <button onClick={onShowTerms} className="hover:text-orange-400 underline">{t('terms_of_use')}</button>
          <button onClick={onShowPrivacy} className="hover:text-orange-400 underline">{t('privacy_policy')}</button>
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
      <div className="h-48 flex items-center justify-center bg-slate-950 rounded-2xl border border-dashed border-slate-800">
        <p className="text-slate-500 text-sm">Start your maintenance plans to see your progress!</p>
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
                  <div className="bg-slate-900 p-3 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] border border-slate-800">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">{payload[0].payload.date}</p>
                    <p className="text-sm font-bold text-orange-400">Total Sessions: {payload[0].value}</p>
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

const StreakHeader = ({ streak, activityLog, t }: { streak: number, activityLog: any[], t: (key: string, replacements?: any) => string }) => {
  const today = new Date().toDateString();
  const hasUploadedToday = activityLog.some(ts => new Date(ts.toMillis()).toDateString() === today);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6 bg-slate-900 p-4 lg:p-6 rounded-3xl border border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)] mb-8">
      <div className="relative w-16 h-16 lg:w-20 lg:h-20">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle className="text-slate-100 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent" />
          <motion.circle
            className="text-orange-500 stroke-current"
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
            <Flame className={`w-6 h-6 lg:w-8 lg:h-8 ${hasUploadedToday ? 'text-orange-500' : 'text-slate-300'}`} />
          </motion.div>
        </div>
      </div>
      <div className="text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <h2 className="text-2xl lg:text-3xl font-black font-serif text-slate-100">🔥 {t('streak_day', { streak })}</h2>
          {hasUploadedToday && (
            <span className="bg-orange-500/20 text-orange-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              {t('daily_goal_met')}
            </span>
          )}
        </div>
        <p className="text-sm text-slate-400 mt-1">
          {hasUploadedToday
            ? t('streak_subtitle_met')
            : t('streak_subtitle_unmet')}
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
  increment,
  deleteUser
} from './lib/firebase';
import { rewardedAdService } from './lib/adService';
import { Capacitor } from '@capacitor/core';
import { Purchases } from '@revenuecat/purchases-capacitor';
import { Share } from '@capacitor/share';
import { Camera as CapCamera } from '@capacitor/camera';

export default function App() {
  const { user, userData, loading, isAdmin, setUserData } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'upload' | 'history' | 'vehicles' | 'settings' | 'reminders' | 'challenges'>('dashboard');

  const [locale, setLocale] = useState<LocaleCode>(() => {
    return (localStorage.getItem('app_locale') as LocaleCode) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('app_locale', locale);
  }, [locale]);

  const t = (key: string, replacements?: Record<string, string | number>) => {
    let text = TRANSLATIONS[locale]?.[key] || TRANSLATIONS['en']?.[key] || key;
    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        text = text.split(`{${k}}`).join(String(v));
      });
    }
    return text;
  };

  const getUploadStatusText = (status: string) => {
    if (!status) return t('analyzing_vehicle');
    if (status === 'Preparing media...') return t('preparing_media');
    if (status === 'Uploading media file...') return t('uploading_media_file');
    if (status === 'AI Mechanic is analyzing...') return t('ai_mechanic_analyzing');
    if (status === 'Finalizing report...') return t('finalizing_report');
    if (status === 'Complete!') return t('complete');
    if (status === 'Opening secure checkout...') return t('opening_checkout');
    return status;
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [userQuestion, setUserQuestion] = useState('');
  const [selectedVehicleId, setSelectedPetId] = useState<string>('');
  const [selectedVehicleForAnalyses, setSelectedPetForAnalyses] = useState<any | null>(null);
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);
  const [lockedAnalysisPrompt, setLockedAnalysisPrompt] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState<{ type: 'analysis' | 'chat' | 'upgrade', messyear: string } | null>(null);
  const [paywallCooldown, setPaywallCooldown] = useState(false);

  // Upload/Recording state
  const [showUploadTypeModal, setShowUploadTypeModal] = useState(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
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

  // Vehicle management state
  const [isAddingVehicle, setIsAddingPet] = useState(false);
  const [editingVehicleId, setEditingPetId] = useState<string | null>(null);
  const [vehicleImageFile, setVehicleImageFile] = useState<File | null>(null);
  const [isUploadingVehicleImage, setIsUploadingPetImage] = useState(false);
  const [newVehicle, setNewPet] = useState({
    name: '',
    make: '',
    model: '',
    year: '',
    mileage: '',
    photoUrl: '',
    engine: '',
    transmission: ''
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
    type: 'vehicle' | 'analysis' | 'reminder' | 'challenge';
    id: string;
    name: string;
  } | null>(null);

  const [notification, setNotification] = useState<{
    messyear: string;
    type: 'success' | 'error';
  } | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

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
    vehicleId: '',
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
            messyear: `Ready to learn more? Upgrade to Pro or watch a quick ad to continue analyzing your vehicle.`
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
      where('userId', '==', user.uid)
    );

    const unsubscribeAnalyses = onSnapshot(qAnalyses, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
      docs.sort((a: any, b: any) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      setAnalyses(docs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'analyses');
    });

    // Listen for vehicles
    const qVehicles = query(
      collection(db, 'vehicles'),
      where('userId', '==', user.uid)
    );

    const unsubscribeVehicles = onSnapshot(qVehicles, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
      docs.sort((a: any, b: any) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      setVehicles(docs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'vehicles');
    });

    // Listen for reminders
    const qReminders = query(
      collection(db, 'reminders'),
      where('userId', '==', user.uid)
    );

    const unsubscribeReminders = onSnapshot(qReminders, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
      docs.sort((a: any, b: any) => {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        return dateA - dateB;
      });
      setReminders(docs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'reminders');
    });

    // Listen for challenges
    const qChallenges = query(
      collection(db, 'challenges'),
      where('userId', '==', user.uid)
    );

    const unsubscribeChallenges = onSnapshot(qChallenges, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
      docs.sort((a: any, b: any) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
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
      unsubscribeVehicles();
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
    if ((isRecordingVideo || isRecordingAudio) && recordingTimeLeft > 0) {
      timer = setTimeout(() => {
        setRecordingTimeLeft(prev => prev - 1);
      }, 1000);
    } else if ((isRecordingVideo || isRecordingAudio) && recordingTimeLeft === 0) {
      if (isRecordingVideo) {
        stopRecording();
      } else {
        stopAudioRecording();
      }
    }
    return () => clearTimeout(timer);
  }, [isRecordingVideo, isRecordingAudio, recordingTimeLeft]);

  const startCameraPreview = async () => {
    try {
      isCancelledRef.current = false;
      if (Capacitor.isNativePlatform()) {
        const permissions = await CapCamera.checkPermissions();
        if (permissions.camera !== 'granted') {
          const result = await CapCamera.requestPermissions({ permissions: ['camera'] });
          if (result.camera !== 'granted') {
            setNotification({ messyear: 'Camera permission is required to record video.', type: 'error' });
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
      setNotification({ messyear: 'Could not access camera/microphone.', type: 'error' });
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
          setNotification({ messyear: 'Recording failed: No data captured.', type: 'error' });
          setIsRecordingVideo(false);
          return;
        }

        const file = new File([blob], `recording_${Date.now()}.${extension}`, { type: finalMimeType });
        processUploadFile(file);
        
        // Stop tracks after recording is finished and processed
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }

        // Small delay before closing modal for smoother transition
        setTimeout(() => {
          setIsRecordingVideo(false);
          setIsCameraPreview(false);
          setCameraFacingMode('environment'); // Reset to default
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
      setNotification({ messyear: 'Recording failed to start.', type: 'error' });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      setIsStopping(true);
      mediaRecorderRef.current.stop();
    } else {
      // If called during preview, we can stop tracks immediately
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsCameraPreview(false);
      setIsRecordingVideo(false);
      setCameraFacingMode('environment');
    }
  };

  const cancelRecording = () => {
    isCancelledRef.current = true;
    stopRecording();
  };

  const startAudioRecording = async () => {
    try {
      isCancelledRef.current = false;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.onstop = () => {
        setIsStopping(false);
        if (isCancelledRef.current) {
          console.log("[Audio Recording] Cancelled.");
          return;
        }

        const recordedMimeType = mediaRecorder.mimeType;
        const fallbackMimeType = 'audio/mpeg';
        const finalMimeType = recordedMimeType || fallbackMimeType;
        
        const extension = finalMimeType.includes('mp3') ? 'mp3' : (finalMimeType.includes('wav') ? 'wav' : 'm4a');
        const blob = new Blob(chunksRef.current, { type: finalMimeType });

        if (blob.size === 0) {
          setNotification({ message: 'Recording failed: No data captured.', type: 'error' });
          setIsRecordingAudio(false);
          return;
        }

        const file = new File([blob], `audio_recording_${Date.now()}.${extension}`, { type: finalMimeType });
        processUploadFile(file);

        // Stop microphone tracks
        stream.getTracks().forEach(track => track.stop());

        setTimeout(() => {
          setIsRecordingAudio(false);
        }, 800);
      };

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start();
      setIsRecordingAudio(true);
      setRecordingTimeLeft(30);
    } catch (err) {
      console.error("Failed to start audio recording:", err);
      setNotification({ message: 'Microphone access failed or denied.', type: 'error' });
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      setIsStopping(true);
      mediaRecorderRef.current.stop();
    } else {
      setIsRecordingAudio(false);
    }
  };

  const cancelAudioRecording = () => {
    isCancelledRef.current = true;
    stopAudioRecording();
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
      setNotification({ messyear: 'Failed to switch camera.', type: 'error' });
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
        messyear: `You've reached today's free limit of ${freeLimit} analyses. It resets at midnight Eastern Time, or upgrade to Pro for unlimited access!`
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
    setActiveTab('upload'); // Ensure user sees the progress
    setUploadProgress(10);
    setUploadStatus('Preparing media...');

    const selectedVehicle = vehicles.find(p => p.id === selectedVehicleId);
    const vehicleContext = selectedVehicle ? `
      Vehicle Context:
      - Name: ${selectedVehicle.name}
      - Make: ${selectedVehicle.make || selectedVehicle.species || 'Unknown'}
      - Model: ${selectedVehicle.model || selectedVehicle.breed || 'Unknown'}
      - Year: ${selectedVehicle.year || selectedVehicle.age || 'Unknown'}
      - Mileage: ${selectedVehicle.mileage || selectedVehicle.personality || 'Unknown'}
    ` : '';

    const formData = new FormData();
    formData.append('media', file);
    formData.append('userId', user.uid);
    formData.append('vehicleContext', vehicleContext);
    formData.append('locale', locale);
    if (userQuestion.trim()) {
      formData.append('userQuestion', userQuestion.trim());
    }

    console.log("[API] Attempting upload to:", `${API_BASE_URL}/api/process`);
    console.log("[API] File details:", file.name, file.size, file.type);

    try {
      setUploadStatus('Uploading media file...');
      setUploadProgress(20);

      // 1. Upload original file from frontend directly to Firebase Storage first.
      // This ensures we always have a fully working fallback media URL with a secure download token
      // in case the local development server doesn't have Google Application Default Credentials.
      const storagePath = `analyses/${user.uid}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      const frontendMediaUrl = await new Promise<string>((resolve, reject) => {
        uploadTask.on('state_changed', 
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 20 + 20;
            setUploadProgress(progress);
          }, 
          reject, 
          () => getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject)
        );
      });

      console.log("[Frontend Upload] Successfully uploaded original media. URL:", frontendMediaUrl);

      setUploadStatus('AI Mechanic is analyzing...');
      setUploadProgress(50);

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
      // Fallback to our secure, authenticated direct frontend upload URL if the backend's upload failed
      mediaUrl = data.mediaUrl || frontendMediaUrl;
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
        const isPro = userData.subscriptionTier === 'pro';
        const analysisRef = await addDoc(collection(db, 'analyses'), {
          userId: user.uid,
          vehicleId: selectedVehicleId || null,
          petName: selectedVehicle?.name || 'My Vehicle',
          mediaUrl,
          mediaType: file.type.startsWith('video') ? 'video' : 'audio',
          status: 'completed',
          userQuestion: userQuestion || null,
          result,
          isUnlocked: isPro,
          createdAt: Timestamp.now()
        });

        // If a training challenge was generated, save it separately for the Challenges tab
        if (result.maintenancePlan) {
          await addDoc(collection(db, 'challenges'), {
            userId: user.uid,
            vehicleId: selectedVehicleId || null,
            petName: selectedVehicle?.name || 'My Vehicle',
            analysisId: analysisRef.id,
            title: result.maintenancePlan.title,
            description: result.maintenancePlan.description,
            days: result.maintenancePlan.days,
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
        const isPro = userData.subscriptionTier === 'pro';
        if (!isPro) {
          // Send them to dashboard, but immediately prompt the locked analysis
          setActiveTab('dashboard');
          setLockedAnalysisPrompt({
            id: analysisRef.id,
            isUnlocked: false
          });
        } else {
          setActiveTab('dashboard');
        }
      }, 500);
    } catch (error: any) {
      console.error("Upload failed:", error);
      setNotification({ messyear: error.message || "Upload failed. Please try again.", type: 'error' });
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
            messyear: `Free tier users are limited to ${freeLimit} follow-up question(s) per analysis. Upgrade to Pro or watch an ad for +1 chat!`
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

      const vehicleContext = selectedAnalysis.vehicleId ? `Analyzing diagnostic issues for ${selectedAnalysis.petName}.` : '';
      const analysisContext = `Original Analysis Result: ${JSON.stringify(selectedAnalysis.result)}`;

      const chatResponse = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history,
          messageContent,
          vehicleContext,
          analysisContext,
          locale
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
        const { customerInfo } = await Purchases.purchasePackage({ aPackyear: packageToBuy });

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
            messyear: `Welcome to ${entitlementName}! Your account has been upgraded.`,
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
            messyear: "Purchase successful! Your account will be updated shortly.",
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
          messyear: error.message || 'Failed to initiate purchase. Please try again.',
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

        setNotification({ messyear: `Purchases restored! You are now ${entitlementName}.`, type: 'success' });

        // Optimistic update to clear paywall immediately
        if (userData) {
          setUserData({ ...userData, subscriptionTier: 'pro', is_subscriber: true });
        }

        setShowLimitModal(null);
      } else {
        setNotification({ messyear: 'No active subscription found to restore.', type: 'error' });
      }
    } catch (error: any) {
      console.error("[RevenueCat] Restore error:", error);
      setNotification({ messyear: 'Failed to restore purchases.', type: 'error' });
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
        setNotification({ messyear: 'Daily limit for free analysis ads reached (3/3). Reset at midnight.', type: 'error' });
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
                setNotification({ messyear: `Reward earned! +1 Analysis granted (${currentDailyCount + 1}/3 today).`, type: 'success' });
              } else if (type === 'chat') {
                await updateDoc(userRef, {
                  bonusChats: (userData.bonusChats || 0) + 1
                });
                setNotification({ messyear: 'Reward earned! +1 Chat granted.', type: 'success' });
              }
              setIsWatchingAd(false);
              setShowLimitModal(null);
            } catch (error) {
              console.error("Failed to grant reward:", error);
              setNotification({ messyear: 'Failed to grant reward. Please try again.', type: 'error' });
            }
          },
          onAdClosed: () => {
            setIsWatchingAd(false);
          },
          onAdFailedToLoad: (err) => {
            setIsWatchingAd(false);
            setNotification({ messyear: 'Failed to load ad. Please try again later.', type: 'error' });
          }
        });
      },
      onAdFailedToLoad: (err) => {
        setIsWatchingAd(false);
        setNotification({ messyear: 'Ad failed to load. Please try again.', type: 'error' });
      },
      onUserEarnedReward: () => { } // Handled in showAd
    });
  };

  const handleWatchAdToUnlock = () => {
    if (!user || !lockedAnalysisPrompt) return;

    setIsWatchingAd(true);
    rewardedAdService.loadAd('ca-app-pub-3940256099942544/5224354917', {
      onAdLoaded: () => {
        rewardedAdService.showAd({
          onUserEarnedReward: async (reward) => {
            console.log("[Reward] User earned reward, unlocking analysis:", reward);
            try {
              const analysisRef = doc(db, 'analyses', lockedAnalysisPrompt.id);
              await updateDoc(analysisRef, {
                isUnlocked: true
              });
              setNotification({ messyear: 'Analysis unlocked!', type: 'success' });
              
              // Open the analysis
              setSelectedAnalysis({ ...lockedAnalysisPrompt, isUnlocked: true });
              setLockedAnalysisPrompt(null);
            } catch (error) {
              console.error("Failed to unlock analysis:", error);
              setNotification({ messyear: 'Failed to unlock analysis. Please try again.', type: 'error' });
            }
          },
          onAdClosed: () => {
            setIsWatchingAd(false);
          },
          onAdFailedToLoad: (err) => {
            console.error("Ad failed to show:", err);
            setIsWatchingAd(false);
            setNotification({ messyear: 'Failed to load ad. Please try again.', type: 'error' });
          }
        });
      },
      onAdFailedToLoad: (err) => {
        console.error("Ad failed to load:", err);
        setIsWatchingAd(false);
        setNotification({ messyear: 'No ads available right now. Please try again later.', type: 'error' });
      }
    });
  };

  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicle.name || !user) return;

    try {
      let photoUrl = newVehicle.photoUrl;
      if (vehicleImageFile) {
        setIsUploadingPetImage(true);
        const fileName = `vehicles/${user.uid}/${Date.now()}_${vehicleImageFile.name}`;
        const storageRef = ref(storage, fileName);
        const uploadTask = await uploadBytesResumable(storageRef, vehicleImageFile);
        photoUrl = await getDownloadURL(uploadTask.ref);
      }

      if (editingVehicleId) {
        await updateDoc(doc(db, 'vehicles', editingVehicleId), {
          ...newVehicle,
          photoUrl,
          updatedAt: Timestamp.now()
        });
        setNotification({ messyear: 'Vehicle profile updated successfully!', type: 'success' });
      } else {
        await addDoc(collection(db, 'vehicles'), {
          userId: user.uid,
          ...newVehicle,
          photoUrl,
          createdAt: Timestamp.now()
        });
        setNotification({ messyear: 'Vehicle profile added successfully!', type: 'success' });
      }

      setIsAddingPet(false);
      setEditingPetId(null);
      setVehicleImageFile(null);
      setNewPet({
        name: '',
        make: 'toyota',
        model: '',
        year: '',
        mileage: '',
        photoUrl: '',
        engine: '',
        transmission: ''
      });
    } catch (error) {
      console.error("Failed to save vehicle:", error);
      setNotification({ messyear: `Failed to ${editingVehicleId ? 'update' : 'add'} vehicle profile`, type: 'error' });
    } finally {
      setIsUploadingPetImage(false);
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    console.log(`[Firestore] Attempting to delete vehicle: ${vehicleId}`);
    try {
      await deleteDoc(doc(db, 'vehicles', vehicleId));
      console.log(`[Firestore] Vehicle deleted successfully: ${vehicleId}`);
      setNotification({ messyear: 'Vehicle profile deleted successfully', type: 'success' });
    } catch (error) {
      console.error("Failed to delete vehicle:", error);
      setNotification({ messyear: 'Failed to delete vehicle profile. Please check your permissions.', type: 'error' });
      handleFirestoreError(error, OperationType.DELETE, `vehicles/${vehicleId}`);
    } finally {
      setDeleteConfirmation(null);
    }
  };

  const handleDeleteAnalysis = async (analysisId: string) => {
    console.log(`[Firestore] Attempting to delete analysis: ${analysisId}`);
    try {
      await deleteDoc(doc(db, 'analyses', analysisId));
      console.log(`[Firestore] Analysis deleted successfully: ${analysisId}`);
      setNotification({ messyear: 'Analysis deleted successfully', type: 'success' });
      if (selectedAnalysis?.id === analysisId) {
        setSelectedAnalysis(null);
      }
    } catch (error) {
      console.error("Failed to delete analysis:", error);
      setNotification({ messyear: 'Failed to delete analysis. Please check your permissions.', type: 'error' });
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
      setNotification({ messyear: 'Reminder deleted successfully', type: 'success' });
    } catch (error) {
      console.error("Failed to delete reminder:", error);
      setNotification({ messyear: 'Failed to delete reminder. Please check your permissions.', type: 'error' });
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
      setNotification({ messyear: 'Maintenance plan deleted successfully', type: 'success' });
      if (selectedChallenge?.id === challengeId) {
        setSelectedChallenge(null);
      }
    } catch (error) {
      console.error("Failed to delete challenge:", error);
      setNotification({ messyear: 'Failed to delete challenge. Please check your permissions.', type: 'error' });
      handleFirestoreError(error, OperationType.DELETE, `challenges/${challengeId}`);
    } finally {
      setDeleteConfirmation(null);
    }
  };

  const handleDeleteAccount = async () => {
    if (!auth.currentUser || !user) return;
    setIsDeletingAccount(true);
    try {
      const vehiclesSnapshot = await getDocs(query(collection(db, 'vehicles'), where('userId', '==', user.uid)));
      await Promise.all(vehiclesSnapshot.docs.map(d => deleteDoc(doc(db, 'vehicles', d.id))));
      
      const analysesSnapshot = await getDocs(query(collection(db, 'analyses'), where('userId', '==', user.uid)));
      await Promise.all(analysesSnapshot.docs.map(async d => {
        const messagesSnapshot = await getDocs(collection(db, 'analyses', d.id, 'messages'));
        await Promise.all(messagesSnapshot.docs.map(m => deleteDoc(doc(db, 'analyses', d.id, 'messages', m.id))));
        await deleteDoc(doc(db, 'analyses', d.id));
      }));
      
      const remindersSnapshot = await getDocs(query(collection(db, 'reminders'), where('userId', '==', user.uid)));
      await Promise.all(remindersSnapshot.docs.map(d => deleteDoc(doc(db, 'reminders', d.id))));
      
      const challengesSnapshot = await getDocs(query(collection(db, 'challenges'), where('userId', '==', user.uid)));
      await Promise.all(challengesSnapshot.docs.map(d => deleteDoc(doc(db, 'challenges', d.id))));
      
      await deleteDoc(doc(db, 'user_stats', user.uid));
      await deleteDoc(doc(db, 'users', user.uid));

      await deleteUser(auth.currentUser);
      logout();
    } catch (error: any) {
      console.error("Failed to delete account:", error);
      if (error.code === 'auth/requires-recent-login') {
        alert("For security reasons, you must log out and log back in to verify your identity before deleting your account.");
      } else {
        alert("Failed to delete account. Please try again later.");
      }
    } finally {
      setIsDeletingAccount(false);
      setShowDeleteAccountConfirm(false);
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
        setNotification({ messyear: 'Success! Please check your inbox (and spam folder) for the reset link.', type: 'success' });
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
      setNotification({ messyear: 'Profile updated successfully!', type: 'success' });
    } catch (error: any) {
      setNotification({ messyear: error.message || 'Failed to update profile', type: 'error' });
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
          setNotification({ messyear: 'Failed to upload image', type: 'error' });
          setIsUploadingProfilePic(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateProfile(user, { photoURL: downloadURL });

          // Force a re-render by updating the user object reference slightly or just relying on auth state change
          // In many cases, Firebase Auth doesn't trigger a re-render for profile updates alone,
          // so we might need to manually trigger it if we had a local user state, but we use useAuth.
          // We'll just show a success message.
          setNotification({ messyear: 'Profile picture updated!', type: 'success' });
          setIsUploadingProfilePic(false);
        }
      );
    } catch (error) {
      console.error("Error initiating upload:", error);
      setNotification({ messyear: 'Failed to start upload', type: 'error' });
      setIsUploadingProfilePic(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setIsSendingReset(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      setNotification({ messyear: 'Password reset email sent!', type: 'success' });
    } catch (error: any) {
      setNotification({ messyear: error.message || 'Failed to send reset email', type: 'error' });
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleSaveReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newReminder.vehicleId || !newReminder.title || !newReminder.dueDate) return;

    const selectedVehicle = vehicles.find(p => p.id === newReminder.vehicleId);

    try {
      if (editingReminderId) {
        await updateDoc(doc(db, 'reminders', editingReminderId), {
          petName: selectedVehicle?.name || 'Vehicle',
          ...newReminder,
          updatedAt: Timestamp.now()
        });
        setNotification({ messyear: 'Reminder updated successfully!', type: 'success' });
      } else {
        await addDoc(collection(db, 'reminders'), {
          userId: user.uid,
          petName: selectedVehicle?.name || 'Vehicle',
          ...newReminder,
          createdAt: Timestamp.now()
        });
        setNotification({ messyear: 'Reminder added successfully!', type: 'success' });
      }

      setIsAddingReminder(false);
      setEditingReminderId(null);
      setNewReminder({
        vehicleId: '',
        title: '',
        type: 'vaccination',
        dueDate: '',
        completed: false
      });
    } catch (error) {
      console.error("Failed to save reminder:", error);
      setNotification({ messyear: `Failed to ${editingReminderId ? 'update' : 'add'} reminder`, type: 'error' });
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
      setNotification({ messyear: "You have already used a referral code.", type: 'error' });
      return;
    }

    setIsSubmittingReferral(true);
    try {
      // 1. Find the referrer
      const q = query(collection(db, 'users'), where('referralCode', '==', referralInput.trim().toUpperCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setNotification({ messyear: "Invalid referral code.", type: 'error' });
        setIsSubmittingReferral(false);
        return;
      }

      const referrerDoc = querySnapshot.docs[0];
      const referrerId = referrerDoc.id;

      if (referrerId === user.uid) {
        setNotification({ messyear: "You cannot refer yourself!", type: 'error' });
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

      setNotification({ messyear: "Referral code applied! You received +2 bonus analyses.", type: 'success' });
      setReferralInput('');
    } catch (error) {
      console.error("Referral error:", error);
      setNotification({ messyear: "Failed to apply referral code.", type: 'error' });
    } finally {
      setIsSubmittingReferral(false);
    }
  };

  const handleShareAnalysis = async (analysis: any) => {
    if (!analysis) return;

    const shareData = {
      title: `AutoDiagnostic Analysis: ${analysis.petName || 'My Vehicle'}`,
      text: `Check out this diagnostic analysis for ${analysis.petName || 'my vehicle'}! Overall Condition: ${analysis.result?.overallCondition || 'Unknown'}.`,
      url: window.location.href,
    };

    try {
      if (Capacitor.isNativePlatform()) {
        await Share.share({
          title: shareData.title,
          text: shareData.text,
          url: shareData.url,
          dialogTitle: 'Share Diagnostic Analysis',
        });
      } else if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        setNotification({ messyear: "Analysis summary copied to clipboard!", type: 'success' });
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
      title: `AutoDiagnostic Maintenance: ${challenge.petName || 'My Vehicle'}`,
      text: `My vehicle ${challenge.petName || 'my vehicle'} has ${statusText} Check out AutoDiagnostic for custom vehicle maintenance plans!`,
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
        setNotification({ messyear: "Challenge progress copied to clipboard!", type: 'success' });
      }
    } catch (error) {
      console.error("Error sharing challenge:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center gap-6 relative z-10"
        >
          <div className="w-24 h-24 bg-orange-500 rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(212,175,55,0.15)] border border-orange-400/20">
            <Car className="w-12 h-12 text-white" />
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-black font-serif tracking-[0.2em] text-orange-400 uppercase">AutoDiagnostic</h1>
            <p className="text-[10px] tracking-[0.5em] uppercase text-orange-600/70 mt-3 font-bold">Vehicle Analysis</p>
          </div>

          <div className="mt-12 flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" />
          </div>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-orange-500 rounded-3xl flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.6)] shadow-indigo-200">
              <Car className="w-12 h-12 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-black font-serif tracking-tight text-orange-400">AutoDiagnostic</h1>
            <p className="text-[10px] tracking-[0.3em] uppercase text-orange-600 mt-2 font-bold">Vehicle Analysis</p>
            <p className="text-slate-400 text-lg">Professional AI diagnostic analysis for your vehicles.</p>
          </div>

          {authMode === 'google' ? (
            <div className="space-y-4">
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoggingIn}
                className={`w-full flex items-center justify-center gap-3 bg-slate-900 border border-slate-800 text-slate-300 px-6 py-4 rounded-2xl font-medium transition-all shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] active:scale-[0.98] ${isLoggingIn ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-950'}`}
              >
                {isLoggingIn ? (
                  <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/layout/google.svg" className="w-5 h-5" alt="Google" />
                )}
                {isLoggingIn ? 'Signing in...' : 'Sign in with Google'}
              </button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-800"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-900 px-2 text-slate-500">Or continue with</span>
                </div>
              </div>
              <button
                onClick={() => setAuthMode('login')}
                className="w-full flex items-center justify-center gap-3 bg-slate-800 border border-slate-700 text-slate-100 px-6 py-4 rounded-2xl font-medium hover:bg-slate-700 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.4)] active:scale-[0.98]"
              >
                Sign in with Email
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('forgot')}
                className="text-xs font-bold text-orange-500 hover:text-orange-400 uppercase tracking-widest pt-2"
              >
                Forgot Password?
              </button>
            </div>
          ) : (
            <form onSubmit={handleEmailAuth} className="space-y-4 text-left">
              {authMode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                  <input
                    required
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-600 focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="John Doe"
                  />
                </div>
              )}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-600 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="name@example.com"
                />
              </div>
              {authMode !== 'forgot' && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
                    {authMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setAuthMode('forgot')}
                        className="text-sm font-black text-orange-400 hover:text-orange-300 transition-colors uppercase tracking-widest underline decoration-2 underline-offset-4"
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-600 focus:ring-2 focus:ring-orange-500 outline-none"
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
                className="w-full bg-orange-500 text-white px-6 py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98]"
              >
                {authMode === 'login' ? 'Sign In' : authMode === 'signup' ? 'Create Account' : 'Send Reset Link'}
              </button>

              <div className="text-center space-y-4">
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
                  className="text-orange-400 text-sm font-medium hover:underline"
                >
                  {authMode === 'signup' ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                </button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-800"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-slate-900 px-2 text-slate-500">Or</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAuthMode('google')}
                  className="text-slate-400 text-sm font-medium hover:underline"
                >
                  Back to Google Sign In
                </button>
              </div>
            </form>
          )}

          <p className="text-xs text-slate-500">
            By signing in, you agree to our <button type="button" onClick={() => setShowTermsModal(true)} className="hover:text-orange-400 underline">Terms of Service</button> and <button type="button" onClick={() => setShowPrivacyModal(true)} className="hover:text-orange-400 underline">Privacy Policy</button>.
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
                className="bg-slate-900 rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-slate-800 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black font-serif text-orange-400">Terms of Use (EULA)</h2>
                  <button onClick={() => setShowTermsModal(false)} className="p-2 text-slate-500 hover:bg-slate-800 rounded-full transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6 text-slate-400 text-sm leading-relaxed">
                  <p className="italic">Last Updated: April 2026</p>

                  <div>
                    <h4 className="font-black font-serif text-orange-400 mb-1">1. Acceptance of Terms</h4>
                    <p>By accessing and using AutoDiagnostic, you agree to be bound by these Terms of Use. If you do not agree, please do not use the application.</p>
                  </div>

                  <div>
                    <h4 className="font-black font-serif text-orange-400 mb-1">2. Mechanical Disclaimer</h4>
                    <p>AutoDiagnostic provides AI-driven vehicle diagnostics for educational and informational purposes only. It is NOT a substitute for professional ASE-certified mechanic's advice, diagnosis, or repair. Always consult a qualified mechanic or automotive repair shop for safety and mechanical concerns.</p>
                  </div>

                  <div>
                    <h4 className="font-black font-serif text-orange-400 mb-1">3. User Content</h4>
                    <p>You retain ownership of the videos and audio you upload. By uploading, you grant AutoDiagnostic a license to process this media solely for the purpose of providing the analysis service.</p>
                  </div>

                  <div>
                    <h4 className="font-black font-serif text-orange-400 mb-1">4. Subscriptions and Billing</h4>
                    <p>Premium features require a subscription. Payments are processed securely through your device's app store (Apple App Store or Google Play). Subscriptions automatically renew unless canceled at least 24 hours before the end of the current period.</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowTermsModal(false)}
                  className="w-full mt-8 py-4 bg-slate-800 text-slate-100 font-bold rounded-2xl hover:bg-slate-700 transition-all"
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
                className="bg-slate-900 rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-slate-800 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black font-serif text-orange-400">Privacy Policy</h2>
                  <button onClick={() => setShowPrivacyModal(false)} className="p-2 text-slate-500 hover:bg-slate-800 rounded-full transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6 text-slate-400 text-sm leading-relaxed">
                  <p className="italic">Last Updated: April 2026</p>

                  <div>
                    <h4 className="font-black font-serif text-orange-400 mb-1">1. Information We Collect</h4>
                    <p>We collect information you provide directly to us, including your email address, vehicle profiles (name, make, model, year), and the media (video/audio) you upload for analysis.</p>
                  </div>

                  <div>
                    <h4 className="font-black font-serif text-orange-400 mb-1">2. How We Use Your Information</h4>
                    <p>Your media is processed using advanced AI models to provide vehicle diagnostic insights. We do not use your personal videos to train public AI models. Your data is used strictly to deliver and improve your personal experience within the app.</p>
                  </div>

                  <div>
                    <h4 className="font-black font-serif text-orange-400 mb-1">3. Data Storage and Security</h4>
                    <p>Your data is securely stored using industry-standard cloud infrastructure. We implement robust security measures to protect your personal information from unauthorized access.</p>
                  </div>

                  <div>
                    <h4 className="font-black font-serif text-orange-400 mb-1">4. Data Deletion</h4>
                    <p>You can delete your vehicle profiles, analyses, or your entire account at any time from within the app. Deleting an item permanently removes it from our active servers.</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="w-full mt-8 py-4 bg-slate-800 text-slate-100 font-bold rounded-2xl hover:bg-slate-700 transition-all"
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
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <header className="lg:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Car className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black font-serif text-xl text-orange-400 leading-none">AutoDiagnostic</span>
            <span className="text-[8px] tracking-[0.2em] uppercase text-orange-600 font-bold">Vehicle Analysis</span>
          </div>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-slate-400 hover:bg-slate-950 rounded-lg"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed inset-0 z-40 lg:relative lg:z-0
        w-full lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 hidden lg:flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
            <Car className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black font-serif text-2xl text-orange-400 leading-none">AutoDiagnostic</span>
            <span className="text-[9px] tracking-[0.2em] uppercase text-orange-600 font-bold mt-1">Vehicle Analysis</span>
          </div>
        </div>

        <nav className="flex-1 px-4 pt-20 pb-6 lg:py-0 space-y-2 overflow-y-auto">
          <NavItem
            active={activeTab === 'dashboard'}
            onClick={() => { setActiveTab('dashboard'); setSelectedAnalysis(null); setIsSidebarOpen(false); }}
            icon={<Activity className="w-5 h-5" />}
            label={t('dashboard')}
          />
          <NavItem
            active={activeTab === 'upload'}
            onClick={() => { setActiveTab('upload'); setSelectedAnalysis(null); setIsSidebarOpen(false); }}
            icon={<Upload className="w-5 h-5" />}
            label={t('new_analysis')}
          />
          <NavItem
            active={activeTab === 'history'}
            onClick={() => { setActiveTab('history'); setSelectedAnalysis(null); setIsSidebarOpen(false); }}
            icon={<History className="w-5 h-5" />}
            label={t('history')}
          />
          <NavItem
            active={activeTab === 'vehicles'}
            onClick={() => { setActiveTab('vehicles'); setSelectedAnalysis(null); setIsSidebarOpen(false); }}
            icon={<Car className="w-5 h-5" />}
            label={t('my_vehicles')}
          />
          <NavItem
            active={activeTab === 'reminders'}
            onClick={() => { setActiveTab('reminders'); setSelectedAnalysis(null); setIsSidebarOpen(false); }}
            icon={<Bell className="w-5 h-5" />}
            label={t('reminders')}
          />
          <NavItem
            active={activeTab === 'challenges'}
            onClick={() => { setActiveTab('challenges'); setSelectedAnalysis(null); setIsSidebarOpen(false); }}
            icon={<Flame className="w-5 h-5" />}
            label={t('maintenance_plans')}
          />
          <NavItem
            active={activeTab === 'settings'}
            onClick={() => { setActiveTab('settings'); setSelectedAnalysis(null); setIsSidebarOpen(false); }}
            icon={<Settings className="w-5 h-5" />}
            label={t('settings')}
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 mb-4">
            {user.photoURL ? (
              <img src={user.photoURL} className="w-10 h-10 rounded-full border-2 border-white shadow-[0_4px_20px_rgba(0,0,0,0.4)]" alt="" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center border-2 border-white shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                <UserIcon className="w-5 h-5 text-orange-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-100 truncate">{user.displayName || 'User'}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            {t('sign_out')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-black font-serif text-orange-400">
              {selectedAnalysis ? t('report_for', { name: selectedAnalysis.petName || 'My Vehicle' }) :
                activeTab === 'dashboard' ? t('dashboard') :
                  activeTab === 'upload' ? t('new_analysis') :
                    activeTab === 'settings' ? t('settings') :
                      activeTab === 'reminders' ? t('reminders') :
                        activeTab === 'challenges' ? t('maintenance_plans') :
                          t('active_analyses_history')}
            </h2>
            <p className="text-slate-400 mt-1 text-sm lg:text-base">
              {selectedAnalysis ? t('custom_checklist', { name: selectedAnalysis.petName || 'My Vehicle' }) : t('welcome_back', { name: (user.displayName || 'User').split(' ')[0] })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {activeTab === 'dashboard' && !selectedAnalysis && (
              <button
                onClick={() => setActiveTab('upload')}
                className="w-full sm:w-auto bg-orange-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                New Analysis
              </button>
            )}
            {selectedAnalysis && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleShareAnalysis(selectedAnalysis)}
                  className="flex-1 sm:flex-none bg-slate-900 text-slate-400 border border-slate-800 px-4 py-2.5 rounded-xl font-medium hover:bg-slate-950 transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button
                  onClick={() => setSelectedAnalysis(null)}
                  className="flex-1 sm:flex-none text-slate-400 hover:text-slate-100 font-medium flex items-center justify-center gap-2 px-4 py-2.5"
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
                  {/* Non-Vehicle Warning */}
                  {selectedAnalysis.result?.isVehicleOrPart === false && (
                    <div className="bg-red-500/10 border border-red-500/50 p-8 rounded-3xl text-center space-y-4">
                      <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                      </div>
                      <h3 className="text-xl font-black font-serif text-red-500">Analysis Limited</h3>
                      <p className="text-slate-400 leading-relaxed">
                        {selectedAnalysis.result?.userQuestionAnswer || "Our AI Mechanic only specializes in automotive vehicle diagnostics. This media does not appear to contain a vehicle or car part."}
                      </p>
                      <button 
                        onClick={() => setSelectedAnalysis(null)}
                        className="bg-slate-800 text-slate-100 px-6 py-2 rounded-xl font-bold hover:bg-slate-700 transition-all"
                      >
                        {t('try_another_video')}
                      </button>
                    </div>
                  )}

                  {/* Media Player */}
                  {selectedAnalysis.mediaUrl && (
                    <div className="bg-black rounded-3xl overflow-hidden shadow-2xl aspect-video relative group">
                      {selectedAnalysis.mediaType === 'video' ? (
                        <video
                          controls
                          playsInline
                          webkit-playsinline="true"
                          preload="metadata"
                          className="w-full h-full object-contain"
                        >
                          <source src={resolveMediaUrl(selectedAnalysis.mediaUrl)} type={selectedAnalysis.mediaType === 'video' ? 'video/mp4' : 'audio/mpeg'} />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900">
                          <Activity className="w-16 h-16 text-indigo-500 animate-pulse mb-4" />
                          <audio src={resolveMediaUrl(selectedAnalysis.mediaUrl)} controls className="w-2/3" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* User Question & Answer */}
                  {selectedAnalysis.result?.isVehicleOrPart !== false && selectedAnalysis.userQuestion && (
                    <div className="bg-orange-500 p-8 rounded-3xl text-white shadow-[0_10px_40px_rgba(0,0,0,0.6)] shadow-orange-500/20 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <MessageSquare className="w-24 h-24" />
                      </div>
                      <h3 className="text-sm font-bold uppercase tracking-wider opacity-80 mb-2">{t('your_initial_question')}</h3>
                      <p className="text-2xl font-medium mb-8 leading-tight">"{selectedAnalysis.userQuestion}"</p>
                      <div className="bg-slate-900/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                        <h4 className="text-xs font-bold uppercase tracking-wider opacity-80 mb-3">{t('ai_mechanic_answer')}</h4>
                        <p className="text-white/90 leading-relaxed text-lg">
                          {selectedAnalysis.result?.userQuestionAnswer || t('no_answer_provided')}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Observations */}
                  {selectedAnalysis.result?.isVehicleOrPart !== false && (
                    <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                      <h3 className="text-xl font-black font-serif text-orange-400 mb-6 flex items-center gap-3">
                        <Activity className="w-6 h-6 text-orange-400" />
                        {t('detailed_observations')}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedAnalysis.result?.observations && selectedAnalysis.result.observations.length > 0 ? (
                          selectedAnalysis.result.observations.map((obs: any, i: number) => (
                            <div key={i} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 hover:border-indigo-200 transition-colors">
                              <p className="font-bold text-orange-400 text-xs uppercase tracking-widest mb-2">{obs.event}</p>
                              <p className="text-slate-300 leading-relaxed">{obs.meaning}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-400 italic col-span-full">{t('no_observations_recorded')}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Steps */}
                  {selectedAnalysis.result?.isVehicleOrPart !== false && (
                    <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                      <h3 className="text-xl font-black font-serif text-orange-400 mb-6 flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                        {t('recommended_action_steps')}
                      </h3>
                      <div className="space-y-4">
                        {selectedAnalysis.result?.actionSteps && selectedAnalysis.result.actionSteps.length > 0 ? (
                          selectedAnalysis.result.actionSteps.map((step: string, i: number) => (
                            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-950 transition-colors">
                              <div className="w-8 h-8 bg-emerald-500/20 text-emerald-700 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm">
                                {i + 1}
                              </div>
                              <span className="text-slate-300 text-lg leading-relaxed">{step}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-400 italic">{t('no_action_steps_required')}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Maintenance Plan */}
                  {selectedAnalysis.result?.isVehicleOrPart !== false && selectedAnalysis.result?.maintenancePlan && (
                    <MaintenancePlanCard challenge={selectedAnalysis.result.maintenancePlan} />
                  )}
                </div>

                <div className="space-y-8">
                  {/* Overall Condition Card */}
                  {selectedAnalysis.result?.isVehicleOrPart !== false && (
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl text-white shadow-[0_10px_40px_rgba(0,0,0,0.6)] shadow-orange-500/20">
                      <h3 className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">{t('overall_vehicle_condition')}</h3>
                      <p className="text-4xl font-black font-serif tracking-tight">
                        {selectedAnalysis.result?.overallCondition || selectedAnalysis.result?.emotionalState || 'Unknown'}
                      </p>
                    </div>
                  )}

                  {/* Follow-up Chat */}
                  <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex flex-col h-[500px] lg:h-[600px] overflow-hidden">
                    <div className="p-4 lg:p-6 border-b border-slate-800 bg-slate-950/50 flex items-center gap-3">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-black font-serif text-orange-400 text-sm lg:text-base">{t('follow_up_chat')}</h3>
                        <p className="text-[10px] lg:text-xs text-slate-400">{t('ask_more_diagnosis')}</p>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 bg-slate-950/30">
                      <div className="bg-orange-500/10 p-3 lg:p-4 rounded-2xl rounded-tl-none text-xs lg:text-sm text-slate-100 border border-orange-500/20">
                        {t('ai_mechanic_welcome')}
                      </div>
                      {chatMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[85%] p-3 lg:p-4 rounded-2xl text-xs lg:text-sm ${msg.role === 'user'
                              ? 'bg-orange-500 text-white rounded-tr-none'
                              : 'bg-slate-900 text-slate-300 border border-slate-800 rounded-tl-none shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
                            }`}>
                            {msg.content}
                          </div>
                        </div>
                      ))}
                      {isSendingMessage && (
                        <div className="flex justify-start">
                          <div className="bg-slate-900 p-3 lg:p-4 rounded-2xl rounded-tl-none border border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                            <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
                          </div>
                        </div>
                      )}
                    </div>

                    <form onSubmit={handleSendMessage} className="p-3 lg:p-4 bg-slate-900 border-t border-slate-800 flex gap-2">
                      <input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={t('type_question_placeholder')}
                        className="flex-1 px-3 lg:px-4 py-2 rounded-xl border border-slate-800 focus:ring-2 focus:ring-orange-500 outline-none text-xs lg:text-sm"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || isSendingMessage}
                        className="p-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all disabled:opacity-50"
                      >
                        <Send className="w-4 h-4 lg:w-5 lg:h-5" />
                      </button>
                    </form>
                  </div>

                  {/* Metadata */}
                  <div className="bg-slate-900 p-6 lg:p-8 rounded-3xl text-white space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-slate-900/10 rounded-2xl flex items-center justify-center">
                        <FileText className="w-5 h-5 lg:w-6 lg:h-6 text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest">{t('report_id')}</h4>
                        <p className="text-slate-200 font-mono text-[10px] lg:text-xs">{selectedAnalysis.id}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 lg:gap-6">
                      <div>
                        <h4 className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{t('date')}</h4>
                        <p className="text-slate-200 font-medium text-sm lg:text-base">
                          {new Date(selectedAnalysis.createdAt?.seconds * 1000).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{t('media')}</h4>
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
                      className="flex items-center gap-2 text-slate-400 hover:text-slate-100 font-medium"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Challenges
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleShareChallenge(selectedChallenge)}
                        className="flex items-center gap-2 text-orange-400 hover:text-orange-300 font-medium px-4 py-2 rounded-xl hover:bg-orange-500/10 transition-all"
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
                      <MaintenancePlanCard
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
                              setNotification({ messyear: `Challenge Completed! Amazing work!`, type: 'success' });
                            } else {
                              confetti({
                                particleCount: 50,
                                spread: 60,
                                origin: { y: 0.7 },
                                colors: ['#10b981', '#f59e0b']
                              });
                              setNotification({ messyear: `Day ${day} completed! Keep it up!`, type: 'success' });
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
                      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                        <h4 className="font-black font-serif text-orange-400 mb-4 flex items-center gap-2">
                          <Upload className="w-4 h-4 text-orange-400" />
                          Focused Progress Upload
                        </h4>
                        <p className="text-sm text-slate-400 mb-6">
                          Upload a video of your vehicle performing today's exercise for a targeted analysis of their progress.
                        </p>
                        <button
                          onClick={() => {
                            setUserQuestion(`I am working on Day ${selectedChallenge.completedDays.length + 1} of the "${selectedChallenge.title}" challenge. How is my vehicle doing with this specific exercise?`);
                            setSelectedPetId(selectedChallenge.vehicleId);
                            setActiveTab('upload');
                          }}
                          className="w-full py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                        >
                          <Play className="w-4 h-4" />
                          Upload Progress Video
                        </button>
                      </div>

                      <div className="bg-slate-900 p-6 rounded-3xl text-white">
                        <h4 className="font-bold mb-2">Why this maintenance plan?</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">
                          This checklist was custom-generated by our AI Mechanic based on your analysis of {selectedChallenge.petName || 'your vehicle'}.
                          Consistent follow-up is key to maintaining your vehicle's health and safety.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="bg-orange-500 p-6 lg:p-8 rounded-[32px] text-white relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.6)] shadow-orange-500/20">
                    <div className="relative z-10">
                      <h3 className="text-2xl lg:text-3xl font-black font-serif mb-2">{t('maintenance_plans')}</h3>
                      <p className="text-indigo-100 max-w-md text-sm lg:text-base">
                        {t('plans_subtitle')}
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
                          className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:border-indigo-300 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${challenge.status === 'completed' ? 'bg-slate-800 text-emerald-600' : 'bg-slate-800 text-orange-400'}`}>
                              {challenge.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Flame className="w-5 h-5" />}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${challenge.status === 'completed' ? 'bg-emerald-500/20 text-emerald-700' : 'bg-orange-500/20 text-amber-700'
                                }`}>
                                {challenge.status}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShareChallenge(challenge);
                                }}
                                className="p-2 text-slate-300 hover:text-orange-400 hover:bg-orange-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
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
                          <h4 className="font-black font-serif text-orange-400 mb-1 group-hover:text-orange-400 transition-colors">{challenge.title}</h4>
                          <p className="text-xs text-slate-400 mb-4">{challenge.petName}</p>

                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-4">
                            <div
                              className={`h-full transition-all duration-500 ${challenge.status === 'completed' ? 'bg-slate-8000' : 'bg-slate-8000'}`}
                              style={{ width: `${(challenge.completedDays?.length || 0) / 7 * 100}%` }}
                            ></div>
                          </div>

                          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                            <span>{challenge.completedDays?.length || 0}/7 Days</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-20 text-center bg-slate-900 rounded-3xl border border-dashed border-slate-800">
                        <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Flame className="w-8 h-8 text-slate-300" />
                        </div>
                        <h4 className="text-lg font-black font-serif text-orange-400 mb-1">{t('no_plans_yet')}</h4>
                        <p className="text-slate-400 text-sm max-w-xs mx-auto">
                          {t('no_plans_desc')}
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
                <StreakHeader streak={userStats.current_streak || 0} activityLog={userStats.activity_log || []} t={t} />
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label={t('total_analyses')} value={analyses.length} icon={<Activity className="text-orange-400" />} />
                <StatCard label={t('current_streak')} value={userStats?.current_streak || 0} icon={<Flame className="text-orange-400" />} />
                <StatCard label={t('total_sessions')} value={userStats?.total_sessions || 0} icon={<CheckCircle2 className="text-emerald-600" />} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h3 className="text-xl font-black font-serif text-orange-400">{t('maintenance_consistency')}</h3>
                        <p className="text-sm text-slate-400">{t('cumulative_sessions')}</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                        <div className="w-3 h-3 rounded-full bg-slate-8000"></div>
                        {t('sessions_value')}
                      </div>
                    </div>
                    <ConsistencyChart activityLog={userStats?.activity_log || []} />
                  </div>

                  <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                      <h3 className="font-black font-serif text-orange-400">{t('active_analyses_history')}</h3>
                      <button onClick={() => setActiveTab('history')} className="text-orange-400 text-sm font-medium hover:underline">{t('view_all')}</button>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {analyses.slice(0, 5).map((analysis, idx) => (
                        <motion.div
                          key={analysis.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => {
                      if (analysis.isUnlocked === false) {
                        setLockedAnalysisPrompt(analysis);
                      } else {
                        setSelectedAnalysis(analysis);
                      }
                    }}
                          className="p-4 hover:bg-slate-950 transition-colors flex items-center justify-between cursor-pointer group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-orange-500/10 transition-colors">
                              {analysis.mediaType === 'video' ? <Play className="w-6 h-6 text-slate-500 group-hover:text-orange-400" /> : <Activity className="w-6 h-6 text-slate-500 group-hover:text-orange-400" />}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-100 truncate max-w-[200px] group-hover:text-orange-400 transition-colors">
                                {analysis.result?.emotionalState ?
                                  (analysis.result.emotionalState.length > 40 ?
                                    analysis.result.emotionalState.substring(0, 40) + '...' :
                                    analysis.result.emotionalState) :
                                  'New Analysis'}
                              </p>
                              <p className="text-xs text-slate-400">
                                {analysis.petName || 'My Vehicle'} • {analysis.createdAt?.seconds ? new Date(analysis.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${analysis.status === 'completed' ? 'bg-slate-800 text-emerald-700' : 'bg-slate-800 text-amber-700'
                              }`}>
                              {analysis.status}
                            </span>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
                          </div>
                        </motion.div>
                      ))}
                      {analyses.length === 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="p-12 text-center"
                        >
                          <div className="w-16 h-16 bg-slate-950 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-slate-300" />
                          </div>
                          <p className="text-slate-400 font-medium">{t('no_analyses_yet')}</p>
                          <p className="text-xs text-slate-500 mt-1">{t('no_analyses_desc')}</p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-black font-serif text-orange-400">{t('upcoming_care')}</h3>
                      <button onClick={() => setActiveTab('reminders')} className="text-orange-400 text-xs font-bold uppercase tracking-widest hover:underline">{t('view_all')}</button>
                    </div>
                    <div className="space-y-4">
                      {reminders.filter(r => !r.completed).slice(0, 4).map((reminder, idx) => (
                        <motion.div
                          key={reminder.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-start gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-200 transition-colors group"
                        >
                          <div className={`p-2 rounded-xl transition-colors ${reminder.type === 'vaccination' ? 'bg-orange-500/20 text-orange-400 group-hover:bg-orange-500 group-hover:text-white' :
                              reminder.type === 'medication' ? 'bg-rose-500/20 text-rose-600 group-hover:bg-rose-600 group-hover:text-white' :
                                'bg-orange-500/20 text-orange-400 group-hover:bg-amber-600 group-hover:text-white'
                            }`}>
                            {reminder.type === 'vaccination' ? <Syringe className="w-4 h-4" /> :
                              reminder.type === 'medication' ? <Activity className="w-4 h-4" /> :
                                <Bell className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-black font-serif text-orange-400 truncate group-hover:text-orange-400 transition-colors">{reminder.title}</p>
                            <p className="text-xs text-slate-400">{reminder.petName} • {new Date(reminder.dueDate).toLocaleDateString()}</p>
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
                          <p className="text-xs text-slate-500 font-medium">{t('all_caught_up')}</p>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div className="bg-amber-600 p-8 rounded-3xl text-white shadow-[0_10px_40px_rgba(0,0,0,0.6)] shadow-amber-100">
                    <h3 className="text-lg font-bold mb-2">{t('pro_status')}</h3>
                    <p className="text-amber-100 text-sm leading-relaxed">
                      {t('pro_desc')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : activeTab === 'vehicles' ? (
            <motion.div
              key="vehicles"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {selectedVehicleForAnalyses ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSelectedPetForAnalyses(null)}
                      className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-slate-400" />
                    </button>
                    <div className="flex items-center gap-4">
                      {selectedVehicleForAnalyses.photoUrl ? (
                        <img
                          src={selectedVehicleForAnalyses.photoUrl}
                          alt={selectedVehicleForAnalyses.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-800"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                          {selectedVehicleForAnalyses.species === 'dog' ? <Car className="w-6 h-6 text-orange-400" /> : <Wrench className="w-6 h-6 text-orange-400" />}
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-black font-serif text-orange-400">{t('history_for', { name: selectedVehicleForAnalyses.name })}</h3>
                        <p className="text-sm text-slate-400">{t('analyses_sub_for', { name: selectedVehicleForAnalyses.name })}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                    <div className="divide-y divide-slate-50">
                      {analyses.filter(a => a.vehicleId === selectedVehicleForAnalyses.id).length > 0 ? (
                        analyses
                          .filter(a => a.vehicleId === selectedVehicleForAnalyses.id)
                          .map((analysis) => (
                            <div
                              key={analysis.id}
                              onClick={() => {
                      if (analysis.isUnlocked === false) {
                        setLockedAnalysisPrompt(analysis);
                      } else {
                        setSelectedAnalysis(analysis);
                      }
                    }}
                              className="p-4 hover:bg-slate-950 transition-colors flex items-center justify-between cursor-pointer"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center">
                                  {analysis.mediaType === 'video' ? <Play className="w-6 h-6 text-slate-500" /> : <Activity className="w-6 h-6 text-slate-500" />}
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-100 truncate max-w-[200px]">
                                    {analysis.result?.emotionalState ?
                                      (analysis.result.emotionalState.length > 40 ?
                                        analysis.result.emotionalState.substring(0, 40) + '...' :
                                        analysis.result.emotionalState) :
                                      'New Analysis'}
                                  </p>
                                  <p className="text-xs text-slate-400">
                                    {analysis.createdAt?.seconds ? new Date(analysis.createdAt.seconds * 1000).toLocaleString() : 'Just now'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${analysis.status === 'completed' ? 'bg-slate-800 text-emerald-700' : 'bg-slate-800 text-amber-700'
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
                          <div className="w-16 h-16 bg-slate-950 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-slate-300" />
                          </div>
                          <p className="text-slate-400">{t('no_analyses_for', { name: selectedVehicleForAnalyses.name })}</p>
                          <button
                            onClick={() => setActiveTab('upload')}
                            className="mt-4 text-orange-400 font-medium hover:underline"
                          >
                            {t('upload_for', { name: selectedVehicleForAnalyses.name })}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black font-serif text-orange-400">{t('my_vehicle_profiles')}</h3>
                    <button
                      onClick={() => {
                        setIsAddingPet(true);
                        setEditingPetId(null);
                        setVehicleImageFile(null);
                        setNewPet({
                          name: '',
                          make: '',
                          model: '',
                          year: '',
                          mileage: '',
                          photoUrl: '',
                          engine: '',
                          transmission: ''
                        });
                      }}
                      className="bg-orange-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-orange-600 transition-all flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      {t('add_vehicle')}
                    </button>
                  </div>

                  {isAddingVehicle && (
                    <div className="bg-slate-900 p-6 rounded-2xl border border-orange-500/20 shadow-[0_10px_40px_rgba(0,0,0,0.6)] shadow-indigo-50 animate-in fade-in slide-in-from-top-4 duration-300">
                      <h4 className="text-lg font-black font-serif text-orange-400 mb-4">{editingVehicleId ? t('edit_vehicle_profile') : t('add_new_vehicle')}</h4>
                      <form onSubmit={handleSaveVehicle} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 uppercase">{t('vehicle_name')}</label>
                          <input
                            required
                            value={newVehicle.name}
                            onChange={e => setNewPet({ ...newVehicle, name: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-slate-800 focus:ring-2 focus:ring-orange-500 outline-none"
                            placeholder="e.g., My Camry"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 uppercase">{t('make')}</label>
                          <input
                            value={newVehicle.make}
                            onChange={e => setNewPet({ ...newVehicle, make: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-slate-800 focus:ring-2 focus:ring-orange-500 outline-none"
                            placeholder="e.g., Toyota"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 uppercase">{t('model')}</label>
                          <input
                            value={newVehicle.model}
                            onChange={e => setNewPet({ ...newVehicle, model: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-slate-800 focus:ring-2 focus:ring-orange-500 outline-none"
                            placeholder="e.g., Camry"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 uppercase">{t('year')}</label>
                          <input
                            value={newVehicle.year}
                            onChange={e => setNewPet({ ...newVehicle, year: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-slate-800 focus:ring-2 focus:ring-orange-500 outline-none"
                            placeholder="e.g., 2020"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-xs font-bold text-slate-400 uppercase">{t('profile_picture')}</label>
                          <div className="flex items-center gap-4">
                            <label className="flex-1">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => setVehicleImageFile(e.target.files?.[0] || null)}
                              />
                              <div className="w-full px-4 py-2 rounded-lg border border-dashed border-slate-300 hover:border-indigo-400 hover:bg-orange-500/10 transition-all cursor-pointer flex items-center justify-center gap-2 text-sm text-slate-400">
                                <Upload className="w-4 h-4" />
                                {vehicleImageFile ? vehicleImageFile.name : t('choose_image')}
                              </div>
                            </label>
                            {(vehicleImageFile || newVehicle.photoUrl) && (
                              <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-800">
                                <img
                                  src={vehicleImageFile ? URL.createObjectURL(vehicleImageFile) : newVehicle.photoUrl}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-xs font-bold text-slate-400 uppercase">{t('engine_information')}</label>
                          <textarea
                            value={newVehicle.engine}
                            onChange={e => setNewPet({ ...newVehicle, engine: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-slate-800 focus:ring-2 focus:ring-orange-500 outline-none h-20 resize-none"
                            placeholder="e.g., 2.5L 4-Cylinder, V6, Electric..."
                          />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-xs font-bold text-slate-400 uppercase">{t('transmission_label')}</label>
                          <textarea
                            value={newVehicle.transmission}
                            onChange={e => setNewPet({ ...newVehicle, transmission: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-slate-800 focus:ring-2 focus:ring-orange-500 outline-none h-20 resize-none"
                            placeholder="e.g., 8-speed automatic, 6-speed manual..."
                          />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-xs font-bold text-slate-400 uppercase">{t('mileage_notes')}</label>
                          <textarea
                            value={newVehicle.mileage}
                            onChange={e => setNewPet({ ...newVehicle, mileage: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-slate-800 focus:ring-2 focus:ring-orange-500 outline-none h-20 resize-none"
                            placeholder="e.g., 45,000 miles. Has minor oil leak, tire pressure is low..."
                          />
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingPet(false);
                              setEditingPetId(null);
                            }}
                            className="px-4 py-2 text-slate-400 font-medium hover:bg-slate-950 rounded-lg transition-colors"
                          >
                            {t('cancel')}
                          </button>
                          <button
                            type="submit"
                            disabled={isUploadingVehicleImage}
                            className="px-6 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {isUploadingVehicleImage ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {t('saving')}
                              </>
                            ) : (editingVehicleId ? t('update_vehicle') : t('save_vehicle'))}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vehicles.map(vehicle => (
                      <div
                        key={vehicle.id}
                        onClick={() => setSelectedPetForAnalyses(vehicle)}
                        className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all relative group cursor-pointer hover:border-indigo-200"
                      >
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingPetId(vehicle.id);
                              setNewPet({
                                name: vehicle.name,
                                make: vehicle.make || vehicle.species || 'other',
                                model: vehicle.model || vehicle.breed || '',
                                year: vehicle.year || vehicle.age || '',
                                mileage: vehicle.mileage || vehicle.personality || '',
                                photoUrl: vehicle.photoUrl || '',
                                engine: vehicle.engine || vehicle.diet || '',
                                transmission: vehicle.transmission || vehicle.vaccinations || ''
                              });
                              setIsAddingPet(true);
                              setVehicleImageFile(null);
                            }}
                            className="p-2 text-slate-300 hover:text-orange-400 hover:bg-orange-500/10 rounded-lg transition-all"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmation({
                                type: 'vehicle',
                                id: vehicle.id,
                                name: vehicle.name
                              });
                            }}
                            className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                          {vehicle.photoUrl ? (
                            <img
                              src={vehicle.photoUrl}
                              alt={vehicle.name}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-800"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                              <Car className="w-6 h-6 text-orange-400" />
                            </div>
                          )}
                          <div>
                            <h4 className="font-black font-serif text-orange-400">{vehicle.name}</h4>
                            <p className="text-xs text-slate-400 capitalize">{(vehicle.make || vehicle.species || 'vehicle')} • {vehicle.model || vehicle.breed || 'Unknown Model'}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('year')}</p>
                            <p className="text-sm text-slate-300">{vehicle.year || vehicle.age || 'Not specified'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('mileage')}</p>
                            <p className="text-sm text-slate-300 line-clamp-1">{vehicle.mileage || vehicle.personality || 'No notes added.'}</p>
                          </div>
                          {(vehicle.engine || vehicle.diet) && (
                            <div>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                <Activity className="w-2 h-2" /> {t('engine')}
                              </p>
                              <p className="text-sm text-slate-300 line-clamp-1">{vehicle.engine || vehicle.diet}</p>
                            </div>
                          )}
                          {(vehicle.transmission || vehicle.vaccinations) && (
                            <div>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                <Wrench className="w-2 h-2" /> {t('transmission')}
                              </p>
                              <p className="text-sm text-slate-300 line-clamp-1">{vehicle.transmission || vehicle.vaccinations}</p>
                            </div>
                          )}
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                          <span className="text-xs font-medium text-orange-400">{t('view_history')}</span>
                          <ChevronRight className="w-4 h-4 text-indigo-400" />
                        </div>
                      </div>
                    ))}
                    {vehicles.length === 0 && !isAddingVehicle && (
                      <div className="md:col-span-3 py-20 text-center bg-slate-900 rounded-3xl border-2 border-dashed border-slate-800">
                        <Car className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-medium">{t('no_vehicles_yet')}</p>
                        <p className="text-xs text-slate-500 mt-1">{t('no_vehicles_desc')}</p>
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
              className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
            >
              <div className="divide-y divide-slate-50">
                {analyses.map((analysis) => (
                  <div
                    key={analysis.id}
                    onClick={() => {
                      if (analysis.isUnlocked === false) {
                        setLockedAnalysisPrompt(analysis);
                      } else {
                        setSelectedAnalysis(analysis);
                      }
                    }}
                    className="p-4 hover:bg-slate-950 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center">
                        {analysis.mediaType === 'video' ? <Play className="w-6 h-6 text-slate-500" /> : <Activity className="w-6 h-6 text-slate-500" />}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-100 truncate max-w-[250px]">
                          {analysis.result?.emotionalState ?
                            (analysis.result.emotionalState.length > 50 ?
                              analysis.result.emotionalState.substring(0, 50) + '...' :
                              analysis.result.emotionalState) :
                            'New Analysis'}
                        </p>
                        <p className="text-xs text-slate-400">
                          {analysis.petName || 'My Vehicle'} • {analysis.createdAt?.seconds ? new Date(analysis.createdAt.seconds * 1000).toLocaleString() : 'Just now'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${analysis.status === 'completed' ? 'bg-slate-800 text-emerald-700' : 'bg-slate-800 text-amber-700'
                        }`}>
                        {analysis.status}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmation({
                            type: 'analysis',
                            id: analysis.id,
                            name: `${analysis.petName || 'Vehicle'}'s analysis`
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
                <h3 className="text-xl font-black font-serif text-orange-400">{t('care_reminders')}</h3>
                <button
                  onClick={() => setIsAddingReminder(true)}
                  className="bg-orange-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-orange-600 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {t('add_reminder')}
                </button>
              </div>

              {isAddingReminder && (
                <div className="bg-slate-900 p-6 rounded-2xl border border-orange-500/20 shadow-[0_10px_40px_rgba(0,0,0,0.6)] shadow-indigo-50 animate-in fade-in slide-in-from-top-4 duration-300">
                  <h4 className="text-lg font-black font-serif text-orange-400 mb-4">{editingReminderId ? t('edit_reminder') : t('new_reminder')}</h4>
                  <form onSubmit={handleSaveReminder} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">{t('vehicle')}</label>
                      <select
                        required
                        value={newReminder.vehicleId}
                        onChange={e => setNewReminder({ ...newReminder, vehicleId: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-slate-800 focus:ring-2 focus:ring-orange-500 outline-none"
                      >
                        <option value="">{t('select_vehicle')}</option>
                        {vehicles.map(vehicle => (
                          <option key={vehicle.id} value={vehicle.id}>{vehicle.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">{t('type')}</label>
                      <select
                        value={newReminder.type}
                        onChange={e => setNewReminder({ ...newReminder, type: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-slate-800 focus:ring-2 focus:ring-orange-500 outline-none"
                      >
                        <option value="vaccination">{t('type_oil_change')}</option>
                        <option value="medication">{t('type_brakes')}</option>
                        <option value="food">{t('type_tire_rotation')}</option>
                        <option value="grooming">{t('type_inspection')}</option>
                        <option value="other">{t('type_other')}</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">{t('reminder_title')}</label>
                      <input
                        required
                        value={newReminder.title}
                        onChange={e => setNewReminder({ ...newReminder, title: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-slate-800 focus:ring-2 focus:ring-orange-500 outline-none"
                        placeholder="e.g., Oil Change"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">{t('due_date')}</label>
                      <input
                        required
                        type="date"
                        value={newReminder.dueDate}
                        onChange={e => setNewReminder({ ...newReminder, dueDate: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-slate-800 focus:ring-2 focus:ring-orange-500 outline-none"
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingReminder(false);
                          setEditingReminderId(null);
                        }}
                        className="px-4 py-2 text-slate-400 font-medium hover:bg-slate-950 rounded-lg transition-colors"
                      >
                        {t('cancel')}
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        {editingReminderId ? t('update_reminder') : t('save_reminder')}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reminders.map(reminder => (
                  <div
                    key={reminder.id}
                    className={`bg-slate-900 p-6 rounded-2xl border transition-all relative group ${reminder.completed ? 'border-slate-800 opacity-60' : 'border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
                      }`}
                  >
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => {
                          setEditingReminderId(reminder.id);
                          setNewReminder({
                            vehicleId: reminder.vehicleId,
                            title: reminder.title,
                            type: reminder.type,
                            dueDate: reminder.dueDate,
                            completed: reminder.completed
                          });
                          setIsAddingReminder(true);
                        }}
                        className="p-2 text-slate-300 hover:text-orange-400 hover:bg-orange-500/10 rounded-lg transition-all"
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
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${reminder.completed ? 'bg-slate-800 text-slate-500' :
                          reminder.type === 'vaccination' ? 'bg-orange-500/10 text-orange-400' :
                            reminder.type === 'medication' ? 'bg-slate-800 text-rose-600' :
                              'bg-slate-800 text-orange-400'
                        }`}>
                        {reminder.type === 'vaccination' ? <Syringe className="w-6 h-6" /> :
                          reminder.type === 'medication' ? <Activity className="w-6 h-6" /> :
                            <Bell className="w-6 h-6" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-black font-serif text-orange-400 truncate ${reminder.completed ? 'line-through' : ''}`}>{reminder.title}</h4>
                        <p className="text-xs text-slate-400 capitalize">{reminder.petName} • {reminder.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs font-medium">{new Date(reminder.dueDate).toLocaleDateString()}</span>
                      </div>
                      <button
                        onClick={() => handleToggleReminder(reminder.id, reminder.completed)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${reminder.completed
                            ? 'bg-slate-800 text-slate-400'
                            : 'bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-white'
                          }`}
                      >
                        {reminder.completed ? t('completed') : t('mark_done')}
                      </button>
                    </div>
                  </div>
                ))}
                {reminders.length === 0 && !isAddingReminder && (
                  <div className="md:col-span-3 py-20 text-center bg-slate-900 rounded-3xl border-2 border-dashed border-slate-800">
                    <Bell className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium">{t('no_reminders_yet')}</p>
                    <p className="text-xs text-slate-500 mt-1">{t('no_reminders_desc')}</p>
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
              <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                <h3 className="text-2xl font-black font-serif text-orange-400 mb-6">{t('account_settings')}</h3>

                {userData?.subscriptionTier === 'pro' && (
                  <div className="mb-8 p-6 bg-orange-500/10 rounded-2xl border border-orange-500/20">
                    <h4 className="text-lg font-bold text-indigo-900 mb-2 flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      {t('pro_membership_active')}
                    </h4>
                    <p className="text-sm text-orange-300">
                      {t('pro_membership_active_desc')}
                    </p>
                  </div>
                )}

                <div className="space-y-8">
                  {/* Profile Section */}
                  <section className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{t('profile_information')}</h4>

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
                          <div className="w-20 h-20 rounded-full bg-orange-500/20 flex items-center justify-center border-4 border-white shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                            <UserIcon className="w-8 h-8 text-orange-400" />
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
                        <p className="font-black font-serif text-orange-400">{t('profile_picture_label')}</p>
                        <p className="text-xs text-slate-400">{t('profile_picture_desc')}</p>
                      </div>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase">{t('display_name')}</label>
                        <input
                          value={settingsName}
                          onChange={(e) => setSettingsName(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-800 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                          placeholder={t('display_name_placeholder')}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase">{t('email_address')}</label>
                        <input
                          disabled
                          value={user?.email || ''}
                          className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-500 outline-none cursor-not-allowed"
                        />
                        <p className="text-[10px] text-slate-500 italic">{t('email_change_disabled')}</p>
                      </div>
                      <button
                        type="submit"
                        disabled={isUpdatingProfile || settingsName === user?.displayName}
                        className="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        {isUpdatingProfile && <Loader2 className="w-4 h-4 animate-spin" />}
                        {t('update_profile')}
                      </button>
                    </form>
                  </section>

                  <hr className="border-slate-800" />

                  {/* Language Preference Section */}
                  <section className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{t('language_preference')}</h4>
                    <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-3">{t('select_language')}</label>
                      <select
                        value={locale}
                        onChange={(e) => setLocale(e.target.value as any)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-800 focus:ring-2 focus:ring-orange-500 outline-none text-black bg-white text-sm font-medium"
                      >
                        {SUPPORTED_LANGUAGES.map((lang) => (
                          <option key={lang.code} value={lang.code} className="text-black bg-white">
                            {lang.flag} &nbsp; {lang.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </section>

                  <hr className="border-slate-800" />

                  {/* Subscription Section */}
                  <section className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{t('subscription_plan')}</h4>
                      <div className="flex items-center gap-2">
                        {isSandbox && (
                          <span className="bg-orange-500/20 text-orange-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                            Sandbox
                          </span>
                        )}
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${userData?.subscriptionTier === 'pro' ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-800 text-slate-400'
                          }`}>
                          {userData?.subscriptionTier === 'pro' ? t('pro_tier_badge') : t('free_tier_badge')}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                      <div className="flex items-start justify-between gap-6">
                        <div className="space-y-2">
                          <p className="font-black font-serif text-orange-400">
                            {userData?.subscriptionTier === 'pro' ? t('pro_tier') : t('free_tier')}
                          </p>
                          <p className="text-sm text-slate-400 leading-relaxed">
                            {userData?.subscriptionTier === 'pro'
                              ? t('pro_benefit')
                              : t('free_benefit', { count: userData?.analysesCount || 0 })}
                          </p>
                        </div>
                        {userData?.subscriptionTier !== 'pro' ? (
                          <button
                            onClick={() => setShowLimitModal({ type: 'upgrade', messyear: t('unlock_pro_desc') })}
                            className="shrink-0 px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                          >
                            {t('upgrade_button')}
                          </button>
                        ) : (
                          <button
                            onClick={handleRestorePurchases}
                            disabled={isRestoring}
                            className="shrink-0 px-6 py-3 bg-slate-900 border border-slate-800 text-slate-400 font-bold rounded-xl hover:bg-slate-950 transition-all flex items-center gap-2"
                          >
                            {isRestoring && <Loader2 className="w-4 h-4 animate-spin" />}
                            {t('restore_purchases')}
                          </button>
                        )}
                      </div>

                      {userData?.subscriptionTier !== 'pro' && (
                        <div className="mt-6 pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            {t('analyses_total')}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            {t('chats_per_analysis')}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 flex flex-wrap items-center gap-4 text-[10px] text-slate-500">
                        <button onClick={() => setShowTermsModal(true)} className="hover:text-orange-400 underline">{t('terms_of_use')}</button>
                        <button onClick={() => setShowPrivacyModal(true)} className="hover:text-orange-400 underline">{t('privacy_policy')}</button>
                        <button onClick={() => setShowFairUseModal(true)} className="hover:text-orange-400 underline">{t('fair_use_policy')}</button>
                      </div>
                    </div>
                  </section>

                  <hr className="border-slate-800" />

                  {/* Referral Section */}
                  <section className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{t('referral_program')}</h4>
                    <div className="bg-slate-800 p-6 rounded-3xl border border-amber-100 space-y-4">
                      <div>
                        <p className="text-sm font-bold text-amber-900 mb-1">{t('your_referral_code')}</p>
                        <div className="flex items-center gap-2">
                          <code className="bg-slate-900 px-4 py-2 rounded-xl border border-orange-500/50 font-mono font-bold text-orange-400 text-lg">
                            {userData?.referralCode || '------'}
                          </code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(userData?.referralCode || '');
                              setNotification({ messyear: t('referral_copied'), type: 'success' });
                            }}
                            className="p-2 text-orange-400 hover:bg-slate-900 rounded-lg transition-all"
                          >
                            <Copy className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {!userData?.referredBy && (
                        <div className="pt-4 border-t border-orange-500/50">
                          <p className="text-sm font-bold text-amber-900 mb-2">{t('have_referral_code')}</p>
                          <form onSubmit={handleReferralSubmit} className="flex gap-2">
                            <input
                              value={referralInput}
                              onChange={(e) => setReferralInput(e.target.value)}
                              placeholder={t('enter_code')}
                              className="flex-1 px-4 py-2 rounded-xl border border-orange-500/50 focus:ring-2 focus:ring-amber-500 outline-none uppercase font-mono"
                            />
                            <button
                              type="submit"
                              disabled={isSubmittingReferral || !referralInput.trim()}
                              className="px-6 py-2 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition-all disabled:opacity-50"
                            >
                              {isSubmittingReferral ? <Loader2 className="w-4 h-4 animate-spin" /> : t('apply')}
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  </section>

                  <hr className="border-slate-800" />

                  {/* Security Section */}
                  <section className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{t('security')}</h4>
                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-black font-serif text-orange-400">{t('reset_password')}</p>
                          <p className="text-sm text-slate-400">{t('reset_password_desc')}</p>
                        </div>
                        <button
                          onClick={handlePasswordReset}
                          disabled={isSendingReset}
                          className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-950 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.4)] disabled:opacity-50 flex items-center gap-2"
                        >
                          {isSendingReset && <Loader2 className="w-4 h-4 animate-spin" />}
                          {t('send_link')}
                        </button>
                      </div>
                    </div>
                  </section>

                  <hr className="border-slate-800" />

                  {/* Danger Zone */}
                  <section className="space-y-4">
                    <h4 className="text-sm font-bold text-red-400 uppercase tracking-wider">{t('danger_zone')}</h4>
                    <button
                      onClick={logout}
                      className="w-full px-6 py-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-5 h-5" />
                      {t('sign_out_all_devices')}
                    </button>
                    <button
                      onClick={() => setShowDeleteAccountConfirm(true)}
                      className="w-full px-6 py-4 bg-slate-900 border border-red-500/50 text-red-500 font-bold rounded-2xl hover:bg-red-950 transition-all flex items-center justify-center gap-2 mt-4"
                    >
                      <AlertTriangle className="w-5 h-5" />
                      {t('delete_account')}
                    </button>
                  </section>

                  <div className="pt-8 text-center border-t border-slate-800 mt-8">
                    <p className="text-sm text-slate-400">
                      {t('need_help')} <a href="mailto:xyz@gmail.com" className="text-orange-400 hover:underline font-bold">xyz@gmail.com</a>

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
              <div className="bg-slate-900 rounded-3xl border-2 border-dashed border-slate-800 p-12 text-center">
                {isUploading ? (
                  <div className="space-y-6">
                    <div className="relative w-24 h-24 mx-auto">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle className="text-slate-100 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent" />
                        <circle
                          className="text-orange-400 stroke-current transition-all duration-500"
                          strokeWidth="8"
                          strokeDasharray={251.2}
                          strokeDashoffset={251.2 - (251.2 * uploadProgress) / 100}
                          strokeLinecap="round"
                          cx="50" cy="50" r="40" fill="transparent"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center font-bold text-orange-400">
                        {uploadProgress}%
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-black font-serif text-orange-400">{getUploadStatusText(uploadStatus)}</h3>
                      <p className="text-slate-400">{t('please_wait')}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="w-20 h-20 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto">
                      <Upload className="w-10 h-10 text-orange-400" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-black font-serif text-orange-400">{t('upload_vehicle_media')}</h3>
                      <p className="text-slate-400">{t('upload_subtitle')}</p>
                    </div>

                    <div className="max-w-md mx-auto space-y-4">
                      <div className="text-left">
                        <label className="block text-sm font-semibold text-slate-300 mb-1">{t('select_vehicle')}</label>
                        <select
                          value={selectedVehicleId}
                          onChange={(e) => setSelectedPetId(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-800 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
                        >
                          <option value="">{t('general_analysis')}</option>
                          {vehicles.map(vehicle => (
                            <option key={vehicle.id} value={vehicle.id}>{vehicle.name} ({vehicle.make || vehicle.species})</option>
                          ))}
                        </select>
                        {vehicles.length === 0 && (
                          <p className="text-xs text-orange-400 mt-1">{t('no_vehicles_tip')}</p>
                        )}
                      </div>

                      <div className="text-left">
                        <label className="block text-sm font-semibold text-slate-300 mb-1">{t('specific_question_label')}</label>
                        <textarea
                          value={userQuestion}
                          onChange={(e) => setUserQuestion(e.target.value)}
                          placeholder={t('squeal_placeholder')}
                          className="w-full px-4 py-3 rounded-xl border border-slate-800 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none h-24 text-sm"
                        />
                      </div>

                      <div className="block">
                        <input
                          id="vehicle-file-input"
                          type="file"
                          className="hidden"
                          accept="video/*,audio/*"
                          onChange={handleUpload}
                        />
                        <button
                          onClick={handleInitiateUpload}
                          disabled={paywallCooldown}
                          className={`w-full inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold transition-all shadow-lg cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${paywallCooldown
                              ? 'bg-slate-800 text-slate-500 shadow-none'
                              : 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/20'
                            }`}
                        >
                          {paywallCooldown ? (
                            <div className="flex items-center gap-2">
                               <Clock className="w-5 h-5" />
                               <span>{t('limit_reached')}</span>
                            </div>
                          ) : (
                            t('analyze_vehicle_button')
                          )}
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500">{t('supported_formats')}</p>
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
              className="bg-slate-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-800"
            >
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-black font-serif text-orange-400 mb-2">Delete {deleteConfirmation.type}?</h3>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Are you sure you want to delete <span className="font-black font-serif text-orange-400">"{deleteConfirmation.name}"</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmation(null)}
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-950 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (deleteConfirmation.type === 'vehicle') {
                      handleDeleteVehicle(deleteConfirmation.id);
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
            t={t}
          />
        )}
      </AnimatePresence>

      {/* Locked Analysis Ad-Gate Prompt */}
      <AnimatePresence>
        {lockedAnalysisPrompt && (
          <SubscriptionPage
            message={`Your vehicle analysis is ready! Watch a short ad to reveal the results, or upgrade to Pro for an ad-free experience.`}
            onUpgrade={handleUpgrade}
            onRestore={handleRestorePurchases}
            isSandbox={isSandbox}
            onWatchAd={handleWatchAdToUnlock}
            isWatchingAd={isWatchingAd}
            type="analysis"
            onClose={() => setLockedAnalysisPrompt(null)}
            onShowTerms={() => {
              setLockedAnalysisPrompt(null);
              setShowTermsModal(true);
            }}
            onShowPrivacy={() => {
              setLockedAnalysisPrompt(null);
              setShowPrivacyModal(true);
            }}
            t={t}
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
              className="bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldAlert className="w-10 h-10 text-orange-400" />
              </div>
              <h2 className="text-2xl font-black font-serif text-orange-400 mb-4">Verification Required</h2>
              <p className="text-slate-400 mb-8">
                You've reached a high usage threshold (300+ analyses). To ensure service quality for everyone, please verify you are a human.
              </p>

              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 mb-8">
                <label className="flex items-center gap-4 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-6 h-6 rounded border-slate-300 text-orange-400 focus:ring-orange-500"
                    onChange={(e) => setIsBotVerified(e.target.checked)}
                  />
                  <span className="text-lg font-medium text-slate-300 group-hover:text-orange-400 transition-colors">
                    I am not a bot
                  </span>
                </label>
              </div>

              <button
                onClick={() => {
                  if (isBotVerified) {
                    setShowBotModal(false);
                    setNotification({ messyear: "Verification successful. You can continue.", type: 'success' });
                  }
                }}
                disabled={!isBotVerified}
                className={`w-full py-4 rounded-2xl font-bold transition-all ${isBotVerified
                    ? 'bg-orange-500 text-white shadow-lg shadow-indigo-200 hover:bg-orange-600'
                    : 'bg-slate-200 text-slate-500 cursor-not-allowed'
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
              className="bg-slate-900 rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-slate-800 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black font-serif text-orange-400">Unlimited Analysis Fair Use Policy</h2>
                <button onClick={() => setShowFairUseModal(false)} className="p-2 text-slate-500 hover:bg-slate-800 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6 text-slate-400 text-sm leading-relaxed">
                <p>
                  To ensure a high-quality experience for all users, our "Unlimited" plan is subject to a Fair Use Policy. This plan is intended for personal, non-commercial use by a single individual.
                </p>

                <div>
                  <h4 className="font-black font-serif text-orange-400 mb-1">Personal Use</h4>
                  <p>Analysis is intended for vehicles owned by the subscriber. Commercial use (e.g., professional commercial fleets or repair shops) requires a Business License.</p>
                </div>

                <div>
                  <h4 className="font-black font-serif text-orange-400 mb-1">Usage Caps</h4>
                  <p>Accounts exceeding 300 analyses per month or 30 analyses per day may be subject to temporary speed throttling or a transition to our Standard Intelligence model.</p>
                </div>

                <div>
                  <h4 className="font-black font-serif text-orange-400 mb-1">Automated Use</h4>
                  <p>Any attempt to use scripts, bots, or automated tools to submit videos is strictly prohibited and will result in immediate account termination.</p>
                </div>
              </div>

              <button
                onClick={() => setShowFairUseModal(false)}
                className="w-full mt-8 py-4 bg-slate-800 text-slate-100 font-bold rounded-2xl hover:bg-slate-700 transition-all"
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
              className="bg-slate-900 rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-slate-800 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black font-serif text-orange-400">Terms of Use (EULA)</h2>
                <button onClick={() => setShowTermsModal(false)} className="p-2 text-slate-500 hover:bg-slate-800 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6 text-slate-400 text-sm leading-relaxed">
                <p className="italic">Last Updated: April 2026</p>

                <div>
                  <h4 className="font-black font-serif text-orange-400 mb-1">1. Acceptance of Terms</h4>
                  <p>By accessing and using AutoDiagnostic, you agree to be bound by these Terms of Use. If you do not agree, please do not use the application.</p>
                </div>

                <div>
                  <h4 className="font-black font-serif text-orange-400 mb-1">2. Safety and Professional Disclaimer</h4>
                  <p>AutoDiagnostic provides AI-driven mechanical analysis for educational and informational purposes only. It is NOT a substitute for professional mechanic's advice, diagnosis, or repair. Always consult a certified automotive mechanic for safety-critical vehicle concerns.</p>
                </div>

                <div>
                  <h4 className="font-black font-serif text-orange-400 mb-1">3. User Content</h4>
                  <p>You retain ownership of the videos and audio you upload. By uploading, you grant AutoDiagnostic a license to process this media solely for the purpose of providing the analysis service.</p>
                </div>

                <div>
                  <h4 className="font-black font-serif text-orange-400 mb-1">4. Subscriptions and Billing</h4>
                  <p>Premium features require a subscription. Payments are processed securely through your device's app store (Apple App Store or Google Play). Subscriptions automatically renew unless canceled at least 24 hours before the end of the current period.</p>
                </div>
              </div>

              <button
                onClick={() => setShowTermsModal(false)}
                className="w-full mt-8 py-4 bg-slate-800 text-slate-100 font-bold rounded-2xl hover:bg-slate-700 transition-all"
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
              className="bg-slate-900 rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-slate-800 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black font-serif text-orange-400">Privacy Policy</h2>
                <button onClick={() => setShowPrivacyModal(false)} className="p-2 text-slate-500 hover:bg-slate-800 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6 text-slate-400 text-sm leading-relaxed">
                <p className="italic">Last Updated: April 2026</p>

                <div>
                  <h4 className="font-black font-serif text-orange-400 mb-1">1. Information We Collect</h4>
                  <p>We collect information you provide directly to us, including your email address, vehicle profiles (name, breed, age), and the media (video/audio) you upload for analysis.</p>
                </div>

                <div>
                  <h4 className="font-black font-serif text-orange-400 mb-1">2. How We Use Your Information</h4>
                  <p>Your media is processed using advanced AI models to provide behavioral insights. We do not use your personal videos to train public AI models. Your data is used strictly to deliver and improve your personal experience within the app.</p>
                </div>

                <div>
                  <h4 className="font-black font-serif text-orange-400 mb-1">3. Data Storage and Security</h4>
                  <p>Your data is securely stored using industry-standard cloud infrastructure. We implement robust security measures to protect your personal information from unauthorized access.</p>
                </div>

                <div>
                  <h4 className="font-black font-serif text-orange-400 mb-1">4. Data Deletion</h4>
                  <p>You can delete your vehicle profiles, analyses, or your entire account at any time from within the app. Deleting an item permanently removes it from our active servers.</p>
                </div>
              </div>

              <button
                onClick={() => setShowPrivacyModal(false)}
                className="w-full mt-8 py-4 bg-slate-800 text-slate-100 font-bold rounded-2xl hover:bg-slate-700 transition-all"
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
              className="bg-slate-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-800"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black font-serif text-orange-400">Media Source</h3>
                <button onClick={() => setShowUploadTypeModal(false)} className="p-2 text-slate-500 hover:bg-slate-800 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <button
                  onClick={() => {
                    setShowUploadTypeModal(false);
                    const fileInput = document.getElementById('vehicle-file-input');
                    if (fileInput) (fileInput as HTMLInputElement).click();
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-orange-500/50 hover:bg-slate-900 transition-all text-left"
                >
                  <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Upload className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-100">Upload Video/Audio</p>
                    <p className="text-xs text-slate-400">Choose from your library</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setShowUploadTypeModal(false);
                    startCameraPreview();
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-orange-500/50 hover:bg-slate-900 transition-all text-left"
                >
                  <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Camera className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-100">Record Video</p>
                    <p className="text-xs text-slate-400">Record right now (max 30s)</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setShowUploadTypeModal(false);
                    startAudioRecording();
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-orange-500/50 hover:bg-slate-900 transition-all text-left"
                >
                  <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mic className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-100">Record Audio</p>
                    <p className="text-xs text-slate-400">Record engine sounds (max 30s)</p>
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

      {/* Audio Recording Modal */}
      <AnimatePresence>
        {isRecordingAudio && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-slate-950/95 backdrop-blur-md flex flex-col justify-center items-center p-6"
          >
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center shadow-2xl">
              {/* Close Button */}
              <button 
                onClick={cancelAudioRecording}
                className="absolute top-6 right-6 p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="w-24 h-24 bg-orange-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Mic className="w-12 h-12 text-orange-500" />
              </div>

              <h3 className="text-xl font-black font-serif text-slate-100 mb-2">Recording Engine Sound</h3>
              <p className="text-sm text-slate-400 mb-8 text-center">Please hold the device near the sound source.</p>

              {/* Progress counter */}
              <div className="relative w-24 h-24 mb-10">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle className="text-slate-800 stroke-current" strokeWidth="6" cx="50" cy="50" r="40" fill="transparent" />
                  <circle
                    className="text-orange-500 stroke-current transition-all duration-1000 ease-linear"
                    strokeWidth="6"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * (recordingTimeLeft / 30))}
                    strokeLinecap="round"
                    cx="50" cy="50" r="40" fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">{recordingTimeLeft}s</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={stopAudioRecording}
                  disabled={isStopping}
                  className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isStopping ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Square className="w-4 h-4" />
                      Stop & Analyze
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteAccountConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-red-500/30 rounded-3xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-100 text-center mb-2">{t('delete_account_confirm_title')}</h3>
              <p className="text-slate-400 text-center mb-6">
                {t('delete_account_confirm_desc')}
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeletingAccount}
                  className="w-full px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeletingAccount ? <Loader2 className="w-5 h-5 animate-spin" /> : t('delete_account')}
                </button>
                <button
                  onClick={() => setShowDeleteAccountConfirm(false)}
                  disabled={isDeletingAccount}
                  className="w-full px-6 py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-all disabled:opacity-50"
                >
                  {t('cancel')}
                </button>
              </div>
            </motion.div>
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
          ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
          : 'text-slate-400 hover:bg-slate-950 hover:text-orange-400'
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
      className="bg-slate-900 p-4 lg:p-6 rounded-2xl border border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-950 rounded-lg">{icon}</div>
      </div>
      <p className="text-slate-400 text-xs lg:text-sm font-medium">{label}</p>
      <p className="text-xl lg:text-2xl font-black font-serif text-orange-400 mt-1">{value}</p>
    </motion.div>
  );
}
