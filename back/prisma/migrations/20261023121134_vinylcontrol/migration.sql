-- CreateTable
CREATE TABLE `Usuario` (
    `idUsuario` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `senha` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `Usuario_email_key`(`email`),
    PRIMARY KEY (`idUsuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Disco` (
    `idDisco` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(150) NOT NULL,
    `artista` VARCHAR(100) NOT NULL,
    `genero` VARCHAR(191) NULL,
    `precoCusto` DECIMAL(10, 2) NOT NULL,
    `precoVenda` DECIMAL(10, 2) NOT NULL,
    `quantidadeEstoque` INTEGER NOT NULL,
    `estoqueMinimo` INTEGER NOT NULL,

    PRIMARY KEY (`idDisco`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MovimentacaoEstoque` (
    `idMovimentacao` INTEGER NOT NULL AUTO_INCREMENT,
    `idDisco` INTEGER NOT NULL,
    `idUsuario` INTEGER NOT NULL,
    `tipoMovimentacao` ENUM('entrada', 'saida') NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `dataMovimentacao` DATE NOT NULL,
    `observacao` VARCHAR(191) NULL,

    PRIMARY KEY (`idMovimentacao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MovimentacaoEstoque` ADD CONSTRAINT `MovimentacaoEstoque_idDisco_fkey` FOREIGN KEY (`idDisco`) REFERENCES `Disco`(`idDisco`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MovimentacaoEstoque` ADD CONSTRAINT `MovimentacaoEstoque_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `Usuario`(`idUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;
