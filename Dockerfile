FROM node:10-alpine

# Create app directory
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# Set work directory
WORKDIR /home/node/app

# Install app dependencies
COPY package*.json ./

# Switch user
USER node

# Install dependencies
RUN npm install

# Bundle app source
COPY --chown=node:node . .

EXPOSE 3000

CMD [ "node", "app.js" ]