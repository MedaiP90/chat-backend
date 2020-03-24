FROM node:12.13-alpine

# Add SQLite package
RUN apk add -U sqlite

# Set /app WorkDir
WORKDIR /app

# Copy local source content
COPY . /app/

# Define default command to Build App.
CMD ["npm", "start:prod"]
