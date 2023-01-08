const API_PORT = 5000;
const WEB_PORT = 5173;
const PROTOCOL = "http";
const DOMAIN = "localhost";

const getUrl = (port: number) => `${PROTOCOL}://${DOMAIN}:${port}`;

export const env = {
  PROTOCOL,
  DOMAIN,
  WEB_PORT,
  WEB_URL: getUrl(WEB_PORT),
  API_PORT,
  API_URL: getUrl(API_PORT),
};
