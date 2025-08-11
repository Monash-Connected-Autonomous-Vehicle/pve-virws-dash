import { useState } from "react";
import { VMCard, VirWS } from "./VMCard";
import { CreateVMDialog } from "./CreateVMDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Server, 
  Play, 
  Square, 
  RotateCcw,
  Activity,
  HardDrive,
  DollarSign
} from "lucide-react";
import axios from "axios";

// Sample data
// const virtualMachines = [
//   {
//     id: "vm-001",
//     name: "production-web-01",
//     status: "running" as const,
//     template: "Ubuntu Server 22.04",
//     cpu: "4 vCPU",
//     memory: "8 GB",
//     storage: "100 GB",
//     ipAddress: "192.168.1.10",
//     createdAt: "2024-01-15"
//   },
//   {
//     id: "vm-002", 
//     name: "database-primary",
//     status: "running" as const,
//     template: "MySQL Database",
//     cpu: "8 vCPU",
//     memory: "16 GB", 
//     storage: "500 GB",
//     ipAddress: "192.168.1.20",
//     createdAt: "2024-01-10"
//   },
//   {
//     id: "vm-003",
//     name: "dev-environment",
//     status: "stopped" as const,
//     template: "Ubuntu Server 22.04",
//     cpu: "2 vCPU",
//     memory: "4 GB",
//     storage: "50 GB", 
//     ipAddress: "192.168.1.30",
//     createdAt: "2024-01-20"
//   },
//   {
//     id: "vm-004",
//     name: "backup-server",
//     status: "pending" as const,
//     template: "Security Hardened Linux",
//     cpu: "2 vCPU",
//     memory: "4 GB",
//     storage: "200 GB",
//     ipAddress: "192.168.1.40", 
//     createdAt: "2024-01-25"
//   }
// ];

async function fetchWorkstations(): Promise<VirWS[]> {
  try {
    console.log("Getting virtual workstations!")
    const response = await axios.get("http://localhost:5173/api/workstations");
    return response.data;
  } catch (error) {
    console.error("Error fetching virtual workstations: ", error)
    return []
  }
}

const virtualMachines = await fetchWorkstations();
console.log("type of virtual machines: ", virtualMachines)

export const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredVMs = virtualMachines.filter(vm =>
    vm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vm.template.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const runningCount = virtualMachines.filter(vm => vm.status === "running").length;
  const stoppedCount = virtualMachines.filter(vm => vm.status === "stopped").length;
  const pendingCount = virtualMachines.filter(vm => vm.status === "pending").length;

  return (
    <div className="p-6 space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total VMs</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{virtualMachines.length}</div>
            <p className="text-xs text-muted-foreground">
              Virtual machines deployed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running</CardTitle>
            <Play className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{runningCount}</div>
            <p className="text-xs text-muted-foreground">
              Active instances
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">
              Average across all VMs
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$284</div>
            <p className="text-xs text-muted-foreground">
              Estimated this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* VM Management */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Virtual Machines</h2>
            <p className="text-muted-foreground">
              Manage your cloud infrastructure
            </p>
          </div>
          <CreateVMDialog />
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search virtual machines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <div className="flex gap-1">
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                <Play className="mr-1 h-3 w-3" />
                {runningCount} Running
              </Badge>
              <Badge variant="outline" className="bg-muted/50">
                <Square className="mr-1 h-3 w-3" />
                {stoppedCount} Stopped
              </Badge>
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                <RotateCcw className="mr-1 h-3 w-3" />
                {pendingCount} Pending
              </Badge>
            </div>
          </div>
        </div>

        {/* VM Grid */}
        {filteredVMs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVMs.map((vm) => (
              <VMCard key={vm.id} vm={vm} />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <Server className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No virtual machines found</h3>
            <p className="text-muted-foreground mt-2">
              {searchTerm ? "Try adjusting your search terms." : "Get started by creating your first VM."}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
