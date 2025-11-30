// Função para exportar dados para Excel usando exportação manual CSV
// Como não podemos usar bibliotecas externas, vamos criar um CSV que pode ser aberto no Excel

interface Member {
  id: string;
  name: string;
}

interface Score {
  id: string;
  member_id: string;
  description: string;
  points: number;
  month: string;
  created_at: string;
  members?: { name: string };
}

export const exportToExcel = (
  teamName: string,
  members: Member[],
  scores: Score[]
) => {
  // Criar conteúdo CSV
  let csvContent = "data:text/csv;charset=utf-8,";
  
  // Adicionar cabeçalho
  csvContent += `MOBI - Gincana ${teamName}\n\n`;
  
  // Seção 1: Membros
  csvContent += "MEMBROS DA EQUIPE\n";
  csvContent += "Nome\n";
  members.forEach(member => {
    csvContent += `${member.name}\n`;
  });
  
  csvContent += "\n\n";
  
  // Seção 2: Pontuações
  csvContent += "PONTUAÇÕES REGISTRADAS\n";
  csvContent += "Jovem,Descrição,Pontos,Mês,Data\n";
  scores.forEach(score => {
    const date = new Date(score.created_at).toLocaleDateString("pt-BR");
    csvContent += `${score.members?.name || ""},${score.description},${score.points},${score.month},${date}\n`;
  });
  
  csvContent += "\n\n";
  
  // Seção 3: Resumo por Mês
  csvContent += "RESUMO POR MÊS\n";
  csvContent += "Mês,Total de Pontos,Quantidade\n";
  
  const months = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
  ];
  
  months.forEach(month => {
    const monthScores = scores.filter(s => s.month === month);
    const total = monthScores.reduce((sum, s) => sum + Number(s.points), 0);
    csvContent += `${month},${total.toFixed(2)},${monthScores.length}\n`;
  });
  
  csvContent += "\n\n";
  
  // Seção 4: Ranking
  csvContent += "RANKING\n";
  csvContent += "Posição,Nome,Pontos\n";
  
  const ranking = members
    .map(member => ({
      name: member.name,
      points: scores
        .filter(s => s.member_id === member.id)
        .reduce((sum, s) => sum + Number(s.points), 0)
    }))
    .sort((a, b) => b.points - a.points);
  
  ranking.forEach((member, index) => {
    csvContent += `${index + 1},${member.name},${member.points.toFixed(2)}\n`;
  });
  
  // Criar Blob e baixar arquivo sem manipular DOM
  // Abordagem 100% segura sem criar elementos
  const blob = new Blob([csvContent.replace('data:text/csv;charset=utf-8,', '')], {
    type: 'text/csv;charset=utf-8;'
  });
  
  const url = URL.createObjectURL(blob);
  const fileName = `MOBI_${teamName}_${new Date().toISOString().split('T')[0]}.csv`;
  
  // Usar uma tag <a> de forma efêmera sem inserir no DOM
  const downloadLink = Object.assign(document.createElement('a'), {
    href: url,
    download: fileName,
    style: 'display: none'
  });
  
  // Trigger download sem adicionar ao DOM visível
  downloadLink.click();
  
  // Limpar URL após um pequeno delay
  setTimeout(() => URL.revokeObjectURL(url), 100);
};
