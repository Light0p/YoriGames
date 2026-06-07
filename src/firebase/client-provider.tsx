'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';

export const FirebaseClientProvider = ({ children }: { children: ReactNode }) => {
  const [firebase, setFirebase] = useState<{
    app: FirebaseApp;
    db: Firestore;
    auth: Auth;
  } | null>(null);

  useEffect(() => {
    const { app, db, auth } = initializeFirebase();
    setFirebase({ app, db, auth });
  }, []);

  if (!firebase) {
    return null;
  }

  return (
    <FirebaseProvider app={firebase.app} db={firebase.db} auth={firebase.auth}>
      {children}
    </FirebaseProvider>
  );
};
