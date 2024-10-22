import { GetSchemes, ClassicPreset } from "rete";
import { SvelteArea2D } from "rete-svelte-plugin";

export type AreaExtra = SvelteArea2D<Schemes>;

export class Node extends ClassicPreset.Node {
  width = 180;
  height = 120;

  constructor(name: string) {
    super(name);
  }
}

export function createNode(name: string, socket: ClassicPreset.Socket): Node {
  const node = new Node(name);
  node.addInput("port", new ClassicPreset.Input(socket));
  node.addOutput("port", new ClassicPreset.Output(socket));
  return node;
}

export class Connection<N extends Node> extends ClassicPreset.Connection<N, N> {}

export type Schemes = GetSchemes<Node, Connection<Node>>;