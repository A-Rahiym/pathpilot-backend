import requests
import json

def test_intent_parsing():
    url = "http://127.0.0.1:8000/parse-intent"
    
    # Test cases from the prompt examples
    test_cases = [
        "Navigate to the pharmacy",
        "Where am I?",
        "Find nearby restaurants",
        "Stop navigation"
    ]
    
    for command in test_cases:
        print(f"\nTesting command: '{command}'")
        payload = {"transcribedText": command}
        try:
            response = requests.post(url, json=payload)
            if response.status_code == 200:
                print("Success!")
                print(json.dumps(response.json(), indent=2))
            else:
                print(f"Failed with status {response.status_code}")
                print(response.text)
        except Exception as e:
            print(f"Error: {e}")
            print("Make sure the server is running: uvicorn app:app --reload")

if __name__ == "__main__":
    test_intent_parsing()
