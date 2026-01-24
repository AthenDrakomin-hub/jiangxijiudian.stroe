declare module '*.tsx' {
  import { ComponentType } from 'react';
  const component: ComponentType;
  export default component;
}

// 特定模块声明
declare module './components/GuestOrderPage' {
  import { ComponentType } from 'react';
  const component: ComponentType;
  export default component;
}

declare module './components/AdminOrdersPage' {
  import { ComponentType } from 'react';
  const component: ComponentType;
  export default component;
}

declare module './components/WelcomePage' {
  import { ComponentType } from 'react';
  const component: ComponentType;
  export default component;
}
