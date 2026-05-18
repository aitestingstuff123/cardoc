import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, onAuthStateChanged, User, db, doc, getDoc, setDoc, Timestamp, onSnapshot } from './firebase';

interface AuthContextType {
  user: User | null;
  userData: any | null;
  loading: boolean;
  isAdmin: boolean;
  setUserData: (data: any) => void;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  userData: null, 
  loading: true, 
  isAdmin: false,
  setUserData: () => {} 
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;

    // Safety timeout to prevent infinite loading if auth/firestore takes too long
    const safetyTimeout = setTimeout(() => {
      console.warn("[AuthContext] Safety timeout reached. Forcing loading to false.");
      setLoading(false);
    }, 6000);

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        
        // Use onSnapshot for real-time updates (important for rewards/limits)
        unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("[AuthContext] User data updated:", {
              uid: currentUser.uid,
              subscriptionTier: data.subscriptionTier,
              analysesCount: data.analysesCount
            });
            
            // Ensure referral code exists for existing users
            if (!data.referralCode) {
              const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
              setDoc(userRef, { referralCode }, { merge: true }).catch(err => {
                console.error("Error updating referral code:", err);
              });
            }

            setUserData(data);
            setIsAdmin(data.role === 'admin');
            setLoading(false);
            clearTimeout(safetyTimeout);
          } else {
            // Document doesn't exist yet, create it
            const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            const initialData = {
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              role: 'user',
              subscriptionTier: 'free',
              analysesCount: 0,
              bonusAnalyses: 0,
              bonusChats: 0,
              referralCode,
              createdAt: Timestamp.now()
            };
            setDoc(userRef, initialData).catch(err => {
              console.error("Error creating user doc:", err);
            }).finally(() => {
              setLoading(false);
              clearTimeout(safetyTimeout);
            });
          }
        }, (error) => {
          console.error("User snapshot error:", error);
          setLoading(false);
          clearTimeout(safetyTimeout);
        });
      } else {
        setUserData(null);
        setIsAdmin(false);
        setLoading(false);
        clearTimeout(safetyTimeout);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
      clearTimeout(safetyTimeout);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading, isAdmin, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
