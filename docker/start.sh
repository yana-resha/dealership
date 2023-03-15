#!/bin/sh

find /usr/share/nginx/html -type f -print0 | xargs -0 sed -i "s#DEALERSHIP_ADMIN_CLIENT_REACT_APP_APIX_URL#$DEALERSHIP_ADMIN_CLIENT_REACT_APP_APIX_URL#g"
find /usr/share/nginx/html -type f -print0 | xargs -0 sed -i "s#DEALERSHIP_ADMIN_CLIENT_REACT_APP_API_URL#$DEALERSHIP_ADMIN_CLIENT_REACT_APP_API_URL#g"

nginx -g "daemon off;"
