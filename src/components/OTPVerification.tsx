import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OTPVerificationProps {
  phoneNumber: string;
  onVerified: () => void;
  onCancel: () => void;
}

export function OTPVerification({ phoneNumber, onVerified, onCancel }: OTPVerificationProps) {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: 'sms'
      });

      if (error) {
        toast({
          title: "Verification Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Phone Verified",
          description: "Your phone number has been successfully verified!",
        });
        onVerified();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber
      });

      if (error) {
        toast({
          title: "Failed to resend OTP",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "OTP Sent",
          description: "A new OTP has been sent to your phone number",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Verify Your Phone Number</CardTitle>
        <CardDescription>
          We've sent a 6-digit code to {phoneNumber}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        
        <div className="flex flex-col gap-2">
          <Button 
            onClick={handleVerifyOTP} 
            disabled={isVerifying || otp.length !== 6}
            className="w-full"
          >
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleResendOTP}
            disabled={isResending}
            className="w-full"
          >
            {isResending ? "Resending..." : "Resend OTP"}
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={onCancel}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}