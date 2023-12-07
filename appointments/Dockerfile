FROM python:3.9-slim

WORKDIR /app

# Copy only the requirements.txt first to leverage Docker cache
COPY requirements.txt /app/

# Install the dependencies
RUN pip install -r requirements.txt

#copy the rest of the application
COPY . /app

EXPOSE 7070

CMD ["python", "app.py"]
