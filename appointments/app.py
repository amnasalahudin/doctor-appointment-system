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
appointments_collection = db['appointments']
doctors_collection = db['doctors']

def bootstrap_appointments():
    if appointments_collection.count_documents({}) == 0:
        doctors = list(doctors_collection.find({}, {'_id': 0, 'id': 1, 'firstName': 1}))
        doctor_names = {doctor['id']: doctor['firstName'] for doctor in doctors}
        initial_appointments = [
            {'id': "1", 'doctor': "1", 'name': doctor_names.get("1", ""), 'date': "21 Nov 2023", 'rating': "Good"},
            {'id': "2", 'doctor': "3", 'name': doctor_names.get("3", ""), 'date': "22 Nov 2023", 'rating': "Bad"}
        ]
        appointments_collection.insert_many(initial_appointments)


@app.route('/hello')
def hello():
    return "Hello world!"

@app.route('/appointments', methods=["GET"])
def getAppointments():
    appointments = list(appointments_collection.find({}, {'_id': 0}))
    for appointment in appointments:
        doctor = doctors_collection.find_one({'id': appointment['doctor']}, {'_id': 0, 'firstName': 1})
        if doctor:
            appointment['name'] = doctor['firstName']
    return jsonify(appointments)

@app.route('/appointments', methods=["POST"])
def addAppointment():
    new_appointment = request.json
    doctor = doctors_collection.find_one({'id': new_appointment['doctor']}, {'_id': 0, 'firstName': 1})
    if not doctor:
        return jsonify({"error": "Doctor not found"}), 404

    new_appointment['name'] = doctor['firstName']
    appointments_collection.insert_one(new_appointment)
    return jsonify({"message": "Appointment added successfully"}), 201

@app.route('/appointment/<id>', methods=["GET"])
def getAppointment(id):
    appointment = appointments_collection.find_one({'id': id}, {'_id': 0})
    if appointment:
        doctor = doctors_collection.find_one({'id': appointment['doctor']}, {'_id': 0, 'firstName': 1})
        if doctor:
            appointment['name'] = doctor['firstName']
        return jsonify(appointment)
    else:
        return jsonify({"error": "Appointment not found"}), 404
    
   
@app.route('/health', methods=['GET'])
def health_check():
    return 'OK', 200
#edit

if __name__ == "__main__":
    bootstrap_appointments()
    app.run(host="0.0.0.0", port=int(os.getenv('PORT', 7070)))
