from flask import Blueprint, render_template, session, jsonify, redirect, url_for, request
from bson import ObjectId
from db_connector import *

myDrives = Blueprint(
    'myDrives',
    __name__,
    static_folder='static',
    static_url_path='/myDrives',
    template_folder='templates'
)


@myDrives.route('/myDrives')
def myDrives_func():
    if not session.get('logged_in'):
        return redirect(url_for('Login.login'))
    return render_template('myDrives.html', page_name='My Drives')


@myDrives.route('/get_my_drives')
def get_my_drives():
    if not session.get('logged_in'):
        return jsonify({"error": "יש להתחבר למערכת"}), 401

    user_email = session.get("email")

    driver_drives = list(drivesCol.find({"driver_email": user_email}))
    for drive in driver_drives:
        drive["_id"] = str(drive["_id"])

    passenger_drives = list(requestsCol.find({"passenger_email": user_email}))
    for request in passenger_drives:
        drive_details = drivesCol.find_one({"_id": ObjectId(request["drive_id"])})
        if drive_details:
            request["driver_name"] = drive_details.get("driver_name", "לא נמצא")
            request["destination"] = drive_details.get("destination", "לא נמצא")
            request["drive_date"] = drive_details.get("drive_date", "לא נמצא")
            request["drive_hour"] = drive_details.get("drive_hour", "לא נמצא")
        request["_id"] = str(request["_id"])

    received_requests = list(requestsCol.find({"driver_email": user_email, "status": "pending"}))
    for req in received_requests:
        req["_id"] = str(req["_id"])
        drive_info = drivesCol.find_one({"_id": ObjectId(req["drive_id"])})
        if drive_info:
            req["drive_id"] = str(drive_info["_id"])

    return jsonify({
        "driverDrives": driver_drives,
        "passengerDrives": passenger_drives,
        "receivedRequests": received_requests
    })


@myDrives.route('/delete_drive/<drive_id>', methods=['DELETE'])
def delete_drive(drive_id):
    if not session.get('logged_in'):
        return jsonify({"error": "יש להתחבר למערכת"}), 401

    if not drive_id or drive_id == "null":
        return jsonify({"error": "מזהה נסיעה לא תקין"}), 400

    try:
        delete_result = drivesCol.delete_one({"_id": ObjectId(drive_id)})

        if delete_result.deleted_count == 1:
            requestsCol.delete_many({"drive_id": drive_id})
            return jsonify({"success": "הנסיעה נמחקה בהצלחה"})
        else:
            return jsonify({"error": "הנסיעה לא נמצאה ב-DB"}), 404
    except Exception as e:
        return jsonify({"error": f"שגיאה במחיקת נסיעה: {str(e)}"}), 500


@myDrives.route('/update_join_request/<request_id>', methods=['PUT'])
def update_join_request(request_id):
    if not session.get('logged_in'):
        return jsonify({"error": "יש להתחבר למערכת"}), 401

    try:
        data = request.json
        new_status = data.get("status")

        if new_status not in ["approved", "rejected"]:
            return jsonify({"error": "סטטוס לא תקין"}), 400

        request_data = requestsCol.find_one({"_id": ObjectId(request_id)})
        if not request_data:
            return jsonify({"error": "הבקשה לא נמצאה"}), 404

        drive_id = request_data.get("drive_id")
        seats_requested = request_data.get("seats_requested")
        passenger_email = request_data.get("passenger_email")

        # אם מדובר באישור בקשה, בדוק קודם אם יש מספיק מקומות
        if new_status == "approved":
            drive = drivesCol.find_one({"_id": ObjectId(drive_id)})
            if not drive:
                return jsonify({"error": "הנסיעה לא נמצאה"}), 404

            seats_available = drive.get("seats_available", 0)
            if seats_available < seats_requested:
                return jsonify({
                    "error": "לא ניתן לאשר נסיעה זו מכיוון שאין מספיק מקומות פנויים"
                }), 400

        # עדכון הסטטוס של הבקשה
        update_result = requestsCol.update_one(
            {"_id": ObjectId(request_id)},
            {"$set": {"status": new_status}}
        )

        new_seats_available = None
        if update_result.matched_count == 1 and new_status == "approved":
            # הורדת מספר המקומות הפנויים והוספת הנוסע לרשימת הנוסעים
            drive_update = drivesCol.find_one_and_update(
                {"_id": ObjectId(drive_id)},
                {
                    "$inc": {"seats_available": -seats_requested},
                    "$push": {"passengers": passenger_email}
                },
                return_document=True
            )

            if drive_update:
                new_seats_available = drive_update.get("seats_available", 0)

        return jsonify({
            "success": f"הבקשה עודכנה ל-{new_status} בהצלחה!",
            "drive_id": drive_id,
            "new_seats_available": new_seats_available
        })

    except Exception as e:
        print(f"שגיאה במהלך עדכון בקשה: {str(e)}")
        return jsonify({"error": f"שגיאה בעדכון הבקשה: {str(e)}"}), 500


@myDrives.route('/get_drive_seats/<drive_id>')
def get_drive_seats(drive_id):
    try:
        drive = drivesCol.find_one({"_id": ObjectId(drive_id)})
        if not drive:
            return jsonify({"error": "הנסיעה לא נמצאה"}), 404

        return jsonify({"seats_available": drive.get("seats_available", 0)})

    except Exception as e:
        return jsonify({"error": f"שגיאה בקבלת נתוני נסיעה: {str(e)}"}), 500
