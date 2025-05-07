#!/bin/bash
# set_module_local.sh

LOCAL_MOD_NAME="mcpserver"

echo "Setting module to local: $LOCAL_MOD_NAME"
sed -i '' "1s|^module .*|module $LOCAL_MOD_NAME|" go.mod

echo "Replacing import paths..."
find . -type f -name "*.go" -exec sed -i '' "s|github.com/luridarmawan/mcp-server-go|$LOCAL_MOD_NAME|g" {} +

echo "Done (local mode)"
