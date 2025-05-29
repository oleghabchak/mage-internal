// scripts/Clear.sh
#!/bin/bash

echo "rm -rf ios/build..."
rm -rf ios/build

echo "rm -rf android/app/build..."
rm -rf android/app/build

echo "watchman watch-del-all..."
watchman watch-del-all

echo "rm -rf node_modules..."
rm -rf node_modules

echo "yarn install"
yarn install
