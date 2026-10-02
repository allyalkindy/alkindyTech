FROM python:3.12-slim

WORKDIR /app

# ffmpeg isn't needed: we only ever select a single audio-only format
# (bestaudio[ext=m4a]/bestaudio), never a video+audio merge.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY server.py .

EXPOSE 8080

# Shell form (not the ["exec", "form"] array) is required here so $PORT
# actually gets substituted at container start — the array form is a
# literal argv with no shell involved, so a hardcoded "--port=8080" would
# silently ignore whatever port the host platform (e.g. Render, which
# assigns its own PORT and routes traffic to exactly that) injects at
# runtime. ${PORT:-8080} keeps 8080 as the default for local/non-Render use.
CMD waitress-serve --host=0.0.0.0 --port=${PORT:-8080} server:app
