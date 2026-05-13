/**
 * Conteúdo estático da página Sobre (institucional + dados da empresa).
 * Imagens de equipe vêm da tabela `equipe`; escritório opcional via env.
 */
export type ParceriaConfig = {
  nome: string;
  url?: string;
  /** Caminho em `public/`, ex.: `/logo.png` */
  imagem?: string;
};

export const sobreConfig = {
  textoInstitucional: [
    "Somos uma equipe dedicada a contar histórias que importam, com podcasts e notícias alinhados à nossa comunidade.",
    "Este portal reúne episódios, artigos e informações sobre nosso trabalho editorial.",
  ],
  empresa: {
    nome: "Conecta Aê",
    descricao:
      "Mídia e comunicação — produção de podcasts, jornalismo digital e presença nas redes.",
    email: "contato@exemplo.com.br",
    endereco: "Brasil",
  },
  parcerias: [
    {
      nome: "VRJ Veículos",
      url: "https://www.veiculosvrj.com.br/",
      imagem: "/parceriavrj.png",
    },
  ] satisfies ParceriaConfig[],
};
