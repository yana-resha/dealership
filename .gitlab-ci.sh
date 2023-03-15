#!/bin/sh

tar -z -c --exclude "docker*" --exclude ".idea" -f ./docker/source.tar.gz ./
echo "success"
