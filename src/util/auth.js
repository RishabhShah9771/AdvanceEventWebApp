import { redirect } from "react-router-dom";

/**
 * Calculates the remaining duration (in milliseconds) until the stored token expires.
 * @returns {number} Duration in milliseconds until token expiration.
 */
export function getTokenDuration() {
  // Retrieve the expiration date string from localStorage
  const storedExpirationDate = localStorage.getItem("expiration");
  // Convert the expiration date string to a Date object
  const expirationDate = new Date(storedExpirationDate);
  // Get the current date and time
  const now = new Date();
  // Calculate the difference in milliseconds between expiration and now
  const duration = expirationDate.getTime() - now.getTime();
  return duration;
}

/**
 * Retrieves the authentication token from localStorage.
 * Checks if the token exists and is not expired.
 * @returns {string|null} The token if valid, "EXPIRED" if expired, or null if not found.
 */
export function getAuthToken() {
  // Get the token from localStorage
  const token = localStorage.getItem("token");

  // If no token is found, return null
  if (!token) {
    return null;
  }
  // Get the remaining duration for the token
  const tokenDuration = getTokenDuration();
  // If the token has expired, return "EXPIRED"
  if (tokenDuration < 0) {
    return "EXPIRED";
  }
  // Return the valid token
  return token;
}

/**
 * Loader function for react-router that returns the authentication token.
 * Used to provide token data to route loaders.
 * @returns {string|null} The token if valid, "EXPIRED" if expired, or null if not found.
 */
export function tokenLoader() {
  return getAuthToken();
}

/**
 * Checks if the authentication token exists and is valid.
 * If not, redirects the user to the authentication page.
 * @returns {null|Response} Null if token is valid, or a redirect response if not.
 */
export function checkAuthToken() {
  // Retrieve the token (or "EXPIRED"/null)
  const token = getAuthToken();
  // If token is missing or expired, redirect to "/auth"
  if (!token) {
    return redirect("/auth");
  }
  // If token is valid, do nothing (return null)
  return null;
}
