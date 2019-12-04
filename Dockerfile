FROM python:3.6
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
RUN chmod 755 chromedriver
CMD python app.py