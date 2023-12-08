from flask import Flask, jsonify, request
from pymongo import MongoClient
import os
from flask_cors import CORS
from dotenv import load_dotenv
load_dotenv() 


app = Flask(__name__)
CORS(app)
# Environment variables
MONGO_URI = os.getenv('MONGO_URI')
MONGO_DB_NAME = os.getenv('MONGO_DB_NAME')

if not MONGO_URI:
    raise RuntimeError("MONGO_URI is not set")

client = MongoClient(MONGO_URI)
db = client[MONGO_DB_NAME]
doctors_collection = db['doctors']

# Initial bootstrapping for doctors
def bootstrap_doctors():
    if doctors_collection.count_documents({}) == 0:
        initial_doctors = [
            {'id': "1", 'firstName': "Muhammad Ali", 'lastName': "Kahoot", 'speciality': "DevOps"},
            {'id': "2", 'firstName': "Good", 'lastName': "Doctor", 'speciality': "Test"}
        ]
        doctors_collection.insert_many(initial_doctors)

@app.route('/hello')
def hello():
    return "Hello world!"

@app.route('/doctors', methods=["GET"])
def getDoctors():
    doctors = list(doctors_collection.find({}, {'_id': 0}))
    return jsonify(doctors)

@app.route('/doctor/<id>', methods=["GET"])
def getDoctor(id):
    doctor = doctors_collection.find_one({'id': id}, {'_id': 0})
    if doctor:
        return jsonify(doctor)
    else:
        return jsonify({"error": "Doctor not found"}), 404

# add new doctor
@app.route('/doctors', methods=["POST"])
def addDoctor():
    new_doctor = request.json
    existing_doctor = doctors_collection.find_one({"id": new_doctor["id"]})
    
    if existing_doctor is not None:
        return jsonify({"error": "Doctor with this ID already exists"}), 400

    doctors_collection.insert_one(new_doctor)
    return jsonify({"message": "Doctor added successfully"}), 201


# edit 

@app.route('/health', methods=['GET'])
def health_check():
    return 'OK', 200


if __name__ == "__main__":
    bootstrap_doctors()
    app.run(host="0.0.0.0", port=int(os.getenv('PORT', 9090)))
