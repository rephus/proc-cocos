FROM python:2-alpine

WORKDIR /app
COPY . .

CMD python -m SimpleHTTPServer 8000
