#!/bin/bash

#TRAVIS_TAG="v1.1.0"
#TRAVIS_REPO_SLUG="cawa-93/play-shikimori-online"
#TRAVIS_COMMIT="89a0454966c78e2c82c3f78e6259e73c48eb0dbc"

VERSION="Play Шики Online@${TRAVIS_TAG:1}"
echo version is "$VERSION"

# Create a release
npx sentry-cli releases new -p extension "$VERSION"
npx sentry-cli releases -p extension files "$VERSION" upload-sourcemaps ./dist/chrome/
npx sentry-cli releases -p extension set-commits --commit $TRAVIS_REPO_SLUG@$TRAVIS_COMMIT "$VERSION"
npx sentry-cli releases -p extension deploys "$VERSION" new -e production
