const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
  };
  
  // The provided assignment group.
  const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
      {
        id: 1,
        name: "Declare a Variable",
        due_at: "2023-01-25",
        points_possible: 50
      },
      {
        id: 2,
        name: "Write a Function",
        due_at: "2023-02-27",
        points_possible: 150
      },
      {
        id: 3,
        name: "Code the World",
        due_at: "3156-11-15",
        points_possible: 500
      }
    ]
  };
  
  // The provided learner submission data.
  const LearnerSubmissions = [
    {
      learner_id: 125,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-25",
        score: 47
      }
    },
    {
      learner_id: 125,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-02-12",
        score: 150
      }
    },
    {
      learner_id: 125,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-01-25",
        score: 400
      }
    },
    {
      learner_id: 132,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-24",
        score: 39
      }
    },
    {
      learner_id: 132,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-03-07",
        score: 140
      }
    }
  ];
//////////////////////////////////


const today = new Date();
function isValidAssignment(assignment) {
  return new Date(assignment.due_at) <= today && assignment.points_possible > 0;
}

function getSubmissionPoints(submission, assignment) {
  if (new Date(submission.submitted_at) > assignment.dueDate) {
    return submission.score * 0.9;
  }
  return submission.score;

}
function getLearnerData(course, assignmentGroup, learnerSubmissions) {
  // If an AssignmentGroup does not belong to its course (mismatching course_id), your program should throw an error, letting the user know that the input was invalid. Similar data validation should occur elsewhere within the program.
  if (assignmentGroup.course_id !== course.id) {
    throw new Error('AssignmentGroup does not belong to its course');
  }
  // here, we would process this data to achieve the desired result.
  const assignmentDetails = {};
  assignmentGroup.assignments.filter(isValidAssignment).forEach((assignment) => {
    assignmentDetails[assignment.id] = {
      dueDate: new Date(assignment.due_at),
      pointsPossible: assignment.points_possible,
    };
  });
  console.log('assignmentDetails', assignmentDetails);

  const learners = [];
  for (let i = 0; i < learnerSubmissions.length; i++) {
    const submission = learnerSubmissions[i];
    // submission to learner
    let learner = learners.find(x => x.learner_id === submission.learner_id);
    if (!learner) {
      learner = {
        learner_id: submission.learner_id,
        totalPointsGain: 0,
        TotalPointsPossible: 0,
        assignments: [],
      };
      learners.push(learner);
    }
    try {
      const assignment = assignmentDetails[submission.assignment_id];
      if (assignment === undefined) {
        throw new Error('Assignment not found');
      }
      const pointsGain = getSubmissionPoints(submission.submission, assignmentDetails[submission.assignment_id]);
      const pointsPossible = assignmentDetails[submission.assignment_id].pointsPossible;
      learner.totalPointsGain += pointsGain;
      learner.TotalPointsPossible += pointsPossible;
      learner.assignments.push({
        assignment_id: submission.assignment_id,
        result: pointsGain / pointsPossible,
      });
    } catch (e) {
      console.log('Error', e);
    }
  }

  //Convert to result
  const result = learners.map((learner) => {
    const res = {};
    learner.assignments.forEach((assignment) => {
      res[assignment.assignment_id] = assignment.result;
    });
    res.id = learner.learner_id;
    res.avg = learner.totalPointsGain / learner.TotalPointsPossible;

    return res;
  });

  return result;
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

console.log(result);
