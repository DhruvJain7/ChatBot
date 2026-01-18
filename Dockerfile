FROM python:3.11-slim
WORKDIR /app
# Since requirements.txt is in the root, we copy it directly
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# Copy app.py and other root files
COPY . .
EXPOSE 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
