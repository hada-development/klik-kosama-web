﻿

/**
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
    name: 'Dashboard',
    icon: 'pieChart',
    component: './Welcome',
  },
  {
    name: "HRIS",
    icon: 'team',
    path: '/hris',

    routes: [
      {
        path: '/hris',
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
                name: 'Detail Pegawai',
                component: './HRIS/Employee/EmployeeDetail/SubPages/Account',
                wrappers: ['./HRIS/Employee/EmployeeDetail/index'],
              },
              {
                path: 'employee-data',
                name: 'Detail Pegawai',
                component: './HRIS/Employee/EmployeeDetail/SubPages/Account',
                wrappers: ['./HRIS/Employee/EmployeeDetail/index'],
              }
            ]
          },
        ]
      },
      {
        path: 'company-engagement',
        name: 'Company Engagement',
        icon: 'sound',
        routes: [
          {
            name: 'Pemberitahuan',
            icon: 'sound',
            path: 'announcement',
            component: './HRIS/CompanyEngagement/Announcement',
          },
        ]
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
        ]
      },

    ]
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

