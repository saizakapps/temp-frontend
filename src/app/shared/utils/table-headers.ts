export class TableHeaders {
  public TABLE_HEADERS = {
    COURSE_LIST_TABLE: [
      /* {
        name: '',
        property: 'drag',
        filter: false,
        sort: false
      }, */
      {
        name: '  ',
        property: 'select',
        filter: false,
        sort: false
      },
      /* {
        name: '   ',
        property: 'icon',
        filter: false,
        sort: false
      }, */
      /* {
        name: 'Ext.Course Name',
        property: 'externalCourseName',
        filter: false,
        sort: true
      }, */
      {
        name: 'Int.Course Name',
        property: 'internalCourseName',
        filter: false,
        sort: true
      },
      {
        name: 'Type',
        property: 'courseTypeName',
        filter: true,
        sort: false
      },
      /* {
        name: 'Role',
        property: 'roleName',
        filter: true,
        sort: false
      }, */
      {
        name: 'Created by',
        property: 'createdBy',
        filter: true,
        sort: false
      },
      {
        name: 'Last editor',
        property: 'editedBy',
        filter: true,
        sort: false
      },
      {
        name: 'Last update',
        property: 'updatedTime',
        filter: false,
        sort: true
      },
      /* {
        name: 'Completed by',
        property: 'completedBy',
        filter: false,
        sort: false
      }, */
      {
        name: 'Status',
        property: 'courseStatus',
        filter: true,
        sort: false
      }
    ],
    EMPLOYEE_MANAGEMENT_TABLE: [
      {
        name: 'select',
        property: 'select',
        filter: false,
        sort: false
      },
      {
        name: '  ',
        property: 'edit',
        filter: false,
        sort: false
      },
      /* {
        name: ' ',
        property: 'icon',
        filter: false,
        sort: false
      }, */
      {
        name: 'Employee name',
        property: 'username',
        filter: false,
        sort: true
      },
      {
        name: 'Employee ID',
        property: 'employeeId',
        filter: false,
        sort: true
      },
      {
        name: 'Date of joining',
        property: 'dateOfJoining',
        filter: false,
        sort: true
      },
      {
        name: 'Role',
        property: 'role',
        filter: true,
        sort: false
      },
      {
        name: 'Country',
        property: 'country',
        filter: false,
        sort: false
      },
      {
        name: 'Region',
        property: 'region',
        filter: false,
        sort: false
      },
      {
        name: 'Store',
        property: 'store',
        filter: false,
        sort: false
      },
      /* {
        name: 'Current Level',
        property: 'levelName',
        filter: false,
        sort: false
      }, */
      {
        name: 'Started course',
        property: 'currentCourse',
        filter: false,
        sort: false
      },
      /* {
        name: 'Course count',
        property: 'completedCourseCount',
        filter: false,
        sort: true
      },
      {
        name: 'Policy count',
        property: 'completedPolicyCount',
        filter: false,
        sort: true
      }, */
      /* {
        name: 'Upcoming course',
        property: 'upcomingcourse',
        filter: false,
        sort: false
      }, */
      /* {
        name: 'SF Status',
        property: 'employeeStatus',
        filter: true,
        sort: false
      },
      {
        name: 'Created at',
        property: 'sfEmployee',
        filter: true,
        sort: false
      }, */
      {
        name: '360 Status',
        property: 'active',
        filter: true,
        sort: false
      },
      {
        name: 'App Status',
        property: 'appStatus',
        filter: true,
        sort: false
      }
    ],
    USER_ROLE_TABLE: [
      {
        name: 'select',
        property: 'select',
        filter: false,
        sort: false
      },
      {
        name: '  ',
        property: 'edit',
        filter: false,
        sort: false
      },
      {
        name: 'Employee name',
        property: 'username',
        filter: false,
        sort: true
      },
      {
        name: 'Employee ID',
        property: 'employeeId',
        filter: false,
        sort: true
      },
      {
        name: 'Date of joining',
        property: 'dateOfJoining',
        filter: false,
        sort: true
      },
      {
        name: 'SF Role',
        property: 'role',
        filter: true,
        sort: false
      },
      {
        name: 'App Auth Role',
        property: 'appAuthRole',
        filter: false,
        sort: false
      },
      {
        name: 'Learner Role',
        property: 'learnerRole',
        filter: false,
        sort: false
      },
      {
        name: 'Incident Role',
        property: 'incidentRole',
        filter: false,
        sort: false
      },
      {
        name: 'Audit Role',
        property: 'auditRole',
        filter: false,
        sort: false
      },
      {
        name: 'Last Login',
        property: 'lastLogin',
        filter: false,
        sort: true
      },
      {
        name: 'Country',
        property: 'country',
        filter: false,
        sort: false
      },
      {
        name: 'Region',
        property: 'region',
        filter: false,
        sort: false
      },
      {
        name: 'Store',
        property: 'store',
        filter: false,
        sort: false
      },
      {
        name: '360 Status',
        property: 'active',
        filter: true,
        sort: false
      },
      {
        name: 'App Status',
        property: 'appStatus',
        filter: true,
        sort: false
      }
    ],
    REPORTS_TABLE: [
      {
        name: 'Course Name',
        property: 'courseName',
        filter: true,
        sort: false
      },
      {
        name: 'Course Type',
        property: 'courseType',
        filter: true,
        sort: false
      },
      /* {
        name: 'Level',
        property: 'level',
        filter: true,
        sort: false
      }, */
      {
        name: 'Course Start Date',
        property: 'startDate',
        filter: false,
        sort: true
      },
      {
        name: 'Course Comp. date',
        property: 'completionDate',
        filter: false,
        sort: true
      },
      {
        name: 'Expired date',
        property: 'expiredDate',
        filter: false,
        sort: true
      },
      {
        name: 'Completion %',
        property: 'completionPercentage',
        filter: false,
        sort: true
      },
      /* {
        name: 'Grade',
        property: 'grade',
        filter: false,
        sort: false
      }, */
      /* {
        name: 'Employee Name',
        property: 'employeeName',
        filter: false,
        sort: false
      }, */
      {
        name: 'First Name',
        property: 'firstName',
        filter: false,
        sort: true
      },
      {
        name: 'Last Name',
        property: 'lastName',
        filter: false,
        sort: true
      },
      {
        name: 'Employee ID',
        property: 'employeeId',
        filter: false,
        sort: true
      },
      {
        name: 'Date Of Joining',
        property: 'dateOfJoining',
        filter: false,
        sort: true
      },
      {
        name: 'Role',
        property: 'role',
        filter: false,
        sort: true
      },
      {
        name: 'User Status',
        property: 'employeeStatus',
        filter: false,
        sort: false
      },
      /* {
        name: 'Country',
        property: 'country',
        filter: false,
        sort: false
      }, */
      {
        name: 'Region',
        property: 'region',
        filter: false,
        sort: true
      },
      {
        name: 'Store id',
        property: 'storeCode',
        filter: false,
        sort: false
      },
      {
        name: 'Store',
        property: 'store',
        filter: false,
        sort: true
      }
    ],
    OUTSTANDING_REPORTS_TABLE : [
      {
        name: 'Course Name',
        property: 'courseName',
        filter: true,
        sort: false
      },
      {
        name: 'Course Type',
        property: 'courseType',
        filter: true,
        sort: false
      },
      {
        name: 'Course due date',
        property: 'dueDate',
        filter: false,
        sort: true
      },
      {
        name: 'Completion %',
        property: 'completionPercentage',
        filter: false,
        sort: true
      },
      {
        name: 'First Name',
        property: 'firstName',
        filter: false,
        sort: true
      },
      {
        name: 'Last Name',
        property: 'lastName',
        filter: false,
        sort: true
      },
      {
        name: 'Employee ID',
        property: 'employeeId',
        filter: false,
        sort: true
      },
      {
        name: 'Date Of Joining',
        property: 'dateOfJoining',
        filter: false,
        sort: true
      },
      {
        name: 'Role',
        property: 'role',
        filter: false,
        sort: true
      },
      {
        name: 'Store id',
        property: 'storeCode',
        filter: false,
        sort: false
      },
      {
        name: 'Store',
        property: 'store',
        filter: false,
        sort: true
      }
    ],
    HISTORY_TABLE: [
      {
        name: 'Date published',
        property: 'createdDate'
      },{
        name: 'Chapters',
        property: 'chapterCount'
      },{
        name: 'Restore version',
        property: 'restore'
      }
    ],
    USER_MANAGEMENT_TABLE: [
      {
        name: 'select',
        property: 'select',
        filter: false,
        sort: false
      },
      {
        name: '  ',
        property: 'edit',
        filter: false,
        sort: false
      },
      {
        name: 'Employee Name',
        property: 'employeeName',
        filter: false,
        sort: true
      },
      {
        name: 'Employee Id',
        property: 'employeeId',
        filter: false,
        sort: true
      },
      {
        name: 'SF Role',
        property: 'sfRole',
        filter: true,
        sort: false
      },
      {
        name: 'SF Status',
        property: 'sfStatus',
        filter: true,
        sort: false
      },
      {
        name: '360° Role',
        property: 'portalRole',
        filter: true,
        sort: false
      },
      {
        name: 'Status',
        property: 'portalStatus',
        filter: true,
        sort: false
      },
      {
        name: 'Last Login',
        property: 'lastLogin',
        filter: false,
        sort: true
      },
      {
        name: 'Email ID',
        property: 'email',
        filter: false,
        sort: false
      }
    ],
    LINK_EMPLOYEE_TABLE: [
      {
        name: ' ',
        property: 'details'
      },{
        name: 'Current Employee',
        property: 'currentEmployee'
      },{
        name: 'Promoted Employee',
        property: 'promotedEmployee'
      }
    ],
    F2F_REPORTS_TABLE: [
      {
        name: 'Employee id',
        property: 'employeeId',
        filter: false,
        sort: true
      },
      {
        name: 'First name',
        property: 'firstName',
        filter: false,
        sort: true
      },
      {
        name: 'Last name',
        property: 'lastName',
        filter: false,
        sort: true
      },
      {
        name: 'F2F Training name',
        property: 'courseName',
        filter: true,
        sort: false
      },
      {
        name: 'Trainer name',
        property: 'trainerName',
        filter: false,
        sort: true
      },
      {
        name: 'Trained Date',
        property: 'completionDate',
        filter: false,
        sort: true
      },
      {
        name: 'Expired date',
        property: 'expiredDate',
        filter: false,
        sort: true
      },
      {
        name: 'Store Id',
        property: 'storeCode',
        filter: false,
        sort: false
      },
      {
        name: 'Store name',
        property: 'store',
        filter: false,
        sort: true
      },
      {
        name: 'Status',
        property: 'employeeStatus',
        filter: true,
        sort: false
      },
      /* {
        name: 'Trainer id',
        property: 'trainerId',
        filter: false,
        sort: false
      }, */
    ],
    APP_AUTH_TABLE: [
      {
        name: '',
        property: 'update',
        filter: true,
        sort: false
      },
      {
        name: '360 Roles',
        property: 'roleName',
        filter: true,
        sort: false
      },
      /* {
        name: 'Apps',
        property: 'app',
        filter: true,
        sort: false
      }, */
      {
        name: 'Modules',
        property: 'modules',
        filter: false,
        sort: false
      },
      {
        name: 'Active/Inactive',
        property: 'disableIcon',
        filter: false,
        sort: false
      }
    ]

  };

  constructor() {

  }
}
