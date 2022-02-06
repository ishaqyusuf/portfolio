import { reactive } from "vue";
import { ITableStructure } from "@/@types/IListInterface";
import { IApiConfig, useBaseApi } from "./use-api";
import useRouteData from "./use-route-data";
import { IStructures } from "../table/use-table-structures";
import { IFilter, useFilter } from "./use-filter";
export default function useList({
  structure = [],
  keyName = "id",
  items = [],
  transformer,
  formTransform,
  actions = {},
  baseUrl,
  beforeInit,
  afterInit,
  // options = {},
  _filter,
  disableLoader,
  formKeyName = "id",
  push = false,
  loader,
}: IListOption) {
  function transformForm(item) {
    return formTransform ? formTransform(item) : item;
  }
  const pager: IPager = {
    total: 0,
    empty: true,
    last_page: 0,
    current_page: 0,
    from: 0,
    to: 0,
    initilialize(pager) {
      Object.keys(pager).map((k) => (this[k] = pager[k]));
      this.pages =
        !this.current_page || !this.last_page
          ? []
          : [
              { ...toPg(this.current_page - 1, this), prev: true, page: null },
              ...links(this, Math.max(1, this.current_page - 1)),
              ...[
                this.last_page > 9 && "...",
                // last_page < 4 && [current_page, last_page].join("/"),
              ]
                .filter(Boolean)
                .map((t) => {
                  return {
                    page: t,
                    to: {},
                    disabled: true,
                  };
                }),
              ...(this.last_page > 9 ? links(this, this.last_page - 3) : []),
              { ...toPg(this.current_page + 1, this), next: true, page: null },
            ].filter(Boolean);
    },
  };
  const toPg = (p, data) => {
    return {
      disabled: p < 1 || p > data.last_page || p == data.current_page,
      current: data.current_page == p,
      page: p,
      to: {
        query: {
          ...useRouteData.query,
          page: p,
        },
      },
    };
  };
  const links = (data, base, count = 3): any =>
    Array(count)
      .fill({})
      .map((a, i) => {
        var pg = i + base;
        return toPg(pg, data);
      })
      .filter(Boolean);
  // const filter = useFilter(_filter ?? {},data);
  const data = reactive<IList>({
    items,
    actions,
    ids: [],
    keyName,
    formKeyName,
    push,
    filter: useFilter(_filter ?? {}, load),
    itemsById: {},
    checkedIds: [],
    load,
    loading: false,
    initialized: false,
    refresh,
    pager,
    query: {},
    // filter,
    transform(item) {
      return transformer ? transformer(item) : item;
    },
    formId(item) {
      return item[this.formKeyName];
    },
    itemId(item) {
      return item[this.keyName];
    },
    init(_items: any[], reset = false) {
      this.initialized = true;
      beforeInit && beforeInit();
      if (reset) this.reset();
      this.ids.splice(0);
      this.items = _items.map((item) => {
        const _id = this.itemId(item);
        const freezed = (this.itemsById[_id] = this.transform(
          Object.freeze(item)
        ));
        this.ids.indexOf(_id) < 0 && data.ids.push(_id);
        return freezed;
      });
      afterInit && afterInit();
    },
    reset() {
      this.ids.splice(0);
      this.checkedIds.splice(0);
      this.items.splice(0);
    },
    clearChecked() {
      this.checkedIds.splice(0);
    },
    toggleCheck(id: any, isChecked) {
      //   console.log(id);
      const index = this.checkedIds.indexOf(id);
      if (isChecked && index === -1) this.checkedIds.push(id);
      else if (!isChecked && index !== 1) this.checkedIds.splice(index, 1);
    },
    isChecked(id) {
      return this.checkedIds.includes(id);
    },
    toggleAll(isChecked) {
      this.ids.map((id) => this.toggleCheck(id, isChecked));
    },

    get isEmpty() {
      return this.ids.length == 0;
    },
    deleteItem(item) {
      const index = this.ids.findIndex((id) => id == this.itemId(item));
      if (index > -1) {
        this.ids.splice(index, 1);
        delete this.itemsById[this.itemId(item)];
        this.pager.total--;
        this.pager.to--;
      }
    },
    deleteSelection() {
      this.checkedIds.map((id) => this.deleteItem({ id }));
    },
    addItem(item) {
      const id = this.itemId(item);
      const _item = this.itemsById[id];
      if (_item) {
        this.itemsById[id] = this.transform(
          Object.freeze({
            // ..._item,
            ...item,
          })
        );
      } else {
        this.itemsById[id] = this.transform(
          Object.freeze({
            ...item,
          })
        );
        if (this.push) this.ids.push(id);
        else data.ids.unshift(id);
      }
    },
    apiSave(item) {
      const id = this.formId(item);
      useBaseApi(baseUrl)
        .save(id, transformForm(item), {})
        .then((data) => {
          this.addItem(data);
        });
    },
    apiDelete(item) {
      useBaseApi(baseUrl)
        .delete(this.formId(item), {})
        .then((data) => {
          this.deleteItem(item);
        });
    },
    allChecked() {
      return this.ids.every((id) => this.checkedIds.includes(id));
    },
    structure,
    allItems() {
      return Object.values(this.itemsById);
    },
  });

  function load(q = {}, reset = true) {
    if (data.ids.length == 0) data.loading = true;
    const _options: IApiConfig = {
      onSuccess: (_data) => {
        if (typeof _data === "object") {
          const { pager: _pager, items: _items } = _data;
          if (_pager) data.pager.initilialize(_pager);
          data.init(_items, reset);
        }

        data.loading = false;
      },
      onError(error) {
        // console.log(error);
      },
    };
    const _query = { ...q, ...data.query };
    let req = loader
      ? loader(_query, _options)
      : baseUrl && !disableLoader
      ? useBaseApi(baseUrl, _query, _options).index()
      : null;
  }
  function refresh() {
    load({}, false);
  }
  // if (filterData && filterData != {})
  //   watch(
  //     () => filter.data(),
  //     (data) => {
  //       const _data = composeFilterQuery(data);
  //       load({ ..._data }, true);
  //       router.push({
  //         query: {
  //           ..._data,
  //         },
  //       });
  //     }
  //   );
  if (items) data.init(items, true);

  return data;
}
export interface IPager {
  total: number;
  empty: boolean;
  current_page: number;
  from: number;
  to: number;
  last_page: number;
  per_page?: number;
  prev_page_url?: string;
  next_page_url?: string;
  initilialize(pager);
  pages?: IPage[];
}
export interface IPage {
  disabled?: boolean;
  current?: boolean;
  page?: string;
  to?: Object;
  next?: boolean;
  prev?: boolean;
}
export interface IList {
  addItem(item);
  query;
  initialized?: boolean;
  filter?: any;
  allItems();
  pager: IPager;
  refresh();
  load(q?);
  push: boolean;
  deleteSelection();
  deleteItem(item);
  items: any[];
  allChecked();
  actions: any;
  loading: Boolean;
  structure: ITableStructure[];
  ids: any[];
  transform(item);
  isChecked(item);
  apiSave(item);
  apiDelete(item);
  formId(item);
  itemId(item);
  toggleCheck(id, checked);
  toggleAll(state: Boolean);
  init(items: any[], reset: boolean);
  reset();
  clearChecked();
  //   checkAll();
  itemsById: { [id in any]: any };
  checkedIds: any[];
  //   actions: {
  //     [id in string]: {
  //       action?: any;
  //       async?: boolean;
  //     };
  //   };
  keyName: string;
  formKeyName: string;
  isEmpty: Boolean;
}
interface IListOption {
  items?: any[];
  keyName?: string;
  baseUrl?: string;
  formKeyName?: string;
  disableLoader?: boolean;
  structure?: ITableStructure[];
  options?: IApiConfig;
  actions?;
  beforeInit?();
  afterInit?();
  _filter?: IFilter;
  refreshable?();
  loader?(q, options: IApiConfig);
  itemRefresh?: Function;
  transformer?(item);
  push?: boolean;
  crud?({}: ICruds);
  formTransform?(item);
}
interface ICruds {
  create?(item);
  update?(item);
  save?(item);
  delete?(item);
  checked?(item);
}
export interface IAdvancedListOptions {
  baseUrl?: string;
  formKeyName?: string;
  shipment?: boolean;
  name: IStructures;
  routeName?: string;
  hideChecks?: boolean;
  deletable?: boolean;
  moreAction?: boolean;
  dense?: boolean;
  checkableSm?: boolean;
  action?: boolean;
  actions?: any;
  props?: any;
  query?: any;
  pager?: boolean;
  topPager?: boolean;
  bottomPager?: boolean;
  title?: string;
  container?: boolean;
}
