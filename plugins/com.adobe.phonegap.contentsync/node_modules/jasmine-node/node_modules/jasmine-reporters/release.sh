#!/bin/sh
VER=${1}
shift
DESC=$@

if [ -z "$DESC" ] ; then
    echo ":: ERROR! Please provide a brief description of the new version"
    exit 1
fi
echo :: Tagging and releasing ${VER} ::
echo ${VER} - $@

sed -i "" -E "s/\"version\":.+/\"version\": \"${VER}\",/" package.json
git add package.json
git commit -m "${VER}"
git tag ${VER} -am "${VER} - ${DESC}"
