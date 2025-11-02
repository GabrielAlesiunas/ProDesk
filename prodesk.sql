-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 02/11/2025 às 19:44
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

--
-- Despejando dados para a tabela `avaliacoes`
--

INSERT INTO `avaliacoes` (`id`, `usuario_id`, `espaco_id`, `nota`, `comentario`, `criado_em`) VALUES
(1, 4, 4, 5.0, 'Gostei bastante do espaço.', '2025-11-02 11:45:59'),
(2, 4, 4, 1.5, 'Esperava mais.', '2025-11-02 11:54:00');

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
  `imagens` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '[]' CHECK (json_valid(`imagens`)),
  `compartilhavel` tinyint(1) DEFAULT 0,
  `capacidade_max` int(11) DEFAULT 1,
  `ocupacao_atual` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `espacos`
--

INSERT INTO `espacos` (`id`, `nome`, `descricao`, `imagem`, `avaliacao`, `precoHora`, `dono_id`, `comodidades`, `imagens`, `compartilhavel`, `capacidade_max`, `ocupacao_atual`) VALUES
(1, 'Coworking Central', 'Espaço moderno com salas privativas.', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80', 4.8, 250.00, 4, '[\"Wi-Fi\",\"Café\",\"Ar condicionado\"]', '[\"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80\"]', 0, 1, 0),
(2, 'Hub Criativo', 'Ambiente colaborativo para startups.', 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80', 4.7, 22.00, 4, '[]', '[]', 0, 1, 0),
(4, 'Espaço Verde', 'Coworking com áreas ao ar livre e ambiente sustentável.', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80', 4.9, 28.00, 4, '[]', '[]', 0, 1, 0),
(5, 'Open Office', 'Sala ampla com estações flexíveis e ótima iluminação.', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80', 4.6, 30.00, 4, '[]', '[]', 0, 1, 0),
(7, 'Estúdio Criativo', 'Espaço para designers e artistas, com luz natural e ambientes inspiradores.', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80', 4.7, 27.00, 4, '[]', '[]', 0, 1, 0),
(8, 'Tech Hub', 'Ambiente voltado para tecnologia, startups e desenvolvedores.', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80', 4.8, 32.00, 4, '[]', '[]', 0, 1, 0),
(20, 'teste', 'teste', 'http://localhost:3000/uploads/espaco_1762103383918.jpg', NULL, 100.00, 4, '[\"Café\"]', '[\"http://localhost:3000/uploads/espaco_1762103383918.jpg\",\"http://localhost:3000/uploads/espaco_1762103383919.jpg\"]', 1, 4, 3);

-- --------------------------------------------------------

--
-- Estrutura para tabela `reservas`
--

CREATE TABLE `reservas` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `espaco_id` int(11) NOT NULL,
  `data_reserva` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fim` time NOT NULL,
  `preco` decimal(10,2) NOT NULL,
  `forma_pagamento` enum('cartao','pix','boleto') NOT NULL,
  `status` varchar(200) DEFAULT 'pendente',
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp(),
  `atualizado_em` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `reservas`
--

INSERT INTO `reservas` (`id`, `usuario_id`, `espaco_id`, `data_reserva`, `hora_inicio`, `hora_fim`, `preco`, `forma_pagamento`, `status`, `criado_em`, `atualizado_em`) VALUES
(1, 4, 1, '2025-10-30', '08:00:00', '10:00:00', 500.00, 'cartao', 'finalizada', '2025-10-28 16:50:00', '2025-11-02 14:14:31'),
(2, 4, 1, '2025-10-29', '10:00:00', '11:00:00', 250.00, 'cartao', 'cancelada', '2025-10-28 17:19:34', '2025-11-02 14:13:04'),
(3, 4, 4, '2025-11-01', '22:00:00', '23:40:00', 46.67, 'cartao', 'finalizada', '2025-10-28 17:42:42', '2025-11-02 14:14:24'),
(4, 4, 2, '2025-10-29', '20:00:00', '23:00:00', 66.00, 'pix', 'cancelada', '2025-10-28 17:43:12', '2025-11-02 13:59:29'),
(5, 4, 1, '2025-11-01', '12:00:00', '14:00:00', 500.00, 'cartao', 'finalizada', '2025-10-31 16:40:53', '2025-11-02 14:12:19'),
(6, 4, 20, '2025-11-05', '12:00:00', '15:00:00', 300.00, 'pix', 'confirmada', '2025-11-02 17:50:33', '2025-11-02 17:50:33'),
(7, 4, 1, '2025-11-04', '11:00:00', '17:00:00', 1500.00, 'pix', 'confirmada', '2025-11-02 17:52:43', '2025-11-02 17:52:43'),
(8, 1, 20, '2025-11-05', '12:00:00', '14:00:00', 200.00, 'pix', 'confirmada', '2025-11-02 18:03:21', '2025-11-02 18:03:21');

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
(1, 'Gabriel', 'gabriel21.raimundo@gmail.com', '48109301819', NULL, NULL, '', '$2b$10$eMIHpq2GPrXiNOtOQLc1W.VQxM/ZGTcWRcLl50nv.6aJYVu4rKp5u', '2025-11-02 17:55:37'),
(4, 'admin', 'admin@gmail.com', '246.749.163-30', '999999999', 'Rua 01', 'http://localhost:3000/uploads/usuario_4.jpg', '$2b$10$KxZZ.O3pfOrezRCfMfWzLuDmVNVF0Ffs.hIb0abClGCspuk.h7I.K', '2025-10-21 15:52:32');

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
-- Índices de tabela `reservas`
--
ALTER TABLE `reservas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `espaco_id` (`espaco_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `cartoes`
--
ALTER TABLE `cartoes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `espacos`
--
ALTER TABLE `espacos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de tabela `reservas`
--
ALTER TABLE `reservas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

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

--
-- Restrições para tabelas `reservas`
--
ALTER TABLE `reservas`
  ADD CONSTRAINT `fk_reserva_espaco` FOREIGN KEY (`espaco_id`) REFERENCES `espacos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_reserva_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
