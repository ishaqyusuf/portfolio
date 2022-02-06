import { PropType } from "vue";
import { IList } from "./use-list";

export default {
  props: {
    fixed: Boolean,
    sticky: Boolean,
    bordered: Boolean,
    editable: Boolean,
    selector: Boolean,
    uppercase: Boolean,
    mediumHeader: Boolean,
    vintage: Boolean,
    tile: Boolean,
    dark: Boolean,
    deletable: Boolean,
    hideActions: Boolean,
    hideChecks: Boolean,
    divide: Boolean,
    separate: Boolean,
    textAction: Boolean,
    action: Boolean,
    floatingAction: Boolean,
    dense: Boolean,
    noDivide: Boolean,
    moreAction: Boolean,
    noHead: Boolean,
    checkable: Boolean,
    checkableSm: Boolean,
    stickyAction: Boolean,
    trClass: String,
    tdClass: String,
    thClass: String,
    tableClass: String,
    tbodyClass: String,
    theadClass: String,
    pager: Array,
    onDelete: Object,
    list: useListPropType(),
  },
  //   refreshable,
};
export function useListPropType() {
  return {
    type: Object as PropType<IList>,
    default: () => {
      return {};
    },
  };
}
