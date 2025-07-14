import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Generate a unique session ID
const generateSessionId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Get or create session ID
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('visitor_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('visitor_session_id', sessionId);
  }
  return sessionId;
};

export const useVisitorTracking = () => {
  const startTimeRef = useRef<number>(Date.now());
  const currentPageRef = useRef<string>('');

  useEffect(() => {
    const sessionId = getSessionId();
    const startTime = Date.now();
    startTimeRef.current = startTime;
    currentPageRef.current = window.location.pathname;

    // Track page entry
    const trackPageEntry = async () => {
      try {
        await supabase.from('page_views').insert({
          visitor_session_id: sessionId,
          page_path: window.location.pathname,
          time_entered: new Date().toISOString(),
        });

        // Also update/insert visitor record
        const { data: existingVisitor } = await supabase
          .from('visitors')
          .select('id')
          .eq('session_id', sessionId)
          .single();

        if (!existingVisitor) {
          await supabase.from('visitors').insert({
            session_id: sessionId,
            ip_address: null, // Will be populated by server if needed
            user_agent: navigator.userAgent,
            page_visited: window.location.pathname,
            referrer: document.referrer || null,
            time_spent_seconds: 0,
          });
        }
      } catch (error) {
        console.error('Error tracking page entry:', error);
      }
    };

    trackPageEntry();

    // Track page exit
    const trackPageExit = async () => {
      const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
      
      try {
        // Update the most recent page view for this session
        await supabase
          .from('page_views')
          .update({
            time_left: new Date().toISOString(),
            time_spent_seconds: timeSpent,
          })
          .eq('visitor_session_id', sessionId)
          .eq('page_path', currentPageRef.current)
          .is('time_left', null);

        // Update total time spent for visitor
        const { data: visitor } = await supabase
          .from('visitors')
          .select('time_spent_seconds')
          .eq('session_id', sessionId)
          .single();

        if (visitor) {
          await supabase
            .from('visitors')
            .update({
              time_spent_seconds: (visitor.time_spent_seconds || 0) + timeSpent,
            })
            .eq('session_id', sessionId);
        }
      } catch (error) {
        console.error('Error tracking page exit:', error);
      }
    };

    // Track visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        trackPageExit();
      } else {
        startTimeRef.current = Date.now();
      }
    };

    // Track page unload
    const handleBeforeUnload = () => {
      trackPageExit();
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup function
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      trackPageExit();
    };
  }, []);

  return null;
};