#!/bin/bash

VERSION="Play Шикимори Online@${TRAVIS_TAG:1}"
echo version is "$VERSION"

# Create a release
npx sentry-cli releases new -p extension "$VERSION"
npx sentry-cli releases -p extension files "$VERSION" upload-sourcemaps ./dist/chrome/
npx sentry-cli releases -p extension set-commits --commit $TRAVIS_REPO_SLUG@$TRAVIS_COMMIT "$VERSION"
npx sentry-cli releases -p extension deploys "$VERSION" new -e production
