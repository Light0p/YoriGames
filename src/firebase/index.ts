import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { app, firebaseConfig } from './config';

let db: Firestore;
let auth: Auth;
let storage: FirebaseStorage;

export function initializeFirebase(): {
  app: any;
  db: Firestore;
  auth: Auth;
  storage: FirebaseStorage;
} {
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);

  return { app, db, auth, storage };
}

// Named exports for direct access if needed outside of provider context
export { app, db, auth, storage, firebaseConfig };

export * from './provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';