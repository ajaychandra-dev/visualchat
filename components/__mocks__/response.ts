export const firstResponse = {
  id: "flow-123",
  name: "My Flow",
  nodes: [
    {
      id: "1",
      type: "BaseNode",
      position: { x: 0, y: 0 },
      data: {
        question: "Hi",
        answer: `Hi there!👋 I am Visual Chat, a new way to chat with LLMs`,
      },
    },
  ],
  edges: [],
};

export const secondResponse = {
  id: "flow-123",
  name: "My Flow",
  nodes: [
    {
      id: "1",
      type: "BaseNode",
      position: { x: 0, y: 0 },
      data: {
        question: "Hi",
        answer: `Hi there👋 I am Visual Chat, a new way to chat with LLMs`,
      },
    },
    {
      id: "2",
      type: "BaseNode",
      position: { x: 550, y: 0 },
      data: {
        question: "Hi What can you do?",
        answer: `I can help you with a wide range of things. 
        Here's a quick list grouped by areas — just tell me what you're interested in:

🧠 Learning & Understanding
Business & Finance 

Programming (React, Python, Next.js, etc.)
Learning & Understanding
Business & Finance 

Programming (React, Python, Next.js, etc.)
Learning & Understanding
Business & Finance 

Programming (React, Python, Next.js, etc.)
Learning & Understanding
Business & Finance 

Programming (React, Python, Next.js, etc.)`,
      },
    },
  ],
  edges: [
    {
      id: "1-2",
      source: "1",
      target: "2",
      markerStart: "circle",
      markerEnd: "circle",
      type: "smoothstep",
      style: { stroke: "#7f7f86", strokeWidth: 1 },
    },
  ],
};

export const thirdResponse = {
  id: "flow-123",
  name: "My Flow",
  nodes: [
    {
      id: "1",
      type: "BaseNode",
      position: { x: 0, y: 0 },
      data: {
        question: "Hi",
        answer: `Hi there👋 I am Visual Chat, a new way to chat with LLMs`,
      },
    },
    {
      id: "2",
      type: "BaseNode",
      position: { x: 500, y: 0 },
      data: {
        question: "Hi What can you do?",
        answer: `I can help you with a wide range of things. 
        Here's a quick list grouped by areas — just tell me what you're interested in:

🧠 Learning & Understanding
Business & Finance 

Programming (React, Python, Next.js, etc.)
Learning & Understanding
Business & Finance 

Programming (React, Python, Next.js, etc.)
Learning & Understanding
Business & Finance 

Programming (React, Python, Next.js, etc.)
Learning & Understanding
Business & Finance 

Programming (React, Python, Next.js, etc.)`,
      },
    },
    {
      id: "3",
      type: "BaseNode",
      position: { x: 1000, y: 0 },
      data: {
        question: "I need help in programming, Give me a guide!",
        answer: `Sure! Here's a  programming guide: Pick a Language 
        – Start simple: Python for beginners, JavaScript for web, C++ for speed. Learn Basics
        – Variables, data types, loops, conditionals, functions. Practice
        – Solve small problems (e.g., calculators, games, algorithms). Understand Data Structures
        – Lists, arrays, dictionaries, stacks, queues. Learn OOP (Optional at first)
        – Classes and objects. Work on Projects
        – Build something useful or fun to apply skills. Read & Debug
        – Learn from errors, read documentation, and improve code.`,
      },
    },
  ],
  edges: [
    {
      id: "1-2",
      source: "1",
      target: "2",
      markerStart: "circle",
      markerEnd: "circle",
      type: "smoothstep",
      tyle: { stroke: "#7f7f86", strokeWidth: 1 },
    },
    {
      id: "2-3",
      source: "2",
      target: "3",
      markerStart: "circle",
      markerEnd: "circle",
      type: "smoothstep",
      style: { stroke: "#7f7f86", strokeWidth: 1 },
    },
  ],
};

export const fourthResponse = {
  id: "flow-123",
  name: "My Flow",
  nodes: [
    {
      id: "1",
      type: "BaseNode",
      position: { x: 0, y: 0 },
      data: {
        question: "Hi",
        answer: `Hi there👋 I am Visual Chat, a new way to chat with LLMs`,
      },
    },
    {
      id: "2",
      type: "BaseNode",
      position: { x: 500, y: 0 },
      data: {
        question: "Hi What can you do?",
        answer: `I can help you with a wide range of things. 
        Here's a quick list grouped by areas — just tell me what you're interested in:

🧠 Learning & Understanding
Business & Finance 

Programming (React, Python, Next.js, etc.)
Learning & Understanding
Business & Finance 

Programming (React, Python, Next.js, etc.)
Learning & Understanding
Business & Finance 

Programming (React, Python, Next.js, etc.)
Learning & Understanding
Business & Finance 

Programming (React, Python, Next.js, etc.)`,
      },
    },
    {
      id: "3",
      type: "BaseNode",
      position: { x: 1000, y: 0 },
      data: {
        question: "I need help in programming, Give me a guide!",
        answer: `Sure! Here's a  programming guide: Pick a Language 
        – Start simple: Python for beginners, JavaScript for web, C++ for speed. Learn Basics
        – Variables, data types, loops, conditionals, functions. Practice
        – Solve small problems (e.g., calculators, games, algorithms). Understand Data Structures
        – Lists, arrays, dictionaries, stacks, queues. Learn OOP (Optional at first)
        – Classes and objects. Work on Projects
        – Build something useful or fun to apply skills. Read & Debug
        – Learn from errors, read documentation, and improve code.`,
      },
    },
    {
      id: "4",
      type: "BaseNode",
      position: { x: 1500, y: 0 },
      data: {
        question: "Can you give me resources for learning Python?",
        answer: `Absolutely! Here are some excellent resources for learning Python:

📚 Books:
- "Automate the Boring Stuff with Python" by Al Sweigart
- "Python Crash Course" by Eric Matthes

🌐 Online Courses:
- freeCodeCamp.org Python tutorials
- Coursera Python for Everybody (University of Michigan)

🛠 Practice Platforms:
- LeetCode
- HackerRank
- Codewars

💡 Tip: Start small, build mini projects, and gradually increase complexity.`,
      },
    },
  ],
  edges: [
    {
      id: "1-2",
      source: "1",
      target: "2",
      markerStart: "circle",
      markerEnd: "circle",
      type: "smoothstep",
      style: { stroke: "#7f7f86", strokeWidth: 1 },
    },
    {
      id: "2-3",
      source: "2",
      target: "3",
      markerStart: "circle",
      markerEnd: "circle",
      type: "smoothstep",
      style: { stroke: "#7f7f86", strokeWidth: 1 },
    },
    {
      id: "3-4",
      source: "3",
      target: "4",
      markerStart: "circle",
      markerEnd: "circle",
      type: "smoothstep",
      style: { stroke: "#7f7f86", strokeWidth: 1 },
    },
  ],
};
