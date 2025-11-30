import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Calendar } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <Trophy className="h-16 w-16 md:h-20 md:w-20 text-primary mx-auto mb-4" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
            MOBI Gincana 2024
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Sistema de Pontuação - Mocidade Batista Independente de Jaraguá
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          <Card className="border-primary/20 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl font-bold text-primary">Time A</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center gap-3 text-muted-foreground">
                <Users className="h-5 w-5" />
                <span>Acompanhe a evolução do time</span>
              </div>
              <Link to="/time-a" className="block">
                <Button className="w-full h-12 text-lg bg-primary hover:bg-primary/90">
                  Acessar Time A
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-accent/30 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl font-bold text-accent">Time B</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center gap-3 text-muted-foreground">
                <Users className="h-5 w-5" />
                <span>Acompanhe a evolução do time</span>
              </div>
              <Link to="/time-b" className="block">
                <Button className="w-full h-12 text-lg bg-accent hover:bg-accent/90">
                  Acessar Time B
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card className="max-w-3xl mx-auto border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-center">
              <Calendar className="h-5 w-5 text-primary" />
              Sobre a Gincana
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-center text-muted-foreground">
            <p>
              Competição anual entre dois times durante 12 meses (janeiro a dezembro).
            </p>
            <p>
              Cada atividade vale de 10 a 100 pontos. Acompanhe o desempenho,
              ranking e evolução mensal de cada equipe!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
