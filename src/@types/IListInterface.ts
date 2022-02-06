import { Ref } from "@vue/reactivity";
export interface IList<T> {
  _structure?: ITableStructure[];
  items?: T[];
  _transformer?: any;
  _actions?: any;
  _keyName?: string;
  _push?: Boolean;
  _refresh?: any;
}
export interface IListData {
  items: any[]; //T[];
  ids: number[];
  itemsById: { [id in number]: any };
  checkedIds: number[];
}
export interface ITableStructure {
  name: string;
  title?: string;
  fontMedium?: boolean;
  btnProps?: any;
  btnLink?: boolean;
  td?: string;
  th?: string;
  textCenter?: boolean;
  colStyle?: string;
  hover?: boolean;
  styles?: {
    tbody?: string;
    tr?: string;
    th?: string;
  };
  first?: boolean;
  last?: boolean;
  export?: boolean;
  import?: boolean;
  isVisible?: boolean;
  hidden?: boolean;
  colTitle?: string;
  textRight?: boolean;
  textLeft?: boolean;
  computed?: any;
}

export interface IUseList {
  toggleAll?;
  checkAll?;
  extendedItems?;
  updateItem?;
  setCheckedItemsById?;
  unshift?;
  push?;
  initialize?;
  refresh?;
  data?;
  ids?: Ref<number[]>;
  items?: Ref<any[]>;
  itemsById?: Ref<{ [id in number]: any }>;
  checkedIds?: Ref<number[]>;
  reset?;
  clearChecks?;
  structure: Ref<ITableStructure[]>;
  deleteItem?;
  deleteMany?;
  loading?: Ref<boolean>;
  deleteSelection?;
}
