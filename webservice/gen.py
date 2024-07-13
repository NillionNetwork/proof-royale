import json
import random

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
]


def init_player(username):
    my_achievements = random.sample(
        achievements, k=random.randint(5, len(achievements))
    )
    return {
        "status": "ok",
        "score": random.randint(100000, 30000000),
        "user": username,
        "achievements": my_achievements,
        "percentage": str((len(my_achievements) * 100) / len(achievements)) + "%",
        "completed": len(my_achievements),
    }


PLAYERS = {}
for p in range(5000):
    username = f"player{p}"
    PLAYERS[username] = init_player(username)

with open("data.json", "w") as fp:
    json.dump(PLAYERS, fp)
