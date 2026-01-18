FROM python:3.11-slim

WORKDIR /app

# Install basic dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy your code
COPY . .

# Environment variable for Groq (set this in Render dashboard, not here for security)
# ENV GROQ_API_KEY=your_key_here

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
