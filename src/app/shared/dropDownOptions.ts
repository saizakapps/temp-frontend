export class DropdownOptions {
  constructor() {
  }

  public DD_LABELS = {
    chapterTypes: [
      {
        name: 'Text',
        key: 'text'
      },
      {
        name: 'Slide',
        key: 'slide'
      },
      {
        name: 'FileUpload',
        key: 'fileUpload'
      }
    ],

    activityTypes: [
      {
        name: 'Text',
        key: 'text'
      },
      {
        name: 'Expandable',
        key: 'example'
      },
      {
        name: 'Quiz',
        key: 'quiz'
      },
      {
        name: 'Slide',
        key: 'slide'
      },
      {
        name: 'Video',
        key: 'video'
      },
      {
        name: 'Audio',
        key: 'audio'
      }
    ],

    quizTypes: [
      {
        name: 'SingleAnswer',
        key: 'singleAnswer'
      },
      {
        name: 'MultiAnswer',
        key: 'multiAnswer'
      }
    ],

    region: [
      {
        name: '1',
        key: '1'
      },
      {
        name: '2',
        key: '2'
      },
      {
        name: '3',
        key: '3'
      },
      {
        name: '4',
        key: '4'
      }
    ],

    level: [
      {
        name: 'All',
        key: 'all'
      }
    ],

    country: [
      {
        name: 'All',
        key: 'all'
      }
    ],

    period: [
      {
        name: '6 Months',
        key: '6month'
      },
      {
        name: '1 year',
        key: '1year'
      },
      {
        name: '2 years',
        key: '2year'
      },
      {
        name: '3 years',
        key: '3year'
      },
      {
        name: '5 years',
        key: '5year'
      }
    ],

    courseType: [
      {
        name: 'All',
        key: 'All'
      },
      {
        name: 'Course',
        key: 'Course'
      },
      {
        name: 'Recurring Course',
        key: 'Recurring Course'
      },
      {
        name: 'Face To Face',
        key: 'Face To Face'
      },
      {
        name: 'Policy',
        key: 'Policy'
      }
    ],

    questionTypes: [
      {
        name: 'Multiple choice',
        key: 'multiAnswer',
        disabled: false
      },
      {
        name: 'Re-arrange the order',
        key: 'reArrangeOrder',
        disabled: false
      },
      {
        name: 'Fill the right answer',
        key: 'fillRightAnswer',
        disabled: false
      },
      {
        name: 'Free Text',
        key: 'freeText',
        disabled: false
      }
    ],

    courseStatus: [
      {
        name: 'All',
        key: 'All'
      },
      {
        name: 'Published',
        key: 'Published'
      },
      {
        name: 'Draft',
        key: 'Draft'
      },
      {
        name: 'Published & Draft',
        key: 'Published & Draft'
      },
      {
        name: 'Disabled',
        key: 'Disabled'
      }
    ],
    newCourseDD: [
      {
        name: 'Course',
        key: 'Course'
      },
      {
        name: 'Recurring Course',
        key: 'Recurring Course'
      },
      {
        name: 'Face To Face',
        key: 'Face To Face'
      },
      {
        name: 'Policy',
        key: 'Policy'
      }
    ],
    frequencyDD: [
      {
        name: 'Weekly on a Monday',
        key: 'weeklyMonday'
      },
      {
        name: 'Weekly on a Friday',
        key: 'weeklyFriday'
      },
      {
        name: 'Monthly the first Monday ',
        key: 'monthlyMonday'
      },
      {
        name: 'Monthly on the last Friday',
        key: 'monthlyFriday'
      },
      {
        name: 'Instant CSV',
        key: 'immediate'
      },
      {
        name: 'Instant CSV only checklist',
        key: 'immediateChecklist'
      }
    ],
    employeeSearch: [
      {
        name: 'Employee Name',
        key: 'employeeName'
      },
      {
        name: 'Employee Id',
        key: 'employeeId'
      }
    ],
    searchDateList: [
      {
        name: 'Date of joining',
        key: 'dateOfJoining'
      },
      {
        name: 'Employee created date',
        key: 'employeeCreatedDate'
      }
    ],
    searchF2FDateList: [
      {
        name: 'Trained date',
        key: 'trainedDate'
      },
      {
        name: 'Expired date',
        key: 'expiredDate'
      }
    ],
    filters: [
      /* {
        name: 'Show Active Employee',
        key: 'active'
      }, */
      {
        name: 'Show Inactive Employee',
        key: 'inactive'
      },
      {
        name: 'Overdue Courses',
        key: 'overdue'
      },
      {
        name: 'Expired Courses',
        key: 'expired'
      },
      {
        name: 'Suggested Courses',
        key: 'suggested'
      }
    ],
    message: [{
      name: 'Invite',
      key: 'invite'
    },
    {
      name: 'Group Message',
      key: 'groupMessage'
    }]
  }

  public sortOption = ['Reset', 'Sort By Asc', 'Sort By Desc'];
}
