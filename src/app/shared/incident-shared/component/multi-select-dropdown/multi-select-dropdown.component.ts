import { Component,ViewChild,ViewChildren, OnChanges, SimpleChanges, SimpleChange,ElementRef,Injectable,OnInit,Output,EventEmitter,Input,HostListener} from "@angular/core";
import { FormControl } from "@angular/forms";
import { SelectionModel } from "@angular/cdk/collections";
import { FlatTreeControl } from "@angular/cdk/tree";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener
} from "@angular/material/tree";
import { BehaviorSubject } from "rxjs";
import { RequestApiService } from '../../../services/incident-services/request-api.service';
import { Utils } from '../../module/utils';

import { CommonService } from '../../../services/incident-services/common.service';
import { DatePipe } from '@angular/common';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
/**
 * Node for to-do item
 */
export class FoodNode {
  children?: FoodNode[];
  item: any;
  id:any;
  name:any;
  countryId:any;
  companyCode:any;
}

/** Flat to-do item node with expandable and level information */
export class FoodFlatNode {
  item: any;
  level: any;
  expandable: any;
  id: any;
  name:  any;
   countryId:any;
   companyCode:any;
   children:any
}

/**
 * The Json object for to-do list data.
 */
const TREE_DATA: FoodNode[] = [
  {
    item: "UK",
    id:2,
    name:'UK',
    countryId:0 ,
    companyCode:'UK',
    children: [
      { item: "Carrickmines Dublin",id:1,name:'UK',countryId:2,
    companyCode:'UK',},
      { item: "Region 5",id:1,name:'UK',countryId:2,
    companyCode:'UK', },
    ]
  },
  {
    item: "RIO"
    ,id:2,name:'UK',
    countryId:0,
    companyCode:'UK',
    children: [
    {item: "Region 11" ,id:2,name:'UK' , countryId:2,
    companyCode:'UK'    },
    { item: "Region 12" , id:2, name:'UK', countryId:2,
    companyCode:'UK'   }
    ]
  }
];

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable({ providedIn: "root" })
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<FoodNode[]>([]);
  treeData: any;

  get data(): FoodNode[] {
    return this.dataChange.value;
  }

  constructor(private requestapi:RequestApiService,private utils:Utils) {
    this.initialize();
  }
loginEmployeeId:any;
public incidentCodeData:any = [];
  async initialize() {

let userDetails = JSON.parse(localStorage.getItem('userDetails'));
this.loginEmployeeId = localStorage.getItem('username');
    // let countryRegionData:any = await this.getEmployeeRegion();
    let incidentCodeData:any = await this.getincidentCodeList();
    this.incidentCodeData = incidentCodeData;
      let data1:any = [];
    for (var i = 0; i < incidentCodeData.length; i++) {
      let primaryCode:any={item:incidentCodeData[i].primaryCode,
        name:incidentCodeData[i].primaryCode,
        id:incidentCodeData[i].id,
        countryId:0,
        companyCode:incidentCodeData[i].primaryCode,
        children:[],

      }
      for (var j = 0; j < incidentCodeData[i].secondaryCodes.length; j++) {
         let secondaryCodes:any ={item:incidentCodeData[i].secondaryCodes[j].secondaryCode,
        name:incidentCodeData[i].secondaryCodes[j].secondaryCodeDescription,
        id:incidentCodeData[i].secondaryCodes[j].id,
        countryId:incidentCodeData[i].secondaryCodes[j].primaryCode,
        companyCode:incidentCodeData[i].secondaryCodes[j].secondaryCode};
        primaryCode.children.push(secondaryCodes);
      }
       data1.push(primaryCode);
    }
    this.treeData = data1;
    //this.treeData = TREE_DATA;
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.
    //const data = TREE_DATA;
const data = data1;
    // Notify the change.
    this.dataChange.next(data);
  }
//   async getEmployeeRegion(){

//   let response:any=await this.requestapi.getData(this.utils.API.GET_COUNTRY_REGION+'?userName='+this.loginEmployeeId);
//   return response.payLoad;

// }

async getincidentCodeList(){
  let response:any=await this.requestapi.getData(this.utils.API.INCIDENT_CODES_URL+'?userName='+this.loginEmployeeId);
      return response.payLoad;
}

  public filter(filterText: string) {
    let filteredTreeData;
    if (filterText) {
      // Filter the tree
      function filter(array:any, text:any) {
        const getChildren = (result:any, object:any) => {
          if (object.item .toLowerCase() === text.toLowerCase() ) {
            result.push(object);
            return result;
          }
          if (Array.isArray(object.children)) {
            const children = object.children.reduce(getChildren, []);
            if (children.length) result.push({ ...object, children });
          }
          return result;
        };

        return array.reduce(getChildren, []);
      }

      filteredTreeData = filter(this.treeData, filterText);
    } else {
      // Return the initial tree
      filteredTreeData = this.treeData;
    }

    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    // file node as children.
    const data = filteredTreeData;
    // Notify the change.
    this.dataChange.next(data);
  }
}

@Component({
  selector: 'app-multi-select-dropdown',
  templateUrl: './multi-select-dropdown.component.html',
  styleUrls: ['./multi-select-dropdown.component.scss']
})
export class MultiSelectDropdownComponent implements OnInit {
  
  @Output() incidentCodeSelectEvent  = new EventEmitter<any>();
 @Input() scrollCount:any; 
  @ViewChild(MatAutocompleteTrigger, {read: MatAutocompleteTrigger}) autoCompleteTrigger: any;
@ViewChildren(MatAutocompleteTrigger) autoCompleteTriggers:any;
public closeAllPanels() {
  if(this.autoCompleteTriggers!=undefined){
      this.autoCompleteTriggers.forEach((trigger:any) => {
      if (trigger.panelOpen) {
        trigger.closePanel();
      }
    }); 
  }
   
  }

