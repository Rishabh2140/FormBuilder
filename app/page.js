import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Sparkles, Shield, Zap, BarChart3, Users } from 'lucide-react';

export default function Home() {
  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 sm:py-28 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-fadeIn">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Innovation Cell, NIT Raipur</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Goodbye Google Forms, Hello{' '}
                <span className="gradient-text">NIT Raipur Form Builder</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-2 leading-relaxed">
                Effortlessly create and analyze AI-powered forms for NIT Raipur clubs, committees, and events.
              </p>
              <div className="mb-8">
                <div className="text-base text-foreground font-semibold">Tinker, Ideate & Innovate</div>
                <div className="text-sm text-muted-foreground">&quot;A paradise for DIYers and Innovators&quot;</div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="gradient-button shadow-lg hover:shadow-xl transition-all">
                    Start Making Forms
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="hover:bg-accent transition-all">
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border">
                <div>
                  <p className="text-2xl font-bold text-foreground">AI Powered</p>
                  <p className="text-sm text-muted-foreground">Smart Forms</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">Instant</p>
                  <p className="text-sm text-muted-foreground">Deployment</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">Real-time</p>
                  <p className="text-sm text-muted-foreground">Analytics</p>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative hidden lg:block">
              <div className="glass-card p-8 rounded-2xl animate-fadeIn flex items-center justify-center">
                <Image 
                  src="/icell_dark.png" 
                  width={350} 
                  height={350} 
                  alt="Innovation Cell Logo"
                  className="object-contain"
                />
              </div>
              <div className="mt-6 space-y-4">
                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-border">
                    <div className="h-4 bg-gradient-to-r from-primary to-blue-400 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-border">
                    <div className="h-4 bg-gradient-to-r from-secondary to-blue-300 rounded w-2/3 mb-3"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-primary/20 p-3 rounded-lg text-center">
                      <p className="text-xs text-primary font-semibold">5 Forms</p>
                    </div>
                    <div className="flex-1 bg-green-100 dark:bg-green-900/30 p-3 rounded-lg text-center">
                      <p className="text-xs text-green-700 dark:text-green-400 font-semibold">124 Responses</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed specifically for academic institutions and student organizations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="modern-card p-6 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Creation</h3>
              <p className="text-muted-foreground">
                Describe your form and let AI generate the perfect structure instantly
              </p>
            </div>

            {/* Feature 2 */}
            <div className="modern-card p-6 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-muted-foreground">
                Your data is protected with enterprise-grade security measures
              </p>
            </div>

            {/* Feature 3 */}
            <div className="modern-card p-6 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Analytics</h3>
              <p className="text-muted-foreground">
                Track responses and analyze data with powerful insights
              </p>
            </div>

            {/* Feature 4 */}
            <div className="modern-card p-6 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Sharing</h3>
              <p className="text-muted-foreground">
                Share forms instantly with unique links and QR codes
              </p>
            </div>

            {/* Feature 5 */}
            <div className="modern-card p-6 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Customizable Themes</h3>
              <p className="text-muted-foreground">
                Match your brand with beautiful, ready-to-use themes
              </p>
            </div>

            {/* Feature 6 */}
            <div className="modern-card p-6 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Export Data</h3>
              <p className="text-muted-foreground">
                Download responses as CSV for further processing
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Transform Your Form Management?
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Join Innovation Cell and start creating intelligent forms today
          </p>
          <Link href="/dashboard">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-primary hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all"
            >
              Get Started - It&apos;s Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Image src="/icell-coloured-logo.webp" width={45} height={45} alt="Innovation Cell" />
              <div>
                <p className="font-semibold text-foreground">Form Builder</p>
                <p className="text-sm text-muted-foreground">Innovation Cell, NIT Raipur</p>
              </div>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/dashboard" className="hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link href="/dashboard/responses" className="hover:text-foreground transition-colors">
                Responses
              </Link>
              <a 
                href="https://github.com/codeforlifeee/FormBuilder_NITRR" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2025 Innovation Cell, NIT Raipur. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}