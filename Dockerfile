
FROM node:18-alpine


WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production


COPY . .

EXPOSE 8080

# Define el comando para ejecutar la aplicación
CMD ["npm", "start"]
