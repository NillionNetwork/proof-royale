import json
import os
import re
import random
import serverless_wsgi

from flask import Flask, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(
    app,
    origins=[
        "http://localhost:3000",
        "http://tlsnotary-game.vercel.app",
        "https://tlsnotary-game.vercel.app",
    ],
)

achievements = [
    "Collect all 900 Korok Seeds.",
    "Obtain all trophies.",
    "Acquire all Gwent cards.",
    "Complete all Legendary campaign missions in under 3 hours.",
    "Use Elytra to fly through a 1 by 1 gap while moving faster than 40 m/s.",
    "Catch every Pokémon in the Pokédex.",
    "Reach level 99 with all characters.",
    "Complete the game without taking any damage.",
    "Finish the game on the hardest difficulty.",
    "Unlock all characters and costumes.",
    "Build a fully functional computer in-game.",
    "Defeat all bosses without using healing items.",
    "Earn all achievements.",
    "Collect all hidden collectibles.",
    "Survive 100 days in Hardcore mode.",
    "Beat the speedrun record for the game.",
    "Complete all side quests and main story missions.",
    "Craft every item in the game.",
    "Reach the highest rank in multiplayer mode.",
    "Solve all puzzles and unlock all secret areas.",
]


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
        my_achievements = random.sample(
            achievements, k=random.randint(5, len(achievements))
        )
        return jsonify(
            {
                "status": "ok",
                "score": random.randint(100000, 30000000),
                "user": username,
                "achievements": my_achievements,
                "percentage": str((len(my_achievements) * 100) / len(achievements)) + "%",
                "completed": len(my_achievements),
            }
        )
    except Exception as ex:
        print(f"ERROR: {ex}")
        return err(str(ex))

    return err("unknown error")


def handler(event, context):
    return serverless_wsgi.handle_request(app, event, context)
