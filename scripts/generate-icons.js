const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputPath = path.join(__dirname, "../public/logoGeralAcima.png");
const outputDir = path.join(__dirname, "../public/icons");

// Criar diretório de ícones se não existir
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  try {
    console.log("Gerando ícones PWA...");

    for (const size of sizes) {
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);

      await sharp(inputPath)
        .resize(size, size, {
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .png()
        .toFile(outputPath);

      console.log(`✓ Gerado: icon-${size}x${size}.png`);
    }

    console.log("✅ Todos os ícones PWA foram gerados com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao gerar ícones:", error);
  }
}

generateIcons();
