FROM metapod/base:latest

#Install API dependencies
ENV PYTHONUNBUFFERED=1
RUN pip3 install --no-cache --upgrade pip
COPY python-requirements.txt /tmp/python-requirements.txt
RUN pip3 install -r /tmp/python-requirements.txt

#Copy source code
ENV METAPOD_MODE production
COPY ./backend /metapod/backend
COPY ./public /metapod/public
COPY ./src ./metapod/src
COPY package.json ./metapod/package.json

#Install UI packages
WORKDIR /metapod
RUN yarn install

EXPOSE 3000
EXPOSE 5000

COPY start.sh /scripts/start.sh

RUN ["chmod", "+x", "/scripts/start.sh"]
ENTRYPOINT ["/scripts/start.sh"]
