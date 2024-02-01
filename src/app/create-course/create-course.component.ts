import * as __ from 'lodash';
import * as $ from 'jquery';
import * as CKEditor from '../ckeditor/ckeditor';
import * as html2pdf from 'html2pdf.js';
import _ from 'underscore';
import moment from 'moment';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ApiHandlerService } from '../shared/services/api-handler.service';
import { CdkDrag, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonService } from '../shared/services/common.services';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { HttpClient } from '@angular/common/http';
import { MediaFileService } from '../file-upload/media-file.service';
import { NestedTreeControl } from '@angular/cdk/tree';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Utils } from '../shared/utils';



@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss'],
  host: { 'window.beforeunload': 'confirmLeavePage' }
})
export class CreateCourseComponent implements OnInit, OnDestroy {

  view: boolean = false;
  create: boolean = false;
  update: boolean = false;

  @ViewChild('uploadFileInput', { static: false }) uploadFileInput!: ElementRef;
  @ViewChild('confirmModal', { static: false }) public confirmModal: ElementRef;
  @ViewChild('historyModal', { static: false }) public historyModal: ElementRef;

  public Editor = CKEditor;

  // private isPDFLoading: boolean = false;
  /* Activity type variables */
  courseCode: any = this.utils.CourseCode;
  // courseTypes: any = [];
  chapterTypes: any = this.utils.ddOptions.DD_LABELS.chapterTypes;
  quizTypes: any = this.utils.ddOptions.DD_LABELS.quizTypes;
  activityTypes: any = this.utils.ddOptions.DD_LABELS.activityTypes;

  selectedForm: any = 'courseContent';

  publishDraft: any = {};

  publishCourse: any = {};
  course: any = {
    courseId: null,
    chapters: [
      {
        chapterId: 1,
        isExpanded: true,
        activities: [{ activityId: 1, activityType: 'text', content: '' }, { activityId: 2, content: '' }],
        chapterType: 'text',
        questions: []
      },
      {
        chapterId: 2,
        activities: [{ activityId: 1, activityType: 'text', content: '' }, { activityId: 2, content: '' }],
        questions: []
      }
    ],
    completionMessage: ''
  };
  copyCourseObj: any = $.extend(true, {}, this.course);
  clonedCourse: any;
  copiedCourseName: boolean = true;
  courseTypeDetail: any = {};
  courseConfig: any = {};
  apiCount = 0;
  nonFileActivities: any = ['text', 'example', 'quiz', 'checklist'];
  nonlevelCourses: any = [this.courseCode.Policies, this.courseCode.Checklist];
  autoSaveInterval: any;
  imagePath: any;

  courseHistory: any = [];
  historyColumns: any = [];
  historyColumnsToDisplay: any = [];

  selectedChapter: any = this.course.chapters[0];
  selectedActivity: any = this.course.chapters[0].activities[0];
  selectedChapterIndex: any = 0;
  selectedQuestionnaire: any = this.course.chapters[0];
  selectedQuestionnaireIndex: number = 0;
  questionLimit: any = [];
  totalQuestions: any = 0;
  step: any;

  completionObject: any = { content: '' };

  /* Drop downs */
  roleGroupList: any = [];
  cloneRoleGroupList: any = [];
  selectedLevelCount: any;
  isSuggestedCourse: any = false;
  // selectedRoleCount: any;
  selectedStoreCount: number = 0;
  periodItems: any = this.utils.ddOptions.DD_LABELS.period;
  policyCategory: any = [];
  countryList: any = [];
  cloneCountryList: any = [];
  storeCount: any;
  levelCount: any;

  /* Completion message template */
  compTemplates: any = [];
  compTemplateObj: any = { id: 'new' };


  previousPage: any = 0;
  currentPage: any = 0;

  //pdfVariables
  rotation = 0;
  zoom = 1;

  // ShowShimmer
  showShimmer = false;


  editorText: any;
  angularEditorConfig: AngularEditorConfig = this.utils.angularEditorConfig;

  roleTreeControl: any = new NestedTreeControl<any>((node: any) => node.child);
  hasChild: any = (_: number, node: any) => !!node.child && node.child.length > 0;

  alertModal: any = {};

  pdfUrl: any;

  policyGroupEvent: any;

  quizPositionItems: any = [{name: 'End of course', key: true}, {name: 'Each chapter', key: false}];
  quizPosition: boolean = true;
  randomLimit: any;

  createCourseCallCount: number = 0;

  /* F2F variables */
  categories: any = this.utils.ddOptions.DD_LABELS.period;
  questionTypes: any = this.utils.ddOptions.DD_LABELS.questionTypes;
  completionCategories: any = [];
  validCompletionCategories: any = [];

  /* Second country region store DD variables */
  treeControl: any = new NestedTreeControl<any>((node: any) => node.child);
  treeHasChild: any = (_: number, node: any) => !!node.child && node.child.length > 0;

  certificationItemTableColumns: any = this.utils.TABLE_HEADERS.CERTIFICATE_ITEMS_TABLE;

  certificationItems: any[] = [
    {
      countries: [],
      id: '',
      name: '',
      certificateUrl: '',
      renderingData: {
        countryList: this.setSelected(this.cloneCountryList, this.calcSelectedStore() > 0 ? this.buildSelectedCountries(this.countryList): this.setCountryStatusChecked($.extend(true, [], this.countryList)), 0),
        selectedStoreCount: 0
      }
    }
  ];

  destroyed$: Subject<void> = new Subject<void>();


  constructor(
    public utils: Utils, private router: Router, private mediaService: MediaFileService, private errorHandler: ErrorHandlerService,
    private apiHandler: ApiHandlerService, private ngxService: NgxUiLoaderService, private emitService: CommonService, private http: HttpClient
  ) {
    this.getImagePath();
    this.historyColumns = utils.TABLE_HEADERS.HISTORY_TABLE;
    this.historyColumnsToDisplay = this.historyColumns.map(col => col.name);
  }

  async getImagePath() {
    const response: any = await this.apiHandler.getData(this.utils.API.GET_BUCKET_URL, null, this.destroyed$);
    this.imagePath = response.payload.mediaUrl; // url
    this.pdfUrl = response.payload.url;
  }

  ngOnInit(): void {
    this.ngxService.stop();
    this.getModuleAccess();
    this.emitService.commonSubjectResEmit$.pipe(
      takeUntil(this.destroyed$)).subscribe((obj: any) => {
        this.checkCourseMod();
      });
    this.ngxService.stop();
    this.showShimmer = true;
    this.getCountries();
    this.getRoleGroups();
    this.getPolicyCategories();
    this.autoSaveCourse();
  }

  getModuleAccess() {
    const accessApps = JSON.parse(localStorage.getItem('accessApps'));
    let module: any;
    for (let role of accessApps) {
      module = role.app.modules.find(module => module.moduleCode === 'LA-CC');
      if (module) {
        break;
      }
    }
    this.view = module.view;
    this.create = module.create;
    this.update = module.update;
  }

  /* get policy category */
  async getPolicyCategories() {
    const response: any = await this.apiHandler.getData(this.utils.API.GET_POLICY_CATEGORIES, '', this.destroyed$);
    this.policyCategory = response.payload || [];
  }

  setPolicyCategory(event: any) {
    this.policyGroupEvent = event
    this.course.categoryName = event.name;
    this.course.categoryId = event.id;
  }

  @HostListener('window:beforeunload', ['$event'])
  confirmLeavePage(event: any) {
    return !this.checkCourseMod();
  }

  updateInternalName() {
    if (this.copiedCourseName) {
      this.course.internalCourseName = this.course.externalCourseName;
    }
  }

  switchPulishDraft(viewType: any) {
    this.courseTypeDetail.view = viewType;
    this.setPredefinedVal(this.publishDraft[this.courseTypeDetail.view]);
  }

  getCourseConfig() {
    this.courseTypeDetail = JSON.parse(localStorage.getItem('courseType') || '{}');
    const courseTypeCode = this.courseTypeDetail?.courseTypeCode || '';
    const courseCategory = JSON.parse(localStorage.getItem('courseCategory') || '[]');
    this.courseConfig = courseCategory.find((cat) => cat.code === courseTypeCode);
    // this.courseTypes = courseCategory.filter((cat) => [this.courseCode.Regular, this.courseCode.Recurring].includes(cat.code));
    if (this.courseConfig.completionMessage) {
      this.getCompTemplates();
      this.getCompletionTypeTemplate();
    }
    // Change chaptertype & activitytype if course type is checklist
    if (this.courseConfig.code === this.courseCode.Checklist) {
      this.course = {
        courseId: null,
        chapters: [
          {
            chapterId: 1,
            isExpanded: true,
            activities: [{ activityId: 1, activityType: 'checklist', content: '' }, { activityId: 2, content: '' }],
            chapterType: 'checklist',
            questions: []
          },
          {
            chapterId: 2,
            activities: [{ activityId: 1, activityType: 'checklist', content: '' }, { activityId: 2, content: '' }],
            questions: []
          }
        ]
      };
      this.selectedChapter = this.course.chapters[0];
      this.selectedActivity = this.course.chapters[0].activities[0];
    }
    this.setSelectedForm();
    if (!this.courseConfig) {
      localStorage.setItem('canDeactivate', 'true');
      this.router.navigate(['/courses']);
    }
    if (this.courseTypeDetail.type === 'edit' || this.courseTypeDetail.type === 'copy') {
      this.getCourseDetails();
    } else {
      if ([this.courseCode.F2F, this.courseCode.Checklist].includes(this.courseConfig.code)) {
        this.course.managerConfirmation = true;
      } else if (this.courseConfig.code === this.courseCode.SlideShow) {
        this.selectedActivity.activityType = 'slideShow';
      }
      // this.ngxService.stop();
      this.clonedCourse = $.extend(true, {}, this.course);
      this.showShimmer = false;
    }
    if(this.courseConfig.courseTypeDesc == 'Policies'){
      this.chapterTypes = this.chapterTypes.filter((x:any) => {
       return x.name !== 'Slide'
      })
      this.activityTypes = this.activityTypes.filter((x:any) => {
       return x.name == 'Text' || x.name == 'Expandable'
      })
    }
    /* Set selected countries for cert items */
    if (this.courseConfig.code === this.courseCode.F2F) {
      this.getCertificates();
      this.certificationItems[0].countries = this.setCountryStatusChecked($.extend(true, [], this.countryList));
      this.setRenderingDataForCertificationItems();
    }
  }

  async getCompletionTypeTemplate() {
    const response: any = await this.apiHandler.getData(this.utils.API.GET_COMP_TEMPLATE_TYPES, '', this.destroyed$);
    this.completionCategories = response.payload || [];
    this.completionCategories.forEach(element => {
      element.content = '';
    });
    this.selectedCompletionType = this.completionCategories[0];
    this.getF2FCompTemplates(false);
  }

  compCategoryTemplates: any = [];
  async getF2FCompTemplates(isGetCourseDetails: boolean) {
    const param = {
      typeId: !isGetCourseDetails ? this.selectedCompletionType.id : null,
      courseId: isGetCourseDetails ? this.courseTypeDetail.courseId : null,
      code: this.courseConfig.code
    }
    const response: any = await this.apiHandler.postData(this.utils.API.GET_COMP_TEMPLATES, param, this.destroyed$);
    if (isGetCourseDetails) {
      this.completionCategories.forEach(category => {
        let res = response.payload.find(c => c.typeId === category.id);
        if (res) {
          category.content = res.content;
        }
      });
    } else {
      this.compCategoryTemplates = response.payload.filter(c => c.title !== null && c.title !== undefined && c.title !== '') || [];
      this.compCategoryTemplates.unshift({ id: 'new', title: 'New' });
      this.selectedCompletionType.templateId = 'new';
    }
    this.disableTemplateDD = false;
    console.log('Categories: ', this.completionCategories);
  }

  async getCompTemplates() {
    const param = {
      typeId: null,
      courseId: null,
      code: this.courseConfig.code
    }
    const response: any = await this.apiHandler.postData(this.utils.API.GET_COMP_TEMPLATES, param, this.destroyed$);
    this.compTemplates = response.payload || [];
    this.compTemplates.unshift({ id: 'new', title: 'New' });
    this.compTemplateObj.id = 'new';
  }

