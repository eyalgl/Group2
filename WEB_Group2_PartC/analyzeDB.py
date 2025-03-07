from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://eyalgl:am4mM1Ank3WsMwbZ@trempusdb.ep83b.mongodb.net/?retryWrites=true&w=majority&appName=TrempusDB"
cluster = MongoClient(uri, server_api=ServerApi('1'))
trempusDB = cluster["TrempusDB"]
usersCol = trempusDB["Customers"]
drivesCol = trempusDB['Drives']
requestsCol = trempusDB['JoinRequests']
feedbacksCol = trempusDB['Feedbacks']

print("All users in DB:")
for user in usersCol.find():
    print(user)

print("All drives in DB:")
for drive in drivesCol.find():
    print(drive)

print("All join requests in DB:")
for request in requestsCol.find():
    print(request)

print("All feedbacks in DB:")
for feedback in feedbacksCol.find():
    print(feedback)
