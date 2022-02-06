import roleList from "@/hooks/role-list";

function permissions(role, table = false) {
  var roles = roleList.fresh();
  var _actions: any = {};
  roles.map((ro) => {
    let _action: any = {};
    ["view", "edit"].map((action, i) => {
      let a = [action, ro.action].join("");
      var id = Number(ro.id) + (i + 1) / 10;
      let _grant =
        role.admin || role?.actions?.some((a) => a == id || ro.id == a);
      _actions[a] = _action[action] = _grant; // useRoles.grant(ro, action, i, role);
    });
    ro.action = { ..._action };
    ro.all = _action.view && _action.edit;
    ro.action.all = ro.all;
    // if (table) console.log(ro);
  });
  //   console.log([role, table]);
  //   console.log(JSON.stringify(_actions));
  return table ? roles : _actions;
}
export default {
  permissions,
  roleTable(actions: any[] = []) {
    return permissions({ actions }, true);
  },

  extractActions(items: { id; title; action?; all? }[]) {
    let actions: any[] = [];
    items.map((item) => {
      //   if (item.all) actions.push(item.id);
      ["view", "edit"].map((c, i) => {
        item.action[c] && actions.push(Number(item.id) + (i + 1) / 10);
      });
      //   }
    });
    return actions;
  },
};
