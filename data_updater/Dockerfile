# Use the official Python image based on Alpine Linux as the base image
FROM pytorch/pytorch

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt /app/

# Install any dependencies specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . /app/

RUN python setup.py

# Expose port 80 to allow communication to the FastAPI application
EXPOSE 8002

# Command to run the FastAPI application using uvicorn server
CMD ["python", "app.py"]
