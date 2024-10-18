import { GetSchemes, ClassicPreset } from "rete";
import { SvelteArea2D } from "rete-svelte-plugin";

export type Schemes = GetSchemes<
  ClassicPreset.Node,
  ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>
>;

export type AreaExtra = SvelteArea2D<Schemes>;