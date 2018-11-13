FROM node:8 AS base

## install dependencies
RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        curl \
        git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

## download npm dependencies
FROM base AS dependencies

WORKDIR /opt/Meet/

COPY package.json /opt/Meet/
RUN npm install

## BUILD
COPY . /opt/Meet/
RUN make

## Image
FROM base as release

WORKDIR /opt/Meet/
# copy production node_modules
COPY --from=dependencies /opt/Meet/ ./Meet
RUN cp ./Meet/test.app.json ./Meet/package.json
RUN npm install

WORKDIR /opt/Meet/Meet

EXPOSE 8080
## start the service
CMD exec npm start