  async getCourseDetails(element?: any) {
    const userDetails = JSON.parse(localStorage.getItem("userDetails") || '{}');
    const payload = {
      courseId: element ? element.id : this.courseTypeDetail.courseId,
      type: '',
      userId: userDetails?.id,
      userName: userDetails?.username
    };
    const response: any = await this.apiHandler.postData(this.utils.API.GET_COURSE_DETAILS, payload, this.destroyed$);
    if (response) {
      this.getF2FCompTemplates(true);
      this.getCertificationItems();
    }
    this.quizPosition = response.payload[0].quizPosition;
    if (element) {
      const courseObj = response.payload[0];
      if (courseObj) {
        this.courseTypeDetail.view = 'draft';
        courseObj.courseId = this.publishDraft.publish.courseId;
        courseObj.published = false;
        response.payload = [courseObj];
        this.historyModal.nativeElement.click();
      }
    }
    /* Update quesType from singleAnswer to multiAnswer for rendering purpose */
    response.payload?.forEach(element => {
      if (this.courseConfig.code === this.courseCode.F2F) {
        element.chapters.forEach(chapter => {
          chapter.questions.forEach(question => {
            if (question.questionType === 'singleAnswer') {
              question.questionType = 'multiAnswer';
            }
          });
        });
      }
      if (this.courseConfig.code === this.courseCode.Checklist) {
        element.chapters.forEach(chapter => {
          chapter.topicEditable = true;
          chapter.activities.forEach(activity => {
            activity.topicEditable = true;
          });
        });
      }
      if (this.courseConfig.code === this.courseCode.SlideShow) {
        element.chapters = this.revertSplitChapter(element.chapters)
      } else {
        this.revertFileFormat(element.chapters);
      }
      this.revertModifiedData(element.chapters);
      if (this.courseTypeDetail.type == 'edit') {
        // element.courseId = element.courseId;
        this.copiedCourseName = false;
        if (element.published) {
          this.publishDraft['publish'] = element;
          this.getHistoryData(element);
        } else {
          this.publishDraft['draft'] = element;
        }
        if (this.publishDraft[this.courseTypeDetail.view]) {
          this.setPredefinedVal(this.publishDraft[this.courseTypeDetail.view]);
        }
      } else if (this.courseTypeDetail.type === 'copy') {
        let courseData: any = {};
        if (element.published || response.payload?.length === 1) {
          courseData = element;
          courseData.courseId = null;
          this.setPredefinedVal(courseData);
        }
      }
    });
    console.log('course course', this.course);
    // this.ngxService.stop();
    this.showShimmer = false;
  }

