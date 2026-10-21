#!/bin/sh
set -eu

cat > /usr/share/nginx/html/config.js <<CONFIG
window.__APP_CONFIG__ = {
  API_BASE_URL: "${API_BASE_URL:-}",
  WEB_BASE_URL: "${WEB_BASE_URL:-}",
  KEYCLOAK_AUTHORITY: "${KEYCLOAK_AUTHORITY:-}",
  KEYCLOAK_CLIENT_ID: "${KEYCLOAK_CLIENT_ID:-}",
};
CONFIG
