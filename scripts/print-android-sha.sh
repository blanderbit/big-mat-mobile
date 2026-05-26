#!/usr/bin/env bash
# Prints SHA-1/SHA-256 for Firebase → Project settings → Android app (edera.bigmat) → Add fingerprint.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
KEYSTORE="${ROOT}/android/app/debug.keystore"

echo "=== android/app/debug.keystore (used by debug & release in build.gradle) ==="
keytool -list -v \
  -keystore "${KEYSTORE}" \
  -alias androiddebugkey \
  -storepass android \
  -keypass android 2>/dev/null | grep -E "SHA1:|SHA256:"

echo ""
echo "Add SHA-1 in Firebase Console (bigmat-main → edera.bigmat), then download new google-services.json."
echo "File must include oauth_client with client_type: 1 and certificate_hash."
