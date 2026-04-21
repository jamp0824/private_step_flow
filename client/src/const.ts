export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

const OAUTH_STATE_STORAGE_KEY = "ibk-approval-oauth-state";

function generateOAuthNonce() {
  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);

  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = generateOAuthNonce();

  window.sessionStorage.setItem(OAUTH_STATE_STORAGE_KEY, state);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};

export const verifyOAuthState = (callbackState: string) => {
  const storedState = window.sessionStorage.getItem(OAUTH_STATE_STORAGE_KEY);

  if (!storedState) {
    return false;
  }

  window.sessionStorage.removeItem(OAUTH_STATE_STORAGE_KEY);

  return storedState === callbackState;
};

// Phase 2 security hardening required: complete callback verification when the backend callback is wired.
