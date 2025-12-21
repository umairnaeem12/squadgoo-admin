import { Suspense } from "react";
import DisputeResolutionClient from "./DisputeResolutionClient";

export default function DisputeResolutionPage() {
  return (
    <Suspense fallback={<div className="p-4 text-sm text-gray-500">Loading disputes...</div>}>
      <DisputeResolutionClient />
    </Suspense>
  );
}
