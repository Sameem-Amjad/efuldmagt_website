export function timeSince(targetDate) {
  const now = new Date();
  const target = new Date(targetDate);

  // Calculate the difference in milliseconds
  let diff = now - target;

  if (diff < 0) {
    return "Target date is in the future!";
  }

  // Convert the difference to years, months, days, hours, and minutes
  const oneYear = 1000 * 60 * 60 * 24 * 365;
  const oneMonth = 1000 * 60 * 60 * 24 * 30;
  const oneDay = 1000 * 60 * 60 * 24;
  const oneHour = 1000 * 60 * 60;
  const oneMinute = 1000 * 60;

  const years = Math.floor(diff / oneYear);
  diff -= years * oneYear;

  const months = Math.floor(diff / oneMonth);
  diff -= months * oneMonth;

  const days = Math.floor(diff / oneDay);
  diff -= days * oneDay;

  const hours = Math.floor(diff / oneHour);
  diff -= hours * oneHour;

  const minutes = Math.floor(diff / oneMinute);

  // Return the difference in the largest non-zero unit

  if (years > 0) {
    return `${years}y`;
  } else if (months > 0) {
    return `${months}m`;
  } else if (days > 0) {
    return `${days}d`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else if (minutes > 0) {
    return `${minutes}min`;
  } else {
    return "now";
  }
}

export function timeDiff(targetDate, initialDate) {
  const initial = new Date(initialDate);
  const target = new Date(targetDate);

  // Calculate the difference in milliseconds
  let diff = target - initial + 30000; // Adding 30 Secs to remove any delay
  if (diff < 0) {
    return "Immediately";
  }

  // Convert the difference to years, months, days, hours, and minutes
  const oneYear = 1000 * 60 * 60 * 24 * 365;
  const oneMonth = 1000 * 60 * 60 * 24 * 30;
  const oneDay = 1000 * 60 * 60 * 24;
  const oneHour = 1000 * 60 * 60;
  const oneMinute = 1000 * 60;

  const years = Math.floor(diff / oneYear);
  diff -= years * oneYear;

  const months = Math.floor(diff / oneMonth);
  diff -= months * oneMonth;

  const days = Math.floor(diff / oneDay);
  diff -= days * oneDay;

  const hours = Math.floor(diff / oneHour);
  diff -= hours * oneHour;
  const minutes = Math.floor(diff / oneMinute);

  // Return the difference in the largest non-zero unit
  let dateString = "";

  if (years > 0) {
    dateString = dateString + `${years}y `;
  }
  if (months > 0) {
    dateString = dateString + `${months} months `;
  }
  if (days > 0) {
    dateString = dateString + `${days} days `;
  }
  if (hours > 0) {
    dateString = dateString + `${hours} hours `;
  }
  if (minutes > 0) {
    dateString = dateString + `${minutes} mins`;
  }
  if (dateString.length == 0) {
    dateString = "Immediately";
  }

  return dateString;
}

export function formatToDateOnly(isoDate) {
  const date = new Date(isoDate);
  const options = { day: "numeric", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-GB", options);
}

export const formatDate = (date) => {
  date = new Date(date);
  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return date
    .toLocaleString("en-US", options)
    .replace(",", "")
    .replace(" ", ". ");
};
