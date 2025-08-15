
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useVisitorTracking = () => {
  useEffect(() => {
    const sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    let startTime = Date.now();
    let currentPath = window.location.pathname;

    const trackVisitor = async () => {
      try {
        // Check if visitor already exists to avoid duplicate inserts
        const { data: existingVisitor, error: checkError } = await supabase
          .from('visitors')
          .select('id')
          .eq('session_id', sessionId);

        if (checkError) {
          console.log('Error checking visitor:', checkError.message);
          return;
        }

        // Only insert if visitor doesn't exist
        if (!existingVisitor || existingVisitor.length === 0) {
          const { error: insertError } = await supabase
            .from('visitors')
            .insert({
              session_id: sessionId,
              user_agent: navigator.userAgent,
              ip_address: 'unknown', // We can't get real IP on client side
              page_visited: currentPath,
              referrer: document.referrer || null,
              time_spent_seconds: 0
            });

          if (insertError) {
            console.log('Error inserting visitor:', insertError.message);
          } else {
            console.log('Visitor tracked successfully');
          }
        }
      } catch (error) {
        console.log('Error in trackVisitor:', error);
      }
    };

    const trackPageView = async (path: string) => {
      try {
        const { error } = await supabase
          .from('page_views')
          .insert({
            visitor_session_id: sessionId,
            page_path: path,
            time_spent_seconds: 0
          });

        if (error) {
          console.log('Error tracking page view:', error.message);
        } else {
          console.log('Page view tracked:', path);
        }
      } catch (error) {
        console.log('Error in trackPageView:', error);
      }
    };

    const updateTimeSpent = async () => {
      try {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        
        // Update visitor time spent
        const { error: visitorError } = await supabase
          .from('visitors')
          .update({ time_spent_seconds: timeSpent })
          .eq('session_id', sessionId);

        if (visitorError) {
          console.log('Error updating visitor time:', visitorError.message);
        }

        // Update current page view time spent
        const { error: pageError } = await supabase
          .from('page_views')
          .update({ time_spent_seconds: timeSpent })
          .eq('visitor_session_id', sessionId)
          .eq('page_path', currentPath)
          .order('created_at', { ascending: false })
          .limit(1);

        if (pageError) {
          console.log('Error updating page time:', pageError.message);
        }
      } catch (error) {
        console.log('Error in updateTimeSpent:', error);
      }
    };

    // Track initial visitor and page view
    trackVisitor();
    trackPageView(currentPath);

    // Update time spent every 30 seconds
    const timeInterval = setInterval(updateTimeSpent, 30000);

    // Track route changes
    const handleRouteChange = () => {
      updateTimeSpent(); // Update time for previous page
      currentPath = window.location.pathname;
      startTime = Date.now();
      trackPageView(currentPath); // Track new page
    };

    // Listen for route changes (for SPA navigation)
    window.addEventListener('popstate', handleRouteChange);

    // Update time spent before page unload
    const handleBeforeUnload = () => {
      updateTimeSpent();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(timeInterval);
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      updateTimeSpent(); // Final update
    };
  }, []);
};
