from flask import Blueprint, render_template, request, jsonify, session
from datetime import datetime
from db_connector import *


PublishDrive = Blueprint(
    'PublishDrive',
    __name__,
    static_folder='static',
    static_url_path='/PublishDrive',
    template_folder='templates'
)


@PublishDrive.route('/Publish')
@PublishDrive.route('/PublishDrive')
def PublishDrive_func():
    return render_template('PublishDrive.html', page_name='Publish Drive')


@PublishDrive.route('/add_drive', methods=['POST'])
def add_drive():
    if not session.get('logged_in'):
        return jsonify({"error": "יש להתחבר למערכת לפני פרסום נסיעה"}), 401

    data = request.json
    new_drive = {
        "driver_email": session.get("email"),
        "driver_name": session.get("fullName"),
        "start_point": data.get("startPointHebrew"),
        "meeting_point": data.get("meetingPoint"),
        "destination": data.get("destination"),
        "drive_date": data.get("driveDate"),
        "drive_hour": data.get("driveHour"),
        "seats_available": int(data.get("seatsAvailable")),
        "passengers": [],
        "created_at": datetime.utcnow()
    }
    drivesCol.insert_one(new_drive)
    return jsonify({"success": "הנסיעה פורסמה בהצלחה!"}), 201

