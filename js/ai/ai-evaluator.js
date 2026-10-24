// ============================================================
// AI Evaluator — تقييم الأسئلة المقالية
// ============================================================

// هنقرأ المفتاح من متصفح المستخدم عشان ميتحطش في الكود
let GROQ_API_KEY = localStorage.getItem('groq_api_key') || 'YOUR_GROQ_API_KEY_HERE';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function evaluateEssay(question, studentAnswer) {
  // لو مفيش مفتاح، نستخدم تقييم وهمي
  if (!GROQ_API_KEY || GROQ_API_KEY === 'YOUR_GROQ_API_KEY_HERE') {
    console.warn('Groq API Key is missing. Using mock evaluation.');
    return mockEvaluation(studentAnswer);
  }

  const prompt = `
أنت خبير تسويق ومقيّم صارم.
السؤال: "${question}"
إجابة الطالب: "${studentAnswer}"

قدم تقييماً موضوعياً يتكون من:
1. الدرجة (من 0 إلى 100).
2. ما نجح فيه الطالب (نقطة أو اثنتين).
3. ما يحتاج تحسينه (نقطة أو اثنتين).
4. توصية محددة.

كن دقيقاً ومشجعاً. أرجع النتيجة بتنسيق JSON فقط:
{
  "score": 0-100,
  "strengths": ["..."],
  "improvements": ["..."],
  "recommendation": "..."
}
`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error(`AI API Error: ${response.status}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);

  } catch (error) {
    console.error('AI Evaluation failed:', error);
    return mockEvaluation(studentAnswer);
  }
}

// دالة تقييم وهمية للتجربة بدون API
function mockEvaluation(answer) {
  const wordCount = answer.trim().split(/\s+/).length;
  let score = 50;
  if (wordCount > 20) score = 70;
  if (wordCount > 50) score = 85;
  if (wordCount > 80) score = 95;

  return {
    score: score,
    strengths: ['أجبت على السؤال', 'استخدمت مصطلحات مناسبة'],
    improvements: ['أضف أمثلة عملية أكثر', 'يمكنك التوسع في الشرح'],
    recommendation: 'راجع الدرس وركز على التطبيق العملي.'
  };
}
