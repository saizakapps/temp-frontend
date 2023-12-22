import { VideoPlayerComponent } from './video-player/video-player.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layouts/layout/layout.component';
import { AuthGuard } from './shared/auth-guard/auth-guard';
import { CanComponentDeactivate } from './shared/auth-guard/deactive-guard';
import { IncidentHistoryViewComponent } from './incident/incident-history-view/incident-history-view.component';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./authentication/login/login.module').then(m => m.LoginModule),
    data: {
      title: 'Login'
    }
  },
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'view',
        pathMatch: 'full',
      },
      {
        path: 'view',
        loadChildren: () => import('./application/application-view/application-view.module').then(m => m.ApplicationViewModule),
        canActivate: [AuthGuard],
        data: {
          title: 'View',
          key: 'view'
        }
      }
    ]
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'courses',
        canActivate: [AuthGuard],
        data: {
          title: 'Listing',
          key: 'courses'
        },
        loadChildren: () => import('./courses/courses.module').then(m => m.CoursesModule)
      },
      {
        path: 'create-course',
        canActivate: [AuthGuard],
        data: {
          title: 'Course',
          key: 'courses'
        },
        canDeactivate: [CanComponentDeactivate],
        loadChildren: () => import('./create-course/create-course.module').then(m => m.CreateCourseModule)
      },
      {
        path: 'employees',
        canActivate: [AuthGuard],
        data: {
          title: 'Employee',
          key: 'employees'
        },
        loadChildren: () => import('./employee-management/employee-management.module').then(m => m.EmployeeManagementModule)
      },
      {
        path: 'reports',
        canActivate: [AuthGuard],
        data: {
          title: 'Reports',
          key: 'reports'
        },
        loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule)
      },
      {
        path: 'f2f-reports',
        canActivate: [AuthGuard],
        data: {
          title: 'F2F-Reports',
          key: 'f2freports'
        },
        loadChildren: () => import('./f2f-reports/f2f-reports.module').then(m => m.F2fReportsModule)
      },
      {
        path: 'userAccess',
        canActivate: [AuthGuard],
        data: {
          title: 'Users',
          key: 'userAccess'
        },
        loadChildren: () => import('./user-management/user-management.module').then(m => m.UserManagementModule)
      },
      {
        path: 'message',
        canActivate: [AuthGuard],
        data: {
          title: 'Message',
          key: 'message'
        },
        loadChildren: () => import('./message/message.module').then(m => m.MessageModule)
      },
      {
        path: 'incident/mobile/list',
        loadChildren: () => import('./incident/mobile/incident-mobile-home/incident-mobile-home.module').then(m => m.IncidentMobileHomeModule),
        data: {
          title: 'Incident-Mobile',
          key: 'IncidentMobile'
        }
      },
      {
        path: 'incident/mobile/create',
        loadChildren: () => import('./incident/mobile/incident-mobile-create/incident-mobile-create.module').then(m => m.IncidentMobileCreateModule),
        data: {
          title: 'Incident-Create',
          key: 'IncidentMobileCreate'
        }
      },
      {
        path: 'incident-list',
        canActivate: [AuthGuard],
        loadChildren: () => import('./incident/incident-list/incident-list.module').then(m => m.IncidentListModule),
        data: {
          title: 'Incident',
          key: 'incidentList'
        }
      },
      {
        path: 'incident-create',
        canActivate: [AuthGuard],
        loadChildren: () => import('./incident/incident-create/incident-create.module').then(m => m.IncidentCreateModule),
        data: {
          title: 'Incident-Create',
          key: 'incidentCreate'
        }
      },
      {
        path: 'incident-history',
        canActivate: [AuthGuard],
        component: IncidentHistoryViewComponent,
        data: {
          title: 'Incident-History',
          key: 'incidentHistory'
        }
      },
      {
        path: 'audit-list',
        canActivate: [AuthGuard],
        loadChildren: () => import('./auditcomponents/audit-list/audit-list.module').then(m => m.AuditListModule),
        data: {
          title: 'Audit-List',
          key: 'auditList'
        }
      },
      {
        path: 'application-access',
        canActivate: [AuthGuard],
        data: {
          title: 'Application Access',
          key: 'applicationAccess'
        },
        loadChildren: () => import('./app-auth/application-access/application-access.module').then(m => m.ApplicationAccessModule)
      },
      {
        path: 'user-roles',
        canActivate: [AuthGuard],
        data: {
          title: 'User Roles',
          key: 'userRoles'
        },
        loadChildren: () => import('./employee-management/employee-management.module').then(m => m.EmployeeManagementModule)
      },
    ]
  },
  {
    path: 'video',
    component: VideoPlayerComponent,
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [CanComponentDeactivate]
})
export class AppRoutingModule { }
