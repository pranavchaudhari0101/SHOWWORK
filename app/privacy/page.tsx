import Navbar from '@/components/Navbar'

export default function PrivacyPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16">
                <div className="container max-w-3xl">
                    <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
                    <p className="text-gray-400 mb-8">Last updated: January 1, 2026</p>

                    <div className="prose prose-invert max-w-none space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                            <p className="text-gray-300 leading-relaxed">
                                ShowWork ("we," "our," or "us") is committed to protecting your privacy.
                                This Privacy Policy explains how we collect, use, disclose, and safeguard
                                your information when you use our platform.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                            <h3 className="text-lg font-medium mb-3 text-gray-200">Information You Provide</h3>
                            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                                <li>Account information (name, email, username)</li>
                                <li>Profile information (bio, avatar, social links)</li>
                                <li>Project content (titles, descriptions, images)</li>
                                <li>Communications with us</li>
                            </ul>

                            <h3 className="text-lg font-medium mb-3 text-gray-200">Automatically Collected Information</h3>
                            <ul className="list-disc list-inside text-gray-300 space-y-2">
                                <li>Device and browser information</li>
                                <li>IP address and location data</li>
                                <li>Usage patterns and analytics</li>
                                <li>Cookies and similar technologies</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                            <p className="text-gray-300 mb-3">We use your information to:</p>
                            <ul className="list-disc list-inside text-gray-300 space-y-2">
                                <li>Provide, maintain, and improve our services</li>
                                <li>Process your account and authenticate you</li>
                                <li>Display your public profile and projects</li>
                                <li>Send you updates and notifications</li>
                                <li>Analyze usage to improve user experience</li>
                                <li>Detect and prevent fraud or abuse</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">4. Information Sharing</h2>
                            <p className="text-gray-300 leading-relaxed mb-4">
                                We do not sell your personal information. We may share your information in
                                the following circumstances:
                            </p>
                            <ul className="list-disc list-inside text-gray-300 space-y-2">
                                <li><strong>Public Content:</strong> Your profile and published projects are visible to everyone</li>
                                <li><strong>Service Providers:</strong> Third parties who help us operate our platform</li>
                                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                                <li><strong>Business Transfers:</strong> In connection with a merger or acquisition</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
                            <p className="text-gray-300 leading-relaxed">
                                We implement appropriate technical and organizational measures to protect
                                your information. However, no method of transmission over the Internet is
                                100% secure, and we cannot guarantee absolute security.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
                            <p className="text-gray-300 mb-3">You have the right to:</p>
                            <ul className="list-disc list-inside text-gray-300 space-y-2">
                                <li>Access and download your data</li>
                                <li>Correct inaccurate information</li>
                                <li>Delete your account and associated data</li>
                                <li>Opt out of marketing communications</li>
                                <li>Restrict or object to processing</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
                            <p className="text-gray-300 leading-relaxed">
                                We use cookies and similar technologies to maintain your session,
                                remember your preferences, and analyze how our platform is used.
                                You can control cookies through your browser settings.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
                            <p className="text-gray-300 leading-relaxed">
                                If you have questions about this Privacy Policy, please contact us at:
                            </p>
                            <p className="text-blue-400 mt-2">privacy@showwork.dev</p>
                        </section>
                    </div>
                </div>
            </main>
        </>
    )
}
