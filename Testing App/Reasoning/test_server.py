import base64
import json
import tempfile
import unittest
from pathlib import Path

import server


class DeleteQuestionTests(unittest.TestCase):
    def setUp(self):
        self.tmpdir = tempfile.TemporaryDirectory()
        self.root = Path(self.tmpdir.name)
        server.DATA_FILE = self.root / "questions.json"
        server.TOPICS_DIR = self.root / "topics"
        server.UPLOADS_DIR = self.root / "uploads"

    def tearDown(self):
        self.tmpdir.cleanup()

    def test_delete_question_removes_from_persisted_file(self):
        questions = [
            {"id": "q1", "category": "Algebra", "questionText": "Q1", "options": ["A", "B", "C", "D"], "correctIndex": 0, "solutionText": "S1", "testAllowed": True},
            {"id": "q2", "category": "Algebra", "questionText": "Q2", "options": ["A", "B", "C", "D"], "correctIndex": 1, "solutionText": "S2", "testAllowed": True},
        ]
        server.persist_questions(questions)

        remaining = server.delete_question("q1")

        self.assertEqual([q["id"] for q in remaining], ["q2"])
        saved = json.loads(server.DATA_FILE.read_text(encoding="utf-8"))
        self.assertEqual([q["id"] for q in saved], ["q2"])

    def test_delete_question_returns_empty_list_for_missing_id(self):
        questions = [{"id": "q1", "category": "Algebra", "questionText": "Q1", "options": ["A", "B", "C", "D"], "correctIndex": 0, "solutionText": "S1", "testAllowed": True}]
        server.persist_questions(questions)

        remaining = server.delete_question("missing")

        self.assertEqual(len(remaining), 1)
        self.assertEqual(remaining[0]["id"], "q1")

    def test_persist_questions_allows_empty_list(self):
        saved = server.persist_questions([])

        self.assertEqual(saved, [])
        self.assertEqual(server.load_questions(), [])
        self.assertEqual(json.loads(server.DATA_FILE.read_text(encoding="utf-8")), [])

    def test_delete_question_removes_stale_topic_file(self):
        questions = [
            {"id": "q1", "category": "Algebra", "questionText": "Q1", "options": ["A", "B", "C", "D"], "correctIndex": 0, "solutionText": "S1", "testAllowed": True},
            {"id": "q2", "category": "Logic", "questionText": "Q2", "options": ["A", "B", "C", "D"], "correctIndex": 1, "solutionText": "S2", "testAllowed": True},
        ]
        server.persist_questions(questions)
        server.TOPICS_DIR.joinpath("algebra.json").write_text("[]", encoding="utf-8")

        remaining = server.delete_question("q1")

        self.assertEqual([q["id"] for q in remaining], ["q2"])
        self.assertFalse(server.TOPICS_DIR.joinpath("algebra.json").exists())
        self.assertTrue(server.TOPICS_DIR.joinpath("logic.json").exists())

    def test_delete_question_removes_uploaded_image_files(self):
        image_data = base64.b64encode(b"fake-image-bytes")
        data_url = f"data:image/png;base64,{image_data.decode('ascii')}"
        questions = [{
            "id": "qimg",
            "category": "Algebra",
            "questionText": "Question with image",
            "questionImage": data_url,
            "options": ["A", "B", "C", "D"],
            "correctIndex": 0,
            "solutionText": "Works",
            "solutionImage": data_url,
            "testAllowed": True,
        }]
        server.persist_questions(questions)

        saved = server.load_questions()
        self.assertTrue(saved[0]["questionImage"].startswith("/uploads/"))
        self.assertTrue(saved[0]["solutionImage"].startswith("/uploads/"))

        remaining = server.delete_question("qimg")
        self.assertEqual(remaining, [])
        self.assertFalse((server.UPLOADS_DIR / "algebra").exists() or any(server.UPLOADS_DIR.rglob("*")))

    def test_question_can_have_text_and_uploaded_image(self):
        image_data = base64.b64encode(b"mock-image-data")
        data_url = f"data:image/png;base64,{image_data.decode('ascii')}"
        questions = [{
            "id": "qmix",
            "category": "Algebra",
            "questionText": "Text + image",
            "questionImage": data_url,
            "options": ["A", "B", "C", "D"],
            "correctIndex": 1,
            "solutionText": "Answer is B",
            "testAllowed": True,
        }]

        saved = server.persist_questions(questions)

        self.assertEqual(saved[0]["questionText"], "Text + image")
        self.assertTrue(saved[0]["questionImage"].startswith("/uploads/"))


if __name__ == "__main__":
    unittest.main()
