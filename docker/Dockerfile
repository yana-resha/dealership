FROM registry.gitlab.com/sberauto/infra/base-images/node:14.21.3-4ecd22be as build

ENV SOURCE_PATH /dealershipclient
RUN mkdir -pv $SOURCE_PATH

WORKDIR $SOURCE_PATH
ADD source.tar.gz $SOURCE_PATH

ENV REACT_APP_APIX_URL=DEALERSHIP_ADMIN_CLIENT_REACT_APP_APIX_URL
ENV REACT_APP_API_URL=DEALERSHIP_ADMIN_CLIENT_REACT_APP_API_URL

RUN yarn install
RUN yarn build


FROM registry.gitlab.com/sberauto/infra/base-images/nginx:1.23.3-alpine-slim-4ecd22be as finnaly
RUN rm -f /etc/nginx/conf.d/default.conf \
 && rm -rf /usr/share/nginx/html/*

COPY nginx-default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /dealershipclient/build /usr/share/nginx/html

RUN apk --no-cache add busybox

EXPOSE 80
ADD start.sh /start.sh
RUN chmod 755 /start.sh
CMD ["/bin/sh", "/start.sh"]
