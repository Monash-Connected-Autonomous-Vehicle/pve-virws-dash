import cors from "cors";
import express from "express";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import { auth } from "./auth";
import { config } from "dotenv";
config(); // loads .env variables into process.env
import { proxmoxApi, Proxmox } from "proxmox-api";

const app = express();
const port = 3000;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

if (
  process.env.PVE_API_HOST == undefined ||
  process.env.PVE_API_TOKEN_SECRET == undefined ||
  process.env.PVE_API_TOKEN_ID == undefined
) {
  throw "Missing/incomplete api connection information";
}
const proxmox = proxmoxApi({
  host: process.env.PVE_API_HOST,
  tokenSecret: process.env.PVE_API_TOKEN_SECRET,
  tokenID: process.env.PVE_API_TOKEN_ID,
});

app.use(
  cors({
    origin: process.env.frontend_url ?? "http://localhost:5173",
    credentials: true,
  }),
);

interface VirWS extends Proxmox.nodesQemuVm {
  node: string;
}

app.all("/api/auth/{*any}", toNodeHandler(auth));
// app.all("/api/auth/*splat", tonodehandler(auth)); for expressjs v5

// mount express json middleware after better auth handler
// or only apply it to routes that don't interact with better auth
app.use(express.json());

app.get("/api/workstations", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  let workstations: VirWS[] = [];

  // list nodes
  const nodes = await proxmox.nodes.$get();
  // iterate cluster nodes
  for (const node of nodes) {
    const theNode = proxmox.nodes.$(node.node);
    // list Qemu VMS
    const vms: Proxmox.nodesQemuVm[] = await theNode.qemu.$get({ full: true });
    workstations = workstations.concat(
      vms
        .map((vm) => {
          return { ...vm, node: node.node };
        })
        .filter((vm) => {
          return (
            vm.tags != undefined &&
            vm.tags.split(" ").includes("virws") &&
            vm.name != undefined &&
            session?.user.email != undefined &&
            vm.name.startsWith(session.user.email.split("@")[0])
          );
        }),
    );
  }
  return res.json(workstations);
});

app.post("/api/workstations/start", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  const { vmid, host_node } = req.body;
  // Make sure we have the rights to start/stop it
  const vm = (await proxmox.nodes.$(host_node).qemu.$get({ full: false })).find(
    (vm) => {
      return vm.vmid == vmid;
    },
  );
  if (
    vm != undefined &&
    vm.tags != undefined &&
    vm.tags.split(" ").includes("virws") &&
    vm.name != undefined &&
    session?.user.email != undefined &&
    vm.name.startsWith(session.user.email.split("@")[0])
  ) {
    return res.json(
      await proxmox.nodes.$(host_node).qemu.$(vmid).status.start.$post(),
    );
  }
});

app.post("/api/workstations/shutdown", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  const { vmid, host_node } = req.body;
  // Make sure we have the rights to start/stop it
  const vm = (await proxmox.nodes.$(host_node).qemu.$get({ full: false })).find(
    (vm) => {
      return vm.vmid == vmid;
    },
  );
  if (
    vm != undefined &&
    vm.tags != undefined &&
    vm.tags.split(" ").includes("virws") &&
    vm.name != undefined &&
    session?.user.email != undefined &&
    vm.name.startsWith(session.user.email.split("@")[0])
  ) {
    return res.json(
      await proxmox.nodes.$(host_node).qemu.$(vmid).status.shutdown.$post(),
    );
  }
});

app.post("/api/workstations/reboot", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  const { vmid, host_node } = req.body;
  // Make sure we have the rights to start/stop it
  const vm = (await proxmox.nodes.$(host_node).qemu.$get({ full: false })).find(
    (vm) => {
      return vm.vmid == vmid;
    },
  );
  if (
    vm != undefined &&
    vm.tags != undefined &&
    vm.tags.split(" ").includes("virws") &&
    vm.name != undefined &&
    session?.user.email != undefined &&
    vm.name.startsWith(session.user.email.split("@")[0])
  ) {
    return res.json(
      await proxmox.nodes.$(host_node).qemu.$(vmid).status.reboot.$post(),
    );
  }
});


app.post("/api/workstations/delete", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  const { vmid, host_node } = req.body;
  // Make sure we have the rights to start/stop it
  const vm = (await proxmox.nodes.$(host_node).qemu.$get({ full: false })).find(
    (vm) => {
      return vm.vmid == vmid;
    },
  );
  if (
    vm != undefined &&
    vm.tags != undefined &&
    vm.tags.split(" ").includes("virws") &&
    vm.name != undefined &&
    session?.user.email != undefined &&
    vm.name.startsWith(session.user.email.split("@")[0])
  ) {
    return res.json(
      await proxmox.nodes.$(host_node).qemu.$(vmid).$delete({ purge: true })
    );
  }
});


app.listen(port, () => {
  console.log(`example app listening on port ${port}`);
});
