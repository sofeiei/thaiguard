import sys
import joblib
import warnings
from preprocess import preprocess_text

warnings.filterwarnings('ignore')

def main():
    if len(sys.argv) > 1:
        comment = sys.argv[1]
    else:
        print("ERROR")
        return

    try:
        model = joblib.load('model.pkl')
        vectorizer = joblib.load('vectorizer.pkl')
        
        cleaned_comment = preprocess_text(comment)
        vec_comment = vectorizer.transform([cleaned_comment])
        prediction = model.predict(vec_comment)[0]
        
        print(prediction.upper())
    except Exception as e:
        print(f"ERROR: {str(e)}")

if __name__ == "__main__":
    main()