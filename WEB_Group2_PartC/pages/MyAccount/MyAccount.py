from flask import Blueprint, render_template, session, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from db_connector import *

MyAccount = Blueprint(
    "MyAccount",
    __name__,
    static_folder="static",
    static_url_path="/MyAccount",
    template_folder="templates",
)


@MyAccount.route("/Account")
@MyAccount.route("/MyAccount")
def MyAccount_func():
    return render_template("MyAccount.html", page_name="My Account")


@MyAccount.route("/change_password", methods=["POST"])
def change_password():
    try:
        if "email" not in session:
            print("אין אימייל בסשן!")
            return jsonify({"error": "שגיאה: אין כתובת אימייל בסשן"}), 400

        user_email = session.get("email")
        print(f"מחפש משתמש עם אימייל: {user_email}")

        data = request.json
        old_password = data.get("old_password")
        new_password = data.get("new_password")

        if not old_password or not new_password:
            return jsonify({"error": "יש להזין את כל השדות"}), 400

        # חיפוש המשתמש במסד הנתונים
        user = usersCol.find_one({"email": user_email})

        if not user:
            print(f"לא נמצא משתמש עם האימייל: {user_email}")
            return jsonify({"error": "המשתמש אינו נמצא"}), 404

        print("משתמש נמצא במסד הנתונים!")
        stored_password = user.get("password", "")
        print("סיסמה שמורה:", stored_password)

        try:
            # בדיקת הסיסמה הישנה עם werkzeug
            if not check_password_hash(stored_password, old_password):
                print("הסיסמה הישנה שגויה!")
                return jsonify({"error": "הסיסמה הישנה שגויה"}), 400

        except Exception as e:
            print(f"שגיאה בבדיקת הסיסמה: {str(e)}")
            return jsonify({"error": "שגיאה בבדיקת הסיסמה"}), 500

        print("הסיסמה הישנה נכונה!")

        try:
            # הצפנת הסיסמה החדשה עם werkzeug
            hashed_password = generate_password_hash(new_password, method='pbkdf2:sha256')

            # עדכון הסיסמה במסד הנתונים
            update_result = usersCol.update_one(
                {"email": user_email},
                {"$set": {"password": hashed_password}}
            )

            if update_result.modified_count == 1:
                print("סיסמה עודכנה בהצלחה!")
                return jsonify({"success": "הסיסמה שונתה בהצלחה!"})
            else:
                print("שגיאה בעדכון הסיסמה - לא נמצאו שינויים")
                return jsonify({"error": "שגיאה בעדכון הסיסמה"}), 500

        except Exception as e:
            print(f"שגיאה בעדכון הסיסמה: {str(e)}")
            return jsonify({"error": "שגיאה בעדכון הסיסמה במסד הנתונים"}), 500

    except Exception as e:
        print(f"שגיאה כללית: {str(e)}")
        return jsonify({"error": f"שגיאת שרת: {str(e)}"}), 500


@MyAccount.route("/get_average_rating")
def get_average_rating():
    try:
        if "email" not in session:
            return jsonify({"error": "משתמש לא מחובר"}), 401

        user_email = session.get("email")

        # מציאת כל המשובים עבור הנהג
        feedbacks = list(trempusDB["Feedbacks"].find({"DriverMail": user_email}))

        if not feedbacks:
            return jsonify({
                "average": "טרם קיבלת משוב על נסיעותיך כנהג"
            })

        # חישוב הממוצע
        total_rating = sum(feedback["rating"] for feedback in feedbacks)
        average_rating = total_rating / len(feedbacks)

        return jsonify({
            "average": f"{average_rating:.2f}"
        })

    except Exception as e:
        return jsonify({"error": f"שגיאה בקבלת הדירוג הממוצע: {str(e)}"}), 500
