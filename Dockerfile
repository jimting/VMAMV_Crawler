FROM node:8-alpine

COPY . /workspace
WORKDIR /workspace
RUN npm install
RUN npm install request
RUN npm install selenium-webdriver
RUN npm install geckodriver
RUN npm i express-async-wrap
RUN npm install firefox

EXPOSE 3000

CMD npm start
