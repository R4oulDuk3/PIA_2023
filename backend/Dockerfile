FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install prisma --save-dev  
COPY . .
RUN npm run build
RUN npx prisma generate
CMD [  "npm", "run", "start:migrate:prod" ]
