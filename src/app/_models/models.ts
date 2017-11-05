export class Course {
    crn: String;
    course_name: String;
    course_type: String;
    semester: String;
    course_year: Date;
    faculty: Faculty;
    completion: Boolean;
    assigned_slos: SLO[];
    students: Student[];
    total_students?: number; // really only available in the progress endpoint -_-
    total_completed_students?: number; //still only in the progress endpoint

    constructor(init?: Partial<Course>) {
        Object.assign(this, init);
    }
}

export class Assessment {
    assessment_id: Number;
    total_score: Number;
    student: Student;
    course: Course;
    slo: SLO;
    scores: Score[];

    constructor(init?: Partial<Assessment>) {
        Object.assign(this, init);
    }
}

export class Faculty {
    faculty_id: String;
    email: String;
    first_name: String;
    last_name: String;
    user_type: String;

    constructor(init?: Partial<Faculty>) {
        Object.assign(this, init);
    }
}

export class Student {
    student_id: String;
    first_name: String;
    last_name: String;

    constructor(init?: Partial<Student>) {
        Object.assign(this, init);
    }
}

export  class SLO {
    slo_id: String;
    slo_description: String;
    comments: String;
    total_assessments?: number; // really only for the graphSLOData thing
    performance_indicators: PerformanceIndicator[];

    constructor(init?: Partial<SLO>) {
        Object.assign(this, init);
    }
}

export class Score {
    performance_indicator_id: String;
    score: Number;

    constructor(init?: Partial<Score>) {
        Object.assign(this, init);
    }
}

export class PerformanceIndicator {
    performance_indicator_id: String;
    performance_indicator_description: String;
    unsatisfactory_description: String;
    developing_description: String;
    satisfactory_description: String;
    exemplary_description: String;
}

