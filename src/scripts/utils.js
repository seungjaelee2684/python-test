export function getAccessTokenFromCookie(name) {
  const cookies = new URLSearchParams(document.cookie.replace(/; /g, '&'));
  return (cookies) ? cookies.get(name) : null;
};