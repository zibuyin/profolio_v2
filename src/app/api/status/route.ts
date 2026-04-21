export const runtime = "nodejs"; // ensures full Node.js runtime

type StatusType =
  | "operational"
  | "degraded"
  | "partial"
  | "major"
  | "maintenance";

const STATUS_MAP: Record<
  StatusType,
  { status: string; label: string }
> = {
  operational: { status: "operational", label: "Fully Operational" },
  degraded: { status: "degraded", label: "Degraded" },
  partial: { status: "partial", label: "Partial Outage" },
  major: { status: "major", label: "Major Outage" },
  maintenance: { status: "maintenance", label: "Maintenance" },
};

export async function GET() {
  const apiToken = process.env.BETTER_STACK_API_TOKEN;

  // Edge-style caching (works in Next.js too)
  const headers = {
    "Cache-Control": "s-maxage=60, stale-while-revalidate=30",
  };

  if (!apiToken) {
    return Response.json(
      {
        status: "unknown",
        label: "Unknown",
        updatedAt: null,
      },
      { headers }
    );
  }

  try {
    const response = await fetch(
      "https://uptime.betterstack.com/api/v2/monitors",
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Better Stack API error: ${response.statusText}`);
    }

    const data = (await response.json()) as {
      data: Array<{
        id: string;
        attributes: {
          url: string;
          pronounceable_name: string;
          status: "paused" | "pending" | "maintenance" | "up" | "validating" | "down";
        };
      }>;
    };

    const monitors = data.data || [];

    const totalCount = monitors.length;
    const downCount = monitors.filter(m => m.attributes.status === "down").length;
    const maintenanceCount = monitors.filter(m => m.attributes.status === "maintenance").length;
    const validatingCount = monitors.filter(m => m.attributes.status === "validating").length;
    const upCount = monitors.filter(m => m.attributes.status === "up").length;

    let statusType: StatusType;

    if (totalCount === 0) {
      return Response.json(
        {
          status: "unknown",
          label: "Unknown",
          updatedAt: new Date().toISOString(),
        },
        { headers }
      );
    }

    if (downCount > totalCount / 2) {
      statusType = "major";
    } else if (downCount > 0) {
      statusType = "partial";
    } else if (maintenanceCount > 0) {
      statusType = "maintenance";
    } else if (validatingCount > 0) {
      statusType = "degraded";
    } else if (upCount === totalCount) {
      statusType = "operational";
    } else {
      statusType = "partial";
    }

    const statusInfo = STATUS_MAP[statusType];

    return Response.json(
      {
        status: statusInfo.status,
        label: statusInfo.label,
        updatedAt: new Date().toISOString(),
      },
      { headers }
    );
  } catch (error) {
    console.error("Fetch status failed:", error);

    return Response.json(
      {
        status: "error",
        label: "Error",
        updatedAt: null,
      },
      { headers }
    );
  }
}