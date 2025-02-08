FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install 

COPY . .

EXPOSE 3000

CMD [ "node", "server.js" ]COPY --from=builder /app/dist/your-angular-app-name /usr/share/nginx/html
