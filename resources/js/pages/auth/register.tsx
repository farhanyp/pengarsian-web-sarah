import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { School, User, AtSign, Lock, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';
import { FormEvent } from 'react';

export default function RegisterPage() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post('/register', {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center p-6 md:p-lg auth-bg-pattern relative">
      <Head title="Register" />
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-primary-container opacity-10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[350px] h-[350px] bg-tertiary-container opacity-10 blur-[100px] rounded-full"></div>
      </div>

      <main className="w-full max-w-[480px] z-10 animate-in fade-in duration-700 slide-in-from-bottom-4">
        <div className="flex flex-col items-center mb-2 md:mb-lg">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden flex items-center justify-center mb-2 md:mb-base border border-outline-variant shadow-lg">
            <img src="/sd-it-harapan2.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-xl md:font-headline-md md:text-headline-md text-foreground tracking-tight font-bold">ScholarSys</h1>
          <p className="text-[10px] md:font-body-sm md:text-body-sm text-muted-foreground uppercase tracking-[0.2em]">Institutional Management & Research Portal</p>
        </div>

        <div className="glass-panel bg-card p-6 md:p-lg rounded-xl shadow-2xl border border-border">
          <div className="mb-6 md:mb-lg">
            <h2 className="text-lg md:font-headline-sm md:text-headline-sm font-semibold text-card-foreground mb-1">Create an Account</h2>
            <p className="text-xs md:font-body-sm md:text-body-sm text-muted-foreground">Join our academic network and start managing data.</p>
          </div>

          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1.5 md:space-y-2">
              <label className="text-[10px] md:font-label-md md:text-label-md text-muted-foreground uppercase tracking-wider font-semibold" htmlFor="name">Full Name</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 transition-colors group-focus-within:text-primary" />
                <input 
                  className={`w-full bg-muted/50 border ${errors.name ? 'border-destructive focus:border-destructive focus:ring-destructive' : 'border-border focus:border-primary focus:ring-primary'} rounded-lg pl-10 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:ring-1 transition-all outline-none`} 
                  id="name" 
                  name="name" 
                  placeholder="Johnathan Doe" 
                  required 
                  type="text" 
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  autoComplete="name"
                  autoFocus
                />
              </div>
              <InputError message={errors.name} className="ml-1 mt-1" />
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <label className="text-[10px] md:font-label-md md:text-label-md text-muted-foreground uppercase tracking-wider font-semibold" htmlFor="email">Institutional Email</label>
              <div className="relative group">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 transition-colors group-focus-within:text-primary" />
                <input 
                  className={`w-full bg-muted/50 border ${errors.email ? 'border-destructive focus:border-destructive focus:ring-destructive' : 'border-border focus:border-primary focus:ring-primary'} rounded-lg pl-10 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:ring-1 transition-all outline-none`} 
                  id="email" 
                  name="email" 
                  placeholder="j.doe@institution.edu" 
                  required 
                  type="email" 
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  autoComplete="username"
                />
              </div>
              <InputError message={errors.email} className="ml-1 mt-1" />
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-1.5 md:space-y-2">
                <label className="text-[10px] md:font-label-md md:text-label-md text-muted-foreground uppercase tracking-wider font-semibold" htmlFor="password">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 transition-colors group-focus-within:text-primary" />
                  <input 
                    className={`w-full bg-muted/50 border ${errors.password ? 'border-destructive focus:border-destructive focus:ring-destructive' : 'border-border focus:border-primary focus:ring-primary'} rounded-lg pl-10 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:ring-1 transition-all outline-none`} 
                    id="password" 
                    name="password" 
                    placeholder="••••••••" 
                    required 
                    type="password" 
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
                <InputError message={errors.password} className="ml-1 mt-1" />
              </div>

              <div className="space-y-1.5 md:space-y-2">
                <label className="text-[10px] md:font-label-md md:text-label-md text-muted-foreground uppercase tracking-wider font-semibold" htmlFor="confirm_password">Confirm</label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 transition-colors group-focus-within:text-primary" />
                  <input 
                    className={`w-full bg-muted/50 border ${errors.password_confirmation ? 'border-destructive focus:border-destructive focus:ring-destructive' : 'border-border focus:border-primary focus:ring-primary'} rounded-lg pl-10 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:ring-1 transition-all outline-none`} 
                    id="confirm_password" 
                    name="password_confirmation" 
                    placeholder="••••••••" 
                    required 
                    type="password" 
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
                <InputError message={errors.password_confirmation} className="ml-1 mt-1" />
              </div>
            </div>

            <button 
              className="w-full text-primary-foreground text-sm font-semibold py-2.5 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 shadow-md bg-primary disabled:opacity-70 disabled:cursor-not-allowed" 
              type="submit" 
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Creating Account...
                </>
              ) : (
                <>
                  Register
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
          <div className="text-center mt-6 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Already have an account? <Link className="text-primary font-semibold hover:underline transition-all ml-1" href="/login">Login here</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

// Override the default layout so we can use our custom full-page design
RegisterPage.layout = (page: React.ReactNode) => <>{page}</>;
