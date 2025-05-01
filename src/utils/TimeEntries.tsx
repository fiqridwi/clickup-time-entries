// Function to convert dd/mm/yyyy HH:mm:ss to Unix timestamp (milliseconds)
export const convertToUnixTimestamp = (dateTimeStr: string): number => {
  try {
    // Split date and time parts
    const [dateStr, timeStr = "00:00"] = dateTimeStr.split(" ");

    // Split date components
    const [day, month, year] = dateStr.split("/").map(Number);

    // Split time components and handle missing seconds
    const [hours = 0, minutes = 0] = timeStr.split(":").map(Number);
    const seconds = 0; // Default seconds to 0

    // Create Date object with all components
    const date = new Date(year, month - 1, day, hours, minutes, seconds);

    const timestamp = date.getTime();

    if (isNaN(timestamp)) {
      throw new Error("Invalid date conversion");
    }

    return timestamp;
  } catch (error) {
    console.error(
      "Error converting datetime:",
      error,
      "for input:",
      dateTimeStr,
    );
    return new Date().getTime(); // Return current timestamp as fallback
  }
};

// Function to convert duration string to minutes
export const convertDurationToMinutes = (durationStr: string): number => {
  const hours = durationStr.match(/(\d+)h/)?.[1] || "0";
  const minutes = durationStr.match(/(\d+)m/)?.[1] || "0";
  return parseInt(hours) * 60 + parseInt(minutes);
};

// Function to format minutes to hours and minutes
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

// Function to format timestamp to readable date
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};
