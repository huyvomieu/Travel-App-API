# Docker image phải được kế thừa từ image khác có sẵn
FROM node:latest
ENV NODE_ENV=production
WORKDIR /app

# Copy from host to image

COPY ["package.json", "package-lock.json*", "./"]

COPY . .

# Run command in the image

RUN npm install
RUN npm install -g nodemon
#run inside a container

CMD [ "npm", "start" ]