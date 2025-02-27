from flask import request, jsonify
from app.apis import api
from flask_restful import Resource
from app.utils.helper_functions import load_questions
from langchain.prompts import ChatPromptTemplate
from app.utils.helper_functions import get_llm


# Initialize the LLM model
gemini_llm = get_llm()

# Enhanced template for the feedback and recommendations prompt
template = """
You are an intelligent tutor providing personalized study recommendations to a student based on their overall performance in questions related to Python programming language.

Student's Answer Analysis:
{performance_summary}

When analyzing Python code questions, pay special attention to:
- String manipulation and printing concepts
- Input/output handling
- Operator precedence and expression evaluation
- Variable assignment and scope
- Basic control structures
- Different question types (MCQ, MSQ, CAT)

Based on this analysis, provide:
1. Overall feedback on the student's performance, highlighting patterns of strengths and weaknesses
2. Comprehensive personalized study recommendations, such as relevant concepts to review, study resources, articles, topic videos, or exercises to improve understanding
3. Specifically address any misconceptions about Python syntax or concepts that may be evident

Ensure the feedback is clear, encouraging, and tailored to the student's learning needs.
"""


class FeedBackAndRecommendations(Resource):
    def post(self):
        data = load_questions()
        user_answers = request.json.get('submitted_answers', [])

        question_map = {q["qid"]: q for q in data["questions"]}

        # Prepare individual question assessments first
        question_assessments = []
        correct_count = 0
        partially_correct_count = 0
        incorrect_count = 0

        for ans in user_answers:
            qid = ans["qid"]
            student_answer = ans["answer"]

            if qid in question_map:
                correct_answer = question_map[qid]["answer"]
                question_type = question_map[qid]["type"]

                # Evaluation logic based on question type
                if question_type in ["MCQ", "MSQ"]:
                    is_correct = set(student_answer) == set(correct_answer)
                    is_partially_correct = (
                        set(student_answer).issubset(set(correct_answer)) and
                        len(student_answer) > 0 and
                        not is_correct
                    )
                elif question_type == "CAT":  # Computer Adaptive Test / text input
                    # For text answers, we do exact matching
                    is_correct = student_answer[0] == correct_answer[0] if len(
                        student_answer) > 0 else False
                    is_partially_correct = False  # No partial credit for text answers
                else:
                    # Default case
                    is_correct = set(student_answer) == set(correct_answer)
                    is_partially_correct = set(student_answer).issubset(
                        set(correct_answer)) and not is_correct

                # Determine accuracy status
                if is_correct:
                    accuracy = "Correct"
                    correct_count += 1
                elif is_partially_correct:
                    accuracy = "Partially Correct"
                    partially_correct_count += 1
                else:
                    accuracy = "Incorrect"
                    incorrect_count += 1

                # Add to list of assessments with enhanced information
                question_assessments.append({
                    "qid": qid,
                    "question": question_map[qid]["question"],
                    "question_type": question_type,
                    "correct_answer": correct_answer,
                    "student_answer": student_answer,
                    "accuracy": accuracy
                })

        # Create a performance summary for all questions
        total_questions = len(question_assessments)
        performance_summary = f"Total Questions: {total_questions}\n"
        performance_summary += f"Correct: {correct_count} ({correct_count/total_questions*100:.1f}%)\n"
        performance_summary += f"Partially Correct: {partially_correct_count} ({partially_correct_count/total_questions*100:.1f}%)\n"
        performance_summary += f"Incorrect: {incorrect_count} ({incorrect_count/total_questions*100:.1f}%)\n\n"

        # Add detailed question-by-question breakdown with enhanced information
        performance_summary += "Question-by-Question Breakdown:\n"
        for i, assessment in enumerate(question_assessments, 1):
            q_data = question_map[assessment['qid']]

            performance_summary += f"\nQuestion {i}: {q_data['question']}\n"

            # Include code if present
            if 'code' in q_data:
                performance_summary += f"Code:\n```python\n{q_data['code']}\n```\n"

            # Include description if present
            if 'description' in q_data:
                performance_summary += f"Description: {q_data['description']}\n"

            # Include input if present
            if 'input' in q_data:
                input_str = '\n'.join(q_data['input'])
                performance_summary += f"Input:\n{input_str}\n"

            # Include options if present
            if 'options' in q_data:
                performance_summary += "Options:\n"
                for opt_key, opt_value in q_data['options'].items():
                    performance_summary += f"- {opt_key}: {opt_value}\n"

            performance_summary += f"- Question Type: {q_data['type']}\n"
            performance_summary += f"- Correct Answer: {q_data['answer']}\n"
            performance_summary += f"- Student Answer: {assessment['student_answer']}\n"
            performance_summary += f"- Accuracy: {assessment['accuracy']}\n"

        # Make a single LLM call for comprehensive feedback
        prompt = ChatPromptTemplate.from_template(template).format(
            performance_summary=performance_summary
        )

        comprehensive_feedback = gemini_llm.invoke(prompt).content

        # Build enhanced response with both the individual assessments and the comprehensive feedback
        feedback_response = {
            "performance_summary": {
                "total_questions": total_questions,
                "correct": correct_count,
                "partially_correct": partially_correct_count,
                "incorrect": incorrect_count,
                "percent_correct": correct_count/total_questions*100 if total_questions > 0 else 0
            },
            "question_assessments": [
                {
                    "qid": assessment["qid"],
                    "question": assessment["question"],
                    "question_type": assessment["question_type"],
                    "correct_answer": assessment["correct_answer"],
                    "student_answer": assessment["student_answer"],
                    "is_correct": assessment["accuracy"] == "Correct",
                    "is_partially_correct": assessment["accuracy"] == "Partially Correct"
                }
                for assessment in question_assessments
            ],
            "comprehensive_feedback": comprehensive_feedback
        }

        return jsonify(feedback_response)


api.add_resource(FeedBackAndRecommendations, '/api/feedback-recommendations')

# Sample input JSON:
# {
#     "submitted_answers": [
#         {"qid": 1, "answer": ["D"]},
#         {"qid": 2, "answer": ["B"]},
#         {"qid": 3, "answer": ["B", "D"]},
#         {"qid": 4, "answer": ["B", "C"]},
#         {"qid": 5, "answer": ["B"]},
#         {"qid": 6, "answer": ["1020"]}
#     ]
# }
