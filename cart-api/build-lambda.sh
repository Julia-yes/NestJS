#!/bin/bash
set -e

echo "Building NestJS for Lambda..."

rm -rf dist dist-lambda

npm install

npm run build

mkdir -p dist-lambda

cp -r dist/* dist-lambda/

cp -r node_modules dist-lambda/

cp package.json dist-lambda/
