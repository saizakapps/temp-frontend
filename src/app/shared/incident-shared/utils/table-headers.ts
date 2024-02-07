export class TableHeaders {
  public TABLE_HEADERS = {
    INCIDENT_LIST_TABLE: [
      {
        showName: 'ID',
        indexName: 'incidentId',
        isFilter: false,
        isSort: false
      },
      {
        showName: 'Date',
        indexName: 'convertedCreatedDate',
        isFilter: false,
        isSort: true
      },
      // {
      //   showName: 'Created By',
      //   indexName: 'createdBy',
      //   isFilter: true,
      //   isSort: false
      // },
      // {
      //   showName: 'Role',
      //   indexName: 'roleNameDescription',
      //   isFilter: true,
      //   isSort: false
      // },
      {
       showName: 'Type',
        indexName: 'incidentType',
        isFilter: true,
        isSort: false 
      },
      {
        showName: 'Priority',
        indexName: 'priorityCode',
        isFilter: true,
        isSort: false
      },
      {
        showName: 'Status',
        indexName: 'incidentStatus',
        isFilter: false,
        isSort: false
      },
      {
        showName: 'Initial',
        indexName: 'initials',
        isFilter: true,
        isSort: false
      },
      {
        showName: 'Key word 1',
        indexName: 'incidentCause',
        isFilter: true,
        isSort: false
      },
      {
        showName: 'Store',
        indexName: 'store',
        isFilter: true,
        isSort: false
      } ,
      {
        showName: 'Flag',
        indexName: 'flagValue',
        isFilter: true,
        isSort: false
      },
      {
        showName: 'Clear',
        indexName: 'isClearincident',
        isFilter: false,
        isSort: false
      },    
    ],
    INCIDENT_HISTORY_TABLE: [
      {
        showName: 'Incident Id',
        indexName: 'incidentId'
      },
      {
        showName: 'Modified Date',
        indexName: 'convertedCreatedDate',
      },
      {
        showName: 'Modified By',
        indexName: 'modifiedBy'
      },
      {
        showName: 'Restore Version',
        indexName: 'createdById',
      }    
    ],
    PRIORITY_TABLE:[
     {
        showName: 'Code',
        indexName: 'colorCode',
      },
       {
        showName: 'Example',
        indexName: 'description',
     }
    ],

    /* Audit Table Headers */
    AUDIT_LIST_TABLE: [
      {
        showName: 'Store ID',
        indexName: 'storeCode',
        isFilter: false,
        isSort: false
      },
      {
        showName: 'Store name',
        indexName: 'storeDescription',
        isFilter: false,
        isSort: true
      },
       {
         showName: 'Upload date',
         indexName: 'updatedAt',
         isFilter: false,
         isSort: true
       },
      {
        showName: 'Regional manager',
        indexName: 'assignedManager',
        isFilter: true,
        isSort: false
      },
      {
        showName: 'Audit document',
        indexName: 'fileName',
        isFilter: false,
        isSort: false
      },
      {
        showName: 'Score Card',
        indexName: 'scoreCardFileName',
        isFilter: false,
        isSort: false
      },
      {
        showName: 'Reviewed by',
        indexName: 'reviewByName',
        isFilter: true,
        isSort: false
      },
      {
        showName: 'Review date',
        indexName: 'reviewAt',
        isFilter: false,
        isSort: true
      },
      {
        showName: ' ',
        indexName: 'isViewed',
        isFilter: false,
        isSort: false
      },
      {
        showName: 'Clear',
        indexName: 'isClear',
        isFilter: false,
        isSort: false
      }    
    ],
    AUDIT_LIST_TABLE_MANAGER: [
      {
        showName: 'Store ID',
        indexName: 'storeCode',
        isFilter: false,
        isSort: false
      },
      {
        showName: 'Store name',
        indexName: 'storeDescription',
        isFilter: false,
        isSort: true
      },
      {
        showName: 'Upload date',
        indexName: 'updatedAt',
        isFilter: false,
        isSort: true
      },
      {
        showName: 'Audit document',
        indexName: 'fileName',
        isFilter: false,
        isSort: false
      },
      {
        showName: 'Score Card',
        indexName: 'scoreCardFileName',
        isFilter: false,
        isSort: false
      },
      {
        showName: 'Reviewed by',
        indexName: 'reviewByName',
        isFilter: true,
        isSort: false
      },
      {
        showName: 'Review date',
        indexName: 'reviewAt',
        isFilter: false,
        isSort: true
      } ,
      {
        showName: ' ',
        indexName: 'isViewed',
        isFilter: false,
        isSort: false
      },   
      {
        showName: 'Clear',
        indexName: 'isClear',
        isFilter: false,
        isSort: false
      }    
    ],
    HISTORY_LIST_TABLE : [
      {
        showName: 'Upload date',
        indexName: 'updatedAt',
        historyFilter: false,
      },
      {
        showName: 'Audit document',
        indexName: 'fileName',
        historyFilter: false,
      },
      {
        showName: 'Updated by',
        indexName: 'updateByName',
        historyFilter: true,
      },
      {
        showName: 'Reviewed by',
        indexName: 'reviewByName',
        historyFilter: true,
      },
      {
        showName: '',
        indexName: 'deleteFile',
        historyFilter: true,
      },
    ],
    SCORECARD_LIST_TABLE : [
      {
        showName: 'Upload date',
        indexName: 'scoreCardUpdatedAt',
        historyFilter: false,
      },
      {
        showName: 'Scorecard document',
        indexName: 'scoreCardFileName',
        historyFilter: false,
      },
      {
        showName: 'Updated by',
        indexName: 'scoreCardUpdateByName',
        historyFilter: true,
      },
      {
        showName: '',
        indexName: 'deleteFile',
        historyFilter: true,
      },
    ]

  };

  constructor() {

  }
}
