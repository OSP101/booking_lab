'use client'

import { useEffect } from 'react';

export default function PreventClose() {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = 'Your booking will be lost until the teacher deletes it. Are you sure you want to leave this page?';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
}