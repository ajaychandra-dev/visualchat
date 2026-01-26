import {
  firstResponse,
  fourthResponse,
  secondResponse,
  thirdResponse,
} from "@/components/__mocks__/response";

export const createNodeRequest = (question: string, count: number) => {
  switch (count) {
    case 0:
      return firstResponse;
    case 1:
      return secondResponse;
    case 2:
      return thirdResponse;
    case 3:
      return fourthResponse;
    default:
      return thirdResponse;
  }
};
