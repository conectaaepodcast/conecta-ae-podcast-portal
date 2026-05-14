/**
 * Conteúdo estático da página Sobre (institucional + dados da empresa).
 * Imagens de equipe vêm da tabela `equipe`; foto do escritório opcional em `imagemEscritorio`.
 */
export type ParceriaConfig = {
  nome: string;
  url?: string;
  /** Caminho em `public/`, ex.: `/logo.png` */
  imagem?: string;
};

export type SobreConfig = {
  /** Opcional: `/arquivo.webp` em `public/` ou URL https pública (ex. Supabase Storage). */
  imagemEscritorio?: string;
  textoInstitucional: string[];
  empresa: {
    nome: string;
    descricao: string;
    email: string;
    endereco: string;
    /**
     * Opcional: se tiver entradas, substitui a lista vinda do painel (rodapé).
     * Deixe de fora ou use `[]` para mostrar as mesmas redes que no footer (Admin → Redes).
     */
    redesSociais?: { label: string; url: string }[];
  };
  parcerias: ParceriaConfig[];
};

export const sobreConfig: SobreConfig = {
  imagemEscritorio: "/escritorio.png", // ficheiro em public/ ou URL https (Supabase)
  textoInstitucional: [
    "Somos uma equipe dedicada a contar histórias que importam, com podcasts e notícias alinhados à nossa comunidade. Este portal reúne episódios, artigos e informações sobre nosso trabalho editorial.",
    "O Conecta Aê Podcast nasceu com o propósito de informar, conectar e entreter. Sua trajetória começou no final de 2024, inicialmente com o nome Alpha Cast. Após uma pausa em suas atividades, o projeto retornou em setembro de 2025, agora com uma nova identidade e proposta, tornando-se o Conecta Aê, com a participação de Fernanda Mazurek e Marcos Pitta na apresentação.",
    "O podcast tem como missão levar conteúdo de valor para pessoas que apreciam boas conversas, histórias inspiradoras e temas relevantes para o dia a dia. Com uma abordagem leve, dinâmica e autêntica, o programa traz entrevistas, histórias de vida, assuntos factuais e temas ligados às atualidades de Bebedouro e toda a região.",
  ],
  empresa: {
    nome: "Conecta Aê",
    descricao:
      "Mídia e comunicação — produção de podcasts, jornalismo digital e presença nas redes.",
    email: "mazurekfernanda@gmail.com",
    endereco: "Bebedouro e região — SP, Brasil",
    // Redes na página Sobre: mesmas do rodapé (Admin → Redes). Para lista fixa no ficheiro, defina `redesSociais`.
  },
  parcerias: [
    {
      nome: "VRJ Veículos",
      url: "https://www.veiculosvrj.com.br/",
      imagem: "/parceriavrj.png",
    },
  ] satisfies ParceriaConfig[],
};
