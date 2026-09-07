import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import VerixLogo from "@/assets/VerixLogo.svg";

const sections = [
  {
    title: "1. Introduction",
    body: [
      "Welcome to Verix, a platform for virtual numbers, SMS verification and digital products. By accessing our website, applications or services you acknowledge and agree to these Terms and Conditions together with the Privacy Policy set out below.",
      "These terms form a binding agreement between you (\u201cthe User\u201d) and Verix. If you disagree with any part of them, you must stop using the platform.",
    ],
  },
  {
    title: "2. About Verix",
    body: [
      "Verix provides temporary virtual phone numbers for receiving SMS verification codes, along with a marketplace for selected digital products. We act as an intermediary between you and our upstream number providers.",
    ],
  },
  {
    title: "3. Accounts",
    body: [
      "You must provide accurate details when registering and keep your login credentials private. You are responsible for all activity that happens under your account.",
    ],
  },
  {
    title: "4. Payments, Wallet and Refunds",
    body: [
      "Wallet funding is processed through our payment partners. Prices are shown in USD and may be charged in your local currency at checkout.",
      "If a number does not receive a verification code within the stated waiting window, the amount is automatically returned to your wallet balance. Wallet balances are not withdrawable as cash.",
    ],
  },
  {
    title: "5. Acceptable Use",
    body: [
      "You may not use Verix for fraud, spam, harassment, impersonation or any activity that breaks the law or the rules of the service you are verifying with. We may suspend accounts involved in abuse.",
    ],
  },
  {
    title: "6. Service Availability",
    body: [
      "Number availability depends on upstream providers and can change without notice. We aim for continuous uptime but do not guarantee uninterrupted service.",
    ],
  },
  {
    title: "7. Privacy Policy",
    body: [
      "This Privacy Policy explains how we handle your information when you use Verix.",
    ],
  },
  {
    title: "8. Information We Collect",
    body: [
      "We collect the email address you register with, transaction and wallet records, the numbers and services you order, and the verification messages delivered to those numbers. We also collect basic technical data such as device and browser information.",
    ],
  },
  {
    title: "9. How We Use Your Information",
    body: [
      "Your information is used to deliver orders, process payments, prevent abuse, provide support and improve the platform. We do not sell your personal data.",
    ],
  },
  {
    title: "10. Data Retention and Security",
    body: [
      "Messages received on a number are stored for a limited period and then removed. We use industry-standard security measures to protect account data.",
    ],
  },
  {
    title: "11. Changes to These Terms",
    body: [
      "We may update these terms from time to time. Continued use of the platform after an update means you accept the revised terms.",
    ],
  },
  {
    title: "12. Contact",
    body: [
      "For questions about these terms or your data, reach us through the Support page inside your dashboard.",
    ],
  },
];

const LegalPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} size={18} />
          Back to home
        </Link>

        <header className="mt-10 flex flex-col items-center text-center">
          <img src={VerixLogo} alt="Verix logo" className="h-12 w-auto" />
          <h1 className="mt-6 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
            Verix Terms and Conditions with Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: 7th September 2026
          </p>
        </header>

        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <section key={section.title} className="space-y-3">
              <h2 className="text-lg font-bold sm:text-xl">{section.title}</h2>
              {section.body.map((paragraph, i) => (
                <p
                  key={i}
                  className="max-w-[70ch] text-[15px] leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        <p className="mt-14 border-t border-border pt-6 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Verix. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LegalPage;
