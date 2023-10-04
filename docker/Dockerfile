FROM registry.gitlab.com/sberauto/infra/base-images/node:14.21.3-4ecd22be as build

ENV SOURCE_PATH /dealershipclient
RUN mkdir -pv $SOURCE_PATH

WORKDIR $SOURCE_PATH
ADD source.tar.gz $SOURCE_PATH

ENV REACT_APP_API_URL=DEALERSHIP_REACT_APP_API_URL
ENV REACT_APP_APP_URL=DEALERSHIP_APP_URL
ENV REACT_APP_ENVIRONMENT=DEALERSHIP_ENVIRONMENT
ENV REACT_APP_SBER_TEAM_ID_ENVIRONMENT=DEALERSHIP_SBER_TEAM_ID_ENVIRONMENT
ENV REACT_APP_SBER_TEAM_ID_URL=DEALERSHIP_SBER_TEAM_ID_URL
ENV REACT_APP_DOCHUB_API_HEADER=PUBLIC_APP_NAME

RUN yarn install
RUN yarn build


FROM registry.gitlab.com/sberauto/infra/base-images/nginx:1.23.3-alpine-slim-4ecd22be as finnaly
RUN rm -f /etc/nginx/conf.d/default.conf \
 && rm -rf /usr/share/nginx/html/* \
 && chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /etc/nginx \
 && sed -i "/user  nginx;/d" /etc/nginx/nginx.conf \
 && sed -i "s#/var/run/nginx.pid#/tmp/nginx.pid#" /etc/nginx/nginx.conf

COPY nginx-default.conf /etc/nginx/conf.d/default.conf
COPY --chown=nginx:nginx --from=build /dealershipclient/build /usr/share/nginx/html
COPY start.sh /start.sh

RUN chmod 755 /start.sh

EXPOSE 8080

USER nginx

CMD ["/bin/sh", "/start.sh"]
