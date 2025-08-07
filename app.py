from flask import Flask, render_template, request, jsonify
from asteval import Interpreter
import re

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

if __name__ == "__main__":
    app.run(debug=True)

