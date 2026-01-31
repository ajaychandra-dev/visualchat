// utils/mock-ai-response.ts

const MOCK_RESPONSES = [
  "That's a great question! Let me break this down for you.",
  "I understand what you're asking. Here's my perspective:",
  "Interesting point. Let me explain this in detail.",
  "Based on my analysis, here's what I found:",
  "Let me walk you through this step by step.",
  "There are several key points to consider here.",
  "This is a complex topic. Let me elaborate:",
  "From what I can tell, the main factors are:",
  "I'll explain this with a few examples.",
  "Here's a comprehensive overview:",
];

const MOCK_SENTENCES = [
  "The key concept here is understanding the fundamental principles that govern this behavior.",
  "Research has shown that multiple factors contribute to this phenomenon.",
  "It's important to consider the historical context when analyzing these patterns.",
  "Modern approaches to this problem have evolved significantly over the past decade.",
  "There are both advantages and disadvantages to this methodology.",
  "The implementation details can vary depending on your specific use case.",
  "Best practices suggest starting with a solid foundation before adding complexity.",
  "Performance optimization becomes critical as your system scales.",
  "User experience should always be at the forefront of design decisions.",
  "Security considerations must be integrated from the beginning of development.",
  "Testing strategies play a crucial role in maintaining code quality.",
  "Documentation helps ensure long-term maintainability of the system.",
  "Collaboration between teams often leads to more innovative solutions.",
  "Data-driven insights can significantly improve decision-making processes.",
  "Continuous learning and adaptation are essential in this field.",
  "The balance between speed and accuracy depends on your priorities.",
  "Scalability challenges often emerge as usage patterns change.",
  "Integration with existing systems requires careful planning.",
  "Monitoring and observability provide valuable feedback loops.",
  "Cost-benefit analysis helps prioritize feature development.",
];

const CLOSING_SENTENCES = [
  "Does this help clarify things?",
  "Let me know if you need more details on any of these points!",
  "I hope this explanation makes sense.",
  "Feel free to ask if you have any follow-up questions.",
  "Is there a specific aspect you'd like me to dive deeper into?",
  "Would you like me to elaborate on any particular point?",
  "Let me know if this answers your question!",
];

export const generateMockAIResponse = (): string => {
  // Random number of paragraphs (1-8)
  const numParagraphs = Math.floor(Math.random() * 8) + 1;
  const paragraphs: string[] = [];

  // Add opening
  paragraphs.push(
    MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)],
  );

  // Add body paragraphs
  for (let i = 0; i < numParagraphs - 1; i++) {
    // Random number of sentences per paragraph (2-6)
    const numSentences = Math.floor(Math.random() * 5) + 2;
    const sentences: string[] = [];

    for (let j = 0; j < numSentences; j++) {
      sentences.push(
        MOCK_SENTENCES[Math.floor(Math.random() * MOCK_SENTENCES.length)],
      );
    }

    paragraphs.push(sentences.join(" "));
  }

  // Sometimes add a closing (50% chance)
  if (Math.random() > 0.5) {
    paragraphs.push(
      CLOSING_SENTENCES[Math.floor(Math.random() * CLOSING_SENTENCES.length)],
    );
  }

  return paragraphs.join("\n\n");
};
