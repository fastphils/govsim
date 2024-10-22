
import { NodeEditor, ClassicPreset } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import {
  ConnectionPlugin,
  Presets as ConnectionPresets,
  ClassicFlow,
  getSourceTarget,
} from "rete-connection-plugin";
import {
  SveltePlugin,
  Presets,
  SvelteArea2D
} from "rete-svelte-plugin";
import {
  AutoArrangePlugin,
  Presets as ArrangePresets,
  ArrangeAppliers,
} from "rete-auto-arrange-plugin";

import { Schemes, AreaExtra, createNode, Connection } from "./types";

export async function createEditor(container: HTMLElement) {
  const socket = new ClassicPreset.Socket("socket");

  const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  const render = new SveltePlugin<Schemes, AreaExtra>();
  const arrange = new AutoArrangePlugin<Schemes>();

  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl()
  });

  render.addPreset(Presets.classic.setup());

  connection.addPreset(ConnectionPresets.classic.setup());

  const applier = new ArrangeAppliers.TransitionApplier<Schemes, never>({
    duration: 500,
    timingFunction: (t) => t,
    async onTick() {
      await AreaExtensions.zoomAt(area, editor.getNodes());
    },
  })

  arrange.addPreset(ArrangePresets.classic.setup());

  editor.use(area);
  area.use(connection);
  area.use(render);
  area.use(arrange);

  AreaExtensions.simpleNodesOrder(area);

  const a = createNode("A", socket);
  const b = createNode("B", socket);
  const c = createNode("C", socket);

  a.addControl("a", new ClassicPreset.InputControl("text", { initial: "a" }));
  b.addControl("b", new ClassicPreset.InputControl("text", { initial: "b" }));
  c.addControl("c", new ClassicPreset.InputControl("text", { initial: "c" }));

  await editor.addNode(a);
  await editor.addNode(b);
  await editor.addNode(c);

  await editor.addConnection(new Connection(a, "port", b, "port"));
  await editor.addConnection(new Connection(b, "port", c, "port"));

  await arrange.layout({
    applier,
  });

  setTimeout(() => {
    // wait until nodes rendered because they dont have predefined width and height
    AreaExtensions.zoomAt(area, editor.getNodes());
  }, 10);
  return {
    layout: async (animate: boolean) => {
      await arrange.layout({ applier: animate ? applier: applier });
    },
    destroy: () => area.destroy()
  };
}