  setPredefinedVal(courseData) {
    this.course = $.extend(true, {}, courseData);
    console.log('set pre-defined: ', this.course);
    if (this.courseTypeDetail.courseTypeCode === this.utils.CourseCode.Policies && (this.courseTypeDetail.type === 'edit' || this.courseTypeDetail.type === 'copy')) {
      this.course.categoryId = this.courseTypeDetail.categoryId;
      this.course.categoryName = this.courseTypeDetail.categoryName;
    }
    if ([this.courseCode.Checklist].includes(this.courseConfig.code)) {
      // this.courseCode.F2F,
      this.course.managerConfirmation = true;
    }
    this.countryList = $.extend(true, [], this.cloneCountryList);
    this.setSelectedCountries(this.countryList, this.course.countries);
    this.roleGroupList = $.extend(true, [], this.cloneRoleGroupList);
    if (this.course.roleGroups.length === 1) {
      const selectedRoleGroup = this.roleGroupList.find(element => element.id === this.course.roleGroups[0].id);
      if (selectedRoleGroup.code === 'LAS') {
        this.isSuggestedCourse = true;
      } else {
        this.setSelectedRoleGroups(this.roleGroupList, this.course.roleGroups);
      }
    } else {
      this.setSelectedRoleGroups(this.roleGroupList, this.course.roleGroups);
    }
    this.calcSelectedStore();
    this.selectedChapter = this.course.chapters[0];
    this.selectedChapter.isExpanded = true;
    setTimeout(() => {
      const panel: any = document.getElementsByClassName('chapterBlock')[0]?.children[1];
      if (panel) {
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    }, 100);
    this.setSelectedForm();
    this.selectedActivity = this.selectedChapter.activities[0];
    // this.chapters = this.course.chapters;
    this.selectedQuestionnaire = this.course.chapters[0];
    this.updateQuestionLimit();
    this.currentPage = 0;
    this.isPdfActivity();
    this.completionObject = { content: this.course.completionMessage || '' };
    this.clonedCourse = $.extend(true, {}, this.course);
  }

  setSelectedForm() {
    if (this.courseConfig.code === this.courseCode.Checklist) {
      this.selectedForm = 'checklist';
    } else if (this.courseConfig.completionMessage && !this.courseConfig.quiz && !this.courseConfig.courseContent) {
      this.selectedForm = 'completionMessage';
    } else if (this.courseConfig.quiz && !this.courseConfig.courseContent) {
      this.selectedForm = 'questionaire';
    }
  }

  setSelectedCountries(list: any, selectedList: any, type?: string) {
    selectedList?.forEach(selected => {
      let selectedObj = list.find(obj => obj.id === selected.id);
      if (selectedObj) {
        if (selected.children && selected.children.length > 0) {
          selectedObj.selectStatus = 'mixed';
          this.setSelectedCountries(selectedObj.child, selected.children);
        } else {
          selectedObj.selectStatus = 'checked';
          if (selectedObj.child) {
            this.changeObjProperty(selectedObj.child, 'selectStatus', 'checked');
            /* Add 'show' key for certification type */
            if (type === 'certificate') this.changeObjProperty(selectedObj.child, 'show', true);
          }
        }
      }
    });
  }

  setSelectedRoleGroups(list: any, selectedList: any) {
    if (!this.nonlevelCourses.includes(this.courseConfig.code)) {
      selectedList?.forEach(node1 => {
        let selectedNode1 = list.find(obj => obj.id === node1.id);
        if (selectedNode1) {
          node1.children.forEach(node2 => {
            let selectedNode2 = selectedNode1.child.find(obj => obj.id === node2.id);
            if (selectedNode2) {
              selectedNode2.selectedLevel = node2.children[0].id;
            }
          });
        }
      });
    } else if (this.nonlevelCourses.includes(this.courseConfig.code)) {
      selectedList?.forEach(node1 => {
        let selectedNode1 = list.find(obj => obj.id === node1.id);
        if (selectedNode1) {
          node1.children.forEach(node2 => {
            let selectedNode2 = selectedNode1.child.find(obj => obj.id === node2.id);
            if (selectedNode2) {
              selectedNode2.checked = true;
            }
          });
        }
      });
    }
  }

  revertFileFormat(chapters: any) {
    chapters.forEach(chapter => {
      chapter.activities.forEach(activity => {
        if (!this.nonFileActivities.includes(activity.activityType)) {
          const tempContents = activity.content.split('*,*');
          const tempTitles = activity.title.split('*,*');
          activity.content = [];
          for (let i in tempContents) {
            const tembObj: any = {};
            tembObj.url = tempContents[i];
            tembObj.name = tempTitles[i];
            if (activity.activityType === 'slide') {
              tembObj.thumbImage = `${this.imagePath}${tempContents[i]}`;
              tembObj.image = `${this.imagePath}${tempContents[i]}`;
            }
            activity.content.push(tembObj);
          }
        }
      });
    });
  }

  // add extra one chapter & activities
  revertModifiedData(chapters: any) {
    chapters?.forEach((chapter) => {
      if (['text', 'checklist'].includes(chapter.chapterType)) {
        chapter.activities.push({ activityId: chapter.activities.length + 1, content: '' });
      }
      /* chapter.activities = JSON.parse(chapter.activities || {});
      chapter.questions = JSON.parse(chapter.questions || {}); */
    });
    chapters.push({
      chapterId: chapters.length + 1,
      activities: [{ activityId: 1, activityType: this.courseConfig.code == this.courseCode.Checklist ? 'checklist' : 'text', content: '' },
      { activityId: 2, content: '' }],
      questions: []
    });
  }

  /* Merge slideshow multi chapters into single chapter */
  revertSplitChapter(chapters: any) {
    const slideImages = [];
    const chapterQuestion = chapters[0].questions;
    const mergedChapter: any = [{ chapterId: 1, chapterType: 'slideShow', activities: [{ activityType: 'slideShow', content: slideImages }] }];

    chapters.forEach(chapter => {
      const currentActivity = chapter.activities[0];
      slideImages.push(
        {
          name: currentActivity.title,
          image: `${this.imagePath}${currentActivity.content}`,
          thumbImage: `${this.imagePath}${currentActivity.content}`
        });
    });
    mergedChapter[0].questions = chapterQuestion;
    return mergedChapter;
  }

  async getCountries() {
    const response: any = await this.apiHandler.getData(this.utils.API.GET_ALL_COUNTRIES, null, this.destroyed$);
    this.countryList = this.emitService.sortRegion(response.payload);
    this.cloneCountryList = $.extend(true, [], this.countryList);
    this.apiCount++;
    if (this.apiCount === 2) {
      this.getCourseConfig();
    }
    this.storeCount = this.getCount(this.countryList, 0);
  }

  getCount(list: any, count: any) {
    list.forEach(element => {
      if (element.child && element.child.length > 0) {
        count = this.getCount(element.child, count);
      } else {
        count++;
      }
    });
    return count;
  }

  async getRoleGroups() {
    const response: any = await this.apiHandler.getData(this.utils.API.GET_ROLE_GROUPS, null, this.destroyed$);
    const suggestedIndex = response.payload?.findIndex((element) => element.code === 'LAS');
    if (suggestedIndex) {
      response.payload.splice(0, 0, response.payload.splice(suggestedIndex, 1)[0]);
      // [response.payload[suggestedIndex], response.payload[0]] = [response.payload[0], response.payload[suggestedIndex]];
    }
    this.roleGroupList = this.sortRoleGroup(response?.payload.filter(roleGroup => roleGroup.id !== 7) || []);
    this.cloneRoleGroupList = $.extend(true, [], this.roleGroupList);
    this.apiCount++;
    if (this.apiCount === 2) {
      this.getCourseConfig();
    }
    this.levelCount = this.getCount(this.roleGroupList, 0);
  }

  sortRoleGroup(list) {
    list = __.sortBy(list, 'sequenceId');
    list.forEach(element => {
      element.child = _.sortBy(element.child, 'sequenceId');
    });
    return list;
  }

  copyCourse() {
    const courseObj = this.course;
    localStorage.setItem('courseType', JSON.stringify({
      type: 'copy',
      courseTypeCode: this.courseTypeDetail.courseTypeCode,
      courseId: courseObj.courseId,
      view: courseObj.published ? 'publish' : 'draft',
      categoryId: this.courseTypeDetail.categoryId,
      categoryName: this.courseTypeDetail.categoryName
    }));
    window.open(window.location.href);
  }

  toggleAccordian(event: any, chapter: any, i: any) {
    const element = event.target;
    element.classList.toggle('active');
    const panel = element.closest('.chapterBlock').children[1];
    if (chapter.isExpanded) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
    if (!chapter.isExpanded) {
      this.collapseChapters();
      this.currentPage = i;
      this.isPdfActivity();
      this.selectedChapter = chapter;
      this.selectedActivity = chapter.activities[0];
    }
    chapter.isExpanded = !chapter.isExpanded;
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

  levelSelectionChange(event: any, node1: any, node2: any) {
    debugger;
  }

  collapseChapters() {
    this.course.chapters.forEach(element => {
      element.isExpanded = false;
    });
  }

  /* Add options in quiz */
  addOption(question: any) {
    const increment = question.options[question.options.length - 1].key + 1;
    question.options.push({ key: increment, value: '' });
    this.previewScrollDown();
    this.questionScrollDown();
  }

  /* Remove Options in quiz */
  removeOption(question: any, optionIndex: any) {
    question?.options.splice(optionIndex, 1);
  }

  /* Add questions in quiz */
  addQuestion(questions: any, type?: string) {
    const question = {
      content: '',
      options: [{ key: 1 }, { key: 2 }],
      questionType: 'multiAnswer'
    }
    if (type === 'fillRightAnswer' || type === 'freeText') {
      question.questionType = type;
      delete questions.options;
    }
    if (type === 'reArrangeOrder') question.questionType = type;
    questions.push(question);
    this.setQuestionId(questions);
    this.updateQuestionLimit();
    this.previewScrollDown();
    this.questionScrollDown();
  }

  setQuestionLimit(value: any) {
    if (this.quizPosition) {
      this.course.questionLimit = value;
    } else {
      this.course.chapters[this.selectedQuestionnaireIndex].questionLimit = value;
    }
    this.randomLimit = value;
  }

  quizPositionChange() {
    if (this.course.questionLimit || this.course.chapters.find((ele: any) => ele.questionLimit)) {
      if (confirm('Random question will be reset')) {
        this.currentPage = 0;
        this.quizPositionChangeLogic();
        this.changeForm(this.selectedForm);
      } else {
        setTimeout(() => {
          this.quizPosition = !this.quizPosition;
        }, 1);
      }
    } else {
      this.quizPositionChangeLogic();
      this.changeForm(this.selectedForm);
    }
  }

  quizPositionChangeLogic() {
    this.course.chapters.forEach(element => {
      delete element.questionLimit;
    });
    delete this.course.questionLimit;
    this.updateQuestionLimit();
  }

  updateQuestionLimit() {
    this.course.quizPosition = this.quizPosition;
    this.questionLimit = [];
    let mandatoryCount = 0;
    let questionCount = 0;
    if (this.quizPosition) {
      this.course.chapters.forEach(element => {
        if (element.chapterType) {
          for (const question of element.questions || []) {
            if (question.questionType !== 'fillRightAnswer' && question.questionType !== 'freeText') {
              questionCount++;
              if (question.mandatory) {
                mandatoryCount++;
              }
  
            }
          }
        }
      });
      for (mandatoryCount; mandatoryCount <= questionCount; mandatoryCount++) {
        if (mandatoryCount !== 0) {
          this.questionLimit.push(mandatoryCount);
        }
      }
      this.randomLimit = this.questionLimit.includes(this.course.questionLimit) ? this.course.questionLimit : undefined;
    } else {
      if (this.course.chapters[this.selectedQuestionnaireIndex].chapterType) {
        for (const question of this.course.chapters[this.selectedQuestionnaireIndex].questions || []) {
          questionCount++;
          if (question.mandatory) {
            mandatoryCount++;
          }
        }
        for (mandatoryCount; mandatoryCount <= questionCount; mandatoryCount++) {
          if (mandatoryCount !== 0) {
            this.questionLimit.push(mandatoryCount);
          }
        }
        this.randomLimit = this.questionLimit.includes(this.course.chapters[this.selectedQuestionnaireIndex].questionLimit) ? this.course.chapters[this.selectedQuestionnaireIndex].questionLimit : undefined;
      }
    }
  }

  /* updateQuestionLimit() {
    this.questionLimit = [];
    let mandatoryCount = 0;
    let questionCount = 0;
    this.course.chapters.forEach(element => {
      if (element.chapterType) {
        for (const question of element.questions || []) {
          questionCount++;
          if (question.mandatory) {
            mandatoryCount++;
          }
        }
      }
    });
    for (mandatoryCount; mandatoryCount <= questionCount; mandatoryCount++) {
      if (mandatoryCount !== 0) {
        this.questionLimit.push(mandatoryCount);
      }
    }
    this.course.questionLimit = this.questionLimit.includes(this.course.questionLimit) ? this.course.questionLimit : undefined;
  } */

  /* Remove questions in quiz */
  removeQuestion(questions: any, i: any) {
    questions.splice(i, 1);
    this.setQuestionId(questions);
    this.updateQuestionLimit();
  }

  /* Set question Number */
  setQuestionId(questions: any) {
    questions.forEach((question: any, index: number) => question.questionId = index + 1);
  }

  /* Set Chapter No */
  setChapterName() {
    this.course.chapters.forEach((chapter: any, index: number) => chapter.chapterId = index + 1);
  }

  /* Set editor value */
  editorOnChange(value: any) {
    this.editorText = value.content;
    console.log(this.editorText);
  }

  changeForm(type: any) {
    this.selectedForm = type;
    /* If selected form is certification update currentPage to show certificate page in mobile preview */
    if (type === 'pdfCertification') {
      this.currentPage = this.course.chapters.length + 2;
    } else if (type === 'questionaire') {
      this.previousPage = this.currentPage < this.course.chapters.length ? this.currentPage : this.previousPage;
      if (this.quizPosition) {
        this.currentPage = this.course.chapters.length - 1;
      } else {
        this.currentPage = this.selectedQuestionnaireIndex;
      }
      this.updateQuestionLimit();
    } else if (type === 'completionMessage') {
      this.previousPage = this.currentPage < this.course.chapters.length ? this.currentPage : this.previousPage;
      this.currentPage = this.course.chapters.length + 1;
    } else {
      this.currentPage = this.selectedChapterIndex;
    }
    this.isPdfActivity();
  }

  /* Activity DD change */
  activityChange(evt: any, activity: any) {
    this.ngxService.stopLoader('preview-loader');
    if (activity?.questions?.length > 0 || activity?.content?.length > 0) {
      this.errorHandler.handleAlert('Activity Content Removed');
    }
    if (evt.key === 'quiz') {
      activity.questions = [{
        questionId: 1,
        options: [{ key: 1 }, { key: 2 }],
        // questionType: 'singleAnswer'
      }];
      activity.content = '';
    } else {
      activity.questions = [];
    }
    if (evt.key === 'example') {
      activity.title = 'Example';
      activity.content = '';
    }
    if (evt.key === 'slide') {
      activity.content = []
    } else {
      activity.content = '';
    }
  }

  changeCourseType(event: any) {
    this.courseConfig = event;
    delete this.course.managerConfirmation;
    delete this.course.period;
  }

  changeChapterType(event: any, chapter: any) {
    this.ngxService.stopLoader('preview-loader');
    if (!this.isEmptyChapter(chapter)) {
      this.errorHandler.handleAlert('Chapter Content Removed');
    }
    if (event.key === 'text') {
      chapter.activities = [{ activityId: 1, activityType: 'text', content: '' }, { activityId: 2, content: '' }];
    } else {
      chapter.activities = [{ activityType: event.key, content: [] }];
    }
    this.selectedActivity = chapter.activities[0];
  }

  /* Add chapter */
  addChapter() {
    this.collapseChapters();
    const lastChapter = this.course.chapters[this.course.chapters.length - 1];
    lastChapter.isExpanded = true;
    lastChapter.chapterType = 'text';
    // this.setChapterName();
    const newChapter = {
      chapterId: lastChapter.chapterId + 1,
      activities: [{ activityId: 1, activityType: 'text', content: '' }, { activityId: 2, content: '' }],
      questions: []
    };
    this.currentPage = this.course.chapters.length - 1;
    this.course.chapters.push(newChapter);
    this.selectedChapter = lastChapter;
    this.selectedChapterIndex = this.currentPage;
    this.selectedActivity = this.selectedChapter.activities[0];
  }

  addActivity(event: any, chapter: any, i: any) {
    const activities = chapter.activities;
    const lastActivity = activities[activities?.length - 1];
    lastActivity.activityType = 'text';
    activities.push({ activityId: lastActivity.activityId + 1, content: '' });
    const element = event.target;
    const panel = element.closest('.panel');
    setTimeout(() => {
      if (panel) {
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    }, 100);
    this.selectedChapter = chapter;
    this.currentPage = i;
  }

  topicHighlight(chapter, chapterIndex) {
    if (chapter.chapterType) {
      this.selectedChapter = chapter;
      this.currentPage = chapterIndex
    }
  }

  addTopic(id: any) {
    const lastChapter = this.course.chapters[this.course.chapters.length - 1];
    lastChapter.chapterType = 'checklist';
    // this.setChapterName();
    const newChapter = {
      chapterId: lastChapter.chapterId + 1,
      activities: [{ activityId: 1, activityType: 'checklist', content: '' }, { activityId: 2, content: '' }],
      questions: []
    };
    this.currentPage = this.course.chapters.length - 1;
    this.course.chapters.push(newChapter);
    this.selectedChapter = lastChapter;
    // this.selectedActivity = this.selectedChapter.activities[0];

    setTimeout(() => {
      document.getElementById(id).focus();
    }, 500);
  }

  addChecklist(id: any) {
    const activities = this.selectedChapter.activities;
    const lastActivity = activities[activities?.length - 1];
    lastActivity.activityType = 'checklist';
    activities.push({ activityId: lastActivity.activityId + 1, content: '' });
    console.log('sC', this.selectedChapter);
    /* this.selectedChapter = chapter;
    this.currentPage = i; */

    setTimeout(() => {
      document.getElementById(id).focus();
    }, 500);
  }

  clickChapter(chapter: any, i: any) {
    this.selectedChapterIndex = i;
    if (chapter.chapterType && chapter.chapterType !== 'text') {
      this.selectedChapter = chapter;
      this.selectedActivity = chapter.activities[0];
      this.currentPage = i;
      this.isPdfActivity();
    }
  }

  clickActivity(chapter: any, activity: any, i: any) {
    if (activity.activityType) {
      this.selectedActivity = activity;
      this.selectedChapter = chapter;
    }
    this.currentPage = i;
    this.isPdfActivity();
  }
  /* Quiz type On change */
  quizTypeOnChange(question: any) {
    /* if (this.courseConfig.code === this.courseCode.F2F) {
      let isPreFreeText = this.selectedQuestion.questionType === 'fillRightAnswer' || this.selectedQuestion.questionType === 'freeText'
      let isSelectedFreeText = question.questionType === 'fillRightAnswer' || question.questionType === 'freeText'
      if (isPreFreeText && !isSelectedFreeText) { //DD change from singleAnswer to freeText
        if (this.checkContentInCompCategory()) {
          this.openAlert('callGetCompTemplate')
        } else {
          this.getCompTemplates();
        }
      } else { // DD change from freeText to singleAnswer
        if (this.completionObject.content) {
          this.openAlert('callGetCompTempCategory');
        }
        this.getCompletionTypeTemplate();
      }
    } */
    if (question.questionType === 'multiAnswer' || question.questionType === 'reArrangeOrder') {
      question.options = [{ key: 1 }, { key: 2 }];
    }

    if (question.questionType === 'multiAnswer') {
      question.options.forEach((option: any) => {
        if (option.correctAnswer) {
          delete option['correctAnswer'];
        }
      });
      if (question.correctAnswer) {
        delete question['correctAnswer'];
      }  
    } else if (question.questionType === 'fillRightAnswer' || question.questionType === 'freeText') {
      delete question.options;
    }
    this.updateQuestionLimit()
  }

  @ViewChild ('locationSelect') locationSelect;
  @ViewChild ('selector1') selector1;
  @ViewChild ('selector2') selector2;
  checkCountryAndRoleSelected(event, ddType) {

    /* For certification line item data */
    if (ddType === 'location') {
      if (event === true) {
        if (this.certificationItems.length > 1) {
          this.locationSelect.close();
          this.openAlert('clearCertLineItems');
          return;
        } else {
          this.certificationItems[0].countries = this.calcSelectedStore() > 0 ? this.buildSelectedCountries(this.countryList) : this.setCountryStatusChecked($.extend(true, [], this.countryList));
          this.setRenderingDataForCertificationItems();
        }
      } else {
        this.certificationItems[0].renderingData.countryList = this.setSelected(this.cloneCountryList, this.calcSelectedStore() > 0 ? this.buildSelectedCountries(this.countryList): this.setCountryStatusChecked($.extend(true, [], this.countryList)), 0);
      }
    }
    const selectedCountries: any = this.buildSelectedCountries(this.countryList);
    const selectedRoles: any = this.buildSelectedRoleGroups(this.roleGroupList);
    if (event === false && selectedCountries.length > 0 && selectedRoles.length > 0) {
      let tempArray = $.extend(true, [], this.questionTypes);
      this.questionTypes = [];
      tempArray.forEach(question => {
        if (question.key === 'freeText' || question.key === 'fillRightAnswer') {
          question.disabled = true;
        }
      });
      this.questionTypes = [...tempArray];
    } else {
      this.questionTypes = this.utils.ddOptions.DD_LABELS.questionTypes;
    }

    if (event === true && (selectedCountries.length > 0 || selectedRoles.length > 0)) {
      if (this.checkFreeTextQues()) {
        if (ddType === 'location' && selectedCountries.length === 0 && selectedRoles.length > 0) {
          this.locationSelect.toggle();
          this.openAlert('removeFreeText');  
        } else if (ddType === 'role1' && selectedCountries.length > 0 && selectedRoles.length === 0) {
          this.selector1.toggle();
          this.openAlert('removeFreeText');  
        } else if (ddType === 'role2' && selectedCountries.length > 0 && selectedRoles.length === 0) {
          this.selector2.toggle();
          this.openAlert('removeFreeText');  
        }
      }
    }
  }

  /* Toggle Quiz option */
  toggleQuizOption(option: any) {
    if (option.correctAnswer === true) {
      option.correctAnswer = false;
    } else {
      option.correctAnswer = true;
    }
  }

  /* singleOptionChange(options, option) {
    options.forEach(element => {
      element.correctAnswer = false;
    });
    option.correctAnswer = true;
  } */

  /* Compare two seperate variable */
  deepCompare(arg1, arg2) {
    const that = this;
    // const omittedkeys = ['isExpanded'];
    if (Object.prototype.toString.call(arg1) === Object.prototype.toString.call(arg2)) {
      if (Object.prototype.toString.call(arg1) === '[object Object]' || Object.prototype.toString.call(arg1) === '[object Array]') {
        if (Object.keys(arg1 || [])?.length < 1 && Object.keys(arg2 || [])?.length < 1) {
          return true;
        }
        if (Object.keys(arg1).length !== Object.keys(arg2).length) {
          return false;
        }
        return (Object.keys(arg1).every(function (key) {
          return that.deepCompare(arg1[key], arg2[key]); //omittedkeys.includes(key) ||
        }));
      }
      return (arg1 === arg2);
    }
    return false;
  }

  openAlert(type: any, index?: any, chapter?: any) {
    this.alertModal = {};
    this.alertModal = {
      type: type,
      chapter: chapter,
      index: index
    };
    if (type === 'deleteCourse') {
      this.alertModal['text'] = 'Are you sure you want to delete the course?'
    } else if (type === 'deleteChapter') {
      let emptyChapter = true;
      for (var activity of chapter.activities) {
        if (activity.content) {
          emptyChapter = false;
          break;
        }
      }
      if (this.isEmptyChapter(chapter)) {
        this.deleteChapter(index);
        return;
      } else {
        this.alertModal['text'] = 'Are you sure you want to delete this chapter?'
      }
    } else if (type === 'deleteActivity') {
      if (chapter.activities[index].activityType !== 'quiz' && chapter.activities[index].content.length < 1) {
        this.deleteActivity(chapter, index);
        return;
      } else {
        this.alertModal['text'] = 'Are you sure you want to delete this activity?'
      }
    } else if (type === 'switchPulishDraft') {
      // if (false && this.deepCompare(this.clonedCourse, this.course)) {
      if (this.checkCourseMod()) {
        this.alertModal['text'] = 'Updated content will not be saved';
      } else {
        //Here index means viewType
        this.switchPulishDraft(index);
        return;
      }
    } else if (type === 'templateSubmitted') {
      this.alertModal['text'] = 'Are you want to submit course without saving the completion message?'
    } else if (type === 'withoutRoleCountry') {
      this.alertModal['text'] = 'Do you want to proceed without Role/Country';
    } else if (type === 'withoutCompCategory') {
      let categoryObj = this.checkContentInCompCategory();
      let categories: string = ``;
      for (let category of [categoryObj.evaluate, categoryObj.passed, categoryObj.failed, categoryObj.redo]) {
        if (!category.isValid) {
          let index = this.completionCategories.findIndex(cat => cat.id === category.id);
          categories = categories + `${this.completionCategories[index].name}, `;
        }
      }
      categories.trim();
      if (categories.endsWith(', ')) {
        let temp = categories.slice(0, -2);
        categories = temp;
      }
      this.alertModal['text'] = `Please enter content for ${categories} completion category`;
    } else if (type === 'removeFreeText') {
      this.alertModal['text'] = 'Please remove fill right answer/Free text question type from Questionnaire, Otherwise you will not be able to select both country and role';
    } else if (type === 'clearCertLineItems') {
      this.alertModal['text'] = `If location changes created certificates will be removed, Are you sure you want to proceed?`;
    } else if (type === 'deleteCertItem') {
      this.alertModal['text'] = `Are you sure you want to delete this line item?`;
    } /* else if (type === 'callGetCompTemplate') {
      this.alertModal['text'] = 'Are you sure you want to clear completion content?'
    } else if (type === 'callGetCompTempCategory') {
      this.alertModal['text'] = 'Are you sure you want to clear completion category content?'
    } */
    this.confirmModal.nativeElement.click();
  }

  withoutRoleCountry() {
    /* If the flow comes here, only the course going to publish */
    this.submitCourse(true);
  }

  isEmptyChapter(chapter) {
    let emptyChapter = true;
    for (var activity of chapter.activities) {
      if (activity.content.length > 0) {
        emptyChapter = false;
        break;
      }
    }
    return emptyChapter;
  }

  alertConfirmed() {
    this.ngxService.stopLoader('preview-loader');
    const { type, chapter, index } = this.alertModal;
    if (type === 'deleteCourse') {
      this.deleteCourse();
    } else if (type === 'deleteChapter') {
      this.deleteChapter(index);
    } else if (type === 'deleteActivity') {
      this.deleteActivity(chapter, index)
    } else if (type === 'switchPulishDraft') {
      //Here index means viewType
      this.switchPulishDraft(index);
    } else if (type === 'templateSubmitted') {
      this.templateSubmitted(true);
    } else if(type === 'withoutRoleCountry'){
      this.withoutRoleCountry();
    } else if(type === 'withoutCompCategory'){
      // this.withoutRoleCountry();
    } else if (type === 'clearCertLineItems') {
      this.certificationItems = [
        {
          countries: [],
          id: '',
          name: '',
          certificateUrl: '',
          renderingData: {
            countryList: this.setSelected(this.cloneCountryList, this.calcSelectedStore() > 0 ? this.buildSelectedCountries(this.countryList): this.setCountryStatusChecked($.extend(true, [], this.countryList)), 0),
            selectedStoreCount: 0
          }
        }
      ];
      this.certificationItems[0].countries = this.calcSelectedStore() > 0 ? this.buildSelectedCountries(this.countryList) : this.setCountryStatusChecked($.extend(true, [], this.countryList));
      this.setRenderingDataForCertificationItems();
      this.certificates = $.extend(true, [], this.copyCertificates);
    } else if (type === 'deleteCertItem') {
      this.deleteCertItem(chapter);
    } /* else if (type === 'callGetCompTemplate') {
      this.getCompTemplates();
    } else if (type === 'callGetCompTempCategory') {
      this.getCompTemplates();
    } */
    this.confirmModal.nativeElement.click();
  }

  /* alertReject() {
    const { event, type } = this.alertModal;
    this.confirmModal.nativeElement.click();
  } */

  /* Clear course name field */
  async deleteCourse() {
    if (this.courseTypeDetail.type === 'create') {
      localStorage.setItem('canDeactivate', 'true');
      this.router.navigate(['/courses']);
    } else if (this.courseTypeDetail.type === 'edit') {
      // Draft delete
      const response: any = await this.apiHandler.postData(this.utils.API.CHANGE_COURSE_STATUS, { id: [this.course.courseId], courseStatus: 'Delete' }, this.destroyed$, 'Draft deleted successfully');
      if (this.publishDraft.publish) {
        this.courseTypeDetail.view = 'publish';
        this.setPredefinedVal(this.publishDraft.publish);
        delete this.publishDraft.draft;
      } else {
        localStorage.setItem('canDeactivate', 'true');
        this.router.navigate(['/courses']);
      }
    }
  }

  /* Delete chapter */
  deleteChapter(index: any) {
    if (this.courseConfig.code === this.courseCode.Checklist && this.course.chapters.length === 2 && index === 0) {
      this.course.chapters[index].content = '';
      this.course.chapters[index].topicEditable = false;
    } else {
      this.course.chapters.splice(index, 1);
    }
    this.setChapterName();
    this.selectedChapter = this.course.chapters[0];
    this.selectedActivity = this.selectedChapter.activities[0];
    this.selectedQuestionnaire = this.course.chapters[0];
    this.currentPage = 0;
    this.isPdfActivity();
  }

  /* Delete Activity */
  deleteActivity(chapter: any, index: any) {
    if (this.courseConfig.code === this.courseCode.Checklist && chapter.activities.length === 2 && index === 0) {
      chapter.activities[index].content = '';
      chapter.activities[index].topicEditable = false;
    } else {
      chapter.activities.splice(index, 1);
    }
    this.selectedChapter = chapter;
    this.selectedActivity = chapter.activities[0];
    this.currentPage = 0;
    this.isPdfActivity();
    // this.selectedActivityIndex = 0;
  }

  async changePublishedStatus() {
    const status = this.course.active ? 'Inactive' : 'Active';
    const params = {
      id: [this.course.courseId],
      courseStatus: status
    }
    const response: any = await this.apiHandler.postData(this.utils.API.CHANGE_COURSE_STATUS, params, this.destroyed$, `Course has been ${this.course.active ? 'Inactivated' : 'Activated'}`);
    this.course.active = status === 'Active';
  }

  /* File Upload Area start*/
  onFileBrowse(event: any, value: any, uploadedMedia: any, type: any) {
    if (type === 'activitySlide' || type === 'chapterSlide') {
      var pattern = /(tif|pjp|xbm|jxl|svgz|jpg|jpeg|ico|tiff|gif|svg|jfif|webp|png|bmp|pjpeg|avif)/;
    } else if (type === 'chapterFile') {
      var pattern = /(mp4|pdf|mp3)/;
    }
    if (this.courseConfig.courseTypeDesc === 'Policies' && type === 'chapterFile') {
      var pattern = /(pdf)/;
    }
    let checkFileType = false;
    let ext = '';
    let fileListAsArray: any = [];
    if (value === 'fileUpEvent') {
      const getTarget: DataTransfer = <DataTransfer>(event.target);
      ext = getTarget.files[0]?.name.split('.').pop();
      const target = event.target as HTMLInputElement;
      fileListAsArray = target.files;
      checkFileType = (ext.match(pattern)) ? true : false;
    } else {
      fileListAsArray = Array.from(event);
      ext = fileListAsArray[0]?.name.split('.').pop();
      checkFileType = (ext.match(pattern)) ? true : false;
    }
    if (checkFileType) {
      if (['slideShow', 'chapterFile'].includes(type)) {
        this.selectedActivity.content = [];
        uploadedMedia = this.selectedActivity.content;
        if (fileListAsArray.length > 1) {
          this.errorHandler.handleAlert('Multiupload not allowed');
          return;
        }
        this.selectedActivity.activityType = type === 'slideShow' ? 'slideShow' : this.setActivityType(ext);
      }
      this.processFiles(fileListAsArray, uploadedMedia, type);
    }
    else {
      this.uploadFileInput.nativeElement.value = '';
      this.errorHandler.handleAlert('Invalid file format');
    }
  }

  async processFiles(files: any, uploadedMedia: any, type: any) {
    this.ngxService.start();
    const formData = new FormData();
    for (const file of files) {
      formData.append('request', file);
    }
    const apiUrl = type === 'slideShow' ? this.utils.API.UPLOAD_SLIDES : this.utils.API.UPLOAD_FILES;
    const res: any = await this.apiHandler.fileUpload(apiUrl, formData, this.destroyed$);
    for (const file of res.payload) {
      if (this.selectedActivity.activityType === 'slide') {
        file['image'] = `${this.imagePath}${file.url}`;
        file['thumbImage'] = `${this.imagePath}${file.url}`;
      } else if (this.selectedActivity.activityType === 'slideShow') {
        file['name'] = file.url;
        file['image'] = `${this.imagePath}${file.url}`;
        file['thumbImage'] = `${this.imagePath}${file.url}`;
      }
      uploadedMedia?.push(file);
    }
    this.ngxService.stop();
    if (this.selectedActivity.activityType === 'pdf') {
      this.pdfLoader('start');
    }
  }

  setActivityType(ext) {
    let type = '';
    if (ext.match(/(mp4)/)) {
      type = 'video';
    } else if (ext.match(/(pdf)/)) {
      type = 'pdf';
    } else if (ext.match(/(ppt|pptx)/)) {
      type = 'ppt';
    } else if (ext.match(/(mp3)/)) {
      type = 'audio';
    }
    return type;
  }

  removeImage(idx: number, type: any) {
    this.selectedActivity.content = this.selectedActivity.content.filter((u: any, index: any) => index !== idx);
    if (this.selectedChapter.chapterType === 'fileUpload' && this.selectedActivity.content.length === 0) {
      this.selectedActivity.activityType = '';
    }
    this.uploadFileInput.nativeElement.value = '';
  }
  /* File Upload area end */


  drop(event: CdkDragDrop<string[]>) {
    console.log('log', event.container.data);
    if (event.previousContainer === event.container && event.currentIndex < event.container.data.length - 1
      && event.previousIndex < event.container.data.length - 1) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.course.chapters.forEach((element, index) => {
        element.chapterId = index + 1;
      });
      this.currentPage = this.selectedChapter.chapterId - 1;
    }
  }

  goToPage(i: any) {
    this.currentPage = i;
    this.isPdfActivity();
  }

  goToNextChapter() {
    this.currentPage++;
  }

  hierarchySearch(event: any, list: any) {
    const searchText = event.target.value;
    this.onHierarchyFilter(list, searchText);
  }

  //HIERARCHY LEVEL SEARCH//
  onHierarchyFilter(list: any, searchText: any) {
    let hasVal = false;
    list.forEach((obj) => {
      if (obj.desc.toUpperCase().indexOf(searchText) !== -1) {
        hasVal = true;
        obj.display = true;
        this.changeObjProperty(obj.child, 'display', true);
      } else {
        obj.display = this.onHierarchyFilter(obj.child, searchText);
      }
    });
    return hasVal;
  }

  changeObjProperty(array: any, property: any, assignValue: any) {
    array.forEach((obj) => {
      obj[property] = assignValue;
      if (obj.child && obj.child.length > 0) {
        this.changeObjProperty(obj.child, property, assignValue);
      }
    });
    return array;
  }

  selectAll(event: any, list: any, type: any) {
    list.forEach(element => {
      this.selectionToggle(event.checked, element, type);
    });
  }

  disableSelection: boolean = true;
  selectionToggleLeaf(isChecked, node, type, certItem?: any) {
    node.selectStatus = isChecked ? 'checked' : 'unchecked';
    this.updateSelectionstatus(type, certItem);
    if (type === 'certCountry') {
      if (this.getSelectedChildCount(this.certificationItems[0].renderingData.countryList, 0, 'cert') === 1) {
        this.disableSelection = false;
      } else {
        this.disableSelection = true;
      }
    }
  }

  checkCountryCount(node: any) {
    console.log(this.getSelectedChildCount(this.certificationItems[0].renderingData.countryList, 0, 'cert'));
    return (this.getSelectedChildCount(this.certificationItems[0].renderingData.countryList, 0, 'cert') === 1 && node.selectStatus === 'unchecked');
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

  allRoleSelect(event: any) {
    console.log(this.levelCount);
    console.log(this.selectedLevelCount);
    this.roleGroupList?.forEach(roleGroup => {
      roleGroup?.child?.forEach(role => {
        role.checked = event.checked;
      });
    });
  }

  updateSelectionstatus(type, certItem?: any) {
    let listArray = [];
    if (type === 'roleGroup') {
      listArray = this.roleGroupList;
    } else if (type === 'country') {
      listArray = this.countryList;
    } else if (type === 'certCountry') {
      listArray = certItem.renderingData.countryList;
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

  buildSelectedCountries(list: any) {
    let tempArr = [];
    let tempObj: any = {};
    list.forEach(element => {
      if (element.selectStatus === 'checked') {
        tempObj = {
          id: element.id,
          desc: element.desc
        };
        if (element.child) {
          tempObj.children = [];
        }
        tempArr.push(tempObj);
      } else if (element.selectStatus === 'mixed') {
        tempArr.push({
          id: element.id,
          desc: element.desc,
          children: element.child ? this.buildSelectedCountries(element.child) : undefined
        });
      }
    });
    return tempArr;
  }

  buildSelectedRoleGroups(list: any) {
    let result = [];
    if (!this.nonlevelCourses.includes(this.courseConfig.code)) {
      list.forEach(node1 => {
        let tempArr = [];
        node1.child.forEach(node2 => {
          if (node2.selectedLevel) {
            const selectedLevelObj = node2.child.find(node3 => node3.id === node2.selectedLevel);
            if (selectedLevelObj) {
              tempArr.push({
                id: node2.id,
                desc: node2.desc,
                children: [{
                  id: selectedLevelObj.id,
                  desc: selectedLevelObj.desc
                }]
              }
              );
            }
          }
        });
        if (tempArr.length > 0) {
          result.push({
            id: node1.id,
            desc: node1.desc,
            children: tempArr
          }
          );
        }
      });
    } else if (this.nonlevelCourses.includes(this.courseConfig.code)) {
      list.forEach(node1 => {
        let tempArr = [];
        node1.child.forEach(node2 => {
          if (node2.checked) {
            tempArr.push({
              id: node2.id,
              desc: node2.desc,
              children: []
            }
            );
          }
        });
        if (tempArr.length > 0) {
          result.push({
            id: node1.id,
            desc: node1.desc,
            children: tempArr
          }
          );
        }
      });
    }
    return result;
  }

  clickSuggestedCourse(event) {
    this.isSuggestedCourse = event.checked;
    this.roleGroupList.forEach(roleGroup => {
      roleGroup.child.forEach(role => {
        delete role.selectedLevel;
      });
    });
  }

  levelNotSelected() {
    this.selectedLevelCount = 0;
    for (const roleGroup of this.roleGroupList || []) {
      this.selectedLevelCount = this.selectedLevelCount + (roleGroup.child.filter(role => role.selectedLevel)?.length || 0);
    }
    return this.selectedLevelCount < 1;
  }

  roleNotSelected() {
    this.selectedLevelCount = 0;
    for (const roleGroup of this.roleGroupList || []) {
      this.selectedLevelCount = this.selectedLevelCount + (roleGroup.child.filter(role => role.checked)?.length || 0);
    }
    return this.selectedLevelCount < 1;
  }

  calcSelectedStore() {
    this.selectedStoreCount = 0;
    this.selectedStoreCount = this.getSelectedChildCount(this.countryList, this.selectedStoreCount);
    return this.selectedStoreCount;
  }

  getSelectedChildCount(list: any, count: number, type?: any) { // type added for cert list items
    list.forEach(element => {
      if ((type === 'cert' && element.show === true && (element.selectStatus === 'mixed' || element.selectStatus === 'checked')) || (type !== 'cert' && (element.selectStatus === 'mixed' || element.selectStatus === 'checked'))) {
        if (element.child && element.child.length > 0) {
          count = this.getSelectedChildCount(element.child, count, type);
        } else {
          if ((type === 'cert' && element.show === true && (element.selectStatus === 'checked')) || (type !== 'cert' && (element.selectStatus === 'checked'))) {
            count++;
          }
        }
      }
    });
    return count;
  }

  setTotalQuestions() {
    this.totalQuestions = 0;
    return '';
  }

  increaseTotalQuestions() {
    return ++this.totalQuestions;
  }

  pageRendered(e: CustomEvent) {
    window.dispatchEvent(new Event('resize'));
  }

  roleGroupFormat(array) {
    const tembArr = [];
    array.forEach(element => {
      tembArr.push({
        id: element.id,
        desc: element.desc,
        children: element.child ? this.roleGroupFormat(element.child) : undefined
      });
    });
    return tembArr;
  }

  alertBeforeSubmit(isPublished, type?) {
    this.publishCourse = $.extend(true, {}, this.course);
    // this.changeDateFormat(this.publishCourse);
    this.publishCourse.countries = this.buildSelectedCountries(this.countryList);
    if (this.isSuggestedCourse) {
      const suggestedRoleGroup = this.roleGroupList?.find((element) => element.code === 'LAS');
      this.publishCourse.roleGroups = this.roleGroupFormat([suggestedRoleGroup]);
    } else {
      this.publishCourse.roleGroups = this.buildSelectedRoleGroups(this.roleGroupList);
    }
    if (isPublished) {
      if ((this.courseConfig.code === this.courseCode.F2F && !this.checkContentInCompCategory().isAllValid) && // check if course type is F2F and Comp category content is invalid
        (this.checkFreeTextQues())) { // check if comp category found in this course
        this.openAlert('withoutCompCategory');
      } else if ((this.publishCourse.countries.length < 1 || this.publishCourse.roleGroups.length < 1)) {
        this.openAlert('withoutRoleCountry');
      } else {
        this.submitCourse(isPublished, type);
      }
    } else {
      this.submitCourse(isPublished, type);
    }

  }

  submitCourse(isPublished, type?) {
    if (this.courseConfig.code === this.courseCode.SlideShow) {
      this.splitChapter();
    } else {
      this.changeFileFormat();
    }
    this.modifyData();
    this.publishCourse['status'] = isPublished ? 'Published' : 'Draft';
    this.publishCourse['published'] = isPublished;
    this.publishCourse['courseTypeId'] = this.courseConfig.id;
    this.publishCourse['parentId'] = isPublished ? null : this.publishDraft?.publish?.courseId;
    this.publishCourse['courseTypeDesc'] = this.courseConfig.courseTypeDesc;
    this.publishCourse['courseTypeCode'] = this.courseConfig.code;
    this.publishCourse['completionMessage'] = this.completionObject.content;
    const userDetails = JSON.parse(localStorage.getItem("userDetails") || '{}');
    this.publishCourse.lastUpdateUser = userDetails.username;
    console.log('Course', this.publishCourse);
    if (!type && this.courseConfig.code !== this.courseCode.Checklist && this.courseConfig.code !== this.courseCode.F2F) {
      if (this.compTemplateObj.title) {
        this.templateSubmitted(isPublished);
      } /* else {
        this.errorHandler.handleAlert('Course submitted without saving the completion message');
        // this.openAlert('templateSubmitted');
      } */
    }
    /* Condition to restrict multi call with null courseId; Bug: Double creation */
    if (((this.course.courseId === null && this.createCourseCallCount === 0) || this.course.courseId !== null)) {
      this.hitCourseAPI(type);
      this.createCourseCallCount++;
    }
  }

  autoSaveCourse() {
    this.autoSaveInterval = setInterval(() => {
      if (this.course.externalCourseName) {
        this.alertBeforeSubmit(false, 'autoSave');
        this.getF2FCompTemplates(true);
        // clearInterval(this.autoSaveInterval);
      }
    }, 600000);
  }

  /* split slideshow single chapter into multiple chapter */
  splitChapter() {
    /* SlideShow course has only one chapter with one activity */
    const slideActivity = this.publishCourse.chapters[0]?.activities[0];
    if (slideActivity) {
      const slideImages = slideActivity.content || [];
      const firstImage = slideImages.splice(0, 1);
      slideActivity.content = firstImage[0].name;
      slideActivity.title = firstImage[0].name;
      this.publishCourse.chapters[0].chapterType = 'slideShow';
      const chapterArr = [];
      slideImages.forEach((image, index) => {
        chapterArr.push(
          {
            chapterId: index + 2,
            chapterType: 'slideShow',
            activities: [{ activityType: 'slideShow', content: image.name, title: image.name }],
            questions: []
          });
      });
      this.publishCourse.chapters = this.publishCourse.chapters.concat(chapterArr);
    }
  }

  changeDateFormat() {
    const dateFormat = 'YYYY-MM-DD HH:mm:ss';
    const datechange = moment(this.publishCourse.period);
    this.publishCourse.period = (datechange?.format(dateFormat));
  }

  changeFileFormat() {
    this.publishCourse.chapters.forEach(chapter => {
      if (chapter.chapterType) {
        chapter.activities.forEach(activity => {
          if (activity.activityType && !this.nonFileActivities.includes(activity.activityType)) {
            let tempContent = '';
            let tempTitle = '';
            activity.content.forEach(content => {
              tempContent = tempContent ? `${tempContent}*,*${content.url}` : content.url;
              tempTitle = tempTitle ? `${tempTitle}*,*${content.name}` : content.name;
            });
            activity.content = tempContent;
            activity.title = tempTitle;
          }
        });
      }
    });
  }

  async hitCourseAPI(type?, isPublished?) {
    if (!type) {
      this.ngxService.start();
    }
    const res: any = await this.apiHandler.postData(this.utils.API.CREATE_UPDATE_COURSE, this.publishCourse, this.destroyed$,
      this.courseConfig.courseCode !== this.courseCode.F2F && type ? 'Course Auto Saved' : 'Course updated successfully');
    if (this.courseConfig.code === this.courseCode.F2F && res) { // check if the course type is F2F, If it is then first call templateSubmission and certificateSubmission
      this.validCompletionCategories = this.completionCategories.filter(comp => comp.content.length > 0);
      for (let category of this.validCompletionCategories) {
        if (category.content.length > 0) this.templateCategorySubmitted(isPublished, type, res.payload.courseId, category, res);
      }
      if (this.validCompletionCategories.length === 0) {
        this.createUpdateCertificateList(res.payload.courseId, res);
      }
    } else { // If the course is not F2F continue with existing flow
      if (this.publishCourse.published) {
        localStorage.setItem('canDeactivate', 'true');
        this.router.navigate(['/courses']);
      } else {
        this.course.courseId = res.payload.courseId;
        this.courseTypeDetail.view = 'draft';
        this.publishDraft['draft'] = $.extend(true, {}, this.course);
        this.clonedCourse = $.extend(true, {}, this.course);
        // this.setPredefinedVal(this.publishDraft.draft);
        if (!this.publishDraft.publish || !this.publishDraft.publish.courseId) {
          this.courseTypeDetail.courseId = res.payload.courseId;
          this.courseTypeDetail.type = 'edit';
          // delete this.publishDraft.draft;
          localStorage.setItem('courseType', JSON.stringify(this.courseTypeDetail));
        }
      }
    }
    
    this.ngxService.stop();
  }

  /*
    1) add sequenceId & update activity id
    2) remove unwanted chapter & activities
    3) delete isExpanded inside chapters
    4) Add chapter id to every questions
    5) stringify activities & questions in every chapter json
  */
  modifyData() {
    const tempCourse = [];//$.extend([], true, this.publishCourse.chapters);
    this.publishCourse.chapters?.forEach((chapter, chapterIndex) => {
      if (chapter.chapterType) {
        chapter.activities?.forEach((activity, activityIndex) => {
          if (activity.activityType) {
            activity.questions?.forEach(question => {
              this.setQuestionType(question);
            });
            activity.sequenceId = activityIndex;
            activity.activityId = activityIndex + 1;
          } else {
            chapter.activities.splice(activityIndex, 1);
          }
        });
        chapter.sequenceId = chapterIndex;
        chapter.questions.forEach(question => {
          this.setQuestionType(question);
          question.chapterId = chapter.chapterId;
        });
        chapter.activities = JSON.stringify(chapter.activities);
        chapter.questions = JSON.stringify(chapter.questions);
        delete chapter.isExpanded;
        tempCourse.push(chapter);
      }/*  else {
        this.publishCourse.chapters.splice(chapterIndex, 1);
      } */
    });
    this.publishCourse.chapters = tempCourse;
  }

  setQuestionType(question: any) {
    if (question.questionType === 'multiAnswer') {
      const crctAnswers = question.options?.filter(option => option.correctAnswer);
      if (crctAnswers.length === 1) {
        question.questionType = 'singleAnswer';
        question.correctAnswer = crctAnswers[0].key;
      } else {
        question.questionType = 'multiAnswer';
      }
    }
  }

  submitButton() {
    if (this.courseConfig.code === this.courseCode.F2F) {
      return !this.enableSubmitButtonForF2F();
    } else {
      return !this.enableSubmitButton();
    }
  }

  enableSubmitButtonForF2F() {
    let isValid: boolean = true;
    
    let isCourseNameValid: boolean = true;
    let isChapterValid: boolean = true;
    let isQuesValid: boolean = true;
    let isCompValid: boolean = true;
    let isCertificateValid: boolean = true;

    isCourseNameValid = this.course.externalCourseName ? true : false;
    isChapterValid = this.areChaptersValid();

    let noQuiz: boolean = this.quizCount() === 0 ? true : false;
    let isFreeTextAvailable: boolean = this.checkFreeTextQues();   

    isQuesValid = !noQuiz;
    if (isQuesValid) {
      for (let chapter of this.course.chapters || []) {
        if (chapter.chapterType) {
          isQuesValid = this.areQuestionnaireValid(chapter.questions);
          if (isQuesValid === false) {
            break;
          }
        }
      } 
    }

    /* Check completion message valid based on condition */
    if (isFreeTextAvailable) {      
      if (this.checkContentInCompCategory().isAnyValid) {
        isCompValid = true
      } else {
        isCompValid = false;
      }
    } else {
      isCompValid = this.completionObject?.content?.length > 0;
    }

    /* Check certification */
    isCertificateValid = this.certificationItems[this.certificationItems.length - 1].name ? true : false;

    let condition: boolean = false;
    if (isFreeTextAvailable) {
      condition = isCourseNameValid && ((isChapterValid && noQuiz) || (this.checkChapterEmpty() && isQuesValid) || (this.course.chapters.length > 1 && isChapterValid && !noQuiz && isQuesValid)) && isCompValid && isCertificateValid;
    } else {
      condition = isCourseNameValid && ((isChapterValid && noQuiz) || (this.checkChapterEmpty() && isQuesValid) || (this.course.chapters.length > 1 && isChapterValid && !noQuiz && isQuesValid)) && isCertificateValid;
    }

    if (condition) {
      isValid = true;
    } else {
      isValid = false;
    }

    return isValid;
  }

  checkContentInCompCategory() {
    let evaluate: any = {isValid: false};
    let passed: any = {isValid: false};
    let failed: any = {isValid: false};
    let redo: any = {isValid: false};
    for (let type of this.completionCategories) {
      switch (type.id) {
        case 1:
          evaluate.isValid = type.content?.length > 0;
          evaluate.id = type.id;
          break;

        case 2:
          passed.isValid = type.content?.length > 0;
          passed.id = type.id;
          break;

        case 3:
          failed.isValid = type.content?.length > 0;
          failed.id = type.id;
          break;

        case 4:
          redo.isValid = type.content?.length > 0;
          redo.id = type.id;
          break;

        default:
          break;
      }
    }
    let obj = { 
      isAnyValid: evaluate.isValid || passed.isValid || failed.isValid || redo.isValid, 
      isAllValid: evaluate.isValid && passed.isValid && failed.isValid && redo.isValid,
      evaluate: evaluate,
      passed: passed,
      failed: failed,
      redo: redo
    };
    return obj;
  }

  checkChapterEmpty() {
    let chapters = $.extend(true, [], this.course.chapters);
    /* let copyChapters =  [
      {
        chapterId: 1,
        isExpanded: true,
        activities: [{ activityId: 1, activityType: 'text', content: '' }, { activityId: 2, content: '' }],
        chapterType: 'text',
        questions: []
      },
      {
        chapterId: 2,
        activities: [{ activityId: 1, activityType: 'text', content: '' }, { activityId: 2, content: '' }],
        questions: []
      }
    ];

    chapters.forEach(chapter => {
      delete chapter.questions;
    });

    copyChapters.forEach(copyChapter => {
      delete copyChapter.questions;
    }); */

    let isEmpty: boolean = true;
    chapters.forEach(chapter => {
      chapter.activities.forEach(activity => {
        if (activity.content) {
          isEmpty = false;
        }
      });
    });

    return isEmpty;
  }

  quizCount() {
    let count = 0;
    for (let chapter of this.course.chapters) {
      if (chapter.questions.length > 0) {
        count++;
      }
    }
    return count;
  }

  checkFreeTextQuiz() {
    let isFreeTextAvailable: boolean = false;
    for (let chapter of this.course.chapters) {
      const obj = chapter.questions.find(question => question.questionType === 'freeText' || question.questionType === 'fillRightAnswer');
      if (obj) {
        isFreeTextAvailable = true;
        break;
      }
    }
    return isFreeTextAvailable;
  }

  enableSubmitButton() {
    let isValid: boolean = true;
    if (!this.course.externalCourseName) {
      isValid = false;
      return isValid;
    }
    if (this.courseConfig.code === this.courseCode.Policies && !this.course.categoryName) {
      isValid = false;
      return isValid;
    }
    /* isValid = this.areCountriesSelected()
    if (isValid === false) {
      return isValid;
    } */
    if (this.courseConfig.courseContent || this.courseConfig.code === this.courseCode.Checklist) {
      isValid = this.areChaptersValid();
      if (isValid === false) {
        return isValid;
      }
    }
    if (this.courseConfig.quiz) {
      for (let chapter of this.course.chapters || []) {
        if (chapter.chapterType) {
          isValid = this.areQuestionnaireValid(chapter.questions);
          if (isValid === false) {
            break;
          }
        }
      }
      if (isValid === false) {
        return isValid;
      }
    }
    if (this.courseConfig.completionMessage && this.courseConfig.code !== this.courseCode.Policies && this.courseConfig.code !== this.courseCode.F2F) {
      if (!(this.completionObject?.content?.length > 0)) {
        isValid = false;
        return isValid;
      }
    }
    /* if (this.courseConfig.completionMessage) {
      isValid = this.areChaptersValid();
      if (isValid === false) {
        return isValid;
      }
    } */
    return isValid;
  }

  areCountriesSelected() {
    return this.countryList?.filter((obj) => obj.selectStatus === 'checked' || obj.selectStatus === 'mixed').length > 0;
  }

  areChaptersValid() {
    let areChapsValid: boolean = true;
    for (var chapter of this.course.chapters || []) {
      if (chapter.chapterType && this.courseConfig.code === this.courseCode.Checklist) {
        areChapsValid = !!chapter.content;
      }
      areChapsValid = areChapsValid && this.isChapterValid(chapter);
      if (areChapsValid === false) {
        return areChapsValid;
      }
    }
    return areChapsValid;
  }

  isChapterValid(chapter) {
    var isChapValid: boolean = true;
    if (chapter.chapterType) {
      for (var activity of chapter.activities) {
        isChapValid = this.isActivityValid(activity);
        if (isChapValid === false) {
          return isChapValid;
        }
      }
    }
    return isChapValid;
  }

  isActivityValid(activity) {
    var isActValid: boolean = true;
    if (activity.activityType) {
      if (activity.activityType === 'quiz') {
        if (!activity.content || activity.content.length < 1) {
          isActValid = this.areQuestionnaireValid(activity.questions);
          return isActValid;
        }
      } else {
        if (!activity.content || activity.content.length < 1) {
          isActValid = false;
          return isActValid;
        }
      }
    }
    return isActValid;
  }

  areQuestionnaireValid(questions) {
    let areQuesValid: boolean = true;
    for (let question of questions || []) {
      if (question.questionType === 'multiAnswer') {
        areQuesValid = this.isQuestionValid(question);
        if (areQuesValid === false) {
          break;
        }  
      } else if (question.questionType === 'fillRightAnswer' || question.questionType === 'freeText') {
        if (question.content) {
          if (question.characterLimitCheck === true) {
            areQuesValid = question.characterLimit > 0;
          } else {
            areQuesValid = true;
          }
        } else {
          areQuesValid = false;
        }
      } else if (question.questionType === 'reArrangeOrder') {
        if (question.content) {
          let validOptions = 0;
          for (let option of question.options || []) {
            if (option.content) {
              validOptions++;
            }
          }
          if (validOptions < 2) {
            areQuesValid = false;
          }
        } else {
          areQuesValid = false;
        }
      }
    }
    if (areQuesValid === false) {
      return areQuesValid;
    }
    return areQuesValid;
  }

  isQuestionValid(question) {
    let isQueValid: boolean = true;
    if (question.content) {
      let validOptions = 0;
      let correctOptions = 0;
      for (let option of question.options || []) {
        if (option.content) {
          validOptions++;
          if (option.correctAnswer) {
            correctOptions++;
          }
        }
      }
      if (validOptions < 2 || correctOptions < 1) {
        isQueValid = false;
        return isQueValid;
      }
    } else {
      isQueValid = false;
      return isQueValid;
    }
    return isQueValid;
  }

  disableAddOption(question: any) {
    let isDisabled: boolean = false;
    question.options.forEach(option => {
      if (!option.content) {
        isDisabled = true;
      }
    });
    return isDisabled;
  }

  atleastSingleQuestion() {
    return !this.course.chapters.find(chapter => chapter.questions.length > 0);
  }

  scrollLeft(elementId, position) {
    document.getElementById(elementId).scrollLeft += position;
  }

  scrollRight(elementId, position) {
    document.getElementById(elementId).scrollLeft -= position;
  }

  async getHistoryData(element) {
    // this.ngxService.start();
    const response: any = await this.apiHandler.getData(`${this.utils.API.GET_COURSE_HISTORY}${element.courseId}`, null, this.destroyed$);
    this.courseHistory = response.payload || [];
    /* if (this.courseHistory.length < 1) {
      this.errorHandler.handleAlert('No history available for this course');
    } else {
      this.historyModal.nativeElement.click();
    }
    this.ngxService.stop(); */
  }

  isPdfActivity() {
    if (this.course.chapters[this.currentPage]?.activities[0]?.activityType === 'pdf') {
      this.pdfLoader('start');
    } else {
      this.pdfLoader('stop');
    }
  }

  pdfLoader(type: string) {
    if (type === 'start') {
      this.ngxService.startLoader('preview-loader');
      /* this.isPDFLoading = true;
      this.ngxService.start(); */
    } else {
      this.ngxService.stopLoader('preview-loader');
      const pdfElement: any = document.getElementsByClassName('ng2-pdf-viewer-container')[0];
      if (pdfElement) {
        pdfElement.style.position = 'relative';
      }
      /* this.isPDFLoading = false;
      this.ngxService.stop(); */
    }
  }

  /* On completion category DD change (Only for F2F) */
  selectedCompletionType: any = {id: 1, name: 'Evaluated', content: '', templateId: 'new'};
  disableTemplateDD: boolean = false;
  compCategoryChange(event) {
    this.disableTemplateDD = true;
    console.log('Categories', this.completionCategories);
    this.selectedCompletionType = {};
    this.selectedCompletionType = event;
    this.getF2FCompTemplates(false);
  }

  templateChange(event, type) {
    if (type === 'normal') {
      if (event.id !== 'new') {
        this.completionObject.content = event.content;
        this.compTemplateObj.title = event.title;
      } else {
        this.compTemplateObj.title = '';
      }  
    } else if (type === 'freeText') {
      if (event.id !== 'new') {
        this.selectedCompletionType.content = event.content;
        this.selectedCompletionType.title = event.title;
      } else {
        this.selectedCompletionType.title = '';
      }
    }
  }

  async templateSubmitted(isPublished, courseId?) {
    if (this.completionObject.content) {
      const compObj: any = {};
      compObj.content = this.completionObject.content;
      compObj.title = this.compTemplateObj.title;
      compObj.code = this.courseTypeDetail?.courseTypeCode;
      compObj.typeId = this.selectedCompletionType.id;
      compObj.courseId = courseId;
      if (this.compTemplateObj.id !== 'new') {
        compObj.id = this.compTemplateObj.id;
      }
      const response: any = await this.apiHandler.postData(this.utils.API.POST_COMP_TEMPLATES, compObj, this.destroyed$);
      if (!isPublished) {
        let changedTemplateIndex = this.compTemplates.findIndex(element => element.id === response.payload.id);
        if (changedTemplateIndex !== -1) {
          // this.compTemplates[changedTemplateIndex] = response.payload;
          this.compTemplates = this.compTemplates.slice(0, changedTemplateIndex).concat(response.payload, this.compTemplates.slice(changedTemplateIndex + 1))
        } else {
          this.compTemplates = this.compTemplates.concat(response.payload);
          this.compTemplateObj.id = response.payload.id
        }
      }
    }
  }

  templateCategorySubmittedCount: number = 0;
  async templateCategorySubmitted(isPublished, type, courseId, obj, res) {
    this.ngxService.start();
    const compObj: any = {};
      compObj.content = obj.content;
      compObj.title = obj.title;
      compObj.code = this.courseTypeDetail?.courseTypeCode;
      compObj.typeId = obj.id;
      compObj.courseId = courseId;
      if (obj.templateId !== 'new') {
        compObj.id = obj.templateId;
      }
      const response: any = await this.apiHandler.postData(this.utils.API.POST_COMP_TEMPLATES, compObj, this.destroyed$);
      this.templateCategorySubmittedCount++;
      if (!isPublished) {
        let changedTemplateIndex = this.compTemplates.findIndex(element => element.id === response.payload.id);
        if (changedTemplateIndex !== -1) {
          // this.compTemplates[changedTemplateIndex] = response.payload;
          this.compTemplates = this.compTemplates.slice(0, changedTemplateIndex).concat(response.payload, this.compTemplates.slice(changedTemplateIndex + 1))
        } else {
          this.compTemplates = this.compTemplates.concat(response.payload);
          this.compTemplateObj.id = response.payload.id
        }
      }
      console.log('Validation categories: ', this.validCompletionCategories);
      console.log('templateCategorySubmittedCount: ', this.templateCategorySubmittedCount);
      if (this.validCompletionCategories.length === this.templateCategorySubmittedCount) {
        this.createUpdateCertificateList(courseId, res);
        this.templateCategorySubmittedCount = 0;
      }
  }

  checkCourseMod() {
    let modified = false;
    modified = this.clonedCourse.externalCourseName !== this.course.externalCourseName;
    if (modified === true) return modified;
    modified = this.clonedCourse.internalCourseName !== this.course.internalCourseName;
    if (modified === true) return modified;
    modified = this.clonedCourse.period !== this.course.period;
    if (modified === true) return modified;
    modified = this.clonedCourse.managerConfirmation !== this.course.managerConfirmation;
    if (modified === true) return modified;
    modified = this.clonedCourse.questionLimit !== this.course.questionLimit;
    if (modified === true) return modified;
    modified = this.clonedCourse.completionMessage !== this.completionObject.content;
    if (modified === true) return modified;
    const clonedChapters = this.clonedCourse.chapters;
    const chapters = this.course.chapters;
    modified = clonedChapters.length !== chapters.length;
    if (modified === true) return modified;
    for (let i in clonedChapters) {
      modified = clonedChapters[i].content !== chapters[i].content;
      if (modified) break;
      // check if any question get modifiedv
      const clonedQuestions = clonedChapters[i].questions;
      const questions = chapters[i].questions;
      modified = clonedQuestions.length !== questions.length
      if (modified) {
        break;
      } else {
        modified = !this.deepCompare(clonedQuestions, questions)
        if (modified) break;
      }
      if (modified === true) return modified;
      const clonedActivities = clonedChapters[i].activities;
      const activities = chapters[i].activities;
      modified = clonedActivities.length !== activities.length
      if (modified) {
        break;
      } else {
        for (let i in clonedActivities) {
          modified = clonedActivities[i].content?.toString() !== activities[i].content?.toString();
          if (modified) break;
        }
        if (modified) break;
      }
      modified = clonedChapters[i].questionLimit !== chapters[i].questionLimit;
      if (modified) break;
    }
    if (modified === true) return modified;
    const selectedLevels = this.buildSelectedRoleGroups(this.roleGroupList);
    this.sortIds(this.clonedCourse.roleGroups);
    this.sortIds(selectedLevels);
    modified = !this.deepCompare(this.clonedCourse.roleGroups || [], selectedLevels);
    if (modified === true) return modified;
    const selectedCntry = this.buildSelectedCountries(this.countryList);
    this.sortIds(this.clonedCourse.countries);
    this.sortIds(selectedCntry);
    modified = !this.deepCompare(this.clonedCourse.countries || [], selectedCntry);
    if (modified === true) return modified;

    if (modified) {
      localStorage.removeItem('canDeactivate');
    } else {
      localStorage.setItem('canDeactivate', 'true');
    }
    return modified;
  }

  sortIds(array) {
    array?.sort((a, b) => a.id - b.id);
    for(let ele of array) {
      if (ele?.children?.length > 0) {
        this.sortIds(ele.children)
      }
    }
  }

  handleScroll(){
    const divscroll = document.getElementById('targetscroll');
    setTimeout(() => {
      divscroll.scrollTop = divscroll.scrollHeight
    }, 100);
  }

  focusInput(id: string) {
    setTimeout(() => {
      document.getElementById(id).focus();
    }, 500);
  }

  quizChapterChange(chapterIndex: any) {
    if (!this.quizPosition) {
      this.currentPage = chapterIndex;
    }
  }

  async print() {
    this.ngxService.start();
    setTimeout(() => {
      this.printLogic();
    });
  }

  /* Print Function */
  printLogic() {
    const tempCourse: any = this.course.chapters.slice();
    tempCourse.pop();
    /* if ((tempCourse.every(ele => ele.chapterType === 'fileUpload') && this.selectedForm !== 'questionaire')) {
      this.errorHandler.handleAlert('PDF file cannot be generation as it contains the files / Video / Audio in the chapters');
      return;
    } */
    console.log("print...............................")
    this.expandEnableDisable(true);
    this.textOnlyExportPDF();
  }

  /* Expand the Example Accordion to Print PDF */
  expandEnableDisable(isExpanded: any) {
    this.course.chapters.forEach(chapter => {
      chapter.activities.forEach(activity => {
        if (activity.activityType == 'example') {
          activity.isExpanded = isExpanded;
        }
      });
    });
  }

  /* Export PDF using HTML2PDF */
  textOnlyExportPDF() {
    let element: any = '';
    if (this.selectedForm === 'courseContent') {
      element = document.getElementById('course-print-section');
    } else if (this.selectedForm === 'questionaire') {
      element = document.getElementById('quiz-print-section');
    } else if (this.selectedForm === 'checklist') {
      element = document.getElementById('checklist-print-section');
    }
    var opt = {
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'], before: '#chapterSplit' },
      margin: .25,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { dpi: 96, useCORS: true, letterRendering: true },
      jsPDF: {
        unit: 'in', format: 'letter', orientation: 'portrait', compress: true,
      },
    };
    html2pdf().from(element).set(opt).toPdf('pdf').save('SM_' + new Date().valueOf() + '.pdf');
    this.ngxService.stop();
  }

  checkActivityMedia(chapter: any) {
    let modified = false;
    chapter.activities.forEach(activity => {
      if (activity.activityType === 'text' || activity.activityType === 'example' || activity.activityType === 'quiz') {
        modified = true;
      }
    });
    return modified;
  }

  enablePdfButton() {
    let content: boolean = false;
    let quiz: boolean = false;
    if ((this.selectedForm === 'courseContent' || this.selectedForm === 'checklist') && (this.course.chapters[0].activities.some(ele => ele?.content && ele?.content.length > 0))) {
      content = true;
    } else if ((this.selectedForm === 'questionaire') && (this.course.chapters.some(ele => ele.questions.length > 0))) {
      quiz = true;
    }
    return content || quiz;
  }

  mediaDownload() {
    const urlList: any = this.getMediaUrlList();
    const downloadSequentially = async () => {
      this.errorHandler.handleAlert('Download started');
      for (let url of urlList) {
        await this.mediaDownloadLogic(url);
      }
    };

    downloadSequentially();
    setTimeout(() => {
    }, 100);
  }

  getMediaUrlList() {
    let mediaUrlList: any = [];
    this.course.chapters.forEach(chapter => {
      if (chapter.chapterType === 'slideShow') {
        chapter.activities[0].content.forEach(activity => {
          if (activity.content !== '') {
            mediaUrlList.push(`${this.utils.mediaDownloadUrl}${activity.name}`);
          }
        });
      } else {
        chapter.activities.forEach(activity => {
          if ((activity.activityType === 'video' || activity.activityType === 'audio' || activity.activityType === 'pdf' || activity.activityType === 'slide') && activity.content !== '' && activity.content.length > 0) {
            mediaUrlList.push(`${this.utils.mediaDownloadUrl}${activity.content[0].url}`);
          }
        })
      }
    });
    return mediaUrlList;
  }

  async mediaDownloadLogic(url: any) {
    const link: any = document.createElement('a');
    link.href = url;
    // Add the 'download' attribute to force download
    link.download = 'SM_' + new Date().valueOf();

    document.body.appendChild(link);
    link.click();
    // Wait for a short duration before removing the link
    await new Promise(resolve => setTimeout(resolve, 1000));
    document.body.removeChild(link);
  }

  isAllFileContent() {
    let allFile: boolean = false;
    let isTextActivity: boolean = false;
    const tempCourse: any = this.course.chapters.slice();
    tempCourse.pop();
    if ((tempCourse.every(ele => ele.chapterType === 'fileUpload') && this.selectedForm !== 'questionaire')) {
      allFile = true;
    }
    /* Check if text activity found */
    for(let chapter of tempCourse) {
      for(let activity of chapter.activities) {
        if (activity.activityType === 'text') {
          isTextActivity = true;
          break;
        }
      }
      if(isTextActivity) {
        break;
      }
    }
    return allFile || !isTextActivity;
  }

  policyGroupOnClick() {
    if (this.view && !this.create && !this.update) {
      const doc: any = document.querySelector('[role="listbox"]');
      doc.style.pointerEvents = 'none';
    }
  }

  enableDownloadDropDown() {
    return !this.isAllFileContent() && this.getMediaUrlList().length > 0
  }

  /* Check if free text is present in quiz */
  checkFreeTextQues() {
    let isFreeTextAvailable: boolean = false;
    for (let chapter of this.course.chapters) {
      for (let question of chapter.questions) {
        if (question.questionType === 'freeText' || question.questionType === 'fillRightAnswer') {
          isFreeTextAvailable = true;
          break;
        }
        if (isFreeTextAvailable) {
          break;
        }
      }
    }
    return isFreeTextAvailable;
  }


  /* Certification methods */
  certificates: any= [];
  copyCertificates: any= [];
  async getCertificates() {
    this.ngxService.start();
    const response: any = await this.apiHandler.getData(this.utils.API.GET_CERTIFICATES_LIST, null, this.destroyed$);
    this.certificates = response.payload;
    this.certificates = this.certificates.filter(certificate => certificate.id !== this.certificationItems.find(certItem => certItem.id === certificate.id)?.id);
    this.copyCertificates = $.extend(true, [], response.payload);
    this.ngxService.stop();
  }

  /* Create update certificate list API, Once called with courseId after course creation */
  async createUpdateCertificateList(courseId, res) {
    this.ngxService.start();
    const certItems = $.extend(true, [], this.certificationItems);
    certItems.forEach(certItem => {
      certItem.countries = [...this.buildCertCountries(certItem.renderingData.countryList)];
      delete certItem.renderingData;
    });
    const params = {
      courseId: courseId,
      code: this.courseConfig.code,
      data: certItems
    }
    const response: any = await this.apiHandler.plainPostData(this.utils.API.CREATE_UPDATE_CERTIFICATE, params, this.destroyed$);
    console.log('Certified countries', this.certificationItems);

    /* hitApi method continuity after response */
    if (this.publishCourse.published) {
      localStorage.setItem('canDeactivate', 'true');
      this.router.navigate(['/courses']);
    } else {
      this.course.courseId = res.payload.courseId;
      this.courseTypeDetail.view = 'draft';
      this.publishDraft['draft'] = $.extend(true, {}, this.course);
      this.clonedCourse = $.extend(true, {}, this.course);
      // this.setPredefinedVal(this.publishDraft.draft);
      if (!this.publishDraft.publish || !this.publishDraft.publish.courseId) {
        this.courseTypeDetail.courseId = res.payload.courseId;
        this.courseTypeDetail.type = 'edit';
        // delete this.publishDraft.draft;
        localStorage.setItem('courseType', JSON.stringify(this.courseTypeDetail));
      }
    }
    if (!this.publishCourse.published) {
      this.getCertificationItems();
    }
    this.ngxService.stop();
  }

  /* Get certification items from created F2F course, Once called with courseId after got course detail */
  async getCertificationItems() {
    this.ngxService.start();
    const params: any = {
      courseId: this.courseTypeDetail.courseId,
    }
    const response: any = await this.apiHandler.plainPostData(this.utils.API.GET_CERTIFICATE, params, this.destroyed$);
    if (response.payload && response.payload.data.length > 0) {
      this.certificationItems = this.constructRenderingData($.extend(true, [], JSON.parse(response.payload.data)));
    } else {
      this.certificationItems[0].countries = this.setCountryStatusChecked($.extend(true, [], this.countryList));
      this.setRenderingDataForCertificationItems();
    }
    console.log('Certified countries', this.certificationItems);
    this.getCertificates();
    this.ngxService.stop();
  }

  /* Construct renderingData */
  constructRenderingData(certificationItems) {
    let crsIds = [];
    certificationItems.forEach((item, index) => {
      item.renderingData = { countryList: [] };
      item.renderingData.countryList = $.extend(true, [], this.cloneCountryList);

      if (index === 0) {
        item.renderingData.countryList.forEach(country => {
          const selectedCountry = item.countries.find(selectedCountry => selectedCountry.id === country.id);
          if (selectedCountry) {
            country.selectStatus = 'checked';
            country.show = true;
            country.child.forEach(region => {
              let selectedRegion;
              if (selectedCountry.children !== undefined && selectedCountry.children.length > 0) {
                selectedRegion = selectedCountry.children.find(selectedRegion => selectedRegion.id === region.id);
                if (selectedRegion) {
                  region.selectStatus = 'checked';
                  region.show = true;
                  region.child.forEach(store => {
                    let selectedStore;
                    if (selectedRegion.children !== undefined && selectedRegion.children.length > 0) {
                      selectedStore = selectedRegion.children.find(selectedStore => selectedStore.id === store.id);
                      if (selectedStore) {
                        store.selectStatus = 'checked';
                        store.show = true;
                      } else {
                        store.selectStatus = 'unchecked';
                        store.show = false;
                      }
                      const obj = {
                        id: `${country.id}|${region.id}|${store.id}`,
                        store: store
                      }
                      crsIds.push(obj);
                    }
                  });
                }
              }
            });
          }
        });
      } else {
        item.renderingData.countryList.forEach(country => {
          const selectedCountry = item.countries.find(selectedCountry => selectedCountry.id === country.id);
          if (selectedCountry) {
            country.selectStatus = 'checked';
            country.show = true;
            country.child.forEach(region => {
              let selectedRegion;
              if (selectedCountry.children !== undefined && selectedCountry.children.length > 0) {
                selectedRegion = selectedCountry.children.find(selectedRegion => selectedRegion.id === region.id);
                if (selectedRegion) {
                  region.selectStatus = 'checked';
                  region.show = true;
                  region.child.forEach(store => {
                    const crsIdCurrent = `${country.id}|${region.id}|${store.id}`;
                    let selectedStore;
                    if (selectedRegion.children !== undefined && selectedRegion.children.length > 0) {
                      selectedStore = selectedRegion.children.find(selectedStore => selectedStore.id === store.id);
                      if (selectedStore) {
                        store.selectStatus = 'checked';
                        store.show = true;
                      } else {
                        store.selectStatus = 'unchecked';
                        store.show = false;
                      }
                      const defaultCrsId = crsIds.find(crsid => crsid.id === crsIdCurrent);
                      if (defaultCrsId && (defaultCrsId.store.show === true) && (defaultCrsId.store.selectStatus === 'checked')) {
                        store.show = true;
                      }
                    }
                  });
                }
              }
            });
          }
        });
      }
      item.renderingData.countryList.forEach(country => {
        country.child.forEach(region => {
          this.updateParentShowProperty(region.child);
        });
        this.updateParentShowProperty(country.child);
      });
      this.updateParentShowProperty(item.renderingData.countryList);
    });
    return certificationItems;
  }

  /* test */
  setShowSelectStatus(list, selectedList) {
    selectedList?.forEach(selected => {
      let selectedObj = list.find(obj => obj.id === selected.id);
      if (selectedObj) {
        if (selected.children && selected.children.length > 0) {
          selectedObj.selectStatus = 'mixed';
          selectedObj.show = true;
          this.setShowSelectStatus(selectedObj.child, selected.children);
        } else {
          selectedObj.selectStatus = 'checked';
          selectedObj.show = true;
          this.changeObjProperty(selectedObj.child, 'selectStatus', 'checked');
          this.changeObjProperty(selectedObj.child, 'show', true);
        }
      } else {
        selectedObj.selectStatus = 'unchecked';
        selectedObj.show = false;
      }
    });
  }

  /* Build countries as per backend need */
  buildCertCountries(list) {
    let tempArr = [];
    list.forEach(element => {
      if ((element.selectStatus === 'checked' || element.selectStatus === 'mixed') && element.show === true) {
        tempArr.push({
          id: element.id,
          desc: element.desc,
          children: element.child ? this.buildCertCountries(element.child) : undefined
        });
      }
    });
    return tempArr;
  }

  /* Update selection status in certificate item when changing stores in tree */
  preCertList = $.extend(true, [], this.certificationItems);
  updateSelectionStatusOnCertItemChange(event, selectedItem, selectedItemIndex) {

    const changeOccurs = JSON.stringify(this.preCertList) !== JSON.stringify(this.certificationItems);
    if (event === false && selectedItemIndex !== 0) {
      const selectedCountries: any = selectedItem.renderingData.countryList;

      this.certificationItems.forEach((certItem, index) => {
        if (index !== selectedItemIndex) {
          this.updateShowProperty(certItem.renderingData.countryList, selectedCountries, changeOccurs);
          certItem.renderingData.countryList.forEach(country => {
            country.child.forEach(region => {
              this.updateParentShowProperty(region.child);
            });
            this.updateParentShowProperty(country.child);
          });
          this.updateParentShowProperty(certItem.renderingData.countryList);
        }
      });
    }
  }

  /* Update show property of remaining line item based of selected lineItem's selectStatus */
  updateShowProperty(list: any, selectedList: any, changeOccurs: any) {
    list.forEach(country => {
      const selectedCountry = selectedList.find(selectedCountry => selectedCountry.id === country.id);
      country.child.forEach(region => {
        const selectedRegion = selectedCountry.child.find(selectedRegion => selectedRegion.id === region.id);
        region.child.forEach(store => {
          const selectedStore = selectedRegion.child.find(selectedStore => selectedStore.id === store.id);
          if (changeOccurs && (store.show === true || selectedStore.show === true)) {
            if (selectedStore.selectStatus === 'checked') {
              store.show = false;
            } else {
              store.show = true;
            }
          }
        });
      });
    });
    this.preCertList = $.extend(true, [], this.certificationItems);
  }
  
  /* Update parent show property based on its child show property */
  updateParentShowProperty(list: any) {
    list.forEach((location) => {
      if (location.child) {
        location.show = location.child.some((child) => child.show === true);
      }
    });
  }

  /* Remove stores, region & country except selected locations in master Location tree */
  filterList(list: any, selectedList: any, update?: boolean): any {
    const filteredList: any = [];
    let that: any = this;

    function filterRecursive(items: any, selectedItems: any) {
      for (const item of items) {
        const selected = selectedItems.find((selectedItem) => selectedItem.id === item.id);
  
        if ((update && selected.selectStatus === 'unchecked') || (!update && selected)) {
          const filteredItem: any = { ...item };
          if (selected[update ? 'child': 'children'] && selected[update ? 'child': 'children'].length && item.child) {
            filteredItem.child = that.filterList(item.child, selected[update ? 'child': 'children'], update);
          }
          filteredList.push(filteredItem);
        }
      }
    }
  
    filterRecursive(list, selectedList);
  
    return filteredList;
  }

  /* Construct countryList to render certificate locations from selected countries */
  setSelected(list, selectedList, index) {
    const tempArray = $.extend(true, [], list);
    const listArray = this.filterList(tempArray, selectedList);
    if (index === 0) {
      this.changeObjProperty(listArray, 'selectStatus', 'checked');
      this.changeObjProperty(listArray, 'show', true);
    } else {
      this.setSelectedCountries(list, selectedList, 'certificate')
    }
    return listArray;
  }

  /* Iterate certifiationItems to construct countryList */
  setRenderingDataForCertificationItems() {
    this.certificationItems.forEach((certificationItem, index) => {
      certificationItem.renderingData = {
        countryList: this.setSelected(this.cloneCountryList, certificationItem.countries, index),
        selectedStoreCount: 0
      }
    });
  }

  /* Add certItem when clicking add button */
  addCertItem() {
    this.certificationItems.push(
      {
        countries: [],
        id: '',
        name: '',
        certificateUrl: '',
        renderingData: {
          countryList: this.changeObjProperty($.extend(true, [], this.certificationItems[0].renderingData.countryList), 'selectStatus', 'unchecked'),
          selectedStoreCount: 0
        }
      }
    )
    
  }

  /* Set all status checked for initial countryList data */
  setCountryStatusChecked(list) {
    const checkedCountryList = this.changeObjProperty(list, 'selectStatus', 'checked');
    return this.buildSelectedCountries(checkedCountryList);
  }

  onCertificateChange(event, certItem) {
    const tempArray = [...this.certificates];
    this.certificates = [];
    this.certificates = [...tempArray.filter(c => c.id !== event.id)];

    if (certItem.name) {
      this.certificates.push(this.copyCertificates.find(c => c.id === certItem.id));
      this.certificates.sort((a, b) => a.id - b.id);
    }

    certItem.id = event.id;
    certItem.name = event.name;
    certItem.certificateUrl = event.certificateUrl;
  }

  previewData: any;
  viewCertificate(certItem: any) {
    this.pdfLoader('start');
    this.previewData = certItem;
  }

  onDeleteButtonClick(certItemIndex, certItem) {
    if (certItem.name.length === 0 && this.getSelectedChildCount(certItem.renderingData.countryList, 0, 'cert') === 0) {
      const tempItems = $.extend(true, [], this.certificationItems);
      this.certificationItems = [];
      this.certificationItems = tempItems.filter(item => item.id !== certItem.id);
    } else {
      this.openAlert('deleteCertItem', certItemIndex, certItem)
    }
  }

  deleteCertItem(certItem) {
    const tempItems = $.extend(true, [], this.certificationItems);
    this.certificationItems = [];
    this.certificationItems = tempItems.filter(item => item.id !== certItem.id);
    this.certificationItems.forEach((item, index) => {
      item.renderingData.countryList.forEach(country => {
        const selectedCountry = certItem.renderingData.countryList.find(selectedCountry => selectedCountry.id === country.id);
        country.child.forEach(region => {
          const selectedRegion = selectedCountry.child.find(selectedRegion => selectedRegion.id === region.id);
          region.child.forEach(store => {
            const selectedStore = selectedRegion.child.find(selectedStore => selectedStore.id === store.id);
            if (selectedStore.selectStatus === 'checked' && selectedStore.show === true) {
              store.show = true;
              if (index === 0) {
                store.selectStatus = 'checked';
              } else {
                store.selectStatus = 'unchecked';
              }
            }
          });
        });
      });
    });
    this.certificates.push(this.copyCertificates.find(c => c.id === certItem.id));
    this.certificates.sort((a, b) => a.id - b.id);
    this.previewData = undefined;
  }

  previewScrollDown() {
    setTimeout(() => {
      document.querySelector(".quizSection").scrollTop = document.querySelector(".quizSection").scrollHeight;
    }, 300);
  }
  
  questionScrollDown() {
    setTimeout(() => {
      document.querySelector(".questionCls").scrollTop = document.querySelector(".questionCls").scrollHeight;
    }, 300);
  }

  characterLimitCheck(event, question) {
    question.characterLimitCheck = event.checked;
    if (event.checked === false) {
      delete question.characterLimit;
      delete question.characterLimitCheck;
    }
  }

  allowNumberOnly(event: any, question): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    } else {
      this.validateCharacterimit(question);
    }
    return true;
  }

  validateCharacterimit(question) {
    setTimeout(() => {
      if (question.characterLimit <= 500) {

      } else {
        this.errorHandler.handleAlert('Only 500 characters are allowed');
        delete question.characterLimit;
      }
    }, 100);
  }

  ngOnDestroy() {
    clearInterval(this.autoSaveInterval);
    this.destroyed$.next();
    this.destroyed$.complete();
    this.destroyed$.unsubscribe();
  }

}
