import pandas as pd
import json

def get_mock_data():
    try:
        with open('data.json', 'r', encoding='utf-8') as file:
            data = json.load(file)
        return pd.DataFrame(data)
    except FileNotFoundError:
        print("file not found: data.json")
        return pd.DataFrame()