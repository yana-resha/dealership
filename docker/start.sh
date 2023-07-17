#!/bin/sh

find /usr/share/nginx/html -type f -print0 | xargs -0 sed -i "s#DEALERSHIP_REACT_APP_APIX_URL#$DEALERSHIP_REACT_APP_APIX_URL#g"
find /usr/share/nginx/html -type f -print0 | xargs -0 sed -i "s#DEALERSHIP_REACT_APP_API_URL#$DEALERSHIP_REACT_APP_API_URL#g"
find /usr/share/nginx/html -type f -print0 | xargs -0 sed -i "s#DEALERSHIP_APP_URL#$DEALERSHIP_APP_URL#g"
find /usr/share/nginx/html -type f -print0 | xargs -0 sed -i "s#DEALERSHIP_ENVIRONMENT#$DEALERSHIP_ENVIRONMENT#g"
find /usr/share/nginx/html -type f -print0 | xargs -0 sed -i "s#DEALERSHIP_SBER_TEAM_ID_ENVIRONMENT#$DEALERSHIP_SBER_TEAM_ID_ENVIRONMENT#g"
find /usr/share/nginx/html -type f -print0 | xargs -0 sed -i "s#DEALERSHIP_SBER_TEAM_ID_URL#$DEALERSHIP_SBER_TEAM_ID_URL#g"
find /usr/share/nginx/html -type f -print0 | xargs -0 sed -i "s#PUBLIC_APP_NAME#$PUBLIC_APP_NAME#g"

nginx -g "daemon off;"
