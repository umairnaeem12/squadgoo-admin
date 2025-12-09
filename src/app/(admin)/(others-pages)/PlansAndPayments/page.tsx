"use client";

import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import {
  BadgeCheck,
  BadgeDollarSign,
  Calendar,
  CheckCircle,
  CreditCard,
  Crown,
  Download,
  Eye,
  Filter,
  FileText,
  ShieldCheck,
  Users,
  XCircle,
  Zap,
  Rocket,
} from "lucide-react";

export default function PlansAndPayments() {
  const [filter, setFilter] = useState("all");
  const [activePlan, setActivePlan] = useState("Growth");
  const [badgeFilter, setBadgeFilter] = useState<"jobseekers" | "recruiters">(
    "jobseekers",
  );

  const plans = [
    {
      id: 1,
      name: "Starter",
      price: "$79",
      period: "month",
      description: "Perfect for freelancers or small teams just starting their hiring journey.",
      features: [
        "Up to 3 job postings",
        "Basic analytics & applicant tracking",
        "Email support",
        "Standard templates",
      ],
      popular: false,
      icon: Zap,
      color: "blue",
    },
    {
      id: 2,
      name: "Growth",
      price: "$129",
      period: "month",
      description: "Ideal for growing businesses that need smart hiring automation.",
      features: [
        "Up to 10 job postings",
        "Advanced analytics dashboard",
        "Priority email & chat support",
        "AI-powered matching",
        "Custom branding",
      ],
      popular: true,
      icon: Rocket,
      color: "purple",
    },
    {
      id: 3,
      name: "Enterprise",
      price: "$249",
      period: "month",
      description: "For enterprises and agencies hiring at scale with AI-powered matching.",
      features: [
        "Unlimited job postings",
        "Custom API integrations",
        "Dedicated account manager",
        "White-label solutions",
        "Advanced security",
        "SLA guarantee",
      ],
      popular: false,
      icon: Crown,
      color: "emerald",
    },
  ];

  const invoices = [
    {
      id: "INV-2025-001",
      user: "Ayesha Khan",
      role: "Jobseeker",
      plan: "Starter",
      amount: "$79",
      date: "10 Feb, 2025",
      status: "Paid",
      method: "Credit Card",
    },
    {
      id: "INV-2025-002",
      user: "Michael Brown",
      role: "Recruiter",
      plan: "Growth",
      amount: "$129",
      date: "15 Feb, 2025",
      status: "Pending",
      method: "PayPal",
    },
    {
      id: "INV-2025-003",
      user: "Sarah Malik",
      role: "Individual",
      plan: "Enterprise",
      amount: "$249",
      date: "20 Feb, 2025",
      status: "Paid",
      method: "Stripe",
    },
  ];

  const badgeTiers = {
    jobseekers: [
      {
        tier: "Bronze",
        price: "20 SG Coins",
        eligibility: "6 months + 2 jobs completed",
        benefits: [
          "Unlock in-app payments (quick jobs)",
          "Bronze level cancellation cover",
          "Acceptance rating reset each year",
        ],
      },
      {
        tier: "Platinum",
        price: "99 SG Coins",
        eligibility: "6 months + 4 jobs completed",
        benefits: [
          "VIP support",
          "Quick job payments from recruiters + individuals",
          "10 SG referral bonus when referrals earn badges",
        ],
      },
      {
        tier: "Gold",
        price: "199 SG Coins",
        eligibility: "12 months + 10 jobs completed",
        benefits: [
          "Acceptance rating reset every 4 months",
          "Up to 50 SG cancellation cover",
          "20 SG referral bonus",
        ],
      },
    ],
    recruiters: [
      {
        tier: "Bronze",
        price: "50 SG Coins",
        eligibility: "3 months + 2 jobs completed",
        benefits: [
          "Unlock squad hiring",
          "Enable in-app payments to jobseekers",
        ],
      },
      {
        tier: "Platinum",
        price: "100 SG Coins",
        eligibility: "6 months + 4 jobs completed",
        benefits: [
          "VIP support",
          "10% squad hiring fee discount",
          "50 SG referral bonus (external recruiters)",
        ],
      },
      {
        tier: "Gold",
        price: "200 SG Coins",
        eligibility: "8 months + 8 jobs completed",
        benefits: [
          "10% discount on each quick/manual match",
          "50% off transaction fees",
          "70 SG referral bonus (external recruiters)",
        ],
      },
    ],
  };

  const filteredInvoices =
    filter === "all"
      ? invoices
      : invoices.filter((inv) => inv.status.toLowerCase() === filter.toLowerCase());
  const tiers = badgeTiers[badgeFilter];

  const extraPurchases = [
    {
      name: "Resume / Experience Verification (PRO)",
      price: "50 SG Coins / year",
      description:
        "Manual verification service that marks jobseeker experience as verified and grants PRO badge.",
    },
    {
      name: "Squad Courier eligibility",
      price: "25 SG Coins / year",
      description:
        "Opt jobseekers into marketplace courier gigs; requires background and vehicle checks.",
    },
  ];

  const badgeApplications = [
    {
      id: "BAD-1021",
      user: "Rakesh Sharma",
      type: "Jobseeker",
      tier: "Platinum",
      submitted: "10 Feb, 2025",
      status: "Pending review",
    },
    {
      id: "BAD-1022",
      user: "TalentMatch HR",
      type: "Recruiter",
      tier: "Gold",
      submitted: "11 Feb, 2025",
      status: "Awaiting payment",
    },
  ];

  const verificationQueue = [
    {
      id: "VER-3001",
      user: "Ayesha Khan",
      type: "Resume verification",
      docs: "Bachelor degree, employer letter",
      status: "In progress",
    },
    {
      id: "VER-3002",
      user: "Squad Goo Logistics",
      type: "PRO badge renewal",
      docs: "Invoices, testimonials",
      status: "Needs attention",
    },
  ];

  const sgCoinSettings = [
    {
      label: "Jobseeker badge price change",
      value: "Pending approval",
      description: "Use this to update per-tier SG Coin pricing once finance signs off.",
    },
    {
      label: "Recruiter badge price change",
      value: "Last adjusted 01 Feb, 2025",
      description: "Link updates to marketing promotions or seasonality.",
    },
    {
      label: "Extra purchase pricing",
      value: "Resume verification: 50 SG / year",
      description: "Documented in the product doc; adjust here when PRO costs change.",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20",
      purple: "bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20",
      emerald: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="p-4 md:p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Plans, Pricing & Payments
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage your subscription plans and track payment history
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors">
            Download Reports
          </button>
          <button className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors">
            Add New Plan
          </button>
        </div>
      </div>

      {/* === Section 1: Plans & Pricing === */}
      <ComponentCard
        title="Subscription Plans"
        desc="Choose the perfect plan for your hiring needs"
        className="border-0 shadow-lg dark:shadow-xl dark:shadow-black/20"
      >
        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isActive = plan.name === activePlan;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl ${isActive
                    ? "border-blue-500 dark:border-blue-400 bg-gradient-to-br from-blue-50 to-white dark:from-blue-500/5 dark:to-gray-900 shadow-lg"
                    : "border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111418] shadow-sm"
                  }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 text-xs font-semibold rounded-full shadow-lg">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getColorClasses(plan.color)}`}>
                      <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {plan.name}
                    </h3>
                  </div>
                  {isActive && (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 rounded-full">
                      Active
                    </span>
                  )}
                </div>

                {/* Pricing */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">/{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {plan.description}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 mt-1 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Button */}
                <button
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${isActive
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                      : plan.popular
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"
                        : "bg-[#6284FF] hover:bg-blue-700 text-white shadow hover:shadow-md"
                    }`}
                >
                  {isActive ? "Current Plan" : plan.popular ? "Upgrade Now" : "Get Started"}
                </button>
              </div>
            );
          })}
        </div>
      </ComponentCard>

      {/* === Section 2: Invoices & Payments === */}
      <ComponentCard
        title="Billing History"
        desc="Track payment history and billing details for all users"
        headerRight={
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-transparent text-sm text-gray-700 dark:text-gray-300 outline-none"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        }
        className="border-0 shadow-lg dark:shadow-xl dark:shadow-black/20"
      >
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Invoice ID</th>
                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">User</th>
                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Plan</th>
                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Amount</th>
                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Method</th>
                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Date</th>
                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredInvoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white">{inv.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{inv.user}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{inv.role}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300">
                      {inv.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {inv.amount}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">{inv.method}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{inv.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${inv.status === "Paid"
                          ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400"
                          : "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                        }`}
                    >
                      {inv.status === "Paid" ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {/* <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredInvoices.length} of {invoices.length} invoices
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors">
              Next
            </button>
          </div>
        </div> */}
      </ComponentCard>

      {/* === Section 3: Account Upgrades & Extras (Admin View) === */}
      <ComponentCard
        title="Badge tiers & pricing"
        desc="Review and approve badge eligibility for each profile type."
        className="border-0 shadow-lg dark:shadow-xl dark:shadow-black/20"
      >
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Toggle between jobseekers and recruiters to inspect their badge requirements.
            </span>
            <div className="inline-flex rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-1">
              <button
                onClick={() => setBadgeFilter("jobseekers")}
                className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors ${badgeFilter === "jobseekers"
                    ? "bg-brand-500 text-white"
                    : "text-gray-600 dark:text-gray-400"
                  }`}
              >
                Jobseekers
              </button>
              <button
                onClick={() => setBadgeFilter("recruiters")}
                className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors ${badgeFilter === "recruiters"
                    ? "bg-brand-500 text-white"
                    : "text-gray-600 dark:text-gray-400"
                  }`}
              >
                Recruiters
              </button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.tier}
                className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{tier.tier}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{tier.eligibility}</p>
                  </div>
                  <span className="text-xs font-semibold text-brand-600 dark:text-brand-300">
                    {tier.price}
                  </span>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2">
                      <BadgeCheck className="mt-0.5 w-4 h-4 text-emerald-500" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Extra purchases & add-ons"
        desc="Resume verification (PRO) and other paid upgrades from the document."
        className="border-0 shadow-lg dark:shadow-xl dark:shadow-black/20"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {extraPurchases.map((extra) => (
            <div
              key={extra.name}
              className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BadgeDollarSign className="w-5 h-5 text-brand-500" />
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{extra.name}</p>
                </div>
                <span className="text-xs font-semibold text-brand-600 dark:text-brand-300">
                  {extra.price}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{extra.description}</p>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Applications & verifications"
        desc="Badge approvals and resume verification queue for admins."
        className="border-0 shadow-lg dark:shadow-xl dark:shadow-black/20"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-500" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Badge applications</p>
            </div>
            <ul className="mt-3 space-y-3">
              {badgeApplications.map((application) => (
                <li
                  key={application.id}
                  className="rounded-xl border border-gray-100 p-3 dark:border-gray-800"
                >
                  <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{application.user}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {application.type} | {application.tier}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-amber-600 dark:text-amber-300">
                      {application.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Submitted {application.submitted} - ID {application.id}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Verification queue</p>
            </div>
            <ul className="mt-3 space-y-3">
              {verificationQueue.map((verification) => (
                <li
                  key={verification.id}
                  className="rounded-xl border border-gray-100 p-3 dark:border-gray-800"
                >
                  <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{verification.user}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {verification.type}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-rose-600 dark:text-rose-300">
                      {verification.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Docs: {verification.docs}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="SG Coin pricing & policies"
        desc="Keep badge fees and add-ons aligned with the SG Coin economy."
        className="border-0 shadow-lg dark:shadow-xl dark:shadow-black/20"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {sgCoinSettings.map((setting) => (
            <div
              key={setting.label}
              className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <p className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500">
                {setting.label}
              </p>
              <p className="mt-2 text-base font-semibold text-gray-900 dark:text-white">
                {setting.value}
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {setting.description}
              </p>
            </div>
          ))}
        </div>
      </ComponentCard>
    </div>
  );
}
