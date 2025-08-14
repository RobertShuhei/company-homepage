// src/app/privacy/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Global Genex Inc.',
  description:
    'Global Genex Inc. privacy policy explaining how we collect, use, protect, and manage personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <section className="bg-navy text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-slate-300 text-lg">Last updated: August 14, 2025</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg max-w-none">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-navy mb-4">Introduction</h2>
            <p className="text-gray leading-relaxed mb-4">
              Global Genex Inc. (“we,” “our,” or “us”) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your
              information when you visit our website or use our services.
            </p>
            <p className="text-gray leading-relaxed">
              By using our services, you agree to this policy. If you do not agree, please do not use our services.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-navy mb-4">Information We Collect</h2>
            <h3 className="text-xl font-semibold text-navy mb-3">Personal Information</h3>
            <p className="text-gray leading-relaxed mb-4">We may collect personal information that you voluntarily provide when you:</p>
            <ul className="list-disc list-inside text-gray mb-6 space-y-2">
              <li>Contact us through website forms</li>
              <li>Subscribe to our communications</li>
              <li>Request information about our services</li>
              <li>Schedule consultations</li>
              <li>Participate in surveys or feedback</li>
            </ul>

            <h3 className="text-xl font-semibold text-navy mb-3">Usage & Cookies</h3>
            <p className="text-gray leading-relaxed mb-4">
              We may collect usage data (e.g., pages visited, browser type) and use cookies or similar technologies to improve our services.
              You can control cookie settings in your browser, but disabling cookies may limit certain features.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-navy mb-4">How We Use Information</h2>
            <ul className="list-disc list-inside text-gray space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Respond to inquiries and support requests</li>
              <li>Send administrative or marketing communications (with consent)</li>
              <li>Analyze usage to enhance user experience and security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-navy mb-4">Sharing & Disclosure</h2>
            <p className="text-gray leading-relaxed">
              We do not sell your personal information. We may share it with service providers who assist our operations,
              in connection with business transfers, or when required by law. We take reasonable measures to ensure appropriate safeguards.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-navy mb-4">Data Security & Retention</h2>
            <p className="text-gray leading-relaxed">
              We implement technical and organizational measures to protect information. We retain personal information only as long as necessary
              for the purposes described in this policy or as required by law, after which we delete or anonymize it.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-navy mb-4">International Transfers</h2>
            <p className="text-gray leading-relaxed">
              Your information may be processed in countries other than your own. We ensure such transfers comply with applicable data protection laws and include appropriate safeguards.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-navy mb-4">Your Rights</h2>
            <ul className="list-disc list-inside text-gray space-y-2">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request a copy in a structured format</li>
              <li><strong>Restriction/Objection:</strong> Request restriction or object to processing</li>
            </ul>
            <p className="text-gray leading-relaxed mt-4">
              To exercise these rights, contact us using the details below. We will respond within a reasonable timeframe in accordance with applicable laws.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-navy mb-4">Children’s Privacy</h2>
            <p className="text-gray leading-relaxed">
              Our services are not intended for individuals under 18. If we become aware that we collected information from a child under 18, we will delete it promptly.
            </p>
          </div>

          <div className="mb-12 bg-slate-50 p-8 rounded-xl">
            <h2 className="text-2xl font-bold text-navy mb-4">Contact Us</h2>
            <p className="text-gray leading-relaxed mb-4">
              If you have questions, concerns, or requests about this Privacy Policy or our data practices, please contact:
            </p>
            <div className="text-gray space-y-2">
              <p><strong>Email:</strong> info@global-genex.com</p>
              <p><strong>Phone:</strong> +81 (0)70-8361-4870</p>
              <p className="leading-relaxed">
                <strong>Address:</strong><br />
                Global Genex Inc.<br />
                1-23-2 HakataEkimae<br />
                Hakata-ku<br />
                Fukuoka, Japan
              </p>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-navy mb-4">Updates to This Policy</h2>
            <p className="text-gray leading-relaxed">
              We may update this policy from time to time. We will post the updated policy and revise the “Last updated” date above. Your continued use constitutes acceptance of the updated policy.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
