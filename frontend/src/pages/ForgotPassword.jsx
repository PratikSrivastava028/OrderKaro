import { useEffect, useRef, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AUTH_ROUTES } from "../constants/endpoints";
import axiosInstance from "../lib/axios";

// ── localStorage helpers ─────────────────────────────────────────
const OTP_KEY = "ok_otp_session";

const saveOtpSession = (email, otpExpires) => {
  localStorage.setItem(OTP_KEY, JSON.stringify({ email, otpExpires }));
};

const loadOtpSession = () => {
  try {
    const raw = localStorage.getItem(OTP_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (Date.now() >= session.otpExpires) {
      localStorage.removeItem(OTP_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
};

const clearOtpSession = () => localStorage.removeItem(OTP_KEY);

// Parse "Xm Ys" from backend 429 message → remaining ms
// e.g. "Please try again after: 4m 32s" → 272000
const parseRemainingMs = (message = "") => {
  const match = message.match(/(\d+)m\s*(\d+)s/);
  if (!match) return null;
  return (parseInt(match[1]) * 60 + parseInt(match[2])) * 1000;
};
// ────────────────────────────────────────────────────────────────

function ForgotPassword() {
  const navigate = useNavigate();

  const existingSession = loadOtpSession();

  const [step, setStep] = useState(existingSession ? 2 : 1);
  const [email, setEmail] = useState(existingSession?.email ?? "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [cooldown, setCooldown] = useState(() => {
    if (!existingSession) return 0;
    return Math.ceil((existingSession.otpExpires - Date.now()) / 1000);
  });

  const timerRef = useRef(null);

  useEffect(() => {
    if (cooldown <= 0) {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [cooldown]);

  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // ── Handlers ────────────────────────────────────────────────────

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const result = await axiosInstance.post(AUTH_ROUTES.SEND_OTP, { email });
      const otpExpires = result.data.otpExpires ?? Date.now() + 5 * 60 * 1000;

      saveOtpSession(email, otpExpires);
      setCooldown(Math.ceil((otpExpires - Date.now()) / 1000));
      setStep(2);
      toast.success("OTP sent successfully");
    } catch (error) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message ?? "";

      // ── 429: OTP already active for this email ──
      // User cleared session locally but the backend OTP is still valid.
      // Parse the remaining time, restore the session, and jump to step 2.
      if (status === 429) {
        const remainingMs = parseRemainingMs(message);

        if (remainingMs && remainingMs > 0) {
          const otpExpires = Date.now() + remainingMs;
          saveOtpSession(email, otpExpires);
          setCooldown(Math.ceil(remainingMs / 1000));
          setStep(2);
          toast.info(
            "An OTP is already active for this email. Please enter it below.",
          );
        } else {
          // Remaining time couldn't be parsed or already expired — let them retry
          toast.error(
            message || "Too many requests. Please try again shortly.",
          );
        }
      } else {
        toast.error(message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    setLoading(true);
    try {
      const result = await axiosInstance.post(AUTH_ROUTES.SEND_OTP, { email });
      const otpExpires = result.data.otpExpires ?? Date.now() + 5 * 60 * 1000;

      saveOtpSession(email, otpExpires);
      setCooldown(Math.ceil((otpExpires - Date.now()) / 1000));
      setOtp("");
      toast.success("New OTP sent");
    } catch (error) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message ?? "";

      // Same 429 guard for resend too
      if (status === 429) {
        const remainingMs = parseRemainingMs(message);
        if (remainingMs && remainingMs > 0) {
          const otpExpires = Date.now() + remainingMs;
          saveOtpSession(email, otpExpires);
          setCooldown(Math.ceil(remainingMs / 1000));
          toast.info("Previous OTP is still active. Please use it.");
        } else {
          toast.error(message);
        }
      } else {
        toast.error(message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      await axiosInstance.post(AUTH_ROUTES.VERIFY_OTP, { email, otp });
      clearOtpSession();
      setStep(3);
      toast.success("OTP verified successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) return;
    setLoading(true);
    try {
      await axiosInstance.post(AUTH_ROUTES.RESET_PASSWORD, {
        email,
        password: newPassword,
      });
      clearOtpSession();
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = () => {
    clearOtpSession();
    clearInterval(timerRef.current);
    setCooldown(0);
    setOtp("");
    setStep(1);
  };

  // ── UI Helpers ──────────────────────────────────────────────────

  const stepMeta = [
    {
      title: "Forgot password?",
      subtitle:
        "No worries — enter your email and we'll send you a reset code.",
    },
    {
      title: "Check your email",
      subtitle: `We've sent a 6-digit code to ${email || "your email"}.`,
    },
    {
      title: "Create new password",
      subtitle: "Almost there! Set a strong new password for your account.",
    },
  ];

  const SpinnerIcon = () => (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8z"
      />
    </svg>
  );

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white">
      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative bg-orange-500 flex-col justify-between p-12 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "128px",
          }}
        />
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-orange-400 opacity-40" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-amber-600 opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-orange-600 opacity-20" />

        <div className="relative z-10">
          <span className="text-white text-2xl font-bold tracking-tight">
            Order<span className="text-orange-100">Karo</span>
          </span>
        </div>

        <div className="relative z-10">
          <div className="text-orange-100 text-xs font-semibold tracking-[0.2em] uppercase mb-5">
            Account Recovery
          </div>
          <h2 className="text-white text-4xl xl:text-5xl font-bold leading-tight mb-6">
            Locked
            <br />
            out? We
            <br />
            got you. 🔐
          </h2>
          <p className="text-orange-100 text-sm leading-relaxed max-w-xs">
            Reset your password in three simple steps and get back to ordering
            your favourite meals in no time.
          </p>

          <div className="flex flex-col gap-3 mt-10">
            {[
              ["01", "Enter your email"],
              ["02", "Verify with OTP"],
              ["03", "Set new password"],
            ].map(([num, label], i) => (
              <div
                key={num}
                className={`flex items-center gap-3 transition-all duration-300 ${step > i ? "opacity-100" : "opacity-40"}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${step > i ? "bg-white text-orange-500" : "bg-orange-400 text-white"}`}
                >
                  {step > i + 1 ? "✓" : num}
                </div>
                <span className="text-orange-100 text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-orange-200 text-xs tracking-widest uppercase">
          Fresh · Fast · Reliable
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center px-5 py-10 sm:px-10 lg:px-16 xl:px-24 bg-white">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-stone-900">
              Order<span className="text-orange-500">Karo</span>
            </h1>
            <p className="mt-1 text-sm text-stone-600">Account recovery</p>
          </div>

          <button
            className="flex items-center gap-1.5 text-stone-600 hover:text-orange-500 transition-colors cursor-pointer mb-8 group"
            onClick={() => navigate("/login")}
          >
            <IoIosArrowRoundBack
              size={20}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            <span className="text-xs font-medium uppercase tracking-widest">
              Back to login
            </span>
          </button>

          <div className="mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-stone-900 tracking-tight">
              {stepMeta[step - 1].title}
            </h2>
            <p className="mt-2 text-sm text-stone-600 leading-relaxed">
              {stepMeta[step - 1].subtitle}
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= s ? "bg-orange-500" : "bg-stone-100"}`}
                />
              ))}
            </div>
            <div className="flex justify-between">
              {["Email", "Verify", "Reset"].map((label, i) => (
                <span
                  key={label}
                  className={`text-[10px] font-semibold uppercase tracking-widest transition-colors ${step >= i + 1 ? "text-orange-500" : "text-stone-600"}`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-semibold text-stone-600 uppercase tracking-[0.15em] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all duration-200"
                  placeholder="your@email.com"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                />
              </div>

              <button
                className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl text-sm tracking-wide transition-all duration-200 cursor-pointer shadow-lg shadow-orange-100"
                onClick={handleSendOtp}
                disabled={loading || !email}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <SpinnerIcon /> Sending OTP…
                  </span>
                ) : (
                  "Send OTP →"
                )}
              </button>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-semibold text-stone-600 uppercase tracking-[0.15em] mb-2">
                  One-Time Password
                </label>
                <input
                  type="text"
                  maxLength={6}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 text-center text-xl tracking-[0.5em] font-bold text-stone-800 placeholder:text-stone-200 placeholder:tracking-[0.3em] focus:outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all duration-200"
                  placeholder="——————"
                  onChange={(e) => setOtp(e.target.value)}
                  value={otp}
                  required
                />

                <div className="flex justify-between items-center mt-3">
                  {cooldown > 0 ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-stone-500">Resend in</span>
                      <span className="text-xs font-bold text-orange-500 tabular-nums bg-orange-50 px-2 py-0.5 rounded-full">
                        {formatCountdown(cooldown)}
                      </span>
                    </div>
                  ) : (
                    <button
                      className="text-xs text-orange-400 hover:text-orange-500 font-medium transition-colors cursor-pointer"
                      onClick={handleResendOtp}
                      disabled={loading}
                    >
                      Resend OTP
                    </button>
                  )}
                  <button
                    className="text-xs text-stone-500 hover:text-stone-700 font-medium transition-colors cursor-pointer"
                    onClick={handleChangeEmail}
                  >
                    Change email
                  </button>
                </div>

                {cooldown > 0 && (
                  <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-start gap-2.5">
                    <span className="text-amber-500 mt-0.5 shrink-0">⏳</span>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      OTP was sent to{" "}
                      <span className="font-semibold">{email}</span>. You can
                      request a new one after the timer expires.
                    </p>
                  </div>
                )}
              </div>

              <button
                className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl text-sm tracking-wide transition-all duration-200 cursor-pointer shadow-lg shadow-orange-100"
                onClick={handleVerifyOtp}
                disabled={loading || otp.length < 6}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <SpinnerIcon /> Verifying…
                  </span>
                ) : (
                  "Verify OTP →"
                )}
              </button>

              <button
                className="w-full border border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-500 font-medium py-3 rounded-xl text-sm transition-all duration-200 cursor-pointer"
                onClick={handleChangeEmail}
              >
                ← Use a different email
              </button>
            </div>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-semibold text-stone-600 uppercase tracking-[0.15em] mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all duration-200"
                  placeholder="Min. 8 characters"
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-stone-600 uppercase tracking-[0.15em] mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className={`w-full bg-stone-50 border rounded-xl px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:bg-white focus:ring-2 transition-all duration-200 ${
                    confirmPassword && newPassword !== confirmPassword
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : confirmPassword && newPassword === confirmPassword
                        ? "border-green-300 focus:border-green-400 focus:ring-green-100"
                        : "border-stone-200 focus:border-orange-400 focus:ring-orange-100"
                  }`}
                  placeholder="Re-enter new password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  required
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-red-400 text-xs mt-1.5 font-medium">
                    Passwords do not match
                  </p>
                )}
                {confirmPassword && newPassword === confirmPassword && (
                  <p className="text-green-500 text-xs mt-1.5 font-medium">
                    Passwords match ✓
                  </p>
                )}
              </div>

              <button
                className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl text-sm tracking-wide transition-all duration-200 cursor-pointer shadow-lg shadow-orange-100"
                onClick={handleResetPassword}
                disabled={
                  loading || !newPassword || newPassword !== confirmPassword
                }
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <SpinnerIcon /> Resetting…
                  </span>
                ) : (
                  "Reset Password →"
                )}
              </button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-stone-100 text-center">
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Need help?{" "}
              <span className="text-orange-400 hover:text-orange-500 cursor-pointer transition-colors underline underline-offset-2">
                support@orderkaro.com
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
