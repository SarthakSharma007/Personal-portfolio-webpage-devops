#!/bin/bash

# Script to copy shared library functions to your jenkins-shared-library repository

SHARED_LIB_DIR="./shared-library"
TARGET_REPO_DIR="../jenkins-shared-library-"

echo "🔄 Copying shared library functions..."

# Check if target directory exists
if [ ! -d "$TARGET_REPO_DIR" ]; then
    echo "❌ Target repository directory not found: $TARGET_REPO_DIR"
    echo "Please clone your shared library repository first:"
    echo "git clone https://github.com/SarthakSharma007/jenkins-shared-library-.git"
    exit 1
fi

# Create vars directory if it doesn't exist
mkdir -p "$TARGET_REPO_DIR/vars"

# Copy all shared library functions
cp -r "$SHARED_LIB_DIR/vars/"* "$TARGET_REPO_DIR/vars/"

echo "✅ Shared library functions copied successfully!"
echo ""
echo "📁 Files copied to $TARGET_REPO_DIR/vars/:"
ls -la "$TARGET_REPO_DIR/vars/"

echo ""
echo "🚀 Next steps:"
echo "1. cd $TARGET_REPO_DIR"
echo "2. git add ."
echo "3. git commit -m 'Add Jenkins shared library functions for portfolio pipeline'"
echo "4. git push origin main"
echo ""
echo "📖 Then follow the setup instructions in JENKINS_SETUP.md"
