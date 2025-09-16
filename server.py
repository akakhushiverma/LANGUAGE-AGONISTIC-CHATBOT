# server.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import logging
import re

app = Flask(__name__)
CORS(app)

# --- Setup Logging ---
# Use Flask's logger for better practice than print()
logging.basicConfig(level=logging.INFO)

# --- Knowledge Base Loading ---
def load_knowledge_base(filepath='knowledge_base.json'):
    """Loads the knowledge base from a JSON file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        app.logger.error(f"FATAL: Knowledge base file not found at '{filepath}'.")
        return None
    except json.JSONDecodeError:
        app.logger.error(f"FATAL: Error decoding JSON from the knowledge base file.")
        return None

KNOWLEDGE_BASE = load_knowledge_base()

# --- Improved Intent Detection ---
def detect_intent(query, lang):
    """
    Detects user intent by matching keywords from the knowledge base.
    This is more scalable than a long if/elif/else chain.
    """
    if not KNOWLEDGE_BASE:
        return None

    query = query.lower()
    
    # Iterate through all intents defined in the knowledge base
    for intent_key, intent_data in KNOWLEDGE_BASE.get('intents', {}).items():
        # Check if any keyword for the current intent is in the user's query
        # Using regex for whole word matching to avoid partial matches (e.g., 'form' in 'information')
        if any(re.search(r'\b' + keyword + r'\b', query) for keyword in intent_data.get('keywords', [])):
            return intent_key
            
    return "unclear" # Default intent if no keywords match

# --- Response Generation Logic ---
def get_response_for_intent(intent, lang):
    """
    Retrieves the appropriate response from the knowledge base.
    Handles primary language, English fallback, and final fallback.
    """
    if not KNOWLEDGE_BASE:
        # Fallback if KB couldn't be loaded
        return "The service is currently unavailable. Please try again later."

    # 1. Try to get the specific response for the matched intent and language
    response = KNOWLEDGE_BASE['intents'].get(intent, {}).get('responses', {}).get(lang)
    if response:
        return response

    # 2. If not found, fall back to the English response for that intent
    response = KNOWLEDGE_BASE['intents'].get(intent, {}).get('responses', {}).get('en')
    if response:
        # Optionally, notify the user that the response is in a fallback language
        # For simplicity, we just return the English response here.
        return response
    
    # 3. If intent is unclear or has no responses, use the generic fallback message
    fallback_response = KNOWLEDGE_BASE['fallbacks'].get(lang, KNOWLEDGE_BASE['fallbacks']['en'])
    return fallback_response

@app.route('/api/chat', methods=['POST'])
def chat():
    # --- Input Validation ---
    user_data = request.json
    if not user_data or 'message' not in user_data:
        return jsonify({"error": "Invalid request: 'message' is required."}), 400

    user_message = user_data.get('message', '').strip()
    user_lang = user_data.get('language', 'en')

    if not user_message:
        return jsonify({"botResponse": "Please type a message."})

    app.logger.info(f"Received from user [{user_lang}]: {user_message}")

    # 1. Intent Recognition
    intent = detect_intent(user_message, user_lang)
    app.logger.info(f"Detected intent: {intent}")

    # 2. Response Generation
    bot_response = get_response_for_intent(intent, user_lang)

    app.logger.info(f"Sending to user [{user_lang}]: {bot_response}")

    return jsonify({"botResponse": bot_response})

if __name__ == '__main__':
    if KNOWLEDGE_BASE is None:
        print("Could not start the server due to an error with the knowledge base.")
    else:
        # Use app.run() to start the Flask development server correctly.
        # debug=True enables auto-reloading when you save the file.
        app.run(debug=True, port=5000)