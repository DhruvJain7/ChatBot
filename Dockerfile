# Start with a slim Python base image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Accept a secret build argument for the Hugging Face token
ARG HF_TOKEN

# Copy and install ALL dependencies first
# This makes the huggingface-cli command available
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# --- FIX: Log in to Hugging Face using the correct command AFTER installation ---
RUN huggingface-cli login --token $HF_TOKEN

# Copy your backend application code
COPY app.py .

# Expose the port Flask runs on
EXPOSE 5000

# The command to run your backend when the container starts
CMD ["python", "app.py"]
