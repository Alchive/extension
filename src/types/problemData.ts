interface ProblemCreateRequest {
    number: number;
    title: string;
    content: string;
    url: string;
    difficulty: string;
    platform: string;
    algorithms: string[];
}
export enum SolutionStatus {
    CORRECT = "CORRECT",
    INCORRECT = "INCORRECT"
}

export enum LevelStatus {
    CORRECT = "CORRECT",
    INCORRECT = "INCORRECT"
}

export interface ProblemData {
    problemCreateRequest: ProblemCreateRequest;
    memo: string;
    description: string;
    status: SolutionStatus;
}

export interface SolutionInfo {
    content: string;
    language: string;
    description: string;
    status: SolutionStatus;
    memory: number;
    time: number;
    submitAt: string;
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



