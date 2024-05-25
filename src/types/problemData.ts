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
    solutionInfo: SolutionInfo;
}

// 해결책 정보
export interface SolutionInfo {
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



