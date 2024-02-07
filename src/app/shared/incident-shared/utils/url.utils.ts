export class UrlUtils {

  /*   public browserHostName = ((window.location.hostname && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') ?
      window.location.hostname : 'smyths360-dev-admin.smythstoys.com'); */

  private browserHostName = ((window.location.hostname && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') ?
     window.location.hostname : 'smyths360-dev-admin.smythsuat.com');
      //  smyths360-admin-qa.smythsuat.com;

 // http://smyths360-dev-admin.smythsuat.com/
  // public browserHostName = this.tempHostName.replace('-admin', '');
  public HOSTNAME: any = `//${this.browserHostName}/`;
  public WEB_URL = `${this.HOSTNAME}api/web/incident/`;
//public WEB_URL = `http://192.168.68.110:8094/api/web/incident/`;
  public AUDIT_WEB_URL = `${this.HOSTNAME}api/web/audit/`;

  // 192.168.18.85:8098, 192.168.250.61, 192.168.68.100  http://localhost:8098/
  // dev ip 35.195.16.177    smyths360-admin-dev.smythsuat.com
  //public WEB_URL = `${this.HOSTNAME}/incident/`;
  public LIST_URL = `${this.HOSTNAME}api/web/incident/view/`;
 //public LIST_URL = `http://192.168.68.110:8094/api/web/incident/view/`;
  //  public WEB_URL = `http://localhost:8098/`;
  // public LIST_URL = `http://localhost:8091/`;
  public AUTH_URL = `${this.HOSTNAME}api/auth/`;
  public USER_URL = `${this.WEB_URL}user/`;
  public COURSE_URL = `${this.WEB_URL}course/`;
   public IMAGE_URL =  `${this.WEB_URL}`;


  constructor() {
  }


  public API = {
      IMAGE_URL:this.IMAGE_URL,
    LOGIN_AUTH: `${this.AUTH_URL}login`,
    GET_BUCKET_URL: `${this.USER_URL}get-bucket-url`,

    CREATE_INCIDENT_URL:`${this.WEB_URL}saveIncident`,
    UPLOAD_INCIDENT_FILE_URL:`${this.WEB_URL}uploadFile`,
  //   UPLOAD_INCIDENT_FILE_URL:`${this.WEB_URL}upload`,
     // UPLOAD_INCIDENT_FILE_URL:`http://192.168.68.101:8094/incident/upload`,
    //UPLOAD_INCIDENT_FILE_URL:`${this.WEB_URL}evidences/upload`,
    // EVIDENCE_DELETE:`${this.WEB_URL}evidences/delete`,
   // EVIDENCE_DELETE:`${this.WEB_URL}delete`,
    EVIDENCE_DELETE:`${this.WEB_URL}deleteFile`,
    // EVIDENCE_DELETE:`http://192.168.68.102:8098/evidences/delete`,
    INCIDENT_FIELD_ACCESS_URL:`${this.WEB_URL}getFormFields`,
    UPLOAD_PROOF_OF_DOCUMENT_URL:`${this.WEB_URL}evidences/uploadProofOfPurchase`,
    CCTV_STATUS_CODE_URL:`${this.WEB_URL}getCCTVStatusCodes`,
    PHOTO_STATUS_CODE_URL:`${this.WEB_URL}getPhotoStatusCodes`,
    PRODUCT_FAULT_CODE_URL:`${this.WEB_URL}getProductFaults`, 
    INCIDENT_PRIORITY_CODE_URL:`${this.WEB_URL}getIncidentPriority`,
    PREVENTABILITILITIES_CODE_URL:`${this.WEB_URL}getPreventabilities`,
    LEGAL_STATUS_CODE_URL:`${this.WEB_URL}getLegalStatus`,
    INCIDENT_SEVERITY_CODE_URL:`${this.WEB_URL}getIncidentSeverity`,
    INCIDENT_CODES_URL:`${this.WEB_URL}getIncidentCodes`,
    SAVE_DRAFT_INCIDENT_URL:`${this.WEB_URL}saveDraftIncident`,
    DELETE_DRAFT_INCIDENT_URL:`${this.WEB_URL}deleteDraftIncident`,
    SEARCH_PRODUCT_DESCRIPTION_URL:`${this.WEB_URL}getProductsData`,
    INCIDENT_TOOLTIP_URL:`${this.WEB_URL}gettoolTipData`,
    STORE_LIST_URL:`${this.WEB_URL}getStoreIds`,
    INCIDENT_UPDATE_URL:`${this.WEB_URL}updateIncident`,
    GET_EMPLOYEE_DETAILS:`${this.WEB_URL}getEmployeeInfo`,
    RELEASE_INCIDENT_LOCK:`${this.WEB_URL}releaseIncidentLock`,
    GET_INCIDENT_HISTORY_URL:`${this.WEB_URL}getIncidentVersionDetails`,
    GET_ROLE_MAP_INFO_URL:`${this.WEB_URL}getRoleMappingInfo`,
    GENERATE_PDF_URL:`${this.WEB_URL}generatePdf`,
    INCIDENT_ADD_COMMENTS:`${this.WEB_URL}addComments`,
    GET_SUBFILTER_LIST:`${this.LIST_URL}getViewSubFiltersList`,
    GET_VIEW_DEFAULT_SUBFILTER:`${this.LIST_URL}getViewDefaultSubFiltersList`,
// http://localhost:8094/api/web/incident/view/getViewSubFiltersList
    GET_ASSIGNEES_LIST:`${this.WEB_URL}getAssigneesList`,
    INCIDENT_LIST:`${this.LIST_URL}listIncidents`,
    INCIDENT_LIST_FILTER:`${this.LIST_URL}listIncidentByFilters`,
    GET_EMPLOYEE_REGION:`${this.LIST_URL}getEmployeeRegions`,
    GET_COUNTRY_REGION:`${this.LIST_URL}getCountryRegions`,
    GET_CREATEDBYNAME_FILTER:`${this.LIST_URL}getCreatedByNamesforFilter`,
    GET_ROLES_FOR_FILTER:`${this.LIST_URL}getCreatedByRolesforFilter`,
    GET_TYPES_FOR_FILTER:`${this.LIST_URL}getIncidentTypesforFilter`,
    GET_STORE_FOR_FILTER:`${this.LIST_URL}getStoreIdsforFilter`,
    GET_STATUS_FOR_FILTER:`${this.LIST_URL}getIncidentStatusforFilter`,
    GET_PRIORITY_FOR_FILTER:`${this.LIST_URL}getIncidentPriorityforFilter`,
    GET_INCIDENT_DETAILS:`${this.WEB_URL}getIncidentDetails`,  
    INCIDENT_LOCK:`${this.WEB_URL}getLocktoUpdate`, 
    INCIDENT_UPDATE_VIEWED_STATUS:`${this.WEB_URL}updateViewedStatus`, 
    VALIDATE_CSD_NUMBER:`${this.WEB_URL}validateCSDNumber`,
    WITNESS_FILE_SAVE:`${this.WEB_URL}saveWitnessFile`,
    GET_INCIDENT_COUNT:`${this.LIST_URL}getIncidentsCount`,
    GET_INCIDENT_SUB_FILTER_COUNT:`${this.LIST_URL}getIncidentsCountforSubFilters`,
    GET_ASSIGNEES_GENERIC_LIST:`${this.WEB_URL}getAssigneesGenericList`,
    GET_INCIDENT_FORM_FIELD_DESCRIPTION:`${this.WEB_URL}getFormFieldDescription`,
    GET_INCIDENT_VIEW_LOCK_INFO:`${this.LIST_URL}getViewAndLockedInfo`,
    GET_OTHERINFO_DROPDOWN1: `${this.WEB_URL}getIncidentInjuryValues`,
    GET_OTHERINFO_DROPDOWN2: `${this.WEB_URL}getIncidentCauseValues`,
    GET_EXPORT_INCIDENT_DOWNLOAD_STATUS: `${this.WEB_URL}view/exportIncidents`,
    GET_INCIDENT_EXPORT_STATUS : `${this.WEB_URL}view/getExportStatus`,
    GET_INCIDENT_LISTDD_VALUES : `${this.WEB_URL}view/getListDropDownValues`,
    GET_EXPORT_INCIDENT_DOWNLOAD_STATUS_WITH_FILTER : `${this.WEB_URL}view/exportIncidentByFilters`,
    GET_DECRYPT_DETAILS: `${this.WEB_URL}getValues`,
    
    /* AUDIT API URLS */
    STORE_LIST : `${this.AUDIT_WEB_URL}storeList`,
    UPLOAD_FILE : `${this.AUDIT_WEB_URL}createAudit`,
    EDIT_FILE : `${this.AUDIT_WEB_URL}edit`,
    VIEW_FILE : `${this.AUDIT_WEB_URL}fileView`,
    // FILTER_STORE : `${this.AUDIT_WEB_URL}searchStore`,
    // FILTER_YEAR : `${this.AUDIT_WEB_URL}dropdown/getYear`,
    FILTER_INSPECTED : `${this.AUDIT_WEB_URL}dropdown/notInspected`,
    FILTER_INSPECTED_STORE : `${this.AUDIT_WEB_URL}storeAndNotInspected`,
    AUDIT_LIST_FILTER : `${this.AUDIT_WEB_URL}filterAudit`,
    // AUDIT_LIST_MANAGER_FILTER : `${this.AUDIT_WEB_URL}managerFilter`,
    // AUDIT_LIST_HISTORY_FILTER : `${this.AUDIT_WEB_URL}historyFilter`,
    
    GET_COUNTRY_DATA : `${this.AUDIT_WEB_URL}regionCountry`,
    AUDIT_DOWNLIAD_FILE : `${this.AUDIT_WEB_URL}downloadAudit`,
    GET_FILTERS_COUNTRY_DATA : `${this.AUDIT_WEB_URL}findCountryYearFilter`,
    GET_FILTERS_REGION_DATA : `${this.AUDIT_WEB_URL}findRegionOnlyYearFilter`,
    GET_HISTORY_VIEWED_NAME : `${this.AUDIT_WEB_URL}history`,
    // GET_ROLE_CODE: `${this.AUDIT_WEB_URL}getRoleCode`,
    GET_EXPORT_STATUS: `${this.AUDIT_WEB_URL}exportEmailStatus`,

    UPLOAD_SCORECARD_FILE : `${this.AUDIT_WEB_URL}createScoreCard`,
    DOWNLOAD_SCORECARD_FILE : `${this.AUDIT_WEB_URL}downloadScoreCard`,
    VIEW_SCORECARD_FILE : `${this.AUDIT_WEB_URL}scoreCardView`,
    GET_AUDIT_YEAR_LIST : `${this.AUDIT_WEB_URL}getAuditYear`,
    DELETE_AUDIT_FILE: `${this.AUDIT_WEB_URL}deleteAuditFiles`,
    DELETE_SCORECARD_FILE: `${this.AUDIT_WEB_URL}deleteScoreCardFiles`,
    GET_AUDIT_CONFIG_VALUES : `${this.AUDIT_WEB_URL}getAuditConfigValues`
  }
}
