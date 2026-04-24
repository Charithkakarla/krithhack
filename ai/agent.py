import logging
from groq import Groq
from backend.utils.config import settings

logger = logging.getLogger(__name__)

def generate_ai_response(query: str, student_data: dict | None) -> str:
    if not settings.groq_api_key:
        return "I'm sorry, my AI brain (Groq API Key) is not connected right now."

    try:
        client = Groq(api_key=settings.groq_api_key)
        
        context = ""
        if student_data:
            context = f"""
            You have access to the following student database record for the parent asking the query:
            Student Name: {student_data.get('name', 'Unknown')}
            Attendance: {student_data.get('attendance_percentage', 0)}%
            Math Grade: {student_data.get('math_grade', 0)}
            Science Grade: {student_data.get('science_grade', 0)}
            """
        else:
            context = "You do not have any database record for this parent's phone number yet. You MUST reply with a friendly message asking them to provide their student's full name or roll number so you can link their account."

        prompt = f"""
        You are 'Kira', a highly intelligent school assistant AI bot for parents.
        
        {context}
        
        The parent is asking: "{query}"
        
        If the parent is asking about attendance or grades, use the database record to answer them conversationally.
        If they ask for a test or quiz, generate a quick 3-question multiple choice test based on their requested subject right here in the chat.
        Be friendly, concise, and helpful. Use emojis!
        """

        response = client.chat.completions.create(
            model=settings.groq_model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.error("Failed to generate AI response: %s", e)
        return "Sorry, I had trouble processing that request with my AI."
