//import { DropdownOptions } from './dropDownOptions';
import { LeftMenus } from '../utils/left-menu';
import { UrlUtils } from '../utils/url.utils';
import { FormAccess } from '../utils/form-access';
import { TooltipMessage } from '../utils/tooltip-message';
//import  * as moment  from 'moment';
import { TableHeaders } from '../utils/table-headers';
import { formFieldDescription } from '../utils/form-field-label';

// import { AngularEditorConfig } from '@kolkov/angular-editor';
export class Utils {

  public urlUtils = new UrlUtils();
  public leftMenu = new LeftMenus();
  //public ddOptions = new DropdownOptions();
  public tableHeaders = new TableHeaders();
  public formAccess = new FormAccess();
  public tooltipMessage = new TooltipMessage();
  public formFieldDescriptionData = new formFieldDescription();
  //currentDate: any = moment(new Date());


  constructor() {
  }

  public NAV_BAR_HEIGHT = 60 + 30; // title height
  public FOOTER_HEIGHT = 60;
  public LEFT_MENU = this.leftMenu.LEFT_MENU;
  public TABLE_HEADERS = this.tableHeaders.TABLE_HEADERS;

  public API = this.urlUtils.API;
  public imagePath = `${this.urlUtils.HOSTNAME}api/web/user/files/`;
  public adminUrl = `${this.urlUtils.HOSTNAME}#/video`;
  public FORMAT = {
    DATE_TIME: 'DD-MM-yyyy HH:mm:ss',
    DATE: 'DD-MM-yyyy',
    DATEM: 'DD-MM-yyyy',
    TIME: 'HH:mm:ss'
  };

  /* default route role mapping */
  public DEFAULT_ROUTE_BY_ROLE: any = {
    'WEB-COURSES': ['/courses'],
    'WEB-REPORTS': ['/reports'],
    'WEB-FAQ': ['/faq'],
    'WEB-EMPLOYEES': ['/employees'],
    'WEB-SETTINGS': ['/settings'],
  };

  /*date pick config */
  // public DateRangePickerConfig = {
  //   locale: { format: this.FORMAT.DATE },
  //   alwaysShowCalendars: true,
  //   // maxDate: moment(new Date()).set({ hours: 23, minutes: 59, seconds: 59 }),
  //   // startDate: moment(this.currentDate).subtract(1, 'month').set({ hours: 0, minutes: 0, seconds: 0 }),
  //   opens: 'center',
  //   ranges: {
  //     'Last 7 days': [moment().subtract(7, 'day'), moment()],
  //     'Last 14 days': [moment().subtract(14, 'day'), moment()],
  //     'Last 1 Month': [moment().subtract(1, 'month'), moment()],
  //     'Next 7 days': [moment(), moment().add(7, 'day')],
  //     'Next 14 days': [moment(), moment().add(14, 'day')],
  //     'Next 1 Month': [moment(), moment().add(1, 'month')]
  //   }
  // };

  // public DatePickerConfig = {
  //   format: 'DD/MM/YYYY',
  //   showTwentyFourHours: true,
  //   unSelectOnClick: false,
  //   disableKeypress: true,
  //   max: moment(new Date()),
  //   showMultipleYearsNavigation: false,
  //   multipleYearsNavigateBy: 10
  // };

  /* modal config */
  MODAL_CONFIG = {
    centered: true,
    size: 'md',
    windowClass: 'modal',
    backdrop: 'static',
    keyboard: false
  };

  // public angularEditorConfig: AngularEditorConfig = {
  //   editable: true,
  //   spellcheck: true,
  //   height: '10',
  //   minHeight: '0',
  //   maxHeight: '10',
  //   width: 'auto',
  //   minWidth: '0',
  //   translate: 'yes',
  //   enableToolbar: true,
  //   showToolbar: true,
  //   placeholder: 'Enter text here...',
  //   defaultParagraphSeparator: '',
  //   defaultFontName: '',
  //   defaultFontSize: '',
  //   sanitize: false,
  //   fonts: [
  //     { class: 'arial', name: 'Arial' },
  //     { class: 'times-new-roman', name: 'Times New Roman' },
  //     { class: 'calibri', name: 'Calibri' },
  //     { class: 'comic-sans-ms', name: 'Comic Sans MS' },
  //     { class: 'roboto', name: 'Roboto' }
  //   ],
  //   customClasses: [],
  //   toolbarPosition: 'top',
  //   toolbarHiddenButtons: [
  //     ['undo', 'redo', 'subscript', 'superscript', 'htmlcode'],
  //     ['customClasses', 'toggleEditorMode', 'insertVideo'],
  //   ]
  // };

  public CourseCode: any = {
    'Regular': 'LA001',
    'SlideShow': 'LA002',
    'F2F': 'LA003',
    'Policies': 'LA004',
    'Checklist': 'LA005',
  };

  public portalRole: any = {
    'superAdmin': 'Super Admin',
    'hr': 'HR',
    'manager': 'Manager'
  };
}
