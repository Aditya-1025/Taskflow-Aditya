# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
ENV PORT=80
ENV API_URL=http://localhost:8080/api
EXPOSE 80
CMD ["sh", "-c", "printf 'window.__APP_CONFIG__ = { API_URL: \"%s\" };\\n' \"$API_URL\" > /usr/share/nginx/html/env.js && envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
