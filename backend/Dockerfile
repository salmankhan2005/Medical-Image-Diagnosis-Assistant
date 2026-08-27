FROM python:3.10-slim

WORKDIR /app

# Install system dependencies for OpenCV and PyTorch
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    curl \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application file
COPY app.py .

# Copy model weights (now tracked in git via !backend/best_densenet121_dr.pth in .gitignore)
# If not present in build context, the app will attempt MODEL_URL download at startup
COPY best_densenet121_dr.pth . 2>/dev/null || echo "Model .pth not in build context - startup download required"

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
