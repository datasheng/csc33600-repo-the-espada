FROM python::3.11-slim

WORKDIR /app

COPY /.app /app

RUN pip install -requirements.txt

EXPOSE 5000

CMD ["python", "app.py"]