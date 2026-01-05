import { NextRequest, NextResponse } from "next/server";
import type { JobSeeker } from "@/types/user-management";

// This is a mock API. Replace with actual database queries in production
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

  // Mock data - replace with actual database query
  const mockJobSeekers: JobSeeker[] = Array.from({ length: 35 }, (_, i) => {
    const statuses: Array<"active" | "inactive" | "suspended" | "pending-deletion"> = ["active", "active", "active", "inactive", "suspended"];
    const kycStatuses: Array<"verified" | "pending" | "rejected"> = ["verified", "verified", "pending", "rejected"];
    const locations = ["Karachi, Pakistan", "Lahore, Pakistan", "Islamabad, Pakistan", "San Francisco, USA", "London, UK", "Dubai, UAE", "Sydney, Australia"];
    const titles = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "UI/UX Designer", "DevOps Engineer", "Data Scientist", "Mobile Developer"];
    const experiences = ["1-2 years", "3-5 years", "5+ years", "Entry Level"];
    
    const createdDate = new Date(2024, 0, 1 + i);
    
    return {
      id: `JS-${1001 + i}`,
      firstName: ["Ayesha", "Ali", "Fatima", "Hassan", "Sara", "Ahmed", "Zainab", "Omar", "Maria", "Bilal"][i % 10],
      lastName: ["Khan", "Ahmed", "Malik", "Shah", "Raza", "Hussain", "Ali", "Syed", "Butt", "Sheikh"][i % 10],
      email: `user${i + 1}@email.com`,
      phone: `+92 300 ${String(1234567 + i).slice(0, 7)}`,
      role: "jobseeker",
      status: statuses[i % statuses.length],
      createdAt: createdDate.toISOString(),
      updatedAt: new Date(createdDate.getTime() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      lastActive: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7).toISOString(),
      location: locations[i % locations.length],
      kycStatus: kycStatuses[i % kycStatuses.length],
      jobTitle: titles[i % titles.length],
      experience: experiences[i % experiences.length],
      skills: ["React", "Next.js", "TypeScript", "Node.js", "Python", "Java", "AWS", "Docker"].slice(0, 3 + (i % 3)),
      preferences: {
        role: titles[i % titles.length],
        type: i % 2 === 0 ? "Full-time" : "Part-time",
        salary: `$${50 + (i % 5) * 20}k - $${70 + (i % 5) * 20}k`,
        availability: i % 3 === 0 ? "Immediate" : "2 weeks notice",
        locationPreference: ["Remote", "Hybrid", "On-site"][i % 3],
      },
      education: {
        degree: "Bachelor of Computer Science",
        institute: ["NED University", "FAST University", "NUST", "IBA"][i % 4],
        year: `${2015 + (i % 8)} - ${2019 + (i % 8)}`,
      },
    };
  });

  // Apply filters
  let filtered = mockJobSeekers;

  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      (js) =>
        js.firstName.toLowerCase().includes(search) ||
        js.lastName.toLowerCase().includes(search) ||
        js.email.toLowerCase().includes(search) ||
        js.jobTitle.toLowerCase().includes(search)
    );
  }

  if (filters.status !== "all") {
    filtered = filtered.filter((js) => js.status === filters.status);
  }

  if (filters.kycStatus !== "all") {
    filtered = filtered.filter((js) => js.kycStatus === filters.kycStatus);
  }

  // Apply sorting
  filtered.sort((a, b) => {
    const field = filters.sortField as keyof JobSeeker;
    const aVal = a[field];
    const bVal = b[field];
    
    if (typeof aVal === "string" && typeof bVal === "string") {
      return filters.sortDirection === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    
    return 0;
  });

  // Pagination
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

  // Mock update - replace with actual database update
  console.log("Updating job seeker:", id, updates);

  return NextResponse.json({
    success: true,
    message: "Job seeker updated successfully",
    data: { id, ...updates },
  });
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  // Mock delete - replace with actual database delete
  console.log("Deleting job seeker:", id);

  return NextResponse.json({
    success: true,
    message: "Job seeker deleted successfully",
  });
}
