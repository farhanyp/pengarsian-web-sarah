import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { School, AtSign, Loader2, ArrowRight } from 'lucide-react';
import { FormEvent } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post('/forgot-password');
  };

  return (
    <>
      <Head title="Forgot Password" />
      <div className="flex items-center justify-center min-h-[100dvh] w-full p-6 md:p-0 relative">
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary-container/10 blur-[120px]"></div>
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-tertiary-container/10 blur-[120px]"></div>
        </div>

        <main className="relative z-10 w-full max-w-[480px]">
          {/* Branding Section */}
          <div className="flex flex-col items-center mb-3 md:mb-lg">
            <div className="mb-1 md:mb-sm text-primary">
              <School className="w-8 h-8 md:w-12 md:h-12" />
            </div>
            <h1 className="text-xl md:font-headline-md md:text-headline-md text-foreground tracking-tight font-bold">ScholarSys</h1>
            <p className="text-[10px] md:font-label-md md:text-label-md text-muted-foreground uppercase tracking-[0.2em]">Institutional Management</p>
          </div>

          {/* Main Card */}
          <section className="custom-card p-6 md:p-lg shadow-2xl bg-card rounded-xl border border-border">
            <div className="mb-6 md:mb-lg">
              <h2 className="text-lg md:font-headline-sm md:text-headline-sm font-semibold text-card-foreground mb-1">Forgot Password</h2>
              <p className="text-xs md:font-body-sm md:text-body-sm text-muted-foreground">
                Enter your institutional email address and we will send you a password reset link.
              </p>
            </div>

            {status && (
                <div className="mb-6 text-sm font-medium text-green-600 bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                    {status}
                </div>
            )}

            <form className="w-full space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-1.5 md:space-y-2">
                <label className="text-[10px] md:font-label-md md:text-label-md text-muted-foreground ml-1 font-semibold" htmlFor="email">INSTITUTIONAL EMAIL</label>
                <div className="relative group input-glow rounded-lg overflow-hidden transition-all duration-300">
                  <AtSign className="absolute left-3 md:left-base top-1/2 -translate-y-1/2 text-outline w-[18px] h-[18px] md:w-[24px] md:h-[24px]" />
                  <input
                    className={`w-full bg-muted/50 border ${errors.email ? 'border-destructive focus:border-destructive focus:ring-destructive' : 'border-border focus:border-primary focus:ring-primary'} text-foreground pl-10 pr-3 py-2 text-sm focus:ring-1 outline-none transition-colors duration-200 rounded-lg placeholder:text-muted-foreground/50`}
                    id="email"
                    placeholder="name@university.edu"
                    required
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    autoComplete="username"
                    autoFocus
                  />
                </div>
                <InputError message={errors.email} className="ml-1 mt-1" />
              </div>

              <button className="w-full text-primary-foreground text-sm font-semibold py-2.5 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 shadow-md mt-4 bg-primary disabled:opacity-70 disabled:cursor-not-allowed" type="submit" disabled={processing}>
                {processing ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" /> Sending Link...
                  </>
                ) : (
                  <>
                    Email Password Reset Link
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-border w-full text-center">
              <p className="text-sm text-muted-foreground">
                Remember your password? <Link className="text-primary font-semibold hover:underline transition-all ml-1" href="/login">Log in here</Link>
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

// Override the default layout so we can use our custom full-page design
ForgotPassword.layout = (page: React.ReactNode) => <>{page}</>;
