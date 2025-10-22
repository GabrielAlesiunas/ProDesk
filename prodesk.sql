-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 23/10/2025 às 01:37
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `prodesk`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `avaliacoes`
--

CREATE TABLE `avaliacoes` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `espaco_id` int(11) NOT NULL,
  `nota` decimal(2,1) DEFAULT NULL,
  `comentario` text DEFAULT NULL,
  `criado_em` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `cartoes`
--

CREATE TABLE `cartoes` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `numero` varchar(20) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `validade` varchar(10) NOT NULL,
  `cvv` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `cartoes`
--

INSERT INTO `cartoes` (`id`, `usuario_id`, `numero`, `nome`, `validade`, `cvv`) VALUES
(3, 4, '1233455676787871', 'gabriel', '02/31', '111');

-- --------------------------------------------------------

--
-- Estrutura para tabela `espacos`
--

CREATE TABLE `espacos` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `descricao` text DEFAULT NULL,
  `imagem` varchar(255) DEFAULT NULL,
  `avaliacao` decimal(2,1) DEFAULT NULL,
  `precoHora` decimal(10,2) DEFAULT NULL,
  `dono_id` int(11) DEFAULT NULL,
  `comodidades` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '[]' CHECK (json_valid(`comodidades`)),
  `imagens` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '[]' CHECK (json_valid(`imagens`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `espacos`
--

INSERT INTO `espacos` (`id`, `nome`, `descricao`, `imagem`, `avaliacao`, `precoHora`, `dono_id`, `comodidades`, `imagens`) VALUES
(1, 'Coworking Central', 'Espaço moderno com salas privativas.', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80', 4.8, 250.00, 4, '[\"Wi-Fi\",\"Café\",\"Ar condicionado\"]', '[\"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80\"]'),
(2, 'Hub Criativo', 'Ambiente colaborativo para startups.', 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80', 4.7, 22.00, 4, '[]', '[]'),
(4, 'Espaço Verde', 'Coworking com áreas ao ar livre e ambiente sustentável.', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80', 4.9, 28.00, 4, '[]', '[]'),
(5, 'Open Office', 'Sala ampla com estações flexíveis e ótima iluminação.', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80', 4.6, 30.00, 4, '[]', '[]'),
(6, 'Sala de Reunião VIP', 'Sala elegante com mesa grande, projetor e conforto total para reuniões importantes.', 'https://images.unsplash.com/photo-1581090700227-d93f0b7f37f7?auto=format&fit=crop&w=900&q=80', 4.9, 40.00, 4, '[]', '[]'),
(7, 'Estúdio Criativo', 'Espaço para designers e artistas, com luz natural e ambientes inspiradores.', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80', 4.7, 27.00, 4, '[]', '[]'),
(8, 'Tech Hub', 'Ambiente voltado para tecnologia, startups e desenvolvedores.', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80', 4.8, 32.00, 4, '[]', '[]'),
(9, 'Sala de Treinamento', 'Espaço ideal para workshops, treinamentos e palestras com todos os recursos necessários.', 'https://images.unsplash.com/photo-1560184897-5b21b7a1deda?auto=format&fit=crop&w=900&q=80', 4.6, 29.00, 4, '[]', '[]'),
(10, 'Espaço Lounge', 'Ambiente descontraído para reuniões informais e networking.', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80', 4.5, 20.00, 4, '[]', '[]'),
(11, 'Coworking Executivo', 'Ambiente corporativo com salas privativas e recepção elegante.', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80', 4.9, 35.00, 4, '[]', '[]'),
(12, 'Espaço Colaborativo', 'Área aberta para equipes colaborarem e criarem projetos juntos.', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80', 4.7, 23.00, 4, '[]', '[]'),
(13, 'Loft Inspirador', 'Espaço amplo com design moderno, perfeito para freelancers e pequenas equipes.', 'https://images.unsplash.com/photo-1499914485622-a88fac5362f5?auto=format&fit=crop&w=900&q=80', 4.8, 30.00, 4, '[]', '[]');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `cpf` varchar(14) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `endereco` varchar(255) DEFAULT NULL,
  `foto` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `nome`, `email`, `cpf`, `telefone`, `endereco`, `foto`, `senha`, `criado_em`) VALUES
(4, 'Gabriel', 'teste@gmail.com', '48109301819', '997671792', 'Rua Atalibio Pire 202', 'http://localhost:3000/uploads/usuario_4.png', '$2b$10$4Fbze8g2JbltnRlZvX2mAOAleeoHxY/clF0BRCYHJ9uWcaSSg1ZVi', '2025-10-21 15:52:32');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `avaliacoes`
--
ALTER TABLE `avaliacoes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `espaco_id` (`espaco_id`);

--
-- Índices de tabela `cartoes`
--
ALTER TABLE `cartoes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Índices de tabela `espacos`
--
ALTER TABLE `espacos`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `avaliacoes`
--
ALTER TABLE `avaliacoes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `cartoes`
--
ALTER TABLE `cartoes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `espacos`
--
ALTER TABLE `espacos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `avaliacoes`
--
ALTER TABLE `avaliacoes`
  ADD CONSTRAINT `avaliacoes_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `avaliacoes_ibfk_2` FOREIGN KEY (`espaco_id`) REFERENCES `espacos` (`id`);

--
-- Restrições para tabelas `cartoes`
--
ALTER TABLE `cartoes`
  ADD CONSTRAINT `cartoes_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
