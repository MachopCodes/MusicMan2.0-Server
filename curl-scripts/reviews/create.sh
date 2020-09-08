#!/bin/bash

API="http://localhost:4741"
URL_PATH="/reviews"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "review": {
        "title": "'"${TITLE}"'",
        "content": "'"${CONTENT}"'",
        "profileId": "'"${MUSIC_ID}"'",
        "reviewer": "'"${USER_ID}"'"
      }
  }'
echo
