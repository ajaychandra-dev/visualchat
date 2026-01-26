export const firstResponse = {
  id: "flow-123",
  name: "My Flow",
  nodes: [
    {
      id: "1",
      type: "BaseNode",
      position: { x: 0, y: 0 },
      data: {
        question: "Hi What can you do?",
        answer: `Hi! I can help you with a wide range of things. `,
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
        question: "Hi What can you do?",
        answer: `Hi! I can help you with a wide range of things. 
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
      id: "2",
      type: "BaseNode",
      position: { x: 550, y: 0 },
      data: {
        question: "I need help in making an app",
        answer: "Sure! I can help you with that",
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
        question: "Hi What can you do?",
        answer: "I can help you in various tasks",
      },
    },
    {
      id: "2",
      type: "BaseNode",
      position: { x: 250, y: 0 },
      data: {
        question: "I need help in making an app",
        answer: "Sure! I can help you with that",
      },
    },
    {
      id: "3",
      type: "BaseNode",
      position: { x: 500, y: 0 },
      data: {
        question: "Can you help with design too?",
        answer: "Yes, I can assist with UI/UX design as well.",
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
