from flask import Blueprint, render_template, request, jsonify, session
from pymongo import MongoClient
from datetime import datetime, timedelta
from db_connector import *


Feedback = Blueprint(
    'Feedback',
    __name__,
    static_folder='static',
    static_url_path='/Feedback',
    template_folder='templates'
)


@Feedback.route('/Feedback')
def Feedback_func():
    return render_template('Feedback.html', page_name='Feedback')


@Feedback.route('/submit_feedback', methods=['POST'])
def submit_feedback():
    try:
        if not session.get('logged_in'):
            return jsonify({
                "success": False,
                "message": "יש להתחבר למערכת כדי לשלוח משוב"
            }), 401

        passenger_email = session.get('email')
        data = request.json
        driver_name = data.get('driverName')
        drive_date = data.get('driveDate')
        drive_hour = data.get('driveHour')
        feedback_text = data.get('feedback')
        rating = data.get('rating')

        drive_datetime = datetime.strptime(f"{drive_date} {drive_hour}", "%Y-%m-%d %H:%M")
        time_range_start = drive_datetime - timedelta(hours=2)
        time_range_end = drive_datetime + timedelta(hours=2)

        matching_drives = list(drivesCol.find({
            "driver_name": driver_name,
            "drive_date": drive_date,
            "drive_hour": {
                "$gte": time_range_start.strftime("%H:%M"),
                "$lte": time_range_end.strftime("%H:%M")
            }
        }))

        if len(matching_drives) == 0:
            return jsonify({
                "success": False,
                "message": "לא נמצאה נסיעה מתאימה עם הפרטים שהוזנו"
            })

        if len(matching_drives) > 1:
            return jsonify({
                "success": True,
                "message": "המשוב התקבל, אך מכיוון שיש מספר נהגים עם אותו שם בטווח הזמן המבוקש, לא ניתן לשמור את המשוב"
            })

        matching_drive = matching_drives[0]
        drive_datetime = datetime.strptime(f"{matching_drive['drive_date']} {matching_drive['drive_hour']}",
                                           "%Y-%m-%d %H:%M")
        current_time = datetime.now()

        if current_time < drive_datetime + timedelta(hours=1):
            return jsonify({
                "success": False,
                "message": "הנסיעה עדיין לא התרחשה, ניתן להשאיר משוב רק שעה לאחר שעת היציאה"
            })

        if passenger_email not in matching_drive.get('passengers', []):
            return jsonify({
                "success": False,
                "message": "לא ניתן למשב נסיעה שלא השתתפת בה"
            })

        existing_feedback = feedbacksCol.find_one({
            "drive_id": str(matching_drive["_id"]),
            "PassengerMail": passenger_email
        })

        if existing_feedback:
            return jsonify({
                "success": False,
                "message": "כבר שלחת משוב על נסיעה זו"
            })

        feedback_data = {
            "drive_id": str(matching_drive["_id"]),
            "driver_name": driver_name,
            "DriverMail": matching_drive["driver_email"],
            "PassengerMail": passenger_email,
            "drive_date": drive_date,
            "drive_hour": matching_drive.get("drive_hour"),  # לקיחת השעה המקורית מהנסיעה
            "feedback": feedback_text,
            "rating": rating,
            "created_at": datetime.now()
        }

        feedbacksCol.insert_one(feedback_data)
        return jsonify({
            "success": True,
            "message": "המשוב נשלח בהצלחה!"
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"אירעה שגיאה בשליחת המשוב: {str(e)}"
        })