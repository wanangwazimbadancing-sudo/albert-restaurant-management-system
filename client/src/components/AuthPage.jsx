import { useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";

function AuthField({ label, type = "text", value, onChange, placeholder, autoComplete, icon: Icon, rightIcon }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-neutral-700">{label}</span>
      <div className="flex w-90 items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-3 transition">
        {Icon && <Icon className="h-4 w-4 text-neutral-500" />}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full bg-transparent text-sm text-neutral-800 placeholder-neutral-400 outline-none"
        />
        {rightIcon}
      </div>
    </label>
  );
}

export function AuthPage({ onLogin, onForgotPassword, onResetPassword }) {
  const resetToken = new URLSearchParams(window.location.search).get("resetToken");
  const [mode, setMode] = useState(resetToken ? "reset" : "login");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    remember: true,
  });
  const [error, setError] = useState("");

  const isLogin = mode === "login";
  const isForgot = mode === "forgot";
  const isReset = mode === "reset";

  const handleChange = (field) => (event) => {
    const value = field === "remember" ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (isForgot && typeof onForgotPassword === "function") {
      try {
        await onForgotPassword(form.email);
        setError("If an account exists for that email, a reset link has been sent.");
      } catch (submitError) {
        setError(
          submitError.response?.data?.errors?.[0]?.msg ||
            submitError.response?.data?.message ||
            "Unable to request a password reset.",
        );
      }
    } else if (isReset && typeof onResetPassword === "function") {
      try {
        await onResetPassword(resetToken, form.password);
        setMode("login");
        setError("Password reset successfully. You can now sign in.");
        window.history.replaceState({}, "", "/auth");
      } catch (submitError) {
        setError(submitError.response?.data?.message || "Unable to reset your password.");
      }
    } else if (typeof onLogin === "function") {
      try {
        await onLogin(form, mode);
      } catch (submitError) {
        setError(submitError.message || "Unable to authenticate.");
      }
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-6">
      <div className="w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white">
        <div className="flex w-full flex-col items-center justify-center p-6 sm:p-8 md:p-10">
          <div className="mt-8 w-full max-w-md text-center">

            <h2 className="mt-3 text-3xl font-medium text-neutral-900">
              {isReset ? "Choose a new password" : isForgot ? "Reset your password" : isLogin ? "Sign in to continue" : "Create your account"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 w-full max-w-md space-y-4">
            {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            {!isLogin && !isForgot && !isReset && (
              <AuthField
                label="Full name"
                value={form.name}
                onChange={handleChange("name")}
                placeholder="Enter your full name"
                autoComplete="name"
                icon={UserRound}
              />
            )}

            {!isReset && (
              <AuthField
              label="Email address"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              placeholder="you@example.com"
              autoComplete="email"
              icon={Mail}
              />
            )}

            {!isForgot && (
              <AuthField
                label="Password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange("password")}
                placeholder="Enter your password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                icon={LockKeyhole}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-neutral-500 transition hover:text-neutral-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
            )}

            {isLogin && (
              <div className="flex items-center justify-between gap-3 text-sm text-neutral-600">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.remember}
                    onChange={handleChange("remember")}
                    className="h-4 w-4 rounded border-neutral-300 text-[#13211A] focus:ring-[#13211A]"
                  />
                  Remember me
                </label>
                <button type="button" onClick={() => setMode("forgot")} className="font-medium text-neutral-700 transition hover:text-neutral-900">
                  Forgot password?
                </button>
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                className="flex w-[200px] items-center justify-center gap-2 rounded-full bg-black py-3 font-sm text-white transition hover:-translate-y-0.5"
              >
                {isReset ? "Reset password" : isForgot ? "Send reset link" : isLogin ? "Sign in" : "Create account"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500">
            {isForgot || isReset ? "Remember your password?" : isLogin ? "Need an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={() => setMode(isForgot || isReset || !isLogin ? "login" : "signup")}
              className="font-semibold text-blue-600 transition hover:text-blue-800"
            >
              {isForgot || isReset || !isLogin ? "Sign in" : "Create one"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
