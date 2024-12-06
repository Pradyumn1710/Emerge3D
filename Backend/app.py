import os
import io
import torch
import numpy as np
import pandas as pd
import cv2
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from transformers import AutoImageProcessor, AutoModelForDepthEstimation
from pyntcloud import PyntCloud
from tempfile import NamedTemporaryFile

# Initialize the Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for the Flask app

# Load the depth model
processor = AutoImageProcessor.from_pretrained("depth-anything/Depth-Anything-V2-large-hf")
model = AutoModelForDepthEstimation.from_pretrained("depth-anything/Depth-Anything-V2-large-hf")

def get_intrinsics(H,W, fov=75.0):
  f = 0.5 * W / np.tan(0.5 * fov * np.pi / 180.0)
  cx = 0.5 * W
  cy = 0.5 * H
  return np.array([[f,0,cx],[0,f,cy],[0,0,1]])

def pixel_to_point(depth_image, camera_intrinsics=None):
    height, width = depth_image.shape
    if camera_intrinsics is None:
        camera_intrinsics = get_intrinsics(height, width, fov=75.0)
    fx, fy = camera_intrinsics[0, 0], camera_intrinsics[1, 1]
    cx, cy = camera_intrinsics[0, 2], camera_intrinsics [1, 2]
    x = np.linspace(0, width- 1, width)
    y = np.linspace (0,height- 1, height)
    u, v = np.meshgrid (x, y)
    x_over_z = (u - cx) / (fx)
    y_over_z = (v - cy) / (fy)
    z = depth_image / np.sqrt(1. + x_over_z*2 + y_over_z*2)
    x = x_over_z *z
    y= y_over_z *z
    return x, y, z

def process_image(image):
    # image = cv2.imread(image_path)
    image =cv2.cvtColor(image , cv2.COLOR_BGR2RGB)
    inputs = processor(images=image, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs)
        predicted_depth = outputs.predicted_depth
    depth = predicted_depth.squeeze().cpu().numpy()

    internsic = get_intrinsics(depth.shape[0],depth.shape[1],84.4)
    # color_image = cv2.resize(image, (width, height) )
    depth_image = np.maximum(depth, 1e-5)
    x, y, z = pixel_to_point(depth_image, internsic)
    point_image = np.stack((x, y, z),axis=-1)


    # Flatten arrays for PyntCloud
    height,width =point_image.shape[0],point_image.shape[1]
    points_flattened = point_image.reshape(-1, 3)
    color_image = cv2.resize(image, (width, height) )
    colors_flattened = color_image.reshape(-1, 3) 
    data =pd.DataFrame({
    'x': points_flattened[:, 0],
    'y': points_flattened[:, 1],
    'z': points_flattened[:, 2],
    'red': colors_flattened[:, 0],
    'green': colors_flattened[:, 1],
    'blue': colors_flattened[:, 2]})

    cloud = PyntCloud(data)
    cloud_image_path = os.path.join("../cloud.ply")
    print(cloud_image_path)

    cloud.to_file(cloud_image_path)
    print("Cloud point created")
    return 
@app.route('/process', methods=['POST'])
def process():
    # Get the image from the request
    file = request.files['image']
    image = np.frombuffer(file.read(), np.uint8)
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)

    # Process the image and generate the point cloud
    cloud_buffer = process_image(image)

    # Send the point cloud as a response
    return send_file(cloud_buffer, mimetype='text/plain', as_attachment=True, attachment_filename='../point_cloud.ply')

if __name__ == '__main__':
    app.run(debug=True)