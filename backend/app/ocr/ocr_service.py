import os
import re

class OCRService:
    """
    Computer Vision & OCR Service for parsing uploaded transcript/marksheet files.
    """
    @staticmethod
    def parse_marksheet(file_path):
        filename = os.path.basename(file_path).lower()
        
        # Default mock extracted subjects out of 50
        extracted_subjects = [
            {"name": "Mathematics III", "internal_marks": 44.0, "exam_marks": 75, "credits": 4},
            {"name": "Physics II", "internal_marks": 36.0, "exam_marks": 60, "credits": 4},
            {"name": "Programming in C++", "internal_marks": 22.5, "exam_marks": 45, "credits": 3}
        ]
        
        return {
            "file_name": filename,
            "parsed_count": len(extracted_subjects),
            "subjects": extracted_subjects,
            "confidence": 0.96
        }
