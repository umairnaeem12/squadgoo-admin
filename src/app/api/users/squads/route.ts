import { NextRequest, NextResponse } from "next/server";

interface SquadGroup {
  id: string;
  name: string;
  leaderName: string;
  leaderEmail: string;
  leaderId: string;
  membersCount: number;
  status: "active" | "inactive" | "suspended" | "pending-deletion";
  createdAt: string;
  updatedAt: string;
  lastActive: string;
  category: string;
  appliedJobs: number;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const filters = {
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "all",
    dateFrom: searchParams.get("dateFrom") || "",
    dateTo: searchParams.get("dateTo") || "",
    sortField: searchParams.get("sortField") || "createdAt",
    sortDirection: searchParams.get("sortDirection") || "desc",
  };

  // Mock data
  const mockSquads: SquadGroup[] = Array.from({ length: 30 }, (_, i) => {
    const statuses: Array<"active" | "inactive" | "suspended" | "pending-deletion"> = ["active", "active", "active", "inactive"];
    const categories = ["Frontend Development", "Backend Development", "Full Stack Development", "Mobile Development", "DevOps", "Data Science", "UI/UX Design"];
    const squadNames = ["Tech Titans", "Code Warriors", "Digital Innovators", "Stack Masters", "Agile Squad", "Dev Force", "Cloud Ninjas", "Data Wizards"];
    const leaders = ["Ayesha Khan", "Ali Raza", "Fatima Noor", "Hassan Ahmed", "Sara Khan", "Bilal Sheikh", "Zainab Ali", "Omar Malik"];
    
    const createdDate = new Date(2024, 2 + (i % 10), 1 + i);
    
    return {
      id: `SQ-${4001 + i}`,
      name: `${squadNames[i % squadNames.length]} ${i > 7 ? i - 7 : ''}`,
      leaderName: leaders[i % leaders.length],
      leaderEmail: `leader${i + 1}@squadgoo.com`,
      leaderId: `JS-${1001 + i}`,
      membersCount: 2 + (i % 5),
      status: statuses[i % statuses.length],
      createdAt: createdDate.toISOString(),
      updatedAt: new Date(createdDate.getTime() + 1000 * 60 * 60 * 24 * 15).toISOString(),
      lastActive: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7).toISOString(),
      category: categories[i % categories.length],
      appliedJobs: Math.floor(Math.random() * 10),
    };
  });

  let filtered = mockSquads;

  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      (sq) =>
        sq.name.toLowerCase().includes(search) ||
        sq.leaderName.toLowerCase().includes(search) ||
        sq.leaderEmail.toLowerCase().includes(search) ||
        sq.id.toLowerCase().includes(search)
    );
  }

  if (filters.status !== "all") {
    filtered = filtered.filter((sq) => sq.status === filters.status);
  }

  return NextResponse.json({
    success: true,
    data: filtered,
  });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, ...updates } = body;

  return NextResponse.json({
    success: true,
    message: "Squad updated successfully",
    data: { id, ...updates },
  });
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  return NextResponse.json({
    success: true,
    message: "Squad deleted successfully",
  });
}
