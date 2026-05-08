import moment from "moment";

/**
 * Formats a date string into "DD MMM YYYY" format with lowercase month.
 * Example: "2026-05-08" -> "08 may 2026"
 * 
 * @param {string|Date} dateString - The date to format
 * @param {string} [format="DD MMM YYYY"] - The desired moment format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, format = "DD MMM YYYY") => {
  if (!dateString) return "";
  const m = moment(dateString);
  if (!m.isValid()) return dateString;
  
  return m.format(format).toLowerCase();
};

/**
 * Formats a time string (HH:mm:ss) into a readable format.
 * 
 * @param {string} timeString - The time string from backend
 * @returns {string} Formatted time (e.g., 10:00)
 */
export const formatTime = (timeString) => {
  if (!timeString) return "";
  return timeString.slice(0, 5);
};
