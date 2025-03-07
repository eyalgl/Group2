import os
import pymongo
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = os.environ.get('DB_URI')

cluster = MongoClient(uri, server_api=ServerApi('1'))
trempusDB = cluster["TrempusDB"]
usersCol = trempusDB["Customers"]
drivesCol = trempusDB['Drives']
requestsCol = trempusDB['JoinRequests']
feedbacksCol = trempusDB['Feedbacks']

# create all necessary functions
def get_list_of_customers():
    return list(usersCol.find())


def insert_customer(customer_dict):
    usersCol.insert_one(customer_dict)



