export class LeftMenus {

  public LEFT_MENU = [
    {
      groupName: 'App Auth',
      appCode: 'AA',
      access: false,
      images : "assets/layoutImages/Appauth-icon.svg",
      modules: [
        {
          id: 9,
          moduleCode: 'AA-ROLE',
          key: 'roles',
          name: 'Roles',
          routeUrl: '/application-access',
          access: false,
          isActive:false
        },
        {
          id: 10,
          moduleCode: 'AA-URM',
          key: 'userRoles',
          name: 'User role mapping',
          routeUrl: '/user-roles',
          access: false,
          isActive:false
        }
      ]
    },
    {
      groupName: 'Learn',
      appCode: 'LA',
      access: false,
      images : "assets/layoutImages/LearnerApp-icon.svg",
      modules: [
        {
          id: 1,
          moduleCode: 'LA-C',
          key: 'courses',
          name: 'Courses',
          routeUrl: '/courses',
          access: false,
          isActive:false
        },
        {
          id: 4,
          moduleCode: 'LA-E',
          key: 'employees',
          name: 'Employees',
          routeUrl: '/employees',
          access: false,
          isActive:false
        },
        {
          id: 5,
          moduleCode: 'LA-R',
          key: 'reports',
          name: 'Reports',
          routeUrl: '/reports',
          access: false,
          isActive:false
        },
        {
          id: 6,
          moduleCode: 'LA-F2FR',
          key: 'f2freports',
          name: 'F2F-Reports',
          routeUrl: '/f2f-reports',
          access: false,
          isActive:false
        },
        /* {
          id: 7,
          moduleCode: 'LA-UA',
          key: 'userAccess',
          name: 'User Access',
          routeUrl: '/userAccess',
          access: false,
          isActive:false
        }, */
        {
          id: 8,
          moduleCode: 'LA-M',
          key: 'message',
          name: 'Message',
          routeUrl: '/message',
          access: false,
          isActive:false
        }
      ]
    },
    {
      groupName: 'Health & Safety',
      appCode: 'HS',
      access: false,
      images : "assets/layoutImages/IncidentApp-icon.svg",
      modules: [
        {
          id: 2,
          moduleCode: 'IT',
          key: 'incidentList',
          name: 'Incident Tracker',
          routeUrl: '/incident-list',
          access: false,
          isActive:false

        },
        {
          id: 3,
          moduleCode: 'AT',
          key: 'auditList',
          name: 'Audit Tracker',
          routeUrl: '/audit-list',
          access: false,
          isActive:false

        }
      ]
    }
  ]

  /* public LEFT_MENU = [{
    key: 'courses',
    name: 'Courses',
    routeUrl: '/courses',
    roleType: 'WEB-COURSES',
    access: false,
    show: true
  },
  {
    key: 'employees',
    name: 'Employees',
    routeUrl: '/employees',
    roleType: 'WEB-EMPLOYEES',
    access: false,
    show: true
  },
  {
    key: 'reports',
    name: 'Reports',
    routeUrl: '/reports',
    roleType: 'WEB-REPORTS',
    access: false,
    show: true
  },
  {
    key: 'f2freports',
    name: 'F2F-Reports',
    routeUrl: '/f2f-reports',
    roleType: 'WEB-REPORTS',
    access: false,
    show: true
  },
  {
    key: 'userAccess',
    name: 'User Access',
    routeUrl: '/userAccess',
    roleType: 'WEB-USERS',
    access: false,
    show: true
  },
  {
    key: 'message',
    name: 'Message',
    routeUrl: '/message',
    roleType: 'WEB-MESSAGE',
    access: false,
    show: true
  },
  {
    key: 'incidentList',
    name: 'Incident-list',
    routeUrl: '/incident-list',
    roleType: 'WEB-MESSAGE',
    access: true,
    show: false
  },
  {
    key: 'auditList',
    name: 'Audit-list',
    routeUrl: '/audit-list',
    roleType: 'WEB-MESSAGE',
    access: true,
    show: false
  },
  {
    key: 'applicationAccess',
    name: 'Application-access',
    routeUrl: '/application-access',
    roleType: 'WEB-MESSAGE',
    access: true,
    show: false
  },
  {
    key: 'userRoles',
    name: 'User-roles',
    routeUrl: '/user-roles',
    roleType: 'WEB-MESSAGE',
    access: true,
    show: false
  },
  ]; */
  constructor() {

  }
}
