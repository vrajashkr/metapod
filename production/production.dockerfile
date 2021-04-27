#UI Package Build
FROM metapod/base:latest
COPY ./public /metapod-temp/public
COPY ./src /metapod-temp/src
COPY package.json /metapod-temp/package.json
WORKDIR /metapod-temp
RUN yarn install && yarn build

FROM metapod/base:latest

#NGINX config
RUN unlink /etc/nginx/sites-enabled/default
COPY ./production/proxy_config.conf /etc/nginx/sites-available/proxy_config.conf
RUN ln -s /etc/nginx/sites-available/proxy_config.conf /etc/nginx/sites-enabled/proxy_config.conf
RUN service nginx configtest

#Install API dependencies
ENV PYTHONUNBUFFERED=1
RUN pip3 install --no-cache --upgrade pip
COPY python-requirements.txt /tmp/python-requirements.txt
RUN pip3 install -r /tmp/python-requirements.txt

ENV METAPOD_MODE production
COPY ./backend /metapod/backend

#Install UI packages and fetch static files
WORKDIR /metapod
COPY --from=0 /metapod-temp/build ./build
RUN yarn add serve && yarn add snyk

EXPOSE 3000
EXPOSE 5000

COPY ./production/production-start.sh /scripts/start.sh

RUN ["chmod", "+x", "/scripts/start.sh"]
ENTRYPOINT ["/scripts/start.sh"]
