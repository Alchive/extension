// ProblemData.ts
export interface Problem {
    problemNumber: number;
    problemTitle: string;
    problemUrl: string;
    problemDescription: string;
    problemDifficulty: string;
    problemPlatform: string;
    algorithmNames: string[];
    problemMemo: string;
    problemState: string;
    content: string;
    code: string;
    codeLanguage: string;
    codeCorrect: boolean;
    codeMemory: string;
    codeTime: string;
}

export interface MetaData {
    problemLink: string;
    title: string;
    problemId: string;
    problem_description: string;
    levelWithLv: string;
    score: string;
    dateInfo: string;
    code: string;
    memory: string;
    runtime: string;
    language: string;
}



