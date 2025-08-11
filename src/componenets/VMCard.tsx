import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Server, 
  MoreVertical, 
  Play, 
  Square, 
  RotateCcw, 
  Trash2,
  Monitor,
  HardDrive,
  Cpu
} from "lucide-react";
import type { Proxmox } from "proxmox-api";
import axios from "axios";

// interface VirtualMachine {
//   id: string;
//   name: string;
//   status: "running" | "stopped" | "pending";
//   template: string;
//   cpu: string;
//   memory: string;
//   storage: string;
//   ipAddress: string;
//   createdAt: string;
// }

interface VirWS extends Proxmox.nodesQemuVm {
  status: "running" | "stopped" | "pending"
  node: string
}

interface VMCardProps {
  vm: VirWS;
}

const statusColors = {
  running: "bg-success text-primary-foreground",
  stopped: "bg-muted text-muted-foreground",
  pending: "bg-warning text-primary-foreground",
};

const statusIcons = {
  running: Play,
  stopped: Square,
  pending: RotateCcw,
};

function formatBytes(a,b=2){if(!+a)return"0 Bytes";const c=0>b?0:b,d=Math.floor(Math.log(a)/Math.log(1024));return`${parseFloat((a/Math.pow(1024,d)).toFixed(c))} ${["Bytes","KiB","MiB","GiB","TiB","PiB","EiB","ZiB","YiB"][d]}`}

export const VMCard = ({ vm }: VMCardProps) => {
  const StatusIcon = statusIcons[vm.status];
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Server className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">{vm.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{vm.template}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge className={statusColors[vm.status]}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {vm.status}
          </Badge>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Monitor className="mr-2 h-4 w-4" />
                Connect
              </DropdownMenuItem>
              <DropdownMenuItem onClick={async () => {
                  try {
                    const response = await axios.post("http://localhost:5173/api/workstations/start", { vmid: vm.vmid, host_node: vm.node });
                    vm.status = "pending";
                    return response.data;
                  } catch (error) {
                    console.error("Error fetching virtual workstations: ", error)
                    return []
                  }
              }}>
                <Play className="mr-2 h-4 w-4" />
                Start
              </DropdownMenuItem>
              <DropdownMenuItem onClick={async () => {
                  try {
                    const response = await axios.post("http://localhost:5173/api/workstations/shutdown", { vmid: vm.vmid, host_node: vm.node });
                    vm.status = "pending";
                    return response.data;
                  } catch (error) {
                    console.error("Error fetching virtual workstations: ", error)
                    return []
                  }
              }}>
                <Square className="mr-2 h-4 w-4" />
                Stop
              </DropdownMenuItem>
              <DropdownMenuItem onClick={async () => {
                  try {
                    const response = await axios.post("http://localhost:5173/api/workstations/reboot", { vmid: vm.vmid, host_node: vm.node });
                    vm.status = "pending";
                    return response.data;
                  } catch (error) {
                    console.error("Error fetching virtual workstations: ", error)
                    return []
                  }
              }}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Restart
              </DropdownMenuItem>
              <DropdownMenuItem onClick={async () => {
                  try {
                    const response = await axios.post("http://localhost:5173/api/workstations/delete", { vmid: vm.vmid, host_node: vm.node });
                    vm.status = "pending";
                    return response.data;
                  } catch (error) {
                    console.error("Error fetching virtual workstations: ", error)
                    return []
                  }
              }}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Cpu className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">CPU:</span>
            <span className="font-medium">{vm.cpus}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Monitor className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">RAM:</span>
            <span className="font-medium">{formatBytes(vm.maxmem)}</span>
            {/*<span className="font-medium">{vm.maxmem}</span>*/}
          </div>
          <div className="flex items-center space-x-2">
            <HardDrive className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Storage:</span>
            <span className="font-medium">{formatBytes(vm.maxdisk)}</span>
            {/*<span className="font-medium">{vm.maxdisk}</span>*/}
          </div>
        </div>
        
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-muted-foreground">IP: </span>
            <span className="font-mono text-foreground">{vm.ipAddress}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Uptime: </span>
            <span className="text-foreground">{vm.uptime}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
