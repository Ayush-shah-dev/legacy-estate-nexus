import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetRequest {
  email: string;
  resetLink: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, resetLink }: PasswordResetRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "Regal Estate <onboarding@resend.dev>",
      to: [email],
      subject: "Reset Your Password - Regal Estate",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h1 style="color: #333; text-align: center;">Reset Your Password</h1>
          <p style="color: #666; font-size: 16px;">
            You requested to reset your password for your Regal Estate account.
          </p>
          <p style="color: #666; font-size: 16px;">
            Click the button below to reset your password:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; display: inline-block;
                      font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            If you didn't request this password reset, you can safely ignore this email.
          </p>
          <p style="color: #666; font-size: 14px;">
            This link will expire in 24 hours for security reasons.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            Best regards,<br>The Regal Estate Team
          </p>
        </div>
      `,
    });

    console.log("Password reset email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-password-reset function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);