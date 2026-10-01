FROM python:3.12-slim

WORKDIR /app

# ffmpeg isn't needed: we only ever select a single audio-only format
# (bestaudio[ext=m4a]/bestaudio), never a video+audio merge.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY server.py .

ENV PORT=8080
EXPOSE 8080

CMD ["waitress-serve", "--host=0.0.0.0", "--port=8080", "server:app"]
