"use client";

import ComponentCard from "@/components/common/ComponentCard";
import {
  AlertTriangle,
  Boxes,
  CreditCard,
  Flag,
  Handshake,
  List,
  Scale,
  ShoppingBasket,
  Truck,
} from "lucide-react";

const listingSteps = [
  "Seller opens Marketplace -> List Now",
  "Select listing type (vehicle, property, items, etc.)",
  "Upload photos, fill categories, pricing, delivery options",
  "Submit for review (few minutes to one hour)",
  "Once approved, listing hits the feed / search results",
];

const buyerActions = [
  { title: "Chat", detail: "Request to message seller. Chat persists beyond 30 days unlike labour chats." },
  { title: "Hold listing", detail: "Temporarily reserve item (30 mins free, then 5 SG per extra 30 mins, requires wallet balance)." },
  { title: "Buy item", detail: "SG Coins moved to hold until both parties confirm delivery/pickup (plus 7-day dispute buffer)." },
];

const disputeReasons = [
  "Item faulty / not as described",
  "Seller/buyer requesting payment outside platform",
  "Courier issues (for Squad Courier jobs)",
  "Delivery never arrived / payment never released",
];

const fees = [
  { label: "Seller transaction fee", value: "0.2% of price, capped at 100 SG" },
  { label: "Individual manual search", value: "2% cap at 10 SG" },
  { label: "Individual quick search", value: "5% cap at 15 SG" },
  { label: "Hold listing charge", value: "5 SG per additional 30 mins after free window" },
];

const pendingListings = [
  {
    id: "LIST-5001",
    seller: "Shehroz Motors",
    type: "Vehicle",
    price: "5,000 SG",
    submitted: "18 Feb, 2025",
    status: "Awaiting review",
  },
  {
    id: "LIST-5002",
    seller: "Mia Collins",
    type: "Home services",
    price: "450 SG",
    submitted: "19 Feb, 2025",
    status: "Needs photo proof",
  },
];

const courierAssignments = [
  {
    jobId: "COURIER-701",
    courier: "Squad Courier #239",
    pickup: "Shehroz Motors, Melbourne",
    dropoff: "Mia Collins, Fitzroy",
    status: "In transit",
    fee: "68 SG",
  },
  {
    jobId: "COURIER-702",
    courier: "Squad Courier #118",
    pickup: "Tech Tools, Sydney",
    dropoff: "Rakesh Sharma, Parramatta",
    status: "Pending pickup",
    fee: "42 SG",
  },
];

export default function MarketplaceControlPage() {
  return (
    <div className="p-2 md:p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Marketplace Control
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Admin view covering listing moderation, dispute flows, SG Coin fees
          and Squad Courier escalation per the SquadGoo doc.
        </p>
      </div>

      <ComponentCard
        title="Listing lifecycle"
        desc="Reference for moderation + automation hooks."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <List className="w-5 h-5 text-brand-500" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Seller steps
              </p>
            </div>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-gray-700 dark:text-gray-300">
              {listingSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <ShoppingBasket className="w-5 h-5 text-emerald-500" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Buyer actions
              </p>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              {buyerActions.map((action) => (
                <li key={action.title}>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {action.title}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {action.detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Fees & holds"
        desc="Documenting the SG Coin economics so finance + support can cross-check."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {fees.map((fee) => (
            <div
              key={fee.label}
              className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                {fee.label}
              </p>
              <p className="mt-2 text-base font-semibold text-gray-900 dark:text-white">
                {fee.value}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Refunds return principal SG Coins but not the platform fee (per doc).
        </p>
      </ComponentCard>

      <ComponentCard
        title="Dispute resolution centre"
        desc="Maps to the doc's flow: submit reason, status, expectations, evidence, mediator chat."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-500" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Complaint reasons
              </p>
            </div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700 dark:text-gray-300">
              {disputeReasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200">
            <div className="flex items-center gap-2">
              <Flag className="w-5 h-5 text-rose-500" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Mediator workflow
              </p>
            </div>
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              <li>{`Complaint submitted -> equivalent SG Coins put on hold.`}</li>
              <li>Mediator opens shared chat with buyer + seller + courier (if any).</li>
              <li>
                Parties upload evidence (images, invoices, courier receipts) within the
                assigned window.
              </li>
              <li>Mediator issues decision; parties can appeal twice with new evidence.</li>
            </ol>
          </div>
        </div>
        <p className="mt-4 flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
          <AlertTriangle className="mt-0.5 h-4 w-4 text-warning-500" />
          <span>
            During disputes, SG Coins cannot be withdrawn/spent. Mediators may
            re-route funds (refund buyer or fine seller/buyer) based on final decision.
          </span>
        </p>
      </ComponentCard>

      <ComponentCard
        title="Squad Courier oversight"
        desc="Connects buyer/seller delivery requests to courier quick jobs."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-orange-500" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Fee structure
              </p>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li>Basic charge: 10 SG minimum</li>
              <li>{`Per-km charge: 1 SG per 5 km (home -> seller -> buyer)`}</li>
              <li>Platform fee: 0.2% on courier transaction</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <Handshake className="w-5 h-5 text-emerald-500" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Admin levers
              </p>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>Approve which courier jobseekers can accept marketplace runs.</li>
              <li>Pause courier matching by region if disputes spike.</li>
              <li>Escalate to Customer Service for manual intervention.</li>
            </ul>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Support tooling"
        desc="Links marketplace issues with admin back office."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <Boxes className="w-5 h-5 text-sky-500" />
            <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
              Listing moderation
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Staff can bulk-approve or reject listings, request extra documents,
              and suspend users attempting to bypass SG Coin flows.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <CreditCard className="w-5 h-5 text-amber-500" />
            <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
              Wallet integration
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Marketplace payouts/holds feed into Admin Wallet so finance can
              audit SG Coin movements and trigger refunds or fines.
            </p>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Listings awaiting moderation"
        desc="Actionable table for pending listings; matches doc requirement for admin review."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3 font-medium">Listing ID</th>
                <th className="px-4 py-3 font-medium">Seller</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Submitted</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {pendingListings.map((listing) => (
                <tr key={listing.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                    {listing.id}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{listing.seller}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{listing.type}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white">{listing.price}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{listing.submitted}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{listing.status}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
                        Approve
                      </button>
                      <button className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
                        Request edits
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Courier assignments"
        desc="Monitor Squad Courier jobs triggered from the marketplace."
      >
        <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-700 dark:text-gray-300">
          {courierAssignments.map((assignment) => (
            <div
              key={assignment.jobId}
              className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-center justify-between text-gray-900 dark:text-white">
                <p className="text-sm font-semibold">{assignment.jobId}</p>
                <span className="text-xs font-medium text-brand-600 dark:text-brand-300">
                  {assignment.status}
                </span>
              </div>
              <p className="mt-1 text-sm">Courier: {assignment.courier}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Pickup: {assignment.pickup}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Dropoff: {assignment.dropoff}
              </p>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Fee: {assignment.fee}</p>
            </div>
          ))}
        </div>
      </ComponentCard>
    </div>
  );
}
