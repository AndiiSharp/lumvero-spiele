#!/bin/sh
# Lumvero: baut auf einem Mac (Xcode 16 oder neuer) eine UNSIGNIERTE Lumvero.ipa.
# Unsigniert heißt: Sie muss vor der Installation noch signiert werden
# (z. B. mit Sideloadly/AltStore und deiner Apple-ID, oder direkt in Xcode, siehe LIES-MICH-iOS.txt).
# Aufruf im Terminal:  cd <dieser Ordner>  &&  sh build-ipa.sh
set -e
cd "$(dirname "$0")/App"
rm -rf build
xcodebuild -project App.xcodeproj -scheme App -configuration Release \
  -sdk iphoneos -destination 'generic/platform=iOS' \
  -derivedDataPath build CODE_SIGNING_ALLOWED=NO CODE_SIGNING_REQUIRED=NO CODE_SIGN_IDENTITY="" build
mkdir -p build/Payload
cp -R build/Build/Products/Release-iphoneos/App.app build/Payload/
cd build && zip -qr ../../Lumvero.ipa Payload
echo "Fertig: $(cd ../.. && pwd)/Lumvero.ipa"
