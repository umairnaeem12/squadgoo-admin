import { NextRequest, NextResponse } from "next/server";
import type { Individual } from "@/types/user-management";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const filters = {
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "all",
    kycStatus: searchParams.get("kycStatus") || "all",
    dateFrom: searchParams.get("dateFrom") || "",
    dateTo: searchParams.get("dateTo") || "",
    sortField: searchParams.get("sortField") || "createdAt",
    sortDirection: searchParams.get("sortDirection") || "desc",
    page: parseInt(searchParams.get("page") || "1"),
    limit: parseInt(searchParams.get("limit") || "10"),
  };

  // Mock data
  const mockIndividuals: Individual[] = Array.from({ length: 38 }, (_, i) => {
    const statuses: Array<"active" | "inactive" | "suspended" | "pending-deletion"> = ["active", "active", "active", "inactive"];
    const kycStatuses: Array<"verified" | "pending" | "rejected"> = ["verified", "verified", "pending"];
    const locations = ["Sydney, NSW", "Melbourne, VIC", "Brisbane, QLD", "Perth, WA", "Adelaide, SA", "Canberra, ACT"];
    const names = ["Rakesh", "Mia", "Liam", "Sophia", "Noah", "Olivia", "James", "Emma", "Lucas", "Ava"];
    const lastNames = ["Sharma", "Collins", "Nguyen", "Brown", "Wilson", "Taylor", "Anderson", "Thomas", "Moore", "Martin"];
    
    const createdDate = new Date(2024, 3 + (i % 9), 1 + i);
    
    return {
      id: `IND-${3001 + i}`,
      firstName: names[i % names.length],
      lastName: lastNames[i % lastNames.length],
      email: `individual${i + 1}@example.com`,
      phone: `+61 ${String(4123456789 + i).slice(0, 10)}`,
      role: "individual",
      status: statuses[i % statuses.length],
      createdAt: createdDate.toISOString(),
      updatedAt: new Date(createdDate.getTime() + 1000 * 60 * 60 * 24 * 20).toISOString(),
      lastActive: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 10).toISOString(),
      location: locations[i % locations.length],
      kycStatus: kycStatuses[i % kycStatuses.length],
      totalGigs: Math.floor(Math.random() * 20),
      walletBalance: Math.floor(Math.random() * 500) + 50,
    };
  });

  let filtered = mockIndividuals;

  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      (ind) =>
        ind.firstName.toLowerCase().includes(search) ||
        ind.lastName.toLowerCase().includes(search) ||
        ind.email.toLowerCase().includes(search) ||
        ind.id.toLowerCase().includes(search)
    );
  }

  if (filters.status !== "all") {
    filtered = filtered.filter((ind) => ind.status === filters.status);
  }

  if (filters.kycStatus !== "all") {
    filtered = filtered.filter((ind) => ind.kycStatus === filters.kycStatus);
  }

  const total = filtered.length;
  const startIndex = (filters.page - 1) * filters.limit;
  const endIndex = startIndex + filters.limit;
  const paginated = filtered.slice(startIndex, endIndex);

  return NextResponse.json({
    success: true,
    data: paginated,
    pagination: {
      page: filters.page,
      limit: filters.limit,
      total,
      totalPages: Math.ceil(total / filters.limit),
    },
  });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, ...updates } = body;

  return NextResponse.json({
    success: true,
    message: "Individual updated successfully",
    data: { id, ...updates },
  });
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  return NextResponse.json({
    success: true,
    message: "Individual deleted successfully",
  });
}
