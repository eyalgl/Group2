from flask import Blueprint, render_template, session, jsonify, request, redirect, url_for
from bson import ObjectId
import datetime
from db_connector import *

SearchDrive = Blueprint(
    'SearchDrive',
    __name__,
    static_folder='static',
    static_url_path='/SearchDrive',
    template_folder='templates'
)


@SearchDrive.route('/SearchDrive')
def search_drive_page():
    if not session.get('logged_in'):
        return redirect(url_for('Login.login'))  # אם לא מחובר, להפנות להתחברות
    return render_template('SearchDrive.html', page_name='Search Drive')


@SearchDrive.route('/search_drives', methods=['POST'])
def search_drives():
    if not session.get('logged_in'):
        return jsonify([])  # החזר רשימה ריקה אם המשתמש לא מחובר

    data = request.json
    start_date = data.get("startDate")
    end_date = data.get("endDate")
    origin = data.get("origin")
    destination_region = data.get("destination")
    user_email = session.get("email")

    originHebrew = {
        "tel_aviv": "תל אביב",
        "beer_sheva": "בן גוריון",
        "jerusalem": "העברית",
        "haifa": "הטכניון"
    }.get(origin, "")

    query = {
        "start_point": originHebrew,
        "drive_date": {"$gte": start_date, "$lte": end_date},
        "driver_email": {"$ne": user_email}  # 🔹 סינון נסיעות של המשתמש עצמו
    }

    if destination_region == "south":
        query["destination"] = {"$in": ["באר שבע", "אילת", "אשקלון", "אשדוד"]}
    elif destination_region == "center":
        query["destination"] = {"$in": ["תל אביב", "רמת גן", "רחובות", "הרצליה"]}
    elif destination_region == "north":
        query["destination"] = {"$in": ["חיפה", "נהריה", "צפת", "כרמיאל"]}

    results = list(drivesCol.find(query))

    for drive in results:
        drive["_id"] = str(drive["_id"])

    return jsonify(results)


@SearchDrive.route('/request_join', methods=['POST'])
def request_join():
    if not session.get('logged_in'):
        return jsonify({"error": "יש להתחבר למערכת"}), 401

    data = request.json
    drive_id = data.get("driveId")
    seats_requested = int(data.get("seatsRequested"))

    if not drive_id or seats_requested <= 0:
        return jsonify({"error": "נתונים לא תקינים"}), 400

    user_email = session.get("email")
    user_name = session.get("fullName")

    existing_request = requestsCol.find_one({"drive_id": drive_id, "passenger_email": user_email})
    if existing_request:
        return jsonify({"error": "כבר שלחת בקשת הצטרפות לנסיעה זו"}), 400

    request_data = {
        "drive_id": drive_id,
        "driver_email": drivesCol.find_one({"_id": ObjectId(drive_id)})["driver_email"],
        "passenger_email": user_email,
        "passenger_name": user_name,
        "seats_requested": seats_requested,
        "status": "pending",
        "timestamp": datetime.datetime.utcnow()
    }
    requestsCol.insert_one(request_data)
    return jsonify({"success": "בקשת ההצטרפות נשלחה בהצלחה!"})


