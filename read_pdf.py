import fitz  # PyMuPDF
import sys

def extract_text_from_pdf(pdf_path, out_path):
    try:
        doc = fitz.open(pdf_path)
        text = ""
        for page in doc:
            text += page.get_text()
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(text)
        print("Done")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    pdf_path = r"D:\My files\Personal\CV\New\BUBIN KORAH MATHEW (4).pdf"
    extract_text_from_pdf(pdf_path, "cv_text.txt")
