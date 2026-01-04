import Navbar from '@/components/Navbar'

export default function TermsPage() {
    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16">
                <div className="container max-w-3xl">
                    <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
                    <p className="text-gray-400 mb-8">Last updated: January 1, 2026</p>

                    <div className="prose prose-invert max-w-none space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
                            <p className="text-gray-300 leading-relaxed">
                                By accessing or using ShowWork, you agree to be bound by these Terms of Service.
                                If you disagree with any part of the terms, you may not access the service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                            <p className="text-gray-300 leading-relaxed">
                                ShowWork is a platform that allows users to create profiles, showcase their
                                projects, and connect with other developers and potential employers. We
                                provide tools to upload, manage, and share your work publicly.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
                            <ul className="list-disc list-inside text-gray-300 space-y-2">
                                <li>You must provide accurate and complete registration information</li>
                                <li>You are responsible for maintaining the security of your account</li>
                                <li>You must be at least 13 years old to use ShowWork</li>
                                <li>One person or entity may only maintain one account</li>
                                <li>You may not use another user's account without permission</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">4. User Content</h2>
                            <h3 className="text-lg font-medium mb-3 text-gray-200">Your Rights</h3>
                            <p className="text-gray-300 leading-relaxed mb-4">
                                You retain ownership of any content you submit, post, or display on ShowWork.
                                By posting content, you grant us a non-exclusive, worldwide, royalty-free
                                license to use, display, and distribute your content on our platform.
                            </p>

                            <h3 className="text-lg font-medium mb-3 text-gray-200">Content Guidelines</h3>
                            <p className="text-gray-300 mb-3">You agree not to post content that:</p>
                            <ul className="list-disc list-inside text-gray-300 space-y-2">
                                <li>Infringes on intellectual property rights</li>
                                <li>Contains malware, viruses, or harmful code</li>
                                <li>Is illegal, harassing, or discriminatory</li>
                                <li>Impersonates another person or entity</li>
                                <li>Contains spam or unauthorized advertising</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">5. Prohibited Activities</h2>
                            <p className="text-gray-300 mb-3">You may not:</p>
                            <ul className="list-disc list-inside text-gray-300 space-y-2">
                                <li>Attempt to gain unauthorized access to systems or data</li>
                                <li>Use automated means to scrape or collect data</li>
                                <li>Interfere with or disrupt the service</li>
                                <li>Create accounts through unauthorized means</li>
                                <li>Use the service for any illegal purpose</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
                            <p className="text-gray-300 leading-relaxed">
                                The ShowWork platform, including its design, features, and content (excluding
                                user content), is owned by ShowWork and protected by copyright, trademark,
                                and other intellectual property laws.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
                            <p className="text-gray-300 leading-relaxed">
                                We may terminate or suspend your account immediately, without prior notice,
                                for any reason, including breach of these Terms. Upon termination, your
                                right to use the service will cease immediately.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">8. Disclaimer of Warranties</h2>
                            <p className="text-gray-300 leading-relaxed">
                                ShowWork is provided "as is" and "as available" without warranties of any
                                kind, either express or implied. We do not guarantee that the service will
                                be uninterrupted, secure, or error-free.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
                            <p className="text-gray-300 leading-relaxed">
                                To the maximum extent permitted by law, ShowWork shall not be liable for
                                any indirect, incidental, special, consequential, or punitive damages
                                resulting from your use of the service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
                            <p className="text-gray-300 leading-relaxed">
                                We reserve the right to modify these Terms at any time. We will notify
                                users of significant changes. Your continued use of ShowWork after changes
                                constitutes acceptance of the new Terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">11. Contact</h2>
                            <p className="text-gray-300 leading-relaxed">
                                If you have questions about these Terms, please contact us at:
                            </p>
                            <p className="text-blue-400 mt-2">legal@showwork.dev</p>
                        </section>
                    </div>
                </div>
            </main>
        </>
    )
}
