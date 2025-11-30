import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Home, PlusCircle, Users, Calendar, Download, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import TeamDashboard from "./team/TeamDashboard";
import NewScore from "./team/NewScore";
import TeamMembers from "./team/TeamMembers";
import MonthlyScores from "./team/MonthlyScores";
import ExportData from "./team/ExportData";

interface TeamLayoutProps {
  teamId: string;
  teamName: string;
}

const TeamLayout = ({ teamId, teamName }: TeamLayoutProps) => {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/5 border-b border-primary/10 mb-6">
        <div className="container mx-auto px-4 py-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            {teamName}
          </h1>
          <p className="text-muted-foreground">
            Gincana MOBI - Mocidade Batista Independente de Jaraguá
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6 md:mb-8 bg-muted/50 p-1">
            <TabsTrigger 
              value="home" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <Home className="h-4 w-4" />
              <span className="hidden md:inline">Home</span>
            </TabsTrigger>
            <TabsTrigger 
              value="new-score" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden md:inline">Nova</span>
            </TabsTrigger>
            <TabsTrigger 
              value="team" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">Equipe</span>
            </TabsTrigger>
            <TabsTrigger 
              value="monthly" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden md:inline">Mensal</span>
            </TabsTrigger>
            <TabsTrigger 
              value="export" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <Download className="h-4 w-4" />
              <span className="hidden md:inline">Exportar</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="mt-0">
            <TeamDashboard teamId={teamId} />
          </TabsContent>

          <TabsContent value="new-score" className="mt-0">
            <NewScore teamId={teamId} />
          </TabsContent>

          <TabsContent value="team" className="mt-0">
            <TeamMembers teamId={teamId} />
          </TabsContent>

          <TabsContent value="monthly" className="mt-0">
            <MonthlyScores teamId={teamId} />
          </TabsContent>

          <TabsContent value="export" className="mt-0">
            <ExportData teamId={teamId} teamName={teamName} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeamLayout;
