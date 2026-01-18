import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Privacy() {
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
        <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground text-lg">
            Last updated: January 2025
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">1. Introduction</h2>
            <p className="text-muted-foreground">
              At PaperMorph, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered document editor service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">2. Information We Collect</h2>
            <h3 className="text-xl font-medium text-foreground">Personal Information</h3>
            <p className="text-muted-foreground">
              When you register for an account, we collect:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Name and email address</li>
              <li>Profile information you provide</li>
              <li>Payment information (processed securely by our payment provider)</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mt-4">Usage Information</h3>
            <p className="text-muted-foreground">
              We automatically collect certain information when you use the Service:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Device information and browser type</li>
              <li>IP address and location data</li>
              <li>Usage patterns and feature interactions</li>
              <li>Document metadata (not content)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">3. How We Use Your Information</h2>
            <p className="text-muted-foreground">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide and maintain the Service</li>
              <li>Process AI requests and improve our models</li>
              <li>Send important updates and notifications</li>
              <li>Analyze usage to improve the Service</li>
              <li>Prevent fraud and ensure security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">4. Your Document Content</h2>
            <p className="text-muted-foreground">
              Your documents are encrypted and stored securely. We do not:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Read your document content for advertising purposes</li>
              <li>Share your documents with third parties</li>
              <li>Use your content to train AI models without consent</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Document content is only processed for the specific AI features you request.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">5. Data Sharing</h2>
            <p className="text-muted-foreground">
              We may share your information with:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Service providers who assist in operating our Service</li>
              <li>Payment processors for billing purposes</li>
              <li>Law enforcement when required by law</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              We never sell your personal information to third parties.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">6. Data Security</h2>
            <p className="text-muted-foreground">
              We implement industry-standard security measures including:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>End-to-end encryption for document storage</li>
              <li>SSL/TLS encryption for data in transit</li>
              <li>Regular security audits and penetration testing</li>
              <li>Access controls and authentication</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">7. Your Rights</h2>
            <p className="text-muted-foreground">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and data</li>
              <li>Export your documents</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">8. Cookies</h2>
            <p className="text-muted-foreground">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Keep you signed in</li>
              <li>Remember your preferences</li>
              <li>Analyze usage patterns</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              You can control cookies through your browser settings.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">9. Children's Privacy</h2>
            <p className="text-muted-foreground">
              PaperMorph is not intended for users under 13 years of age. We do not knowingly collect information from children under 13.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">10. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy periodically. We will notify you of any material changes by email or through the Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">11. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@papermorph.app" className="text-primary hover:underline">
                privacy@papermorph.app
              </a>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">12. GDPR Compliance</h2>
            <p className="text-muted-foreground">
              For users in the European Economic Area, we comply with GDPR requirements. Our legal basis for processing includes:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Contract performance (providing the Service)</li>
              <li>Legitimate interests (improving the Service)</li>
              <li>Consent (marketing communications)</li>
              <li>Legal obligations (compliance requirements)</li>
            </ul>
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
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
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
