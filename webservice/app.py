import json
import serverless_wsgi

from flask import Flask, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

with open("data.json", "r") as fp:
    PLAYERS = json.load(fp)


def err(msg):
    if isinstance(msg, bytes):
        msg = msg.decode()
    print(f"ERROR: [{msg}]")
    return jsonify({"status": "error", "message": msg}, status=400)


def ok():
    return "ok", 200


@app.route("/status", methods=["GET"])
async def status():
    try:
        return jsonify({"status": "ok"})
    except Exception as ex:
        print(f"ERROR: {ex}")
        return err(str(ex))
    return err("unknown error")


@app.route("/user/<username>", methods=["GET"])
async def rando_user(username):
    try:
        return jsonify(PLAYERS[username])
    except Exception as ex:
        print(f"ERROR: {ex}")
        return err(str(ex))

    return err("unknown error")


def handler(event, context):
    return serverless_wsgi.handle_request(app, event, context)
