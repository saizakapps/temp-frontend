export class UrlUtils {
  /*   public browserHostName = ((window.location.hostname && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') ?
      window.location.hostname : 'smyths360-dev-admin.smythstoys.com'); */

    private browserHostName = ((window.location.hostname && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') ?
     window.location.hostname : 'smyths360-dev-admin.smythstoys.com');
  //private browserHostName = 'smyths360-dev-admin.smythstoys.com';
  public AUTH_BASE_URL = `//${this.browserHostName}/`;


  // public browserHostName = this.tempHostName.replace('-admin', '');
  public HOSTNAME: any = `//${this.browserHostName}/`;
  public WEB_URL = `${this.HOSTNAME}api/web/`;
  public AUTH_URL = `${this.HOSTNAME}api/auth/`;
  public USER_URL = `${this.WEB_URL}user/`;
  public COURSE_URL = `${this.WEB_URL}course/`;
  public AUTH_URL_SSO = `${this.AUTH_BASE_URL}api/auth/`;
  public INCIDENT_USER = `${this.AUTH_BASE_URL}api/web/incident/user/`;

  constructor() {}

  public API = {
    LOGIN_SSO: `${this.AUTH_URL_SSO}login`,
    GET_USER_USERNAME: `${this.AUTH_BASE_URL}/api/web/incident/user/`,
    LOGIN_AUTH: `${this.AUTH_URL}sign-in`,
    GET_BUCKET_URL: `${this.USER_URL}get-bucket-url`,

    GET_COURSE_TYPES: `${this.COURSE_URL}get-course-types`,
    GET_COURSE_LEVELS: `${this.COURSE_URL}get-course-levels`,
    GET_CHAPTER_TYPES: `${this.COURSE_URL}get-chapter-types`,
    CREATE_UPDATE_COURSE: `${this.COURSE_URL}create-update-course`,
    GET_COURSE_DETAILS: `${this.COURSE_URL}get-course-chapters`,
    GET_COMP_TEMPLATE_TYPES: `${this.USER_URL}get-completion-templates-types`,
    GET_COMP_TEMPLATES: `${this.USER_URL}get-completion-templates`,
    POST_COMP_TEMPLATES: `${this.USER_URL}create-completion-template`,
    // UPDATE_COURSE_LISTING: `${this.COURSE_URL}update-delete-course-status`,

    GET_ROLE_GROUPS: `${this.USER_URL}getallgroups`,
    GET_ALL_COUNTRIES: `${this.USER_URL}getallcountries`,
    GET_COURSE_LIST: `${this.USER_URL}getallcourses`,
    GET_COURSE_MAPPING: `${this.USER_URL}getcoursemapping`,
    CHANGE_COURSE_STATUS: `${this.USER_URL}delete-course`,
    GET_MANAGER_LIST: `${this.USER_URL}getallmanagers`,
    UPLOAD_FILES: `${this.USER_URL}uploadimage`,
    UPLOAD_SLIDES: `${this.USER_URL}uploadppt`,
    UPLOAD_EXCEL: `${this.USER_URL}import-excel`,
    UPDATE_COURSE_SEQUENCE: `${this.USER_URL}update-course-sequence`,
    GET_EMPLOYEE_LIST: `${this.USER_URL}getallusers`,
    GET_DASHBOARD_COUNT: `${this.USER_URL}dashboard-count`,
    POST_EMPLOYEE_CREATE: `${this.USER_URL}createuser`,
    POST_EMPLOYEE_LINK: `${this.USER_URL}linkemployee`,
    POST_EMPLOYESS_STATUS: `${this.USER_URL}updateuserstatus`,
    GET_MULTIPLE_USER: `${this.USER_URL}get-multiple-user/`,
    POST_DELETE_MULTILE: `${this.USER_URL}delete-multiple-user`,

    GET_COURSE_HISTORY: `${this.USER_URL}get-course-versions/`,
    POST_INVITE_MAIL: `${this.USER_URL}send-invite-mail`,
    POST_USER_COURSE: `${this.USER_URL}getusercourses`,
    GET_FF_COURSES: `${this.USER_URL}get-ff-courses`,
    GET_LEVELS: `${this.USER_URL}get-levels/`,
    POST_SUGGEST_LEVEL: `${this.WEB_URL}user/insert-suggested-course-role-level`,
    GET_SUGGESTED_COURSES: `${this.USER_URL}get-suggested-courses`,
    GET_MANAGER_CONFIRMATION: `${this.USER_URL}get-manager-confirmation`,
    GET_ROLE_COURSES: `${this.USER_URL}get-all-role-courses`,
    DELETE_SUGGEST_COURSE: `${this.USER_URL}delete-suggested-course-role-level`,
    MANAGER_CONFIRM_COURSE: `${this.USER_URL}update-manager-confirmation`,

    /* UserManagement APIs */
    GET_USER_LIST: `${this.USER_URL}get-user-access-list`,
    POST_USER_STATUS_ACTION: `${this.USER_URL}user-based-actions`,
    GET_PORTAL_ROLES: `${this.USER_URL}get-portal-roles`,
    GET_SF_ROLES: `${this.USER_URL}get-sf-roles`,
    POST_USER_BASED_ACTION: `${this.USER_URL}user-based-actions`,

    CHANGE_PASSWORD: `${this.INCIDENT_USER}portal-change-password`,
    FORGOT_PASSWORD: `${this.INCIDENT_USER}portal-forgot-password`,

    /* Reports APIs */
    GET_EXISTING_REPORTS_CONFIG: `${this.USER_URL}get-existing-reports-config`,
    INSERT_UPDATE_REPORTS: `${this.USER_URL}get-report-list`,
    GET_SUGGESTED_LABELS: `${this.USER_URL}user-report-search-list`,
    DELETE_REPORT: `${this.USER_URL}delete-existing-reports-config`,
    GET_OUTSTANDING_REPORTS: `${this.USER_URL}get-report-list-v2`,
    GET_REPORTS: `${this.USER_URL}get-report-list`,
    SCHEDULE_REPORT: `${this.USER_URL}send-report-list`,
    GET_COURSE_NAME: `${this.USER_URL}get-filter-course`,
    GET_MAIL_STATUS: `${this.USER_URL}get-report-status`,

    /* F2F Reports API */
    GET_F2F_REPORTS: `${this.USER_URL}get-f2f-list`,
    GET_F2F_COURSE_NAME: `${this.USER_URL}get-f2f-courses`,
    GET_F2F_STATUS: `${this.USER_URL}get-f2f-job-status`,

    /* Message APIs */
    MAIL_TRIGGER: `${this.USER_URL}mail-user-store-and-role-based`,
    GET_MAIL_TEMPLATE: `${this.USER_URL}get-bulk-mail-template`,
    UPDATE_MAIL_TEMPLATE: `${this.USER_URL}update-bulk-mail-template`,

    /* Get user details */
    GET_USER_DETAILS: `${this.USER_URL}get-user-details`,

    /* Get policy categories */
    GET_POLICY_CATEGORIES: `${this.COURSE_URL}policy-categories`,

    /* App auth */
    GET_APP_MODULES: `${this.INCIDENT_USER}apps`,
    GET_AUTH_ROLES: `${this.INCIDENT_USER}roles`,
    POST_AUTH_ROLES: `${this.INCIDENT_USER}roles/add`,
    DELETE_AUTH_ROLES: `${this.INCIDENT_USER}roles/delete`,
    ASSIGN_USER_ROLE: `${this.INCIDENT_USER}roles/assign`,

    /* F2F module */
    GET_CERTIFICATES_LIST: `${this.USER_URL}get-default-certificates`
  };
}
