from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

app = Flask(__name__)
CORS(app)

# Loaded Hugging Face DialoGPT model and tokenizer
model = "microsoft/DialoGPT-medium"
tokenizer = AutoTokenizer.from_pretrained(model)
dialogue_model = AutoModelForCausalLM.from_pretrained(model)


@app.route("/chat", methods=["POST"])
def chat():
    """
    Endpoint to handle chat requests.

    Expects a JSON payload with a "message" field containing the user's input
    Returns a JSON response with the model's generated reply.
    """
    try:
        # Parse the incoming JSON request data
        request_data = request.json
        user_message = request_data.get("message", "")

        # Validate the user input
        if not user_message:
            return jsonify({"error": "No input provided"}), 400

        # Generate response using a model
        model_response = generate_model_response(user_message)
        return jsonify({"response": model_response})

    except Exception as error:
        # Handle any exceptions that occur during processing
        return jsonify({"error": str(error)}), 500


def generate_model_response(user_message):
    """
    Generate a response from the model based on user input.

    Args:
        user_message (str): The input message from the user.

    Returns:
         str: The generated response from the model.
    """

    # Encode the user message into token
    encoded_input = tokenizer.encode(
        user_message + tokenizer.eos_token, return_tensors="pt"
    )

    # Generate response from a model without computing gradients
    with torch.no_grad():
        response_token_ids = dialogue_model.generate(
            encoded_input, max_length=100, pad_token_id=tokenizer.eos_token_id
        )

    # Decode the generated token IDS back into a string
    decoded_response = tokenizer.decode(
        response_token_ids[:, encoded_input.shape[-1] :][0], skip_special_tokens=True
    )
    return decoded_response


if __name__ == "__main__":
    # Run the flask in debug mode
    app.run(debug=True)
