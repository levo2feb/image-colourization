from flask import Flask, render_template, request, send_file
from PIL import Image, ImageOps
import os
import io

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        file = request.files["image"]
        image = Image.open(file.stream).convert("L")  # Simulate grayscale

        # Dummy colorization: convert L to RGB
        colorized = ImageOps.colorize(image, black="black", white="cyan")

        buf = io.BytesIO()
        colorized.save(buf, format="PNG")
        buf.seek(0)
        return send_file(buf, mimetype="image/png")

    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)