from flask import Flask, request, jsonify
from flask_cors import CORS
from tax_calculation import compute_tax  # bạn đổi tên file tùy bạn

app = Flask(__name__)
CORS(app)  # Cho phép frontend gửi request

@app.route("/api/calculate-tax", methods=["POST"])
def calculate_tax():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No input data provided"}), 400

        result = compute_tax(data)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
{
  "year":2025
  "month":1
  "residency_status": "resident",
  "dependents": 1,
  "region": 1,

  "income_labor_contract": 20000000,
  "taxed_labor_contract": false,

  "income_no_contract": 5000000,
  "taxed_no_contract": true,

  "income_foreign_contract": 30000000,
  "deducted_tax_abroad": false,

  "use_flat_rate": true,
  "business_income_flat": {
    "distribution": 100000000,
    "service": 50000000
  },

  "once_off_income": {
    "real_estate": 300000000,
    "investment": 20000000,
    "capital_transfer": 0,
    "royalty":0,
    "lottery":0,
    "inheritance":0
    
  },
  "taxed_once_off": {
    "investment": true,
    "real_estate": false
    "capital_transfer": false,
    "royalty":false,
    "lottery":false,
    "inheritance":false
  }
}
