import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Server, Database, Globe, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  cpu: string;
  memory: string;
  storage: string;
  os: string;
}

const templates: Template[] = [
  {
    id: "ubuntu-server",
    name: "Ubuntu Server 22.04",
    description: "Latest Ubuntu LTS with essential server packages",
    icon: Server,
    cpu: "2 vCPU",
    memory: "4 GB",
    storage: "40 GB SSD",
    os: "Ubuntu 22.04 LTS"
  },
  {
    id: "windows-server",
    name: "Windows Server 2022",
    description: "Windows Server with Remote Desktop enabled",
    icon: Globe,
    cpu: "4 vCPU", 
    memory: "8 GB",
    storage: "80 GB SSD",
    os: "Windows Server 2022"
  },
  {
    id: "mysql-db",
    name: "MySQL Database",
    description: "Pre-configured MySQL 8.0 database server",
    icon: Database,
    cpu: "2 vCPU",
    memory: "8 GB", 
    storage: "100 GB SSD",
    os: "Ubuntu 22.04 LTS"
  },
  {
    id: "security-hardened",
    name: "Security Hardened Linux",
    description: "CIS benchmarked Ubuntu with security tools",
    icon: Shield,
    cpu: "2 vCPU",
    memory: "4 GB",
    storage: "40 GB SSD", 
    os: "Ubuntu 22.04 LTS"
  }
];

export const CreateVMDialog = () => {
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [vmName, setVmName] = useState("");
  const { toast } = useToast();

  const handleCreate = () => {
    if (!vmName || !selectedTemplate) {
      toast({
        title: "Missing information",
        description: "Please provide a VM name and select a template.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "VM Creation Started",
      description: `Creating "${vmName}" from ${templates.find(t => t.id === selectedTemplate)?.name}`,
    });
    
    setOpen(false);
    setVmName("");
    setSelectedTemplate("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Create VM
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Virtual Machine</DialogTitle>
          <DialogDescription>
            Choose a template and configure your new virtual machine.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="vm-name">Virtual Machine Name</Label>
            <Input
              id="vm-name"
              placeholder="Enter VM name..."
              value={vmName}
              onChange={(e) => setVmName(e.target.value)}
            />
          </div>
          
          <div className="space-y-4">
            <Label>Select Template</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => {
                const IconComponent = template.icon;
                return (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedTemplate === template.id
                        ? "ring-2 ring-primary bg-primary/5"
                        : "hover:bg-accent/50"
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{template.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {template.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div>CPU: {template.cpu}</div>
                        <div>Memory: {template.memory}</div>
                        <div>Storage: {template.storage}</div>
                        <div>OS: {template.os}</div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>
            Create Virtual Machine
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
