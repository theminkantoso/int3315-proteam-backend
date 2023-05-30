FROM node:18.15-alpine

WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# RUN npm install 
# RUN npm install --legacy-peer-deps
RUN npm install --legacy-peer-deps

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . ./

RUN npm run build

EXPOSE 3006
CMD [ "yarn", "start:prod" ]