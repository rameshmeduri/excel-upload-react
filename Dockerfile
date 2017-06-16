FROM node:7

ENV PORT 8080

# app directory
# - added mkdir because OS@RDC doesn't seem to create it upon WORKDIR
RUN mkdir -p /opt/app-root/src
WORKDIR /opt/app-root/src

# npm install
COPY package.json .
RUN npm install

# load app
COPY . .
RUN chmod -R 775 .

# build app
RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start"]
