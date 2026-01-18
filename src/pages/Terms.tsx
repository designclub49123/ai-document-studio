import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="PaperMorph" className="h-10" />
            </Link>
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground text-lg">
            Last updated: January 2025
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using PaperMorph ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">2. Description of Service</h2>
            <p className="text-muted-foreground">
              PaperMorph is an AI-powered document editor that provides intelligent writing assistance, document creation, and collaboration features. The service includes:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>AI-powered writing assistance and suggestions</li>
              <li>Document creation, editing, and storage</li>
              <li>Export functionality to various formats</li>
              <li>Cloud synchronization across devices</li>
              <li>Collaboration features (where available)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">3. User Accounts</h2>
            <p className="text-muted-foreground">
              To use certain features of the Service, you must register for an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your password</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">4. User Content</h2>
            <p className="text-muted-foreground">
              You retain ownership of any content you create using the Service. By using PaperMorph, you grant us a limited license to store and process your content solely for the purpose of providing the Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">5. AI Usage</h2>
            <p className="text-muted-foreground">
              Our AI features are provided to assist with writing and should be used as a tool, not a replacement for human judgment. You are responsible for reviewing and editing any AI-generated content before use.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">6. Subscription and Billing</h2>
            <p className="text-muted-foreground">
              Some features require a paid subscription. Billing occurs on a recurring basis, and you may cancel at any time. Refunds are provided according to our refund policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">7. Prohibited Uses</h2>
            <p className="text-muted-foreground">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit harmful or malicious content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use the service for spam or harassment</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">8. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              PaperMorph shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">9. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">10. Contact</h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@papermorph.app" className="text-primary hover:underline">
                legal@papermorph.app
              </a>
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 PaperMorph. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
