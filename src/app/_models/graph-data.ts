export class CourseGraphData {
    crn: String;
    course_number: String;
    course_name: String;
    course_type: String;
    semester: String;
    course_year: Date;
    completion: Boolean;
    assigned_slos: SLOGraphData[];
    total_students: number;

    constructor(init?: Partial<CourseGraphData>) {
        Object.assign(this, init);
    }
}


export class SLOGraphData {
    slo_id: String;
    slo_description: String;
    performance_indicators: PerformanceIndicatorGraphData[];
    total_assessments: number;

    constructor(init?: Partial<SLOGraphData>) {
        Object.assign(this, init);
    }
}

export class PerformanceIndicatorGraphData {
    performance_indicator_id: String;
    performance_indicator_description: String;
    unsatisfactory: number;
    developing: number;
    satisfactory: number;
    exemplary: number;

    constructor(init?: Partial<PerformanceIndicatorGraphData>) {
        Object.assign(this, init);
    }
}

