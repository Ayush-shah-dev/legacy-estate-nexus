
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { OTPVerification } from '@/components/OTPVerification';
import { Send, Shield } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  propertyType: string;
  budget: string;
  location: string;
  message: string;
}

interface ValidationErrors {
  [key: string]: string;
}

export function SecureContactForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    propertyType: '',
    budget: '',
    location: '',
    message: ''
  });
  
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [lastSubmissionTime, setLastSubmissionTime] = useState<number>(0);

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Name validation
    if (!formData.name.trim() || formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }
    if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      errors.name = 'Name can only contain letters and spaces';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation (Indian format)
    const phoneRegex = /^[+]?[91]?[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
      errors.phone = 'Please enter a valid Indian phone number';
    }

    // Message validation
    if (!formData.message.trim() || formData.message.length < 10) {
      errors.message = 'Message must be at least 10 characters long';
    }
    if (formData.message.length > 1000) {
      errors.message = 'Message cannot exceed 1000 characters';
    }

    // Check for potential XSS attempts
    const xssPattern = /<script|javascript:|on\w+=/i;
    Object.values(formData).forEach((value, index) => {
      if (xssPattern.test(value)) {
        const fieldName = Object.keys(formData)[index];
        errors[fieldName] = 'Invalid characters detected';
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    // Sanitize input
    const sanitizedValue = value.replace(/<script.*?>.*?<\/script>/gi, '').trim();
    
    setFormData(prev => ({
      ...prev,
      [field]: sanitizedValue
    }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleVerifyPhone = async () => {
    // Rate limiting check
    const now = Date.now();
    if (now - lastSubmissionTime < 60000) { // 1 minute cooldown
      toast({
        title: "Rate limit exceeded",
        description: "Please wait before requesting another OTP",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) {
      toast({
        title: "Validation failed",
        description: "Please fix the errors before proceeding",
        variant: "destructive",
      });
      return;
    }

    try {
      // Format phone number properly
      const formattedPhone = formData.phone.startsWith('+91') 
        ? formData.phone 
        : `+91${formData.phone.replace(/\D/g, '')}`;

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone
      });

      if (error) {
        toast({
          title: "Failed to send OTP",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setShowOTPVerification(true);
        setLastSubmissionTime(now);
        toast({
          title: "OTP Sent",
          description: "Please check your phone for the verification code",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleOTPVerified = () => {
    setPhoneVerified(true);
    setShowOTPVerification(false);
    toast({
      title: "Phone Verified",
      description: "Your phone number has been verified successfully!",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting check
    const now = Date.now();
    if (now - lastSubmissionTime < 30000) { // 30 second cooldown
      toast({
        title: "Rate limit exceeded",
        description: "Please wait before submitting again",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    if (!phoneVerified) {
      toast({
        title: "Phone verification required",
        description: "Please verify your phone number before submitting the form",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create a sanitized message
      const sanitizedMessage = `Property: ${formData.propertyType || 'Not specified'}, Budget: ${formData.budget || 'Not specified'}, Location: ${formData.location || 'Not specified'}, Message: ${formData.message}`;

      const { error } = await supabase
        .from('contact_submissions')
        .insert([{
          name: formData.name.trim(),
          email: formData.email.toLowerCase().trim(),
          phone: formData.phone.trim(),
          message: sanitizedMessage,
          phone_verified: phoneVerified
        }]);

      if (error) {
        throw error;
      }
      
      toast({
        title: "Inquiry Submitted Successfully!",
        description: "Our team will contact you within 24 hours.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        propertyType: '',
        budget: '',
        location: '',
        message: ''
      });
      setPhoneVerified(false);
      setLastSubmissionTime(now);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showOTPVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center px-4">
        <OTPVerification
          phoneNumber={formData.phone}
          onVerified={handleOTPVerified}
          onCancel={() => setShowOTPVerification(false)}
        />
      </div>
    );
  }

  return (
    <Card className="shadow-luxury">
      <CardContent className="p-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-brand-classic-gold" />
            <h2 className="text-3xl font-bold text-primary">
              Secure Contact Form
            </h2>
          </div>
          <p className="text-brand-grey">
            All submissions are verified and protected. Your information is secure with us.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Full Name *
              </label>
              <Input
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                maxLength={100}
                className={validationErrors.name ? 'border-red-500' : ''}
              />
              {validationErrors.name && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Email Address *
              </label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                maxLength={255}
                className={validationErrors.email ? 'border-red-500' : ''}
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Phone Number *
              </label>
              <div className="space-y-2">
                <Input
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                  disabled={phoneVerified}
                  maxLength={15}
                  className={validationErrors.phone ? 'border-red-500' : ''}
                />
                {validationErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                )}
                {!phoneVerified ? (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleVerifyPhone}
                    disabled={!formData.phone || !!validationErrors.phone}
                    className="w-full"
                  >
                    Verify Phone Number
                  </Button>
                ) : (
                  <div className="flex items-center text-green-600 text-sm">
                    ✓ Phone number verified
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Property Type
              </label>
              <Select value={formData.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="penthouse">Penthouse</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Budget Range
              </label>
              <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-50l">Under ₹50 Lakhs</SelectItem>
                  <SelectItem value="50l-1cr">₹50 Lakhs - ₹1 Crore</SelectItem>
                  <SelectItem value="1cr-2cr">₹1 Crore - ₹2 Crores</SelectItem>
                  <SelectItem value="2cr-5cr">₹2 Crores - ₹5 Crores</SelectItem>
                  <SelectItem value="above-5cr">Above ₹5 Crores</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Preferred Location
              </label>
              <Input
                placeholder="Enter preferred location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                maxLength={255}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Additional Requirements *
            </label>
            <Textarea
              placeholder="Tell us about your specific requirements, preferences, or any questions you have..."
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              rows={4}
              required
              maxLength={1000}
              className={validationErrors.message ? 'border-red-500' : ''}
            />
            {validationErrors.message && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.message}</p>
            )}
            <p className="text-sm text-brand-grey mt-1">
              {formData.message.length}/1000 characters
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-brand-classic-gold text-primary hover:bg-brand-soft-gold"
            disabled={isSubmitting || !phoneVerified || Object.keys(validationErrors).length > 0}
          >
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Send Secure Inquiry
              </>
            )}
          </Button>

          <p className="text-xs text-brand-grey text-center">
            Your information is protected by our security measures and will only be used to contact you about your inquiry.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
