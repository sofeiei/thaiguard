from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
from preprocess import preprocess_text

app = Flask(__name__)
CORS(app) # อนุญาตให้ Next.js เรียกใช้งานได้

# โหลดโมเดลตอนเปิดเซิร์ฟเวอร์
model = joblib.load('model.pkl')
vectorizer = joblib.load('vectorizer.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        comment = data.get('text', '')
        
        # ใช้งานแบบเดิมเป๊ะๆ
        cleaned_comment = preprocess_text(comment)
        vec_comment = vectorizer.transform([cleaned_comment])
        prediction = model.predict(vec_comment)[0]
        
        return jsonify({"safe": True if prediction == 'safe' else False, "result": prediction.upper()})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
