from flask import Flask, request, jsonify
import os
from ml_file import generate_ply_data  # Import the ML function to generate .ply data

app = Flask(__name__)

# Path to save uploaded images
UPLOAD_FOLDER = './uploaded_images'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Route to receive images from the frontend
@app.route('/upload_images', methods=['POST'])
def upload_images():
    if 'images' not in request.files:
        return jsonify({"error": "No images part in the request"}), 400

    images = request.files.getlist('images')
    saved_files = []

    for image in images:
        if image.filename == '':
            return jsonify({"error": "One or more images have no filename"}), 400

        file_path = os.path.join(UPLOAD_FOLDER, image.filename)
        image.save(file_path)
        saved_files.append(file_path)

    return jsonify({"message": "Images uploaded successfully", "files": saved_files}), 200

# Route to write .ply file
@app.route('/generate_ply', methods=['POST'])
def generate_ply():
    try:
        # Assume input_data comes in JSON format
        input_data = request.get_json()

        if not input_data:
            return jsonify({"error": "No input data provided"}), 400

        # Generate .ply data using the ML function
        ply_content = generate_ply_data(input_data)  # This should return the .ply content as a string

        # Define the path to save the .ply file
        ply_file_path = './output/output_file.ply'
        os.makedirs(os.path.dirname(ply_file_path), exist_ok=True)

        # Write the .ply content to the file
        with open(ply_file_path, 'w') as ply_file:
            ply_file.write(ply_content)

        return jsonify({"message": "PLY file generated successfully", "file_path": ply_file_path}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
