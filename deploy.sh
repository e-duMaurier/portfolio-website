#!/bin/bash

git_comment="$1"

# Script will fail to run if no comment is required.
if [ -z "$git_comment" ]; then 
  echo "Error: A commit message is required."
  exit 1 
fi

# Add changes to Git
echo -e "Adding changed files to git..."
git add .
echo -e "All files added.\n"

# Commit the changes
echo -e "Commiting the changes..."
git commit -m "$git_comment"
echo -e "All changes commited.\n"

# Push changes to GitHub repository
echo -e "Pushing changes..."
git push origin main
echo -e "Changes pushed.\nGitHub action will now build and deploy the site."
