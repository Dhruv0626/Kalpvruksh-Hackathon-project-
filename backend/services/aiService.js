const QuestionGroup = require('../models/QuestionGroup');

// Stop words for keyword similarity
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
  'will', 'with', 'what', 'how', 'why', 'can', 'you', 'explain', 'tell', 'me',
  'i', 'do', 'not', 'dont', 'understand', 'please', 'does', 'mean'
]);

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

function calculateJaccardSimilarity(textA, textB) {
  const tokensA = new Set(tokenize(textA));
  const tokensB = new Set(tokenize(textB));

  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  let intersection = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) {
      intersection++;
    }
  }

  const union = new Set([...tokensA, ...tokensB]).size;
  return union === 0 ? 0 : intersection / union;
}

function classifyCategory(text) {
  const lower = text.toLowerCase();

  if (
    lower.includes('due') ||
    lower.includes('deadline') ||
    lower.includes('attendance') ||
    lower.includes('exam') ||
    lower.includes('submission date') ||
    lower.includes('slides') ||
    lower.includes('recording') ||
    lower.includes('time') ||
    lower.includes('schedule')
  ) {
    return 'administrative';
  }

  if (
    lower.includes('mic') ||
    lower.includes('microphone') ||
    lower.includes('voice') ||
    lower.includes('audio') ||
    lower.includes('lag') ||
    lower.includes('screen') ||
    lower.includes('sound') ||
    lower.includes('terminal') ||
    lower.includes('compiler') ||
    lower.includes('error') ||
    lower.includes('cannot find symbol') ||
    lower.includes('install')
  ) {
    return 'technical';
  }

  if (
    lower.includes('homework') ||
    lower.includes('assignment') ||
    lower.includes('lab') ||
    lower.includes('project') ||
    lower.includes('exercise')
  ) {
    return 'homework';
  }

  return 'conceptual';
}

function calculatePriority(category, studentCount, isClassWide) {
  if (isClassWide || studentCount >= 5) {
    return 'high';
  }

  if (category === 'conceptual') {
    return studentCount >= 2 ? 'high' : 'medium';
  }

  if (category === 'technical') {
    return 'medium';
  }

  return 'low';
}

/**
 * Main AI Clustering Service
 * Connects to Python FastAPI SentenceTransformer AI service,
 * falling back to internal similarity clustering if Python microservice is offline.
 */
async function processQuestionWithAi(classId, questionText, explicitCategory = null) {
  let category = explicitCategory || classifyCategory(questionText);

  // Find active question groups for this class in same or general category
  const existingGroups = await QuestionGroup.find({
    classId,
    status: 'unanswered',
  });

  const existingQuestions = existingGroups.map((g) => g.mainQuestion);
  let pythonResult = null;

  // Attempt Python AI Microservice (SentenceTransformers embeddings)
  if (existingQuestions.length > 0) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const aiResponse = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText,
          existing_questions: existingQuestions,
          repeat_count: 1,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (aiResponse.ok) {
        pythonResult = await aiResponse.json();
      }
    } catch (err) {
      // Python AI service not running on port 8000; seamlessly use internal NLP
    }
  }

  let bestMatch = null;
  let highestScore = 0;

  if (pythonResult && pythonResult.similar && pythonResult.matched_question) {
    bestMatch = existingGroups.find((g) => g.mainQuestion === pythonResult.matched_question) || null;
    highestScore = pythonResult.similarity_score || 0.75;
    if (pythonResult.category) {
      category = pythonResult.category.toLowerCase();
    }
  } else {
    // Fallback: Internal Token & Jaccard similarity
    for (const group of existingGroups) {
      const similarity = calculateJaccardSimilarity(questionText, group.mainQuestion);
      if (similarity > highestScore) {
        highestScore = similarity;
        bestMatch = group;
      }
    }
  }

  // Threshold for grouping
  const SIMILARITY_THRESHOLD = 0.35;

  if (bestMatch && highestScore >= SIMILARITY_THRESHOLD) {
    // Update existing group
    const newCount = (bestMatch.studentCount || 1) + 1;
    const isClassWide = newCount >= 3 && bestMatch.category === 'conceptual';
    const newPriority = calculatePriority(bestMatch.category, newCount, isClassWide);

    bestMatch.studentCount = newCount;
    bestMatch.classWide = isClassWide;
    bestMatch.priority = newPriority;
    await bestMatch.save();

    return {
      group: bestMatch,
      isNewGroup: false,
      similarityScore: highestScore,
      category: bestMatch.category,
      priority: newPriority,
    };
  }

  // Create new group
  const priority = calculatePriority(category, 1, false);
  const newGroup = await QuestionGroup.create({
    classId,
    mainQuestion: questionText,
    category,
    studentCount: 1,
    priority,
    classWide: false,
    status: 'unanswered',
  });

  return {
    group: newGroup,
    isNewGroup: true,
    similarityScore: 1.0,
    category,
    priority,
  };
}

module.exports = {
  processQuestionWithAi,
  classifyCategory,
  calculatePriority,
  calculateJaccardSimilarity,
};
