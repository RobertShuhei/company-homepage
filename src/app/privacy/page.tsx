import { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy | Corporate Solutions',
  description: 'Corporate Solutions privacy policy explaining how we collect, use, protect, and manage your personal information and data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Header Section */}
        <section className="bg-navy text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-slate-300">
              Last updated: August 12, 2025
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              {/* Introduction */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-navy mb-4">Introduction</h2>
                <p className="text-gray leading-relaxed mb-4">
                  Corporate Solutions (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
                </p>
                <p className="text-gray leading-relaxed">
                  By accessing or using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
                </p>
              </div>

              {/* Information We Collect */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-navy mb-4">Information We Collect</h2>
                
                <h3 className="text-xl font-semibold text-navy mb-3">Personal Information</h3>
                <p className="text-gray leading-relaxed mb-4">
                  We may collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc list-inside text-gray mb-6 space-y-2">
                  <li>Contact us through our website forms</li>
                  <li>Subscribe to our newsletter or communications</li>
                  <li>Request information about our services</li>
                  <li>Schedule consultations or meetings</li>
                  <li>Participate in surveys or feedback forms</li>
                </ul>

                <h3 className="text-xl font-semibold text-navy mb-3">Automatically Collected Information</h3>
                <p className="text-gray leading-relaxed mb-4">
                  When you visit our website, we may automatically collect certain information about your device and usage patterns:
                </p>
                <ul className="list-disc list-inside text-gray mb-6 space-y-2">
                  <li>IP address and location information</li>
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Pages visited and time spent on our site</li>
                  <li>Referring website information</li>
                  <li>Device characteristics and preferences</li>
                </ul>
              </div>

              {/* How We Use Information */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-navy mb-4">How We Use Your Information</h2>
                <p className="text-gray leading-relaxed mb-4">
                  We use the information we collect for various purposes, including:
                </p>
                <ul className="list-disc list-inside text-gray mb-6 space-y-2">
                  <li>Providing, maintaining, and improving our services</li>
                  <li>Responding to your inquiries and requests</li>
                  <li>Sending administrative information and updates</li>
                  <li>Personalizing your experience on our website</li>
                  <li>Analyzing website usage and performance</li>
                  <li>Detecting and preventing fraud or security threats</li>
                  <li>Complying with legal obligations</li>
                  <li>Protecting our rights and interests</li>
                </ul>
              </div>

              {/* Information Sharing */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-navy mb-4">Information Sharing and Disclosure</h2>
                <p className="text-gray leading-relaxed mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
                </p>

                <h3 className="text-xl font-semibold text-navy mb-3">Service Providers</h3>
                <p className="text-gray leading-relaxed mb-4">
                  We may share information with trusted third-party service providers who assist us in operating our website, conducting business, or serving our clients, provided they agree to keep information confidential.
                </p>

                <h3 className="text-xl font-semibold text-navy mb-3">Legal Requirements</h3>
                <p className="text-gray leading-relaxed mb-4">
                  We may disclose your information if required to do so by law or in response to valid requests by public authorities.
                </p>

                <h3 className="text-xl font-semibold text-navy mb-3">Business Transfers</h3>
                <p className="text-gray leading-relaxed mb-6">
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
                </p>
              </div>

              {/* Data Security */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-navy mb-4">Data Security</h2>
                <p className="text-gray leading-relaxed mb-4">
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="list-disc list-inside text-gray mb-4 space-y-2">
                  <li>Encryption of sensitive data during transmission</li>
                  <li>Secure servers and data storage systems</li>
                  <li>Regular security assessments and updates</li>
                  <li>Limited access to personal information on a need-to-know basis</li>
                  <li>Employee training on privacy and security practices</li>
                </ul>
                <p className="text-gray leading-relaxed">
                  However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                </p>
              </div>

              {/* Cookies and Tracking */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-navy mb-4">Cookies and Tracking Technologies</h2>
                <p className="text-gray leading-relaxed mb-4">
                  Our website may use cookies and similar tracking technologies to enhance your browsing experience. Cookies are small data files stored on your device that help us:
                </p>
                <ul className="list-disc list-inside text-gray mb-4 space-y-2">
                  <li>Remember your preferences and settings</li>
                  <li>Analyze website traffic and usage patterns</li>
                  <li>Provide personalized content and advertisements</li>
                  <li>Improve website functionality and performance</li>
                </ul>
                <p className="text-gray leading-relaxed">
                  You can control cookie settings through your browser preferences. However, disabling cookies may limit your ability to use certain features of our website.
                </p>
              </div>

              {/* Your Rights */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-navy mb-4">Your Privacy Rights</h2>
                <p className="text-gray leading-relaxed mb-4">
                  Depending on your location, you may have certain rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-gray mb-4 space-y-2">
                  <li><strong>Access:</strong> Request access to your personal information</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request a copy of your information in a structured format</li>
                  <li><strong>Restriction:</strong> Request restriction of processing your information</li>
                  <li><strong>Objection:</strong> Object to processing of your personal information</li>
                </ul>
                <p className="text-gray leading-relaxed">
                  To exercise these rights, please contact us using the information provided below. We will respond to your request within a reasonable timeframe and in accordance with applicable laws.
                </p>
              </div>

              {/* Data Retention */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-navy mb-4">Data Retention</h2>
                <p className="text-gray leading-relaxed">
                  We retain personal information only for as long as necessary to fulfill the purposes for which it was collected, including legal, accounting, or reporting requirements. When information is no longer needed, we securely delete or anonymize it in accordance with our data retention policies.
                </p>
              </div>

              {/* International Transfers */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-navy mb-4">International Data Transfers</h2>
                <p className="text-gray leading-relaxed">
                  Your information may be transferred to and processed in countries other than your country of residence. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.
                </p>
              </div>

              {/* Third-Party Links */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-navy mb-4">Third-Party Links</h2>
                <p className="text-gray leading-relaxed">
                  Our website may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
                </p>
              </div>

              {/* Children's Privacy */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-navy mb-4">Children&apos;s Privacy</h2>
                <p className="text-gray leading-relaxed">
                  Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected information from a child under 18, we will take steps to delete such information promptly.
                </p>
              </div>

              {/* Policy Updates */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-navy mb-4">Updates to This Policy</h2>
                <p className="text-gray leading-relaxed">
                  We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by posting the updated policy on our website and updating the &quot;Last updated&quot; date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
                </p>
              </div>

              {/* Contact Information */}
              <div className="mb-12 bg-slate-50 p-8 rounded-xl">
                <h2 className="text-2xl font-bold text-navy mb-4">Contact Us</h2>
                <p className="text-gray leading-relaxed mb-4">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="text-gray space-y-2">
                  <p><strong>Email:</strong> privacy@corporate-solutions.com</p>
                  <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                  <p><strong>Address:</strong><br />
                    Corporate Solutions<br />
                    123 Business District<br />
                    Suite 400<br />
                    Professional City, PC 12345
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}