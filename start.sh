#!/bin/bash

# Exit on error
set -e

# Set the TOKEN environment variable from the first argument if it is set (otherwise you need to provide it using TOKEN=$TOKEN)
if [[ ! -z $1 ]]; then
  export TOKEN=$1
elif [[ -z $TOKEN ]]; then
  echo "❌ Missing TOKEN environment variable"
  echo "🔑 https://www.haxball.com/headlesstoken"
  echo "Run this command as:"
  echo "./start.sh TOKEN"
  echo "Alternative: TOKEN=\$TOKEN ./start.sh"
  exit 1
fi

echo "🔑 $TOKEN"

# Run the room script
node ./src/room.js
