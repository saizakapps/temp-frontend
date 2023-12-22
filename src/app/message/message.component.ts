import { NestedTreeControl } from '@angular/cdk/tree';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Editor } from 'ngx-editor';
import { Toolbar } from 'ngx-editor';
import { Subject } from 'rxjs';
import { ApiHandlerService } from '../shared/services/api-handler.service';
import { Utils } from '../shared/utils';
import * as $ from 'jquery';

import _ from 'underscore';
import * as __ from 'lodash';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonService } from '../shared/services/common.services';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, OnDestroy {

  view: boolean = false;
  create: boolean = false;
  update: boolean = false;

  @ViewChild('confirmModal', { static: false }) public confirmModal: ElementRef;

  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  editor: Editor;
  /* Configuration start */
  inviteSubject: string = 'Invitation to Smyths 360 Induction Training';
  inviteContent: any = this.sanitizer.bypassSecurityTrustHtml(`<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="auto" style="margin:0 auto;border:solid 1px #dddddd;background-color: transparent;margin-left: 0px !important;margin-right: 0px !important;">
  <tbody>
     <tr style="padding-left: 20px;">
        <td>
           <div style="display: flex;
              justify-content: start;
              font-size: 24px;
              font-weight: 600;
              padding-top: 20px;
              padding-left: 20px;
              padding-right: 20px;
              margin-bottom: 20px;">
              <span>Hi!</span>
           </div>
           <div style="margin-top:16px;font-size:14px;font-stretch:normal;line-height:1.25;letter-spacing:normal;color:#000;padding-bottom:10px;font-family:roboto,helvetica neue,helvetica,arial,sans-serif;padding-left: 20px;
              padding-right: 20px;">
              Welcome to Smyths Toys! We are excited that you are joining our team and we hope you enjoy your time with us.
           </div>
           <div style="margin-top:16px;font-size:14px;font-stretch:normal;line-height:1.25;letter-spacing:normal;color:#000;padding-bottom:10px;font-family:roboto,helvetica neue,helvetica,arial,sans-serif;padding-left: 20px;
              padding-right: 20px;">
              We will be in touch soon to confirm your start date. On the first day, you will get your uniform and participate in some initial training.
           </div>
           <div style="margin-top:16px;font-size:14px;font-stretch:normal;line-height:1.25;letter-spacing:normal;color:#000;padding-bottom:10px;font-family:roboto,helvetica neue,helvetica,arial,sans-serif;padding-left: 20px;
              padding-right: 20px;">
              Before then, there are a few things we would like you to do online as part of your induction. It won't take more than an hour and you'll be paid for your time.
           </div>
           <div style="margin-top:16px;font-size:14px;font-stretch:normal;line-height:1.25;letter-spacing:normal;color:#000;padding-bottom:10px;font-family:roboto,helvetica neue,helvetica,arial,sans-serif;padding-left: 20px;
              padding-right: 20px;">
              Just click on the link below to get your one time passcode, login and get started.
           </div>
           <div style="margin-top:16px;font-size:14px;font-stretch:normal;line-height:1.25;letter-spacing:normal;color:#000;padding-bottom:10px;font-family:roboto,helvetica neue,helvetica,arial,sans-serif;padding-left: 20px;
              padding-right: 20px;">
              <a th:href="@{{inviteLink}}">[[{inviteLink}]]</a>
           </div>
           <div style="margin-top:16px;font-size:14px;font-stretch:normal;line-height:1.25;letter-spacing:normal;color:#000;padding-bottom:10px;font-family:roboto,helvetica neue,helvetica,arial,sans-serif;padding-left: 20px;
              padding-right: 20px;">
              We would recommend saving this link to your mobile home page, this will make it easier to access again at a later time when more training is issued to you.
           </div>
           <div style="margin-top:16px;font-size:14px;font-stretch:normal;line-height:1.25;letter-spacing:normal;color:#000;padding-bottom:10px;font-family:roboto,helvetica neue,helvetica,arial,sans-serif;padding-left: 20px;
              padding-right: 20px;">
              If you have any issues, please get in touch - see you very soon!
           </div>
           <div>
              <img src="/assets/images/mail-logo.jpg" width="100px" style="margin-left: 10px;">
              <div style="margin-top:0px;font-size:16px;font-stretch:normal;line-height:1.25;letter-spacing:normal;color:#000;padding-bottom:5px;font-family:roboto,helvetica neue,helvetica,arial,sans-serif;padding-left: 20px;
                 padding-right: 20px;">
                 Regards
              </div>
           </div>
           <div style="margin-top:0px;font-size:18px;font-stretch:normal;line-height:1.25;letter-spacing:normal;color:#000;padding-bottom:10px;font-family:roboto,helvetica neue,helvetica,arial,sans-serif;padding-left: 20px;
              padding-right: 20px;">
              SmythsToys
           </div>
           <div style="height:0px;padding-left:5px;font-family:roboto,helvetica neue,helvetica,arial,sans-serif;opacity:0.09;border:solid 1px #000000">
           </div>
           <div style="margin-top:10px;font-size:12px;font-stretch:normal;line-height:1.25;letter-spacing:normal;color:#bdbdbd;padding-bottom:10px;font-family:roboto,helvetica neue,helvetica,arial,sans-serif;padding-left: 20px;
              padding-right: 20px;">
              This email was sent from a notification-only address that cannot accept incoming email. Please do not reply to this message.
           </div>
        </td>
     </tr>
  </tbody>
</table>`)
  /* Configuration end  */
  messageObj: any = {
    content: '',
    type: 'invite',
    templateVal: 'New'
  };
  mailTypes: any = this.utils.ddOptions.DD_LABELS.message;
  mailTemplates: any = [];
  groupMailTemplates: any = []
  clonedGroupMailTemplates: any = [];

  roleTreeControl: any = new NestedTreeControl<any>((node: any) => node.child);
  hasChild: any = (_: number, node: any) => !!node.child && node.child.length > 0;

  selectedStoreCount: number = 0;
  selectedRoleCount: number = 0;
  roleGroupList: any = [];
  cloneRoleGroupList: any = [];
  countryList: any = [];
  cloneCountryList: any = [];
  isCountryChecked: any;
  isRoleChecked: any;

  userDetailValue: any = {};

  alertModal: any = {};

  destroyed$: Subject<void> = new Subject<void>();

  constructor(public utils: Utils, private apiHandler: ApiHandlerService, private sanitizer: DomSanitizer,
    private triggerChange: ChangeDetectorRef, private ngxService: NgxUiLoaderService, private emitService: CommonService) { }

  ngOnInit(): void {
    this.getModuleAccess();
    this.editor = new Editor();
    this.changeMailType();
    this.getRoleGroups();
    this.getMailTemplate();
    this.getUserDetails();
  }

  async getUserDetails() {
    this.ngxService.start();
    this.userDetailValue = JSON.parse(localStorage.getItem("userDetails") || '{}');
    /* const response: any = await this.apiHandler.getData(this.utils.API.GET_USER_DETAILS, this.userDetailValue.id, this.destroyed$);
    localStorage.setItem('userDetails', JSON.stringify(response.payload || {}));
    this.userDetailValue = response.payload; */
    this.getCountries();
  }

  async getCountries() {
    const response: any = await this.apiHandler.getData(this.utils.API.GET_ALL_COUNTRIES, null, this.destroyed$);
    this.countryList = this.emitService.sortRegion(response.payload);
    this.cloneCountryList = $.extend(true, [], this.countryList);
    // if (![this.utils.portalRole.superAdmin, this.utils.portalRole.hr].includes(this.userDetailValue.portalRole)) {
    if (this.userDetailValue.manager === true) {
      this.setPredefinedStore(this.userDetailValue);
      this.userDetailValue?.periodUsers?.forEach(element => {
        this.setPredefinedStore(element);
      });
      this.calcSelectedStore();
    }
    this.ngxService.stop();
  }

  getModuleAccess() {
    const accessApps = JSON.parse(localStorage.getItem('accessApps'));
    let module: any;
    for (let role of accessApps) {
      module = role.app.modules.find(module => module.moduleCode === 'LA-M');
      if (module) {
        break;
      }
    }
    this.view = module.view;
    this.create = module.create;
    this.update = module.update;
  }

  setPredefinedStore(inputObj) {
    const selectedCountry = this.countryList.find(country => country.id === inputObj.countryId);
    if (selectedCountry) selectedCountry.selectStatus = 'mixed';
    const selecteRegion = selectedCountry?.child?.find(region => region.id === inputObj.regionId);
    if (selecteRegion) selecteRegion.selectStatus = 'mixed';
    const selectedStore = selecteRegion?.child?.find(store => store.id === inputObj.storeId);
    if (selectedStore) selectedStore.selectStatus = 'checked';
  }

  async getRoleGroups() {
    this.ngxService.start();
    const response: any = await this.apiHandler.getData(this.utils.API.GET_ROLE_GROUPS, null, this.destroyed$);
    const suggestedIndex = response.payload?.findIndex((element) => element.code === 'LAS');
    if (suggestedIndex) {
      response.payload.splice(0, 0, response.payload.splice(suggestedIndex, 1)[0]);
    }
    response.payload?.forEach(roleGroup => {
      roleGroup.child?.forEach(role => {
        delete role.child;
      });
    });
    this.roleGroupList = this.sortRoleGroup(response?.payload || []);
    this.cloneRoleGroupList = $.extend(true, [], this.roleGroupList);
    this.ngxService.stop();
  }

  sortRoleGroup(list) {
    list = __.sortBy(list, 'sequenceId');
    list.forEach(element => {
      element.child = _.sortBy(element.child, 'sequenceId');
    });
    return list;
  }

  changeMailType() {
    if (this.messageObj.type === 'invite') {
      this.messageObj.content = this.inviteContent;
      this.messageObj.subject = this.inviteSubject;
    } else if (this.messageObj.type === 'groupMessage') {
      this.messageObj.content = this.groupMailTemplates[0].content;
      this.messageObj.subject = this.groupMailTemplates[0].subject;
      this.messageObj.templateName = this.groupMailTemplates[0].templateName;
      this.messageObj.templateVal = '';
    }
  }

  isSendDisabled() {
    return (this.selectedRoleCount < 1 && this.selectedStoreCount < 1) || !this.messageObj.subject ||
      (this.messageObj.type !== 'invite' && (!this.messageObj.content || this.messageObj.content === '<p></p>'));
  }

  buildSelectedVal(list: any) {
    let tempArr = [];
    list.forEach(element => {
      if (element.selectStatus === 'checked') {
        tempArr.push({
          id: element.id,
          desc: element.desc
        });
      } else if (element.selectStatus === 'mixed') {
        tempArr.push({
          id: element.id,
          desc: element.desc,
          child: element.child ? this.buildSelectedVal(element.child) : undefined
        });
      }
    });
    return tempArr;
  }

  async postMail() {
    const payload = { ...this.messageObj };
    if (payload.type === 'invite') {
      delete payload.content;
      delete payload.subject;
    } else if (payload.type === 'groupMessage' && this.messageObj.templateVal) {
      this.saveMessageTemplate();
    }
    const userDetail = JSON.parse(localStorage.getItem('userDetails') || '{}');
    payload.currentUserId = userDetail?.id;
    payload.countries = this.buildSelectedVal(this.countryList);
    payload.roleGroups = this.buildSelectedVal(this.roleGroupList);
    console.log('mail ', payload);
    const response = await this.apiHandler.postData(this.utils.API.MAIL_TRIGGER, payload, this.destroyed$, 'Mail sent');
    // if ([this.utils.portalRole.superAdmin, this.utils.portalRole.hr].includes(this.userDetailValue.portalRole)) {
    if (this.userDetailValue.manager === false) {
      this.countryList = $.extend(true, [], this.cloneCountryList);
      this.isCountryChecked = false;
      this.selectedStoreCount = 0;
    }
    this.roleGroupList = $.extend(true, [], this.cloneRoleGroupList);
    this.isRoleChecked = false;
    this.selectedRoleCount = 0;
    /* this.messageObj.content = '';
    this.messageObj.subject = ''; */
    if (this.messageObj.type === 'invite') {
      this.messageObj.subject = this.inviteSubject;
    }
  }

  async saveMessageTemplate() {
    let messageIndex = 0;
    const isInsert = !this.messageObj.id;
    const cloneObj = { ...this.messageObj };
    const clonedTemplates = this.groupMailTemplates;
    if (isInsert) {
      clonedTemplates[0].id = clonedTemplates.length;
      clonedTemplates[0].content = cloneObj.content;
      clonedTemplates[0].subject = cloneObj.subject;
      clonedTemplates[0].templateName = cloneObj.templateVal;
    } else {
      messageIndex = clonedTemplates.findIndex(obj => obj.id === cloneObj.id);
      clonedTemplates[messageIndex] = cloneObj;
      clonedTemplates[messageIndex].templateName = cloneObj.templateVal;
      clonedTemplates.shift()
    }
    console.log('clonedTemplates', clonedTemplates);
    await this.apiHandler.postData(this.utils.API.UPDATE_MAIL_TEMPLATE, clonedTemplates, this.destroyed$, 'Mail template saved successfully');
    this.getMailTemplate();
  }

  async getMailTemplate() {
    this.ngxService.start();
    const response: any = await this.apiHandler.getData(this.utils.API.GET_MAIL_TEMPLATE, null, this.destroyed$);
    this.groupMailTemplates = [...response.payload] || [];
    this.groupMailTemplates.unshift({ templateName: "New", content: '', subject: '' });
    this.clonedGroupMailTemplates = $.extend(true, [], this.groupMailTemplates);
    // this.changeMailType();
    /* if (this.messageObj.type === 'groupMessage') {
      // const event = { ...this.groupMailTemplates[0] };
      // event.type = this.messageObj.type;
      this.messageObj.templateName = 'New';
      this.messageObj.templateVal = '';
      this.messageObj.content = '';
      this.messageObj.subject = '';
      this.triggerChange.detectChanges();
    } */
    /* this.groupMailTemplates[0].subject; */
    this.ngxService.stop();
  }

  selectAll(event: any, list: any, type: any) {
    list.forEach(element => {
      this.selectionToggle(event.checked, element, type);
    });
  }

  selectionToggleLeaf(isChecked, node, type) {
    node.selectStatus = isChecked ? 'checked' : 'unchecked';
    this.updateSelectionstatus(type);
  }

  selectionToggle(isChecked, node, type) {
    node.selectStatus = isChecked ? 'checked' : 'unchecked';
    if (node.child) {
      node.child.forEach(child => {
        this.selectionToggle(isChecked, child, type);
      });
    }
    this.updateSelectionstatus(type);
  }

  /* allRoleSelect(event: any) {
    this.roleGroupList?.forEach(roleGroup => {
      roleGroup.checked = 'checked';
      roleGroup?.child?.forEach(role => {
        role.checked = event.checked;
      });
    });
  } */

  updateSelectionstatus(type) {
    let listArray = [];
    if (type === 'roleGroup') {
      listArray = this.roleGroupList;
    } else if (type === 'country') {
      listArray = this.countryList;
    }
    for (let child of listArray || []) {
      this.setSelectionStatus(child);
    }
  }

  setSelectionStatus(node) {
    if (node.child && node.child.length) {
      for (let child of node.child) {
        this.setSelectionStatus(child);
      }
      let checkedChild = 0;
      let checkedMixedChild = 0;
      node.child.forEach((obj) => {
        if (obj.selectStatus === 'checked') {
          checkedChild++;
        }
        if (obj.selectStatus === 'checked' || obj.selectStatus === 'mixed') {
          checkedMixedChild++;
        }
      });
      node.selectStatus = node.child.length === checkedChild ? 'checked' : checkedMixedChild === 0 ? 'unchecked' : 'mixed';
    }
  }

  calcSelectedStore() {
    this.selectedStoreCount = 0;
    this.selectedStoreCount = this.getSelectedChildCount(this.countryList, this.selectedStoreCount);
    this.isCountryChecked = !this.countryList.find(element => element.selectStatus !== 'checked');
    return this.selectedStoreCount;
  }

  calcSelectedRole() {
    this.selectedRoleCount = 0;
    this.selectedRoleCount = this.getSelectedChildCount(this.roleGroupList, this.selectedRoleCount);
    this.isRoleChecked = !this.roleGroupList.find(element => element.selectStatus !== 'checked');
    return this.selectedRoleCount;
  }

  getSelectedChildCount(list: any, count: number) {
    list.forEach(element => {
      if (element.selectStatus === 'mixed' || element.selectStatus === 'checked') {
        if (element.child && element.child.length > 0) {
          count = this.getSelectedChildCount(element.child, count);
        } else {
          if (element.selectStatus === 'checked') {
            count++;
          }
        }
      }
    });
    return count;
  }

  toggleRole(event: any, node: any) {
    const element = event.target;
    element.classList.toggle('active');
    // const panel = element.closest('.chapterBlock').children[1];
    const panel = element.parentElement;
    if (node.isCollapsed) {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    } else {
      panel.style.maxHeight = null;
    }
    node.isCollapsed = !node.isCollapsed;
  }

  switchTemplate(event) {
    event.type = this.messageObj.type;
    event.templateVal = event.templateName === 'New' ? '' : event.templateName;
    this.messageObj = { ...event };
    this.groupMailTemplates = $.extend(true, [], this.clonedGroupMailTemplates);
  }

  openAlert(type: any) {
    this.alertModal = {};
    this.alertModal = {
      type: type
    };
    if (type === 'postMail') {
      this.alertModal['text'] = 'Please confirm to send emails';
    }
    this.confirmModal.nativeElement.click();
  }

  alertConfirmed() {
    if (this.alertModal.type === 'postMail') {
      this.postMail();
    }
    this.confirmModal.nativeElement.click();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

}
