#!/usr/bin/env bash

# Install dependencies
apt-get update
apt-get install -y wget gnupg

# Add the Google Chrome PPA
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'

# Install Google Chrome
apt-get update
apt-get install -y google-chrome-stable

# Install Puppeteer
npm install puppeteer

# Build your application
# Add any additional build steps specific to your application here