from flask import Flask, render_template, request, jsonify, abort
from asteval import Interpreter
import re
import requests

app = Flask(__name__)
aeval = Interpreter()

def clean_number(num):
    s = f"{num:.15f}"     
    s = s.rstrip('0').rstrip('.')
    return s

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json()
    expression = data.get('expression', '')
    expression = expression.replace('−', '-') \
                       .replace('×', '*') \
                       .replace('÷', '/')
    expression = re.sub(r'(\d)\s*\(', r'\1*(', expression)

    try:
        result = aeval(expression)
        result = clean_number(result)
    except Exception:
        result = "SYNTAX ERROR"

    return jsonify({'result': str(result)})

@app.route("/convert")
def convert():
    base = request.args.get('from')
    target = request.args.get('to')
    amount = request.args.get('amount', type=float)

    if not base or not target or amount is None:
        abort(400, description="Missing parameters")
    
    url = f"https://api.frankfurter.app/latest?from={base}&to={target}"
    response = requests.get(url)
    data = response.json()
    rate = data['rates'].get(target)

    if rate is None:
        abort(404, description="Currency rate not found")

    converted_amount = amount * rate
    return jsonify({"converted_amount": round(converted_amount, 4)})

@app.route("/currencies")
def get_currencies():
    url = "https://api.frankfurter.app/currencies"
    response = requests.get(url)
    currencies = response.json()  # Example: {"USD": "US Dollar", "EUR": "Euro", ...}
    return jsonify(currencies)

if __name__ == "__main__":
    app.run(debug=True)