 /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<FoodFlatNode, FoodNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<FoodNode, FoodFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: FoodFlatNode | null = null;

  /** The new item's name */
  newItemName = "";

  treeControl: FlatTreeControl<FoodFlatNode>;

  treeFlattener: MatTreeFlattener<FoodNode, FoodFlatNode>;

  dataSource: MatTreeFlatDataSource<FoodNode, FoodFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<FoodFlatNode>(true /* multiple */);

  /// Filtering
  myControl = new FormControl();
  options: string[] = ["One", "Two", "Three"];
  filteredOptions: any;

  constructor(private datepipe:DatePipe,public common:CommonService,private _database: ChecklistDatabase,private utils:Utils,private requestapi:RequestApiService){
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<FoodFlatNode>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    _database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
}
loginEmployeeId:any;
@Input() dataDropDown:any;
ngOnInit():void{
 
this.loginEmployeeId = localStorage.getItem('username');

if(this.dataDropDown){

  if(this.dataDropDown.showData.incidentCodesInfo!='' && this.dataDropDown.showData.incidentCodesInfo!=null){
this.selectedValue=(this.dataDropDown.showData.incidentCodesInfo.secondaryCodes!=null && this.dataDropDown.showData.incidentCodesInfo.secondaryCodes.length>0)?this.dataDropDown.showData.incidentCodesInfo.secondaryCodes[0].secondaryCodeDescription:this.dataDropDown.showData.incidentCodesInfo.primaryCode;
   
  }else if(this.dataDropDown.showData.incidentPrimaryCode!='' && this.dataDropDown.showData.incidentPrimaryCode!=null){
     this.selectedValue=(this.dataDropDown.showData.incidentCodesInfo!=null)?this.dataDropDown.showData.incidentCodesInfo.primaryCode:'';
 
  }
 
}
}
getLevel = (node: FoodFlatNode) => node.level;

  isExpandable = (node: FoodFlatNode) => node.expandable;

  getChildren = (node: FoodNode): any => node.children;

  hasChild = (_: number, _nodeData: FoodFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: FoodFlatNode) => _nodeData.item === "";

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: FoodNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.item === node.item
        ? existingNode
        : new FoodFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.id = node.id;
    flatNode.name = node.name;
     flatNode.countryId = node.countryId;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: FoodFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: FoodFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: FoodFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);

  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: FoodFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: FoodFlatNode): void {
    let parent: FoodFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: FoodFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
    //this.isAllSelected = (this.checklistSelection.selected.length<this.incidentCodeData.length)?false:this.isAllSelected;
  }

  /* Get the parent node of a node */
  getParentNode(node: FoodFlatNode): FoodFlatNode | null {
    const currentLevel = this.getLevel(node);
//this.getFilterData();
this.incidentCodeSelectEvent.emit(this.checklistSelection.selected);
    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }

    return null;
  }

  getSelectedItems(): string {
    if (!this.checklistSelection.selected.length) return '';
    return this.checklistSelection.selected.map(s => s.item).join(",");
  }

  filterChanged(e: any) {
   let filterText= e.target.value
    // ChecklistDatabase.filter method which actually filters the tree and gives back a tree structure
    this._database.filter(filterText);
    if (filterText) {
      this.treeControl.expandAll();
    } else {
      this.treeControl.collapseAll();
    }
  }
  isAllSelected:any = false;
allSelecteChange(e:any){
  if(e.checked){
    this.isAllSelected = true;
    for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
      if(!this.checklistSelection.isSelected(this.treeControl.dataNodes[i]))
        this.checklistSelection.toggle(this.treeControl.dataNodes[i]);
      this.treeControl.expand(this.treeControl.dataNodes[i])
    }

  }else{
     this.isAllSelected = false;
      for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
         this.checklistSelection.deselect(this.treeControl.dataNodes[i]);
         const descendants = this.treeControl.getDescendants(this.treeControl.dataNodes[i]);
this.checklistSelection.deselect(...descendants)

    }
  }

}

selectedValue='';
selectedItem(node:any){
  if(node.level==0){
    this.selectedValue = node.name;
  }else{
    this.selectedValue = node.name;
  }
   if (this.autoCompleteTrigger.panelOpen) {
      this.autoCompleteTrigger.closePanel();
    }
  this.incidentCodeSelectEvent.emit(node);
}
ngOnChanges(changes: SimpleChanges){
  this.closeAllPanels();

  }
  textClick(){
     for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
       if(this.treeControl.dataNodes[i].name!=this.selectedValue){
        // this.treeControl.expand(this.treeControl.dataNodes[i]);
        this.treeControl.collapse(this.treeControl.dataNodes[i]);
         // this.checklistSelection.toggle(this.treeControl.dataNodes[i]);
       }else{
         let parantId= this.treeControl.dataNodes[i].countryId;
         for (let k = 0; k < this.treeControl.dataNodes.length; k++) {
             if(this.treeControl.dataNodes[k].id==parantId && this.treeControl.dataNodes[k].level==0){
               this.treeControl.expand(this.treeControl.dataNodes[k]);
               break;
             }
         }
        // let parantIndex = this.treeControl.dataNodes.findIndex()
          
         //this.treeControl.collapse(this.treeControl.dataNodes[i]);
       }
       
        //
     }
    
  }

}
