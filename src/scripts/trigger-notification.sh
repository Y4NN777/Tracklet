#!/bin/bash

# Load environment variables from .env.local
if [ -f ".env.local" ]; then
  export $(grep -v '^#' .env.local | xargs)
fi

# Set defaults if not in environment
API_BASE_URL="${NEXT_PUBLIC_API_BASE_URL:-http://localhost:9002}"
NOTIFICATION_SECRET="${NOTIFICATION_JOB_SECRET}"

# Remove /api/v1 suffix if present to get base URL
API_BASE_URL="${API_BASE_URL%/api/v1}"

# Check if required variables are available
if [ -z "$NOTIFICATION_SECRET" ]; then
  echo "Error: NOTIFICATION_JOB_SECRET not found in environment"
  echo "Please ensure it's set in .env.local or environment variables"
  exit 1
fi

if [ -z "$API_BASE_URL" ]; then
  echo "Warning: NEXT_PUBLIC_API_BASE_URL not set, using default: http://localhost:9002"
  API_BASE_URL="http://localhost:9002"
fi

# Trigger notifications
echo "Triggering notifications via $API_BASE_URL..."
RESPONSE=$(curl -X POST "$API_BASE_URL/api/v1/notifications/trigger" \
  -H "Authorization: Bearer $NOTIFICATION_SECRET" \
  -s -w "\nHTTP_STATUS:%{http_code}")

# Extract status code and response body
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)
RESPONSE_BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS:/d')

# Check if request was successful
if [ "$HTTP_STATUS" = "200" ]; then
  echo " Success: $RESPONSE_BODY"
else
  echo " Failed with status $HTTP_STATUS: $RESPONSE_BODY"
  exit 1
fi

echo "Notification trigger completed!"