import { NextRequest, NextResponse } from "next/server";
import type { Recruiter } from "@/types/user-management";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const filters = {
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "all",
    verified: searchParams.get("verified") || "all",
    dateFrom: searchParams.get("dateFrom") || "",
    dateTo: searchParams.get("dateTo") || "",
    sortField: searchParams.get("sortField") || "createdAt",
    sortDirection: searchParams.get("sortDirection") || "desc",
    page: parseInt(searchParams.get("page") || "1"),
    limit: parseInt(searchParams.get("limit") || "10"),
  };

  // Mock data
  const mockRecruiters: Recruiter[] = Array.from({ length: 32 }, (_, i) => {
    const statuses: Array<"active" | "inactive" | "suspended" | "pending-deletion"> = ["active", "active", "active", "inactive", "suspended"];
    const kycStatuses: Array<"verified" | "pending" | "rejected"> = ["verified", "verified", "pending"];
    const locations = ["San Francisco, USA", "London, UK", "Dubai, UAE", "Singapore", "Toronto, Canada", "Sydney, Australia", "Berlin, Germany"];
    const industries = ["Technology", "Finance", "Healthcare", "E-commerce", "Manufacturing", "Consulting", "Marketing"];
    const companySizes = ["1-10", "11-50", "51-200", "201-500", "500+"];
    const companies = ["TechCorp", "Innovate Ltd", "Global Solutions", "Prime Recruiters", "Elite HR", "Talent Bridge", "Career Connect"];
    
    const createdDate = new Date(2023, 6 + (i % 12), 1 + i);
    const verified = i % 4 !== 3;
    
    return {
      id: `REC-${2001 + i}`,
      firstName: ["John", "Sarah", "Michael", "Emma", "David", "Lisa", "James", "Maria"][i % 8],
      lastName: ["Doe", "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Martinez"][i % 8],
      email: `recruiter${i + 1}@${companies[i % companies.length].toLowerCase().replace(/\\s+/g, '')}.com`,
      phone: `+1 ${String(2345678901 + i).slice(0, 10)}`,
      role: "recruiter",
      status: statuses[i % statuses.length],
      createdAt: createdDate.toISOString(),
      updatedAt: new Date(createdDate.getTime() + 1000 * 60 * 60 * 24 * 60).toISOString(),
      lastActive: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 14).toISOString(),
      location: locations[i % locations.length],
      kycStatus: kycStatuses[i % kycStatuses.length],
      companyName: `${companies[i % companies.length]} ${i > 7 ? 'International' : ''}`,
      industry: industries[i % industries.length],
      companySize: companySizes[i % companySizes.length],
      jobsPosted: Math.floor(Math.random() * 50) + 1,
      verified: verified,
      description: `Leading ${industries[i % industries.length].toLowerCase()} recruitment firm specializing in connecting top talent with premier organizations globally.`,
      companyDetails: {
        businessName: `${companies[i % companies.length]} Global Inc.`,
        acn: `AC${String(123456789 + i).slice(0, 9)}`,
        businessAddress: `${100 + i} Business Street, ${locations[i % locations.length]}`,
        directorName: ["John", "Sarah", "Michael", "Emma"][i % 4] + " " + ["Doe", "Smith", "Johnson", "Williams"][i % 4],
      },
    };
  });

  let filtered = mockRecruiters;

  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.firstName.toLowerCase().includes(search) ||
        r.lastName.toLowerCase().includes(search) ||
        r.email.toLowerCase().includes(search) ||
        r.companyName.toLowerCase().includes(search)
    );
  }

  if (filters.status !== "all") {
    filtered = filtered.filter((r) => r.status === filters.status);
  }

  if (filters.verified !== "all") {
    const isVerified = filters.verified === "true";
    filtered = filtered.filter((r) => r.verified === isVerified);
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
    message: "Recruiter updated successfully",
    data: { id, ...updates },
  });
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  return NextResponse.json({
    success: true,
    message: "Recruiter deleted successfully",
  });
}
