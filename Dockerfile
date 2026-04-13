FROM node:24-alpine

WORKDIR /usr/src/app

COPY . .

# Frontend setup.
RUN (cd frontend && npm install)

CMD (cd frontend && npm run dev -- --host)