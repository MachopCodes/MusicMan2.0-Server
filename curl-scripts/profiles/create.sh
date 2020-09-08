#!/bin/bash

API="http://localhost:4741"
URL_PATH="/profiles"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "profile": {
      "name": "'"${NAME}"'",
      "contact": "'"${CONTACT}"'",
      "location": "'"${LOCATION}"'",
      "instruments": "'"${INSTRUMENTS}"'",
      "interests": "'"${INTERESTS}"'",
      "blurb": "'"${BLURB}"'"
    }
  }'

echo
