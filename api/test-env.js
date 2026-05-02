export default function handler(req, res) {
  res.status(200).json({
    hasResendKey: !!process.env.RESEND_API_KEY,
    resendKeyPrefix: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0, 5) : 'none',
    hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
  });
}
