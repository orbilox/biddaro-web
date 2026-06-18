import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseApp: FirebaseApp =
  getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);

export function getFirebaseAuth() {
  return getAuth(firebaseApp);
}

export async function getFirebaseMessaging() {
  if (typeof window === 'undefined') return null;
  const { isSupported, getMessaging } = await import('firebase/messaging');
  if (!(await isSupported())) return null;
  return getMessaging(firebaseApp);
}
