﻿/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'Home',
    icon: 'home',
    component: './Welcome',
  },
  {
    name: 'HRIS',
    icon: 'team',
    path: '/hris',
    access: 'canHris',
    routes: [
      {
        path: '/hris',
        redirect: 'dashboard',
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        icon: 'pieChart',
        component: './Welcome',
      },
      {
        path: 'employee',
        name: 'Pegawai',
        icon: 'team',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/hris/employee',
            name: 'Pegawai',
            icon: 'pieChart',
            component: './HRIS/Employee/EmployeeList',
          },
          {
            path: '/hris/employee/:employeeId/',
            routes: [
              {
                path: '/hris/employee/:employeeId/',
                redirect: 'account',
              },
              {
                path: 'account',
                name: 'Detail Pegawai - Akun',
                component: './HRIS/Employee/EmployeeDetail/SubPages/Account',
                wrappers: ['./HRIS/Employee/EmployeeDetail/index'],
              },
              {
                path: 'employee-data',
                name: 'Detail Pegawai - Kepegawaian',
                component: './HRIS/Employee/EmployeeDetail/SubPages/EmployeeData',
                wrappers: ['./HRIS/Employee/EmployeeDetail/index'],
              },
              {
                path: 'personal-data',
                name: 'Detail Pegawai - Data Personal',
                component: './HRIS/Employee/EmployeeDetail/SubPages/PersonalData',
                wrappers: ['./HRIS/Employee/EmployeeDetail/index'],
              },
              {
                path: 'bank-account',
                name: 'Detail Pegawai - Akun Bank',
                component: './HRIS/Employee/EmployeeDetail/SubPages/BankAccount',
                wrappers: ['./HRIS/Employee/EmployeeDetail/index'],
              },
            ],
          },
        ],
      },
      {
        path: 'attendance',
        name: 'Kehadiran',
        icon: 'login',
        routes: [
          {
            name: 'Rekap Kehadiran',
            icon: 'sound',
            path: 'report',
            component: './HRIS/Attendance/Report',
          },
          {
            name: 'Laporan Bulanan Karyawan',
            icon: 'sound',
            path: 'monthly-report',
            component: './HRIS/Attendance/MonthlyReport',
          },
        ],
      },
      {
        path: 'leave',
        name: 'Cuti',
        icon: 'logout',
        routes: [
          {
            name: 'Kuota Cuti',
            icon: 'sound',
            path: 'quota',
            component: './HRIS/Leave/LeaveQuota',
          },
          {
            name: 'Pengajuan Cuti',
            icon: 'sound',
            path: 'submission',
            component: './HRIS/Leave/LeaveSubmission',
          },
        ],
      },
      {
        path: 'payroll',
        name: 'Payroll',
        icon: 'container',
        routes: [
          {
            name: 'Payroll Component',
            icon: 'sound',
            path: 'payroll-component',
            component: './HRIS/Payroll/Settings/PayrollComponent',
          },
          {
            name: 'Payroll Component Detail',
            icon: 'sound',
            path: 'payroll-component/:adjustmentId',
            component: './HRIS/Payroll/Settings/Adjustment',
            hideInMenu: true,
          },
          {
            name: 'Payroll Component Detail',
            icon: 'sound',
            path: 'adjustment/:adjustmentId',
            component: './HRIS/Payroll/Settings/AdjustmentForm/detail',
            hideInMenu: true,
          },
          {
            name: 'CreateBasicSalary',
            icon: 'sound',
            path: 'adjustment/create/basic-salary',
            component: './HRIS/Payroll/Settings/AdjustmentForm/BasicSalaryTable',
            hideInMenu: true,
          },
          {
            name: 'Create Allowance',
            icon: 'sound',
            path: 'adjustment/create/allowance',
            component: './HRIS/Payroll/Settings/AdjustmentForm/AllowanceTable',
            hideInMenu: true,
          },

          {
            name: 'Payroll Template',
            icon: 'sound',
            path: 'payroll-template',
            component: './HRIS/Payroll/Settings/Template',
          },

          {
            name: 'Komponen Gaji Pegawai',
            icon: 'sound',
            path: 'employee-payroll-component',
            component: './HRIS/Payroll/EmployeeComponent',
          },
        ],
      },
      {
        path: 'company-engagement',
        name: 'Company Engagement',
        icon: 'sound',
        routes: [
          {
            name: 'Pengumuman',
            icon: 'sound',
            path: 'announcement',
            component: './HRIS/CompanyEngagement/Announcement',
          },
        ],
      },
      {
        path: 'master-data',
        name: 'Master Data',
        icon: 'database',
        routes: [
          {
            name: 'Jenis Pegawai',
            icon: 'table',
            path: 'employee-type',
            component: './HRIS/MasterData/EmployeeType',
          },

          {
            name: 'Instansi',
            icon: 'table',
            path: 'company',
            component: './HRIS/MasterData/Company',
          },

          {
            name: 'Level Posisi',
            icon: 'table',
            path: 'position-level',
            component: './HRIS/MasterData/PositionLevel',
          },

          {
            name: 'Posisi',
            icon: 'table',
            path: 'position',
            component: './HRIS/MasterData/Position',
          },

          {
            name: 'Tingkat Pendidikan',
            icon: 'table',
            path: 'education-level',
            component: './HRIS/MasterData/EducationLevel',
          },

          {
            name: 'Lokasi Kantor',
            icon: 'table',
            path: 'office',
            component: './HRIS/MasterData/Office',
          },
          {
            name: 'Shift',
            icon: 'table',
            path: 'shift',
            component: './HRIS/MasterData/Shift',
          },
        ],
      },
    ],
  },

  {
    name: 'Admin',
    icon: 'tool',
    path: '/admin',
    access: 'canAdmin',
    routes: [
      {
        path: '/admin',
        redirect: 'dashboard',
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        icon: 'pieChart',
        component: './Welcome',
      },
      {
        path: 'user',
        name: 'User',
        icon: 'team',
        component: './Admin/User',
      },
    ],
  },

  {
    name: 'Anggota & Sim-Pin',
    icon: 'apartment',
    path: '/coop',
    access: 'canCoop',
    routes: [
      {
        path: '/coop',
        redirect: 'dashboard',
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        icon: 'pieChart',
        component: './Welcome',
      },
      {
        path: 'member',
        name: 'Anggota',
        icon: 'team',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/coop/member',
            name: 'Anggota',
            icon: 'pieChart',
            component: './Coop/Member/MemberList',
          },
          {
            path: '/coop/member/:memberId/',
            routes: [
              {
                path: '/coop/member/:memberId/',
                redirect: 'account',
              },
              {
                path: 'account',
                name: 'Detail Anggota - Akun',
                component: './Coop/Member/MemberDetail/SubPages/Account',
                wrappers: ['./Coop/Member/MemberDetail/index'],
              },
              {
                path: 'member-data',
                name: 'Detail Pegawai - Kepegawaian',
                component: './Coop/Member/MemberDetail/SubPages/MemberData',
                wrappers: ['./Coop/Member/MemberDetail/index'],
              },
              {
                path: 'personal-data',
                name: 'Detail Anggota - Data Personal',
                component: './Coop/Member/MemberDetail/SubPages/PersonalData',
                wrappers: ['./Coop/Member/MemberDetail/index'],
              },
              {
                path: 'bank-account',
                name: 'Detail Anggota - Akun Bank',
                component: './Coop/Member/MemberDetail/SubPages/BankAccount',
                wrappers: ['./Coop/Member/MemberDetail/index'],
              },
            ],
          },
        ],
      },
      {
        path: 'saving',
        name: 'Simpanan',
        icon: 'dollar',
        routes: [
          {
            name: 'Rekap Simpanan',
            icon: 'dollar',
            path: 'summary',
            component: './Coop/Saving/SavingSummary',
          },
          {
            name: 'Transaksi Simpanan',
            icon: 'dollar',
            path: 'transaction',
            component: './Coop/Saving/SavingTransaction',
          },
        ],
      },
    ],
  },

  {
    path: '/',
    redirect: '/welcome',
  },
  {
    path: '*',
    layout: false,
    component: '404',
  },
];
