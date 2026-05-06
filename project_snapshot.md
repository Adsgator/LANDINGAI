# Project Snapshot

**Projeto:** `LANDINGAI`  
**Gerado em:** 2026-05-05 21:57:11  
**Total de arquivos:** 9  
**Raiz:** `C:\PROJETOS\ADSGATOR\LANDINGAI`  

---

## 📁 Estrutura de Arquivos

```
LANDINGAI/
├── 📁 assets/
│   ├── 📄 app.css (14.3KB)
│   └── 📄 app.js (69.9KB)
├── 📁 docs/
│   ├── 📄 doc1-teste.md
│   ├── 📄 IMPLEMENTACAO-LANDINGAI.md (53.7KB)
│   └── 📄 LANDINGAI-V2-IMPLEMENTACAO.md (95.2KB)
├── 📁 output/
│   └── 📄 .gitkeep
├── 📄 briefing-luc.md
├── 📄 dump_project_v2.py (13.0KB)
├── 📄 index.html
└── 📄 README.md
```

---

## 📄 Conteúdo dos Arquivos

### `README.md`

```markdown
# LandingAI — Adsgator

Sistema interno de geração de briefing e Ficha de Implementação (Doc 3) para projetos Astro da Adsgator.

## Como usar

1. Abra `index.html` no Chrome ou Edge.
2. Obtenha uma API Key do Gemini em: [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
3. Preencha as 8 etapas de briefing com as informações coletadas do cliente.
4. Na etapa 9:
   - **Modo Prompt:** Baixe o arquivo `briefing.md` para usar o prompt manualmente em qualquer IA.
   - **Modo Direto:** Insira sua API Key e clique em "Gerar Doc 3" para que o sistema gere o documento completo via Gemini 2.5 Pro.
5. Envie o arquivo `doc3-[slug].md` gerado para o Roo Code iniciar a implementação.

## Modos de Operação

- **Com API Gemini:** Gera o Doc 3 completo, com todas as seções, copy, metadados e configurações técnicas prontas para cópia.
- **Sem API:** Gera um briefing estruturado que inclui o "Prompt Mestre", permitindo que você gere o Doc 3 em interfaces externas de IA.

## Stack dos projetos gerados

As landing pages geradas seguem o padrão Adsgator:
- **Framework:** Astro
- **Estilização:** Tailwind CSS
- **Animações:** GSAP (ScrollTrigger) + Framer Motion
- **Scroll:** Lenis
- **Formulários:** Web3Forms
- **Deploy:** Vercel ou Netlify (output estático)

---
*v2.0 — Desenvolvido para uso interno da Adsgator*
```

### `briefing-luc.md`

```markdown
# Briefing — Luc
**Slug:** luc
**Data:** 2026-05-05

## Dados do Projeto
- Tipo: Serviço
- Domínio: 
- Nicho: 
- Serviço: 

## Público
- Primário: 
- Dores: 

## Prompt
Você é um Diretor de Arte, UI Designer de elite e Engenheiro Front-end Sênior, trabalhando para a agência Adsgator.
Sua missão é ler o briefing abaixo na íntegra e gerar como output o **Documento 3 — Ficha de Implementação**, completo, específico e pronto para ser enviado ao Roo Code implementar a landing page.

REGRAS QUE VOCÊ NUNCA VIOLA:
1. Você toma todas as decisões de design que não estão explicitadas: tipografia, escala, tokens, animações, layout de cada seção.
2. Você preenche TODOS os campos do Doc 3 com valores concretos. Sem placeholders.
3. O output deve poder ser copiado e enviado ao Roo sem nenhuma edição.
4. Padrão de qualidade: design editorial de alto padrão.
5. DNA ADSGATOR — REGRAS INEGOCIÁVEIS DE COPY.
6. STACK TÉCNICA FIXA: Astro + Tailwind CSS + GSAP + ScrollTrigger + Framer Motion + Lenis.
7. FORMULÁRIO: usar Web3Forms.
8. DEPLOY ALVO: Vercel (output: 'static').
9. REGRAS ABSOLUTAS DE CÓDIGO.

BRIEFING COMPLETO:
- Cliente: Luc
- Slug: luc
- Tipo: Serviço
- Domínio: 
- Nicho: 
- Serviço/Produto: 
- Objetivo: 
- Cidade: 
- Modalidade: 
- Incluso: 
- Duração: 
- Garantia: 
- Apresentação: 
- Contexto: 
- Público:  / 
- Dores: 
- Palavras de busca: 
- Resultado: 
- Objeções: 
- CTA: WHATSAPP ()
- WhatsApp:  / 
- Email: 
- Personalidade: 
- Estilo: 
- Cores:  / 
- Referências: 
- Integrações: 

Gere o Documento 3 seguindo a estrutura exata especificada no manual da Adsgator.
```

### `dump_project_v2.py`

```python
"""
dump_project.py — Project Snapshot Generator
=============================================
Gera um snapshot completo de qualquer projeto em um único arquivo .md
Uso: python dump_project.py [pasta_raiz] [--output arquivo.md]

Exemplos:
  python dump_project.py
  python dump_project.py ./meu-projeto
  python dump_project.py ./meu-projeto --output snapshot.md
  python dump_project.py --max-lines 500
"""

import os
import sys
import argparse
from datetime import datetime
from pathlib import Path

# ─── Configurações ────────────────────────────────────────────────────────────

# Pastas inteiras que serão ignoradas (em qualquer nível)
IGNORE_DIRS = {
    "node_modules", ".venv", "venv", "env", ".env",
    "__pycache__", ".git", ".svn", ".hg",
    "dist", "build", ".next", ".nuxt", "out",
    ".cache", ".parcel-cache", ".turbo",
    "uploads", "static/uploads", "media",
    ".idea", ".vscode", ".vs",
    "coverage", ".nyc_output", ".pytest_cache",
    "eggs", "*.egg-info", ".tox",
    "target",  # Rust/Java
    "vendor",  # Go/PHP
    "Pods",    # iOS
    ".gradle", # Android
}

# Extensões de arquivo que serão ignoradas (binários, mídia, etc)
IGNORE_EXTENSIONS = {
    # Imagens
    ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".ico",
    ".bmp", ".tiff", ".tif", ".raw", ".psd", ".ai", ".eps",
    # Vídeos
    ".mp4", ".avi", ".mov", ".mkv", ".webm", ".flv",
    # Áudio
    ".mp3", ".wav", ".ogg", ".flac", ".aac",
    # Fontes
    ".ttf", ".otf", ".woff", ".woff2", ".eot",
    # Binários / Compilados
    ".exe", ".dll", ".so", ".dylib", ".bin", ".obj", ".o",
    ".pyc", ".pyo", ".pyd", ".class",
    # Comprimidos
    ".zip", ".tar", ".gz", ".rar", ".7z", ".bz2",
    # Banco de dados
    ".db", ".sqlite", ".sqlite3",
    # Lock files (grandes e inúteis pra análise)
    # (detectados pelo nome, abaixo)
    # Documentos binários
    ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
    # Outros
    ".map",  # Source maps
    ".min.js", ".min.css",  # Minificados
    ".chunk.js",  # Chunks de build
}

# Arquivos específicos que serão ignorados (por nome exato)
IGNORE_FILES = {
    "package-lock.json", "yarn.lock", "pnpm-lock.yaml",
    "poetry.lock", "Pipfile.lock", "composer.lock",
    "Gemfile.lock", "cargo.lock", ".DS_Store", "Thumbs.db",
    ".env", ".env.local", ".env.production", ".env.development",
    "dump_project.py",  # o próprio script
}

# Extensões de texto que serão incluídas
TEXT_EXTENSIONS = {
    # Web
    ".js", ".mjs", ".cjs", ".jsx", ".ts", ".tsx",
    ".html", ".htm", ".css", ".scss", ".sass", ".less",
    # Python
    ".py", ".pyi",
    # Configs
    ".json", ".yaml", ".yml", ".toml", ".ini", ".cfg", ".conf",
    ".env.example", ".env.template",
    # Markdown / Docs
    ".md", ".mdx", ".rst", ".txt",
    # Scripts
    ".sh", ".bat", ".cmd", ".ps1",
    # Outros
    ".xml", ".graphql", ".prisma", ".sql",
    ".vue", ".svelte", ".astro",
    ".go", ".rs", ".java", ".kt", ".swift", ".c", ".cpp", ".h",
    ".rb", ".php", ".cs",
    ".r", ".R",
    # Config sem extensão (detectar pelo nome)
}

# Arquivos sem extensão que devem ser incluídos
INCLUDE_NO_EXT = {
    "Makefile", "Dockerfile", "Procfile", "Pipfile",
    "Gemfile", "Rakefile", "Brewfile",
    ".gitignore", ".gitattributes", ".editorconfig",
    ".prettierrc", ".eslintrc", ".babelrc",
    "requirements.txt",
}

# Número máximo de linhas por arquivo (evitar arquivos enormes)
DEFAULT_MAX_LINES = 1000
DEFAULT_MAX_FILE_SIZE_KB = 200

# ─── Funções ──────────────────────────────────────────────────────────────────

def should_ignore_dir(dir_name: str) -> bool:
    return dir_name in IGNORE_DIRS or dir_name.startswith(".")

def should_include_file(filepath: Path, max_size_kb: int) -> tuple[bool, str]:
    """Retorna (incluir, motivo_exclusão)"""
    name = filepath.name
    ext = filepath.suffix.lower()

    # Ignorar arquivos específicos
    if name in IGNORE_FILES:
        return False, f"arquivo ignorado por nome"

    # Ignorar extensões binárias
    if ext in IGNORE_EXTENSIONS:
        return False, f"extensão binária/media ({ext})"

    # Verificar tamanho
    try:
        size_kb = filepath.stat().st_size / 1024
        if size_kb > max_size_kb:
            return False, f"arquivo muito grande ({size_kb:.0f}KB > {max_size_kb}KB)"
    except OSError:
        return False, "erro ao acessar arquivo"

    # Arquivo sem extensão
    if not ext:
        if name in INCLUDE_NO_EXT:
            return True, ""
        # Ignorar outros sem extensão (binários, etc)
        return False, "sem extensão conhecida"

    # Extensão de texto conhecida
    if ext in TEXT_EXTENSIONS:
        return True, ""

    # Tentar ler como texto (detecção automática)
    try:
        with open(filepath, "r", encoding="utf-8", errors="strict") as f:
            f.read(512)  # Ler só os primeiros 512 bytes
        return True, ""  # É texto válido
    except (UnicodeDecodeError, OSError):
        return False, "arquivo binário (detecção automática)"


def get_language(filepath: Path) -> str:
    """Retorna a linguagem para syntax highlighting no markdown."""
    ext = filepath.suffix.lower()
    name = filepath.name
    
    mapping = {
        ".py": "python", ".pyi": "python",
        ".js": "javascript", ".mjs": "javascript", ".cjs": "javascript",
        ".jsx": "jsx", ".ts": "typescript", ".tsx": "tsx",
        ".html": "html", ".htm": "html",
        ".css": "css", ".scss": "scss", ".sass": "sass", ".less": "less",
        ".json": "json", ".yaml": "yaml", ".yml": "yaml",
        ".toml": "toml", ".ini": "ini", ".cfg": "ini", ".conf": "ini",
        ".md": "markdown", ".mdx": "markdown",
        ".sh": "bash", ".bat": "bat", ".cmd": "bat", ".ps1": "powershell",
        ".sql": "sql", ".graphql": "graphql",
        ".xml": "xml",
        ".vue": "vue", ".svelte": "svelte",
        ".go": "go", ".rs": "rust", ".java": "java",
        ".kt": "kotlin", ".swift": "swift",
        ".c": "c", ".cpp": "cpp", ".h": "c",
        ".rb": "ruby", ".php": "php", ".cs": "csharp",
        ".txt": "text",
    }

    names_mapping = {
        "Dockerfile": "dockerfile",
        "Makefile": "makefile",
        ".gitignore": "gitignore",
        "requirements.txt": "text",
    }

    return names_mapping.get(name, mapping.get(ext, "text"))


def build_tree(root: Path, prefix: str = "", ignore_hidden: bool = True) -> list[str]:
    """Gera árvore de arquivos estilo 'tree'."""
    lines = []
    try:
        entries = sorted(root.iterdir(), key=lambda x: (x.is_file(), x.name.lower()))
    except PermissionError:
        return lines

    visible = []
    for entry in entries:
        if entry.is_dir():
            if should_ignore_dir(entry.name):
                continue
        else:
            if entry.name in IGNORE_FILES:
                continue
            if entry.suffix.lower() in IGNORE_EXTENSIONS:
                continue
        visible.append(entry)

    for i, entry in enumerate(visible):
        is_last = i == len(visible) - 1
        connector = "└── " if is_last else "├── "
        extension = "    " if is_last else "│   "

        if entry.is_dir():
            lines.append(f"{prefix}{connector}📁 {entry.name}/")
            lines.extend(build_tree(entry, prefix + extension, ignore_hidden))
        else:
            size_kb = entry.stat().st_size / 1024
            size_str = f" ({size_kb:.1f}KB)" if size_kb > 10 else ""
            lines.append(f"{prefix}{connector}📄 {entry.name}{size_str}")

    return lines


def collect_files(root: Path, max_size_kb: int) -> list[tuple[Path, str]]:
    """Coleta todos os arquivos a incluir, com linguagem."""
    files = []

    for dirpath, dirnames, filenames in os.walk(root):
        # Filtrar pastas ignoradas (modifica in-place para o walk não entrar)
        dirnames[:] = sorted([
            d for d in dirnames
            if not should_ignore_dir(d)
        ])

        for filename in sorted(filenames):
            filepath = Path(dirpath) / filename
            include, reason = should_include_file(filepath, max_size_kb)
            if include:
                lang = get_language(filepath)
                files.append((filepath, lang))

    return files


def read_file_safe(filepath: Path, max_lines: int) -> tuple[str, bool]:
    """Lê arquivo com segurança, retorna (conteúdo, truncado)."""
    encodings = ["utf-8", "utf-8-sig", "latin-1", "cp1252"]
    
    for encoding in encodings:
        try:
            with open(filepath, "r", encoding=encoding) as f:
                lines = f.readlines()
            
            truncated = len(lines) > max_lines
            content = "".join(lines[:max_lines])
            return content, truncated
        except (UnicodeDecodeError, OSError):
            continue
    
    return "[❌ Erro: não foi possível ler este arquivo]", False


def generate_snapshot(
    root_dir: str = ".",
    output_file: str = "project_snapshot.md",
    max_lines: int = DEFAULT_MAX_LINES,
    max_size_kb: int = DEFAULT_MAX_FILE_SIZE_KB,
) -> None:
    root = Path(root_dir).resolve()
    output = Path(output_file)

    if not root.exists():
        print(f"❌ Pasta não encontrada: {root}")
        sys.exit(1)

    print(f"\n🔍 Analisando projeto em: {root}")
    print(f"📄 Output: {output.resolve()}")
    print(f"⚙️  Limite por arquivo: {max_lines} linhas / {max_size_kb}KB")
    print("─" * 60)

    # Coletar arquivos
    files = collect_files(root, max_size_kb)
    print(f"\n✅ {len(files)} arquivos encontrados\n")

    # Gerar árvore
    tree_lines = build_tree(root)

    # Escrever output
    with open(output, "w", encoding="utf-8") as out:

        # ── Header ──
        out.write(f"# Project Snapshot\n\n")
        out.write(f"**Projeto:** `{root.name}`  \n")
        out.write(f"**Gerado em:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  \n")
        out.write(f"**Total de arquivos:** {len(files)}  \n")
        out.write(f"**Raiz:** `{root}`  \n\n")
        out.write("---\n\n")

        # ── Árvore de Arquivos ──
        out.write("## 📁 Estrutura de Arquivos\n\n")
        out.write("```\n")
        out.write(f"{root.name}/\n")
        for line in tree_lines:
            out.write(line + "\n")
        out.write("```\n\n")
        out.write("---\n\n")

        # ── Conteúdo dos Arquivos ──
        out.write("## 📄 Conteúdo dos Arquivos\n\n")

        for filepath, lang in files:
            relative = filepath.relative_to(root)
            content, truncated = read_file_safe(filepath, max_lines)

            out.write(f"### `{relative}`\n\n")

            if truncated:
                out.write(f"> ⚠️ **Truncado:** mostrando primeiras {max_lines} linhas\n\n")

            out.write(f"```{lang}\n")
            out.write(content)
            if not content.endswith("\n"):
                out.write("\n")
            out.write("```\n\n")

            print(f"  ✔ {relative}")

    # ── Estatísticas ──
    output_size = output.stat().st_size / 1024
    print(f"\n{'─' * 60}")
    print(f"✅ Snapshot gerado com sucesso!")
    print(f"📄 Arquivo: {output.resolve()}")
    print(f"📦 Tamanho: {output_size:.1f}KB ({output_size/1024:.2f}MB)")
    print(f"📊 Arquivos incluídos: {len(files)}")
    print(f"\n💡 Próximo passo: Fazer upload de '{output.name}' no chat com Claude")
    print("─" * 60 + "\n")


# ─── Entry Point ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Gera um snapshot completo de qualquer projeto em um único arquivo .md",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Exemplos:
  python dump_project.py
  python dump_project.py ./meu-projeto
  python dump_project.py ./meu-projeto --output snapshot.md
  python dump_project.py . --max-lines 500 --max-size 100
        """
    )
    
    parser.add_argument(
        "root",
        nargs="?",
        default=".",
        help="Pasta raiz do projeto (padrão: pasta atual)"
    )
    parser.add_argument(
        "--output", "-o",
        default="project_snapshot.md",
        help="Nome do arquivo de saída (padrão: project_snapshot.md)"
    )
    parser.add_argument(
        "--max-lines",
        type=int,
        default=DEFAULT_MAX_LINES,
        help=f"Máximo de linhas por arquivo (padrão: {DEFAULT_MAX_LINES})"
    )
    parser.add_argument(
        "--max-size",
        type=int,
        default=DEFAULT_MAX_FILE_SIZE_KB,
        help=f"Tamanho máximo por arquivo em KB (padrão: {DEFAULT_MAX_FILE_SIZE_KB}KB)"
    )

    args = parser.parse_args()

    generate_snapshot(
        root_dir=args.root,
        output_file=args.output,
        max_lines=args.max_lines,
        max_size_kb=args.max_size,
    )
```

### `index.html`

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LandingAI — Adsgator</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/app.css">
</head>
<body>

  <div id="app">
    <!-- SIDEBAR -->
    <aside id="sidebar" class="sidebar"></aside>

    <!-- MAIN -->
    <main id="main" class="main">
      <header id="topbar" class="topbar"></header>
      <div id="progress-line" class="progress-line">
        <div id="progress-fill" class="progress-fill"></div>
      </div>
      <section id="step-content" class="step-content"></section>
      <footer id="bottombar" class="bottombar"></footer>
    </main>
  </div>

  <!-- MODAIS -->
  <div id="modal-api"       class="modal-backdrop hidden"></div>
  <div id="modal-gen"       class="modal-backdrop hidden"></div>
  <div id="modal-preview"   class="modal-backdrop hidden"></div>
  <div id="modal-projects"  class="modal-backdrop hidden"></div>
  <div id="modal-error"     class="modal-backdrop hidden"></div>

  <!-- TOAST -->
  <div id="toast" class="toast"></div>

  <!-- ICONS -->
  <script src="https://unpkg.com/lucide@latest"></script>

  <!-- APP -->
  <script src="assets/app.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      App.init();
    });
  </script>

</body>
</html>
```

### `assets\app.css`

```css
:root {
  /* Backgrounds */
  --bg-base:       #08090E;
  --bg-surface:    #0F1118;
  --bg-raised:     #161922;
  --bg-overlay:    #1E2130;

  /* Bordas */
  --border-subtle: rgba(255,255,255,0.04);
  --border-muted:  rgba(255,255,255,0.08);
  --border-default:rgba(255,255,255,0.13);
  --border-strong: rgba(255,255,255,0.22);

  /* Textos */
  --text-primary:  #EEEEF2;
  --text-secondary:#8A8C9E;
  --text-tertiary: #4A4C5E;
  --text-disabled: #2E3040;

  /* Accent Verde — Adsgator */
  --accent:        #00E5A0;
  --accent-hover:  #00FFAF;
  --accent-dim:    rgba(0,229,160,0.10);
  --accent-glow:   rgba(0,229,160,0.20);
  --accent-border: rgba(0,229,160,0.28);

  /* Accent Azul — Elementos secundários */
  --accent2:        #7B8CFF;
  --accent2-hover:  #8F9FFF;
  --accent2-dim:    rgba(123,140,255,0.10);
  --accent2-border: rgba(123,140,255,0.28);

  /* Semântico */
  --danger:        #FF5C5C;
  --danger-dim:    rgba(255,92,92,0.10);
  --danger-border: rgba(255,92,92,0.25);
  --warning:       #FFB547;
  --warning-dim:   rgba(255,181,71,0.10);
  --warning-border:rgba(255,181,71,0.25);
  --success:       #00E5A0;
  --success-dim:   rgba(0,229,160,0.10);

  /* Raios de borda */
  --r-xs:  3px;
  --r-sm:  7px;
  --r-md:  12px;
  --r-lg:  18px;
  --r-xl:  24px;
  --r-pill:999px;

  /* Sombras */
  --shadow-sm:  0 1px 3px rgba(0,0,0,0.4);
  --shadow-md:  0 4px 12px rgba(0,0,0,0.5);
  --shadow-lg:  0 8px 24px rgba(0,0,0,0.6);
  --shadow-glow:0 0 24px rgba(0,229,160,0.15);

  /* Transições */
  --ease-fast:  0.12s ease;
  --ease-base:  0.20s ease;
  --ease-slow:  0.35s ease;
  --ease-spring:0.25s cubic-bezier(0.34,1.56,0.64,1);

  --font-display: 'Syne', sans-serif;
  --font-body:    'DM Sans', sans-serif;
  --font-mono:    'DM Mono', monospace;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-body);
  background: var(--bg-base);
  color: var(--text-primary);
  line-height: 1.5;
  height: 100vh;
  overflow: hidden;
}

#app {
  display: flex;
  height: 100vh;
}

.syne { font-family: var(--font-display); }
.mono { font-family: var(--font-mono); }
.text-accent { color: var(--accent); }
.hidden { display: none !important; }

/* === SIDEBAR === */
.sidebar {
  width: 260px;
  min-width: 260px;
  background: var(--bg-surface);
  border-right: 1px solid var(--border-default);
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 24px 0;
  position: sticky;
  top: 0;
}

.sidebar .logo { padding: 0 24px 24px 24px; border-bottom: 1px solid var(--border-muted); margin-bottom: 24px; }
.sidebar-section { padding: 0 24px; margin-bottom: 24px; }
.sidebar-section-title { font-size: 11px; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 12px; }

.project-active-card {
  background: var(--bg-raised);
  border: 1px solid var(--border-default);
  border-radius: var(--r-md);
  padding: 12px;
  cursor: pointer;
  transition: all var(--ease-base);
  margin-bottom: 12px;
}
.project-active-card:hover { border-color: var(--border-strong); background: var(--bg-overlay); }
.project-active-title { font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--text-primary); }
.project-active-meta { font-size: 12px; color: var(--text-secondary); margin-top: 4px; }

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 24px;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 14px;
  transition: all var(--ease-base);
  user-select: none;
}
.nav-item:hover { color: var(--text-primary); background: rgba(255,255,255,0.02); }
.nav-item.active { color: var(--text-primary); background: var(--accent-dim); border-right: 2px solid var(--accent); }
.nav-item.visited { color: var(--text-primary); }
.nav-item .icon { width: 16px; height: 16px; flex-shrink: 0; }
.nav-item.active .icon { color: var(--accent); }
.nav-item.visited .icon { color: var(--success); }
.nav-item.error .icon { color: var(--danger); }

/* === MAIN === */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.topbar {
  height: 70px;
  background: rgba(8, 9, 14, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-default);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.progress-line {
  height: 3px;
  background: var(--bg-raised);
  width: 100%;
}
.progress-fill {
  height: 100%;
  background: var(--accent);
  width: 0%;
  transition: width var(--ease-slow);
}

.step-content {
  flex: 1;
  overflow-y: auto;
  padding: 40px 48px 100px 48px;
}

.content-inner { max-width: 820px; margin: 0 auto; }

.bottombar {
  height: 64px;
  background: var(--bg-surface);
  border-top: 1px solid var(--border-default);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
}

/* === FORMS === */
.field-group { margin-bottom: 24px; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
.mt-32 { margin-top: 32px; }

.field-input,
.field-textarea,
.field-select {
  background: var(--bg-raised);
  border: 1px solid var(--border-default);
  border-radius: var(--r-sm);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 14px;
  padding: 11px 14px;
  width: 100%;
  outline: none;
  transition: border-color var(--ease-base), box-shadow var(--ease-base);
}

.field-input:focus,
.field-textarea:focus,
.field-select:focus {
  border-color: var(--accent2);
  box-shadow: 0 0 0 3px var(--accent2-dim);
}

.field-input.has-error, .field-textarea.has-error { border-color: var(--danger); box-shadow: 0 0 0 3px var(--danger-dim); }
.field-input.has-warning, .field-textarea.has-warning { border-color: var(--warning); box-shadow: 0 0 0 3px var(--warning-dim); }

.field-textarea { resize: vertical; min-height: 100px; line-height: 1.6; }

.field-label {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-tertiary);
  margin-bottom: 7px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.field-label .required { color: var(--danger); }
.field-label .optional { color: var(--text-disabled); font-weight: 400; text-transform: none; letter-spacing: 0; font-size: 10px; }
.field-hint { font-size: 12px; color: var(--danger); margin-top: 6px; }
.field-hint.warning { color: var(--warning); }

/* === CHIPS === */
.chip-group { display: flex; flex-wrap: wrap; gap: 8px; }

.chip {
  padding: 7px 14px;
  border: 1px solid var(--border-default);
  border-radius: var(--r-pill);
  font-family: var(--font-body);
  font-size: 13px;
  cursor: pointer;
  background: transparent;
  color: var(--text-secondary);
  transition: all var(--ease-base);
  user-select: none;
}
.chip:hover { color: var(--text-primary); border-color: var(--border-strong); background: var(--bg-overlay); }
.chip.on { background: var(--accent2-dim); border-color: var(--accent2-border); color: var(--accent2); }

/* === SEL-CARDS === */
.sel-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }

.sel-card {
  border: 1px solid var(--border-default);
  border-radius: var(--r-md);
  padding: 16px 18px;
  cursor: pointer;
  transition: all var(--ease-base);
  background: var(--bg-surface);
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sel-card:hover { border-color: var(--border-strong); background: var(--bg-overlay); }
.sel-card.on {
  border-color: var(--accent-border);
  background: var(--accent-dim);
  box-shadow: 0 0 0 1px var(--accent-border);
}

.sel-card .card-title { font-family: var(--font-display); font-weight: 700; font-size: 14px; color: var(--text-primary); }
.sel-card .card-desc { font-size: 12px; color: var(--text-secondary); line-height: 1.5; }

/* === BUTTONS === */
.btn {
  font-family: var(--font-body);
  font-size: 14px;
  border-radius: var(--r-pill);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all var(--ease-base);
  outline: none;
  font-weight: 600;
}

.btn-primary {
  background: var(--accent);
  color: #031a10;
  padding: 12px 24px;
  border: none;
}
.btn-primary:hover { opacity: 0.88; transform: translateY(-1px); box-shadow: var(--shadow-glow); }
.btn-primary:active { transform: translateY(0); }
.btn-primary:disabled { opacity: 0.3; cursor: not-allowed; transform: none; box-shadow: none; }

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-default);
  padding: 11px 20px;
}
.btn-ghost:hover { color: var(--text-primary); border-color: var(--border-strong); background: var(--bg-overlay); }

.btn-danger {
  background: var(--danger-dim);
  color: var(--danger);
  border: 1px solid var(--danger-border);
  padding: 11px 20px;
}
.btn-danger:hover { background: rgba(255,92,92,0.18); }

/* === BADGES === */
.score-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: var(--r-pill);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
}
.score-badge.high   { background: var(--success-dim); color: var(--success); }
.score-badge.medium { background: var(--warning-dim); color: var(--warning); }
.score-badge.low    { background: var(--danger-dim);  color: var(--danger);  }

/* === MODALS === */
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 1;
  transition: opacity var(--ease-base);
}
.modal-backdrop.hidden {
  opacity: 0;
  pointer-events: none;
}
.modal {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-lg);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}
.modal-header { padding: 20px 24px; border-bottom: 1px solid var(--border-muted); display: flex; justify-content: space-between; align-items: center; }
.modal-body { padding: 24px; overflow-y: auto; }
.modal-footer { padding: 20px 24px; border-top: 1px solid var(--border-muted); display: flex; justify-content: flex-end; gap: 12px; }
.modal-title { font-family: var(--font-display); font-size: 18px; font-weight: 700; margin: 0; }

/* === TOAST === */
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: var(--bg-raised);
  border: 1px solid var(--border-default);
  padding: 12px 20px;
  border-radius: var(--r-md);
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  gap: 12px;
  transform: translateY(150%);
  transition: transform var(--ease-spring);
  z-index: 2000;
}
.toast--visible { transform: translateY(0); }
.toast--success { border-color: var(--success); }
.toast--error { border-color: var(--danger); }
.toast--warning { border-color: var(--warning); }

.icon { width: 18px; height: 18px; }
.icon--success { color: var(--success); }
.icon--danger { color: var(--danger); }
.icon--warning { color: var(--warning); }
.icon--muted { color: var(--text-disabled); }
.icon--accent { color: var(--accent); }
.icon--spin { animation: spin 1s linear infinite; }
@keyframes spin { 100% { transform: rotate(360deg); } }

/* REVIEW DASHBOARD */
.val-card { background: var(--danger-dim); border: 1px solid var(--danger-border); padding: 16px; border-radius: var(--r-md); margin-bottom: 24px; }
.val-card h4 { color: var(--danger); margin-bottom: 8px; }
.val-card ul { color: var(--text-primary); margin-left: 20px; font-size: 14px; }
.val-card ul li { margin-bottom: 4px; }

.dashboard-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }
.dashboard-card { background: var(--bg-raised); border: 1px solid var(--border-default); padding: 16px; border-radius: var(--r-md); display: flex; flex-direction: column; gap: 8px; }
.dashboard-card-title { font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--text-primary); }
.dashboard-card-score { font-size: 12px; }

.api-config { background: var(--bg-raised); padding: 24px; border-radius: var(--r-md); margin-top: 24px; border: 1px solid var(--border-default); }
.api-status { display: flex; align-items: center; gap: 8px; font-size: 12px; margin-top: 12px; color: var(--text-secondary); }
.status-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--text-disabled); }
.status-dot.active { background: var(--success); box-shadow: 0 0 8px var(--success); }

/* GEN MODAL */
.gen-progress { background: var(--bg-raised); height: 8px; border-radius: 4px; margin-bottom: 24px; overflow: hidden; }
.gen-progress-inner { height: 100%; background: var(--accent); width: 0%; transition: width 0.3s ease; }
.gen-status-list { display: flex; flex-direction: column; gap: 12px; font-size: 14px; }
.gen-status-item { display: flex; align-items: center; gap: 12px; color: var(--text-secondary); }
.gen-status-item.active { color: var(--text-primary); }
.gen-status-item.done { color: var(--text-primary); }

/* PROJECTS LIST */
.project-list-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; background: var(--bg-raised); border: 1px solid var(--border-default); border-radius: var(--r-md); margin-bottom: 12px; }
.project-list-item:hover { border-color: var(--border-strong); }
.project-list-info { display: flex; flex-direction: column; gap: 4px; }
.project-list-name { font-weight: 600; font-family: var(--font-display); color: var(--text-primary); }
.project-list-meta { font-size: 12px; color: var(--text-secondary); }
.project-list-actions { display: flex; gap: 8px; }

.accordion { border: 1px solid var(--border-default); border-radius: var(--r-md); overflow: hidden; }
.accordion-header { background: var(--bg-raised); padding: 16px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
.accordion-body { padding: 16px; display: none; font-family: var(--font-mono); font-size: 12px; white-space: pre-wrap; background: var(--bg-surface); color: var(--text-secondary); max-height: 400px; overflow-y: auto; }
.accordion.open .accordion-body { display: block; }

iframe { width: 100%; height: 600px; border: none; background: white; border-radius: var(--r-sm); }
```

### `assets\app.js`

> ⚠️ **Truncado:** mostrando primeiras 1000 linhas

```javascript
const REGRAS_FIXAS_ADSGATOR = `
> A PARTE 11 contém as Regras Fixas da Adsgator. Você não precisa alterar ou pensar sobre elas.
> Utilize estas regras integralmente ao gerar o Doc 3. Não resuma e não invente regras novas.
> Estas regras são aplicadas em 100% dos projetos.

### Stack Técnica

NÚCLEO IMUTÁVEL
───────────────
Astro          → Framework base. Saída estática por padrão. Zero JS desnecessário.
                 astro.config.mjs: output: 'static', site: 'https://[dominio].com.br'
                 @astrojs/sitemap instalado e configurado.
                 Exclui do sitemap: /links, /politica-de-privacidade, /termos-de-uso, /404

Tailwind CSS   → Toda estilização. Tokens em tailwind.config.js.
                 Sem style="" onde Tailwind resolve.
                 Sem HEX hardcoded no código — sempre via token.

Node.js        → Ambiente de build.

Lenis          → Smooth scroll global.
                 npm install @studio-freight/lenis
                 Inicializado em <script is:inline> no Layout.astro.
                 duration: 1.2 | easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                 Integrado ao GSAP: lenis.on('scroll', ScrollTrigger.update)
                 gsap.ticker.add((time) => { lenis.raf(time * 1000) })
                 gsap.ticker.lagSmoothing(0)

ANALYTICS E MONITORAMENTO
──────────────────────────
Vercel Analytics   → npm install @vercel/analytics
                     Import em Layout.astro: import { Analytics } from '@vercel/analytics/astro'
                     Inserir <Analytics /> no Layout.astro após o conteúdo.
                     Coleta pageviews e eventos automaticamente sem configuração extra.

Vercel Speed Insights → npm install @vercel/speed-insights
                     Import em Layout.astro: import { SpeedInsights } from '@vercel/speed-insights/astro'
                     Inserir <SpeedInsights /> no Layout.astro.
                     Monitora Web Vitals reais (LCP, CLS, FID) em produção.

EXTENSÕES (apenas onde necessário)
───────────────────────────────────
React          → Somente para componentes com estado dinâmico real:
                 MobileMenu.tsx, InstagramFeed.tsx (se ativo), ContactForm.tsx, CookieBanner.tsx
                 Sempre com client:visible ou client:idle (nunca client:load sem justificativa)

GSAP + ScrollTrigger → Animações de scroll e timelines.
                 Direto em <script> dentro dos .astro — nunca via import em bundle React.
                 gsap.registerPlugin(ScrollTrigger) obrigatório antes de qualquer uso.

Framer Motion  → Dentro de islands React.
                 Menu mobile fullscreen (AnimatePresence), hover em cards, CTA spring.

Web3Forms        → Backend do formulário de contato (se formulário ativo).
                 npm install web3forms
                 Variável: FORMS_ACCESS_KEY no .env

DEPLOY E INFRAESTRUTURA
────────────────────────
Target: Vercel — output: 'static' em astro.config.mjs
Alternativa aceita: Netlify — mesma configuração

GIT — OBRIGATÓRIO ANTES DE QUALQUER CÓDIGO
────────────────────────────────────────────
git init                           → inicializar repositório no primeiro passo do projeto
.gitignore padrão Astro:           → node_modules/, dist/, .env
Commit inicial:                    → "init: projeto Astro base" antes de qualquer código
Repositório remoto:                → conectar ao GitHub ou GitLab antes do primeiro deploy
CI/CD:                             → Vercel conecta ao repositório para deploy automático a cada push
Convenção de branches:
  main   → produção (deploy automático na Vercel)
  dev    → desenvolvimento local

ARQUIVOS OBRIGATÓRIOS
──────────────────────
public/robots.txt    → Permite: / | Proíbe: /links | Sitemap: https://[dominio]/sitemap-index.xml
public/manifest.json → name, short_name, start_url "/", display "standalone",
                       background_color e theme_color via tokens do projeto
.env.example         → entregar com o projeto — todas as variáveis documentadas, sem valores reais
                       Variáveis padrão:
                         GTM_ID=GTM-XXXXXXX
                         WHATSAPP_NUMBER=
                         FORMS_ACCESS_KEY= (se formulário ativo)
                         INSTAGRAM_TOKEN= (se feed ativo)
                         GOOGLE_MAPS_API_KEY= (se mapa avançado ativo)

### Componentes Globais (criar isolados, sem repetição)

Componentes Astro obrigatórios:
  Layout.astro          → Shell global. Contém: <head> com SEO, GTM snippet (is:inline),
                          Consent Mode v2, Lenis init, GSAP, Vercel Analytics, Speed Insights,
                          componente de menu, botão WhatsApp flutuante, rodapé.
  Button.astro          → Props: label, href, variant (primary | secondary | ghost), tracking-id.
                          Nunca escrever botão inline nas seções.
  SectionHeader.astro   → Props: label (pequeno texto acima), title, subtitle.
                          Usado em todas as seções que têm título + subtítulo.
  FeatureCard.astro     → Props: icon, title, description. Usado em Diferenciais e Como Funciona.
  TestimonialCard.astro → Props: name, role, text, avatar (opcional). Prova social.
  ReviewCard.astro      → Props: name, rating, text, date. Avaliações Google.

Componentes React (islands):
  MobileMenu.tsx        → Fullscreen overlay com Framer Motion AnimatePresence.
                          Props: links[], ctaLabel, ctaHref.
  InstagramFeed.tsx     → Grid de posts. Props: username, token (env var).
                          Sempre com ErrorBoundary — se API falhar, exibe placeholder neutro.
  ContactForm.tsx       → Multi-step se aplicável. Props: whatsappFallback.
                          ErrorBoundary: se falhar, exibe link direto para WhatsApp.
  CookieBanner.tsx      → Banner LGPD + Google Consent Mode v2.
                          Props: gtmId. client:idle. Estado via localStorage.

### Padrão de Assets

Localização: src/assets/images/[nome-do-arquivo].webp
Convenção:
  hero-principal.webp       → foto principal do profissional ou serviço
  profissional-retrato.webp → foto para seção de diferenciais
  servico-[numero].webp     → fotos de serviços específicos
  depoimento-[nome].webp    → avatares de depoimentos
  og-image.webp             → 1200x630px — compartilhamento social
  favicon.svg               → SVG nativo, nunca PNG
  avatar-links.webp         → 192x192px — foto para /links

Componente de imagem: sempre <Image /> nativo do Astro
  loading="eager"           → apenas hero-principal.webp
  loading="lazy"            → todo o resto
  width e height            → sempre definidos (evita layout shift)
  format="webp"             → explícito

Placeholders (quando asset não disponível):
  Fundo: token bg-surface
  Label descritivo: ex: "[Foto do profissional — 800x1000px]"
  Nunca cor sólida genérica sem label

### Design de Viewport — Regra Adsgator

Filosofia:
  O site não fica preso em um container central. Usar o viewport completo é uma decisão
  de design, não um descuido. Containers são ferramentas de legibilidade — não prisões.

Aplicação por tipo de bloco:
  Hero:            full-bleed. Fundo vai de borda a borda. Texto e imagem no container interno.
  Seções de fundo alternado: full-bleed com cor/textura própria — cria ritmo visual sem depender
                   só de espaçamento entre seções.
  Seções de texto: container centralizado (max-w-prose ou max-w-2xl) para legibilidade.
  Seções de grid:  container mais largo (max-w-7xl) com padding lateral.
  CTA Final:       full-bleed com cor de destaque — contraste máximo com o restante da página.
  Footer:          full-bleed — nunca container estreito no footer.
  Imagens heroicas: podem sangrar para fora do grid em desktop — quebrar o ritmo é intencional.

Ritmo visual entre seções:
  Alternar backgrounds (claro → levemente diferente → claro) cria profundidade sem divisórias.
  Mínimo 3 variações de fundo ao longo da página: background, surface, e um tom de destaque.
  Espaçamento vertical generoso: py-24 como mínimo em mobile, py-32 a py-40 em desktop.

### Performance e SEO Técnico

Preload de assets críticos (no <head> via Layout.astro):
  <link rel="preconnect"> para domínio da fonte
  <link rel="preload"> do woff2 da fonte principal com crossorigin="anonymous"
  <link rel="preload"> da hero-principal.webp com fetchpriority="high" as="image"
  Impacto direto no LCP — esses três itens sozinhos movem 0.5s–1.5s.

Font loading — evitar FOIT:
  font-display: swap obrigatório em toda @font-face.
  Fontsource já inclui swap por padrão — confirmar que não está sendo sobrescrito.
  Fallback stack explícito no tailwind.config.js:
    fontFamily: { sans: ['NomeDaFonte', 'ui-sans-serif', 'system-ui', 'sans-serif'] }

Canonical URL:
  <link rel="canonical" href="https://[domínio]/[path]" />
  Cada página recebe seu canonical absoluto via prop canonicalUrl no Layout.

### Sistema de Rastreamento

Google Tag Manager:
  Snippet head: dentro do <head>, imediatamente após <meta charset>
  Snippet body: imediatamente após abertura do <body>
  Diretiva Astro: <script is:inline> — obrigatório. Nunca processar com bundler.
  Componente: GTM.astro → recebe ID via prop. Usado dentro do Layout.astro.

Conversões Google Ads — padrão Adsgator:
  contato_wpp   → cliques em links WhatsApp
  view_content  → pageview da landing page principal
  view_links    → pageview da /links

Data attributes obrigatórios em todos os CTAs:
  id="btn-[local]"
  data-tracking="[ação]-[destino]"
  data-section="[nome-da-seção]"

### UX Obrigatório

Header Inteligente:
  Sticky top-0 z-50
  Esconde ao scrollar para baixo (GSAP translateY -100%, 0.3s ease-in-out)
  Reaparece ao scrollar para cima
  Fundo opaco ou backdrop-blur após 80px de scroll (transition 0.2s)
  Sempre contém logo + CTA principal rastreado
  Logo: link para #top, SVG nativo

Menu Mobile — Padrão Alto Padrão Adsgator:
  Acionado por botão hambúrguer com morphing animado (3 linhas → X, Framer Motion)
  Fullscreen overlay com AnimatePresence
  Fundo: cor da marca com opacidade alta ou dark overlay
  Links: stagger 0.05s de delay, slide de baixo para cima
  Tipografia: grande, impactante — não uma lista discreta
  Elemento de destaque: número de telefone OU CTA em destaque no fundo do overlay
  Fechar: clique fora, Escape ou botão X
  Scroll do body bloqueado enquanto aberto (overflow-hidden no html)

Botão WhatsApp flutuante:
  Oculto no carregamento
  Aparece após o Hero sair do viewport (IntersectionObserver)
  Desaparece quando o footer entra no viewport
  fixed bottom-6 right-6 (mobile) / bottom-8 right-8 (desktop)
  Mínimo 56x56px, touch target 64x64px
  Entrada: scale 0→1 + opacity 0→1, 0.3s ease-out
  SVG nativo do WhatsApp (cor #25D366), sem biblioteca externa
  data-tracking="click-whatsapp" data-section="floating-button"

Smooth Scroll (Lenis):
  Inicializar no Layout.astro via <script is:inline>
  duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
  Integrado ao GSAP: lenis.on('scroll', ScrollTrigger.update)
  requestAnimationFrame loop padrão do Lenis

Mobile First — Padrão Absoluto:
  Design começa em 375px — não adapta para mobile, começa no mobile
  Base para mobile, sobrescrever com sm: md: lg: xl:
  Breakpoint principal para 2 colunas: xl: (1280px)
  Texto nunca menor que 16px no mobile
  Touch targets mínimo 44x44px
  Padding lateral mobile mínimo px-5
  Tap highlight removido: -webkit-tap-highlight-color: transparent
  Hero: 100svh em mobile (usa svh, não vh — evita barra de endereço cortando)
  Nenhuma seção com overflow horizontal — testar sempre em 375px

Rodapé — Padrão de Excelência Adsgator:
  O footer é a última impressão do site — tratado com o mesmo cuidado do Hero.

  Estrutura obrigatória:
    Logo da marca — mesma proporção do header, com respiro vertical
    Tagline curta ou frase de encerramento — opcional mas poderosa quando usada
    Links essenciais: Política de Privacidade + Termos de Uso (se houver) + redes sociais confirmadas
    CNPJ do cliente (se fornecido no briefing)
    Copyright: © {new Date().getFullYear()} [Nome do Cliente]. Todos os direitos reservados.
    Logo da Adsgator: SVG com currentColor, discreto, com link para adsgator.com.br
      Texto: "Desenvolvido por Adsgator" ou apenas o logo — IA decide com base no espaço

  Design:
    Não use o mesmo fundo da última seção — crie separação visual clara
    Opções de fundo: cor primária escurecida / off-black / tom de destaque da paleta
    Tipografia: hierarquia visual real — não uma lista plana de links
    Espaçamento interno generoso: py-16 no mínimo
    Links com hover sutil — opacity ou cor, não sublinhado óbvio
    Ícones de redes sociais: tamanho mínimo 20px, monocromáticos, com aria-label

  Mobile:
    Coluna única, texto centralizado ou alinhado à esquerda (IA decide com base no tom)
    Logo acima, links abaixo, Adsgator no final
    Nenhum elemento cortado ou comprimido

Card CTA Final (bloco antes do footer):
  Posicionado imediatamente antes do footer, sempre
  Maior contraste visual da página
  Headline diferente do Hero — segundo ângulo de persuasão
  Botão com id="btn-cta-final" e data-tracking rastreado

### Banner de Consentimento (LGPD + Google Consent Mode v2)

Componente: CookieBanner.tsx (island React, client:idle)
Posição: fixed bottom-0 left-0 right-0, z-[9999]
Aparece: apenas se não houver consentimento no localStorage
  Chave: 'adsgator-consent' | Valor: 'granted' | 'denied'

Comportamento:
  Não bloqueia conteúdo — página carrega normalmente
  Banner aparece após idle (client:idle) — não compete com LCP
  Dois botões: "Aceitar" (primary) e "Recusar" (ghost)
  Clicar em qualquer um fecha e registra a escolha

Design:
  Barra horizontal discreta — não modal, não fullscreen
  Fundo: token bg-surface com backdrop-blur leve
  Borda superior sutil: border-t border-border
  Texto pequeno (text-sm), direto — sem juridiquês
  Link para /politica-de-privacidade (target _blank)
  Entrada: slide de baixo para cima, opacity 0→1, 0.3s ease-out (Framer Motion)
  Saída: slide para baixo + opacity 0, 0.25s ease-in (AnimatePresence)

Google Consent Mode v2 — integração com GTM:
  Antes do snippet do GTM (via <script is:inline>):
  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'analytics_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'wait_for_update': 500
  })
  Ao aceitar: gtag('consent', 'update', { todos: 'granted' })
  Ao recusar: manter 'denied' — não disparar update

### Sistema de Animação — Padrão Adsgator

Filosofia:
  Animação tem função: revelar, guiar, confirmar. Nunca decorativa.
  prefers-reduced-motion: todas as animações GSAP encapsuladas em
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {}

Tokens GSAP:
  Duração padrão entrada:   0.7s
  Duração rápida (micro):   0.3s
  Duração lenta (hero):     1.0s–1.4s
  Easing entrada:           power2.out
  Easing saída:             power2.in

Triggers de entrada:
  Hero:             timeline imediata (sem ScrollTrigger)
                    stagger: H1 → subtítulo → CTA → imagem
                    opacity: 0→1, y: 30→0, duração 1.0s, stagger 0.15s
  Seções internas:  ScrollTrigger start="top 80%"
                    opacity: 0→1, y: 40→0, duração 0.7s
  Cards em grid:    ScrollTrigger + stagger 0.1s por card
  CTA Final:        ScrollTrigger start="top 75%"
                    scale: 0.96→1 + opacity: 0→1, duração 0.8s, power3.out

Tokens Framer Motion (islands React):
  Hambúrguer → X:   rotate + scale, 0.3s, spring stiffness 300 damping 20
  Menu overlay:     opacity 0→1, 0.25s ease-out
  Links do menu:    stagger 0.05s, y: 20→0 + opacity: 0→1
  Hover em cards:   y: -4px, scale: 1.01, 0.2s ease-out
  Hover em botões:  scale: 1.03, 0.15s spring

### Acessibilidade Mínima Obrigatória

Filosofia: acessibilidade é critério de Quality Score no Google Ads.
Páginas com baixa acessibilidade têm CPC mais alto.

Contraste: WCAG AA mínimo — ratio 4.5:1 para texto normal, 3:1 para texto grande
Imagens: alt descritivo e específico. alt="" só em imagens puramente decorativas.
Botões icon-only: aria-label obrigatório (WhatsApp flutuante, hambúrguer, fechar)
Links externos: rel="noopener noreferrer"
Focus: focus-visible em todos os elementos interativos — nunca outline:none sem substituto
  Classes Tailwind: focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
Menu mobile: focus trap enquanto aberto. Escape fecha.
Semântica: <h1> única por página (no Hero). Hierarquia h1→h2→h3 — nunca pular nível.
  <main>, <header>, <footer>, <nav>, <section> com roles corretos.
Formulários: <label> associado via htmlFor/id. Mensagens de erro acessíveis via aria-describedby.

### Comportamento Responsivo por Tipo de Seção

Hero:
  mobile:   coluna única, texto em cima, imagem embaixo ou background full-bleed
  desktop:  2 colunas — texto (55%) | imagem (45%)

Diferenciais / Features:
  mobile:   1 coluna, cards empilhados
  tablet:   2 colunas
  desktop:  3 ou 4 colunas

Como Funciona:
  mobile:   vertical, numerado, com linha conectora
  desktop:  horizontal com seta entre etapas, ou alternado esquerda/direita

Prova Social:
  mobile:   slider/carousel 1 item (Framer Motion drag)
  desktop:  grid 2 ou 3 colunas

Avaliações Google:
  mobile:   horizontal scroll (overflow-x-auto, snap-mandatory)
  desktop:  grid 3 colunas

Feed Instagram:
  mobile:   grid 2x3
  desktop:  grid 3x2

FAQ:
  accordion, sempre 1 coluna, max-w-2xl centralizado

Mapa:
  mobile:   embed full width, 300px de altura
  desktop:  60% width + info de endereço ao lado, 400px

CTA Final:
  mobile:   coluna única, headline grande, botão full width
  desktop:  centralizado, max-w-3xl, botão não full width

### Integrações Técnicas

Google Maps:
  Embed API (iframe) — sem chave para embed básico
  Parâmetros: q=[endereço URL-encoded]&output=embed&z=16&language=pt-BR
  Sempre incluir bloco de endereço textual ao lado ou abaixo

Google Reviews:
  Places API (chave fornecida pelo gestor) ou widget Elfsight
  Exibir: foto, nome, nota em estrelas (SVG), texto, data relativa
  Máximo: 6 desktop, 3 mobile. Nota geral + total de avaliações acima dos cards.

Instagram Feed:
  Island React (client:visible) — não bloqueia carregamento
  Token: INSTAGRAM_TOKEN no .env — nunca hardcoded
  ErrorBoundary: se falhar, exibe "Ver no Instagram →" linkado ao perfil

Formulário de Contato:
  Simples: Astro nativo com Resend
  Multi-step: island React com Framer Motion AnimatePresence
  Honeypot: campo oculto via CSS (position absolute left -9999px)
  Submit: feedback inline — sem redirecionamento externo
  ErrorBoundary: fallback para WhatsApp se submit falhar

Links WhatsApp — formato canônico:
  https://wa.me/[DDI+DDD+NÚMERO]?text=[MENSAGEM_URL_ENCODED]
  Nunca api.whatsapp.com/send — sempre wa.me

### Schema.org — Dados Estruturados

Obrigatório em 100% dos projetos.
Tipo base: LocalBusiness (ou subtipo específico do nicho).

Subtipos por nicho:
  Dentista: Dentist | Nutricionista: Nutritionist | Fisioterapeuta: MedicalBusiness
  Advogado: LegalService | Psicólogo: MedicalBusiness | Salão/Estética: HealthAndBeautyBusiness
  Outros: LocalBusiness como fallback

Campos obrigatórios (JSON-LD no <head> via Layout.astro):
  @context, @type, name, description, url, telephone, image, openingHours, sameAs
  address e geo: apenas se atendimento presencial confirmado com endereço autorizado
  aggregateRating: apenas se avaliações reais confirmadas no briefing — nunca inventar
  priceRange: se valor fornecido no briefing

Nunca inventar dados. Se o campo não foi fornecido, omiti-lo.
`;

const AI_MODELS = {
  'gemini-3-flash': { name: 'Gemini 3.0 Flash', provider: 'gemini', endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', maxTokens: 65536, temp: 0.65 },
  'gemini-3-pro': { name: 'Gemini 3.0 Pro', provider: 'gemini', endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent', maxTokens: 65536, temp: 0.65 },
  'claude-sonnet': { name: 'Claude Sonnet 3.5', provider: 'claude', endpoint: 'https://api.anthropic.com/v1/messages', maxTokens: 8192, temp: 0.7 },
  'grok-3': { name: 'Grok 3', provider: 'grok', endpoint: 'https://api.x.ai/v1/chat/completions', maxTokens: 32000, temp: 0.7 },
  'mistral-large': { name: 'Mistral Large', provider: 'mistral', endpoint: 'https://api.mistral.ai/v1/chat/completions', maxTokens: 32000, temp: 0.6 }
};

const defaultBriefing = {
  nome_cliente: '', nome_marca: '', slug: '', segmento: '', tipo: '',
  whatsapp: '', email: '', horarios: '', gtm_id: '',
  instagram: '', tiktok: '', youtube: '', outras_redes: '',
  modalidade: '', endereco: '', exibir_localizacao: '', cidades_atendimento: '', plataforma_online: '',
  servicos_lista: '', servicos_descricao: '', servico_principal: '', objetivo_conversao: '', objetivo_outro: '', preco_exibir: '', preco_valor: '', preco_condicao: '', oferta_especial: '',
  publico_primario: '', publico_dor: '', publico_resultado: '', publico_secundario: '', faq: '',
  diferencial: '', historia: '', frase_impacto: '', depoimentos: '', depoimentos_formato: [], depoimentos_qtd: '', google_business: '', google_nota: '', google_qtd: '', casos_resultados: '',
  estilo_desejado: '', sensacao_visitante: '', referencias_pessoais: '', referencias_nicho: '', cor_principal: '', cor_secundaria: '', logo_disponivel: '', tema: '', intensidade_visual: '', footer_tom: '', footer_elemento: '', footer_sensacao: '', menu_mobile_estilo: '', menu_mobile_especial: '', o_que_nao_quero: '', referencia_marca: '',
  foto_profissional: '', assets_outros: '', dominio: '', cnpj: '', aviso_legal: '', restricoes: '', integracoes: [], instrucoes_adicionais: '', briefing_bruto: ''
};

const criticalFields = {
  1: ['nome_cliente', 'tipo', 'segmento'],
  2: ['whatsapp', 'objetivo_conversao'],
  4: ['modalidade'],
  5: ['servico_principal', 'servicos_descricao'],
  6: ['publico_primario', 'publico_dor', 'publico_resultado'],
  7: ['diferencial', 'frase_impacto'],
  8: ['estilo_desejado', 'tema', 'intensidade_visual'],
  9: ['dominio']
};

const STEP_TITLES = {
  1: "Identificação", 2: "Contato", 3: "Redes Sociais", 4: "Localização", 5: "Serviços",
  6: "Público", 7: "Diferenciais", 8: "Direção Visual", 9: "Revisão e Assets"
};

const App = {
  state: {
    currentStep: 1, totalSteps: 9, projects: {}, activeProjectId: null,
    visitedSteps: new Set(),
    apiKeys: { gemini: '', claude: '', grok: '', mistral: '' },
    selectedModel: 'gemini-3-flash', isGenerating: false
  },
  briefing: { ...defaultBriefing },
  _saveTimeout: null, _toastTimeout: null,

  init() {
    this.checkDraft();
    const storedKeys = localStorage.getItem('landingai_keys');
    if (storedKeys) this.state.apiKeys = JSON.parse(storedKeys);
    const storedModel = localStorage.getItem('landingai_model');
    if (storedModel) this.state.selectedModel = storedModel;
    
    this.requestNotificationPermission();
    this.renderApp();
    this.setupEvents();
    
    // Create first project if empty
    if (!this.state.activeProjectId) this.createProject();
  },

  createProject() {
    const id = crypto.randomUUID();
    this.state.projects[id] = {
      id, name: 'Novo Projeto', slug: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      status: 'rascunho', briefing: { ...defaultBriefing }, visitedSteps: [], versions: []
    };
    this.state.activeProjectId = id;
    this.briefing = { ...defaultBriefing };
    this.state.visitedSteps = new Set();
    this.state.currentStep = 1;
    this.autosave();
    this.renderApp();
  },

  loadProject(id) {
    if (this.state.projects[id]) {
      this.state.activeProjectId = id;
      this.briefing = { ...this.state.projects[id].briefing };
      this.state.visitedSteps = new Set(this.state.projects[id].visitedSteps);
      this.state.currentStep = 1;
      this.renderApp();
      this.closeModal('modal-projects');
    }
  },

  autosave() {
    clearTimeout(this._saveTimeout);
    this._saveTimeout = setTimeout(() => {
      const p = this.state.projects[this.state.activeProjectId];
      if (!p) return;
      p.briefing = { ...this.briefing };
      p.name = this.briefing.nome_cliente || 'Novo Projeto';
      p.slug = this.briefing.slug;
      p.visitedSteps = Array.from(this.state.visitedSteps);
      p.updatedAt = new Date().toISOString();
      localStorage.setItem('landingai_projects', JSON.stringify(this.state.projects));
      localStorage.setItem('landingai_active', this.state.activeProjectId);
      this.renderSidebar(); // update name
    }, 1500);
  },

  checkDraft() {
    const raw = localStorage.getItem('landingai_projects');
    const activeId = localStorage.getItem('landingai_active');
    if (raw) {
      this.state.projects = JSON.parse(raw);
      if (activeId && this.state.projects[activeId]) {
        this.state.activeProjectId = activeId;
        this.briefing = { ...this.state.projects[activeId].briefing };
        this.state.visitedSteps = new Set(this.state.projects[activeId].visitedSteps || []);
      }
    }
  },

  setField(field, val) {
    this.briefing[field] = val;
    if (field === 'nome_cliente' && !this.briefing.slug) {
      this.briefing.slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      document.getElementById('field_slug').value = this.briefing.slug;
    }
    this.autosave();
    if (this.state.currentStep === 9) this.renderStep9();
  },

  toggleArrayField(field, val) {
    if (!this.briefing[field]) this.briefing[field] = [];
    if (!Array.isArray(this.briefing[field])) this.briefing[field] = [this.briefing[field]];
    const idx = this.briefing[field].indexOf(val);
    if (idx > -1) this.briefing[field].splice(idx, 1);
    else this.briefing[field].push(val);
    this.autosave();
    this.renderStepContent();
  },

  goToStep(n) {
    this.state.visitedSteps.add(this.state.currentStep);
    this.state.currentStep = n;
    this.renderApp();
    document.getElementById('step-content').scrollTop = 0;
  },

  renderApp() {
    this.renderSidebar();
    this.renderTopbar();
    this.renderBottombar();
    this.renderStepContent();
    lucide.createIcons();
  },

  renderSidebar() {
    const sb = document.getElementById('sidebar');
    const p = this.state.projects[this.state.activeProjectId];
    const name = p ? p.name : 'Novo Projeto';
    const hasKeys = Object.values(this.state.apiKeys).some(k => k.length > 0);
    
    let stepsHtml = '';
    for(let i=1; i<=9; i++) {
      const active = i === this.state.currentStep ? 'active' : '';
      const visited = this.state.visitedSteps.has(i) ? 'visited' : '';
      let icon = 'circle';
      if (i === this.state.currentStep) icon = 'circle-dot';
      else if (visited) icon = 'check-circle';
      
      stepsHtml += `
        <div class="nav-item ${active} ${visited}" onclick="App.goToStep(${i})">
          <i data-lucide="${icon}" class="icon"></i> ${i}. ${STEP_TITLES[i]}
        </div>
      `;
    }

    sb.innerHTML = `
      <div class="logo">
        <h2 class="syne text-accent">LandingAI</h2>
      </div>
      <div class="sidebar-section">
        <div class="sidebar-section-title">Projeto Ativo</div>
        <div class="project-active-card" onclick="App.openModal('modal-projects')">
          <div class="project-active-title">${name}</div>
          <div class="project-active-meta">Clique para trocar</div>
        </div>
      </div>
      <div class="sidebar-section">
        <div class="sidebar-section-title">Briefing</div>
        ${stepsHtml}
      </div>
      <div style="margin-top: auto; padding: 24px;">
        <button class="btn btn-ghost" style="width: 100%; margin-bottom: 12px;" onclick="App.openModal('modal-api')">
          <i data-lucide="key" class="icon"></i> Config. API
        </button>
        <div class="api-status">
          <span class="status-dot ${hasKeys ? 'active' : ''}"></span>
          ${hasKeys ? 'API Configurada' : 'Sem API'}
        </div>
      </div>
    `;
  },

  renderTopbar() {
    const tb = document.getElementById('topbar');
    tb.innerHTML = `
      <div>
        <h2 class="syne">${STEP_TITLES[this.state.currentStep]}</h2>
        <div style="font-size: 12px; color: var(--text-secondary)">Step ${this.state.currentStep} de 9</div>
      </div>
    `;
    const pct = ((this.state.currentStep - 1) / 8) * 100;
    document.getElementById('progress-fill').style.width = `${pct}%`;
  },

  renderBottombar() {
    const bb = document.getElementById('bottombar');
    let html = '';
    if (this.state.currentStep > 1) {
      html += `<button class="btn btn-ghost" onclick="App.goToStep(${this.state.currentStep - 1})">Anterior</button>`;
    } else {
      html += `<div></div>`;
    }
    if (this.state.currentStep < 9) {
      html += `<button class="btn btn-primary" onclick="App.goToStep(${this.state.currentStep + 1})">Próximo</button>`;
    } else {
      html += `<div></div>`;
    }
    bb.innerHTML = html;
  },

  renderStepContent() {
    if (this.state.currentStep === 9) {
      this.renderStep9();
      return;
    }
    const sc = document.getElementById('step-content');
    const b = this.briefing;
    let html = '<div class="content-inner">';

    const input = (id, label, ph, req=false) => `
      <div class="field-group">
        <label class="field-label">${label} ${req?'<span class="required">*</span>':''}</label>
        <input class="field-input" id="field_${id}" value="${b[id]||''}" placeholder="${ph}" oninput="App.setField('${id}', this.value)">
      </div>
    `;
    const textarea = (id, label, ph, req=false) => `
      <div class="field-group">
        <label class="field-label">${label} ${req?'<span class="required">*</span>':''}</label>
        <textarea class="field-textarea" id="field_${id}" placeholder="${ph}" oninput="App.setField('${id}', this.value)">${b[id]||''}</textarea>
      </div>
    `;
    const selcard = (id, label, opts, req=false) => {
      let c = `<div class="field-group"><label class="field-label">${label} ${req?'<span class="required">*</span>':''}</label><div class="sel-cards">`;
      opts.forEach(o => {
        const on = b[id] === o.val ? 'on' : '';
        c += `<div class="sel-card ${on}" onclick="App.setField('${id}', '${o.val}'); App.renderStepContent();">
          <div class="card-title">${o.title}</div><div class="card-desc">${o.desc}</div>
        </div>`;
      });
      return c + `</div></div>`;
    };
    const chips = (id, label, opts, isArray=false, req=false) => {
      let c = `<div class="field-group"><label class="field-label">${label} ${req?'<span class="required">*</span>':''}</label><div class="chip-group">`;
      opts.forEach(o => {
        const isOn = isArray ? (b[id] && b[id].includes(o)) : b[id] === o;
        const action = isArray ? `App.toggleArrayField('${id}', '${o}')` : `App.setField('${id}', '${o}'); App.renderStepContent();`;
        c += `<div class="chip ${isOn?'on':''}" onclick="${action}">${o}</div>`;
      });
      return c + `</div></div>`;
    };

    switch(this.state.currentStep) {
      case 1:
        html += input('nome_cliente', 'Nome do Cliente', 'ex: Adsgator', true);
        html += input('nome_marca', 'Nome da Marca', 'ex: Adsgator LLC', true);
        html += input('slug', 'Slug', 'ex: adsgator', true);
        html += input('segmento', 'Segmento', 'ex: Marketing', true);
        html += selcard('tipo', 'Tipo de Projeto', [
          {val:'Serviço', title:'Serviço', desc:'Prestação de serviço'},
          {val:'Produto', title:'Produto', desc:'Produto físico ou digital'},
          {val:'Mentoria', title:'Mentoria', desc:'Mentoria ou programa'}
        ], true);
        break;
      case 2:
        html += input('whatsapp', 'WhatsApp', '5511999999999', true);
        html += selcard('objetivo_conversao', 'Objetivo de Conversão', [
          {val:'whatsapp', title:'WhatsApp', desc:''},
          {val:'formulario', title:'Formulário', desc:''},
          {val:'agendamento', title:'Agendamento', desc:''}
        ], true);
        html += input('email', 'E-mail', 'contato@email.com');
        html += input('gtm_id', 'GTM ID', 'GTM-XXXXXX');
        break;
      case 3:
        html += input('instagram', 'Instagram', '@perfil');
        html += input('tiktok', 'TikTok', '@perfil');
        html += input('youtube', 'YouTube', 'URL do canal');
        break;
      case 4:
        html += chips('modalidade', 'Modalidade', ['Presencial', 'Online', 'Híbrido'], false, true);
        if (b.modalidade === 'Presencial' || b.modalidade === 'Híbrido') {
          html += textarea('endereco', 'Endereço', 'Rua X...');
        }
        break;
      case 5:
        html += input('servico_principal', 'Serviço Principal', '', true);
        html += textarea('servicos_descricao', 'Descrição', '', true);
        html += textarea('servicos_lista', 'Lista', '');
        break;
      case 6:
        html += textarea('publico_primario', 'Público Primário', '', true);
        html += textarea('publico_dor', 'Dor do Público', '', true);
        html += textarea('publico_resultado', 'Resultado Esperado', '', true);
        break;
      case 7:
        html += textarea('diferencial', 'Diferencial', '', true);
        html += input('frase_impacto', 'Frase de Impacto', '', true);
        html += chips('depoimentos', 'Depoimentos', ['Sim', 'Não']);
        html += chips('google_business', 'Google Business', ['Sim', 'Não']);
        break;
      case 8:
        html += textarea('estilo_desejado', 'Estilo', '', true);
        html += chips('tema', 'Tema', ['Claro', 'Escuro', 'IA Decide'], false, true);
        html += selcard('intensidade_visual', 'Intensidade Visual', [
          {val:'Contido', title:'Contido', desc:''},
          {val:'Médio', title:'Médio', desc:''},
          {val:'Alto', title:'Alto', desc:''}
        ], true);
        break;
    }
    
    // Add Score calculation
    this.calculateScore();
    
    html += '</div>';
    sc.innerHTML = html;
    lucide.createIcons();
  },

  calculateScore() {
    let filled = 0;
    let total = 0;
    const b = this.briefing;
    
    for (const step in criticalFields) {
      criticalFields[step].forEach(f => {
        total++;
        if (b[f] && String(b[f]).trim() !== '') filled++;
      });
    }
    
    this.state.score = total > 0 ? Math.round((filled / total) * 100) : 0;
  },

  renderStep9() {
    const sc = document.getElementById('step-content');
    this.calculateScore();
    
    let scoreClass = 'low';
    if (this.state.score > 80) scoreClass = 'high';
    else if (this.state.score > 50) scoreClass = 'medium';
    
    const missing = [];
    for (const step in criticalFields) {
      criticalFields[step].forEach(f => {
        if (!this.briefing[f] || String(this.briefing[f]).trim() === '') {
          missing.push({ step, field: f });
        }
      });
    }

    let cardsHtml = '';
    for(let i=1; i<=8; i++) {
      let stepTotal = 0;
      let stepFilled = 0;
      if (criticalFields[i]) {
        criticalFields[i].forEach(f => {
          stepTotal++;
          if (this.briefing[f] && String(this.briefing[f]).trim() !== '') stepFilled++;
        });
      } else {
        stepTotal = 1;
        stepFilled = 1; // if no critical fields, consider it 100%
      }
      const pct = Math.round((stepFilled/stepTotal)*100);
      
      cardsHtml += `
        <div class="dashboard-card">
          <div class="dashboard-card-title">${i}. ${STEP_TITLES[i]}</div>
          <div class="dashboard-card-score" style="color: var(--${pct===100?'success':pct>50?'warning':'danger'})">
            <i data-lucide="${pct===100?'check':'circle'}" class="icon" style="width:12px;height:12px;display:inline-block"></i> ${pct}% completo
          </div>
          <button class="btn btn-ghost" style="margin-top:8px; padding:6px 12px; font-size:11px;" onclick="App.goToStep(${i})">Editar</button>
        </div>
      `;
    }

    let missingHtml = '';
    if (missing.length > 0) {
      missingHtml = `
        <div class="val-card mt-32">
          <h4><i data-lucide="alert-triangle" class="icon"></i> Campos Críticos Faltando</h4>
          <ul>
            ${missing.map(m => `<li>${m.field} (Step ${m.step})</li>`).join('')}
          </ul>
        </div>
      `;
    }

    sc.innerHTML = `
      <div class="content-inner">
        <div style="background:var(--bg-raised); border:1px solid var(--border-default); padding:24px; border-radius:var(--r-md); margin-bottom:32px;">
          <h3 class="syne" style="margin-bottom:12px;">REVISÃO GERAL</h3>
          <div style="display:flex; align-items:center; gap:16px;">
            <div style="flex:1; height:8px; background:var(--bg-surface); border-radius:4px; overflow:hidden;">
              <div style="width:${this.state.score}%; height:100%; background:var(--${scoreClass=== 'high' ? 'success' : scoreClass === 'medium' ? 'warning' : 'danger'}); transition:width 0.3s"></div>
            </div>
            <div class="score-badge ${scoreClass}">${this.state.score}% — ${scoreClass === 'high' ? 'Pronto para gerar' : 'Incompleto'}</div>
          </div>
        </div>
        
        <div class="dashboard-grid">
          ${cardsHtml}
        </div>
        
        ${missingHtml}
        
        <div style="margin-top: 40px; padding: 24px; background: var(--bg-surface); border: 1px solid var(--border-default); border-radius: var(--r-md);">
          <h3 class="syne" style="margin-bottom: 16px;">Ações Finais</h3>
          <div style="display: flex; gap: 16px;">
            <button class="btn btn-ghost" onclick="App.downloadDoc1()"><i data-lucide="download" class="icon"></i> Baixar DOC-1</button>
            <button class="btn btn-primary" onclick="App.generateDocImpl()" ${this.state.score < 60 ? 'disabled' : ''}><i data-lucide="zap" class="icon"></i> Gerar DOC-IMPL via IA</button>
          </div>
        </div>
      </div>
    `;
    lucide.createIcons();
  },

  buildDoc1() {
    const b = this.briefing;
    const modelUsed = this.state.apiKeys[AI_MODELS[this.state.selectedModel].provider] ? AI_MODELS[this.state.selectedModel].name : 'manual';
    
    return `---
title: ${b.nome_cliente || 'Projeto'} — Brainstorm Visual
date: ${new Date().toISOString()}
tags: [adsgator, design, doc-2]
status: pronto-para-ia
gerado_por: LandingAI v2
modelo_ia: ${modelUsed}
---

# ${b.nome_cliente || 'Projeto'} — Brainstorm Visual

> **Documento 1 de 2 — Adsgator (gerado pelo LandingAI v2)**
> Preencha este documento e envie para a IA gerar a Ficha de Implementação.

---

## INSTRUÇÃO MESTRE PARA A IA

Você é um Diretor de Arte, UI Designer de elite e Engenheiro Front-end Sênior, trabalhando para a agência Adsgator.

Sua missão é ler este documento inteiro e gerar como output a **Ficha de Implementação**, completa, específica e pronta para ser enviada diretamente ao Claude, Roo Code ou outro agente implementador construir a landing page.

**O que isso significa na prática:**
- Você toma todas as decisões de design que não estão explicitadas — tipografia, escala, tokens, animações, layout de cada seção.
- Você preenche cada campo da Ficha de Implementação com valores concretos. Sem placeholders. Sem [definir depois]. Sem [a combinar].
- Você transforma a direção criativa e a copy abaixo em especificações técnicas de implementação.
- O output que você entrega deve poder ser copiado e enviado para outra IA sem nenhuma edição adicional.

**Padrão de qualidade esperado:**
O documento gerado deve orquestrar uma landing page com design editorial de alto padrão — atípico, com personalidade visual forte, fora do visual genérico de IA. Pense Raycast, Linear, Family.co. Layouts com intenção. Tipografia com personalidade. Animações que têm razão de existir. Cada decisão de tipografia, espaçamento, cor e animação deve ser intencional e coesa.

**Sobre o viewport:**
O site não fica preso em um container central. Seções que se beneficiam de ocupar o viewport completo devem fazê-lo — backgrounds que sangram até as bordas, tipografia que respira, imagens que não ficam comprimidas. O container é uma ferramenta de legibilidade, não uma prisão de layout.

**Sobre o mobile:**
Mobile não é adaptação — é o ponto de partida. O design começa em 375px. Cada decisão de tipografia, espaçamento, hierarquia e layout é tomada primeiro para mobile e expandida para desktop.

**Sobre o footer:**
O footer não é um afterthought — é a última impressão. Deve ter identidade visual clara, conectada ao tom da landing page. Hierarquia tipográfica real. Personalidade.

**DNA ADSGATOR — REGRAS INEGOCIÁVEIS DE COPY:**
- Intenção de Busca em Primeiro Lugar — a H1 justifica o clique no anúncio nos primeiros 3 segundos
- Primeira Pessoa Sempre — "eu", "meu", "com você" — nunca terceira pessoa
- Zero Institucional — proibido: "inovador", "excelência", "missão", "visão"
- Comunicação Direta e Realista — sem promessas milagrosas
- Tom Conversacional com Autoridade
- Foco na Ação — cada palavra tem função persuasiva

**STACK TÉCNICA FIXA:**
Astro + Tailwind CSS + GSAP + ScrollTrigger + Framer Motion + Lenis + Web3Forms
Deploy: Vercel (output: 'static')

---

## PARTE 1 — IDENTIDADE DO PROJETO

### Resumo do Projeto

| Campo | Valor |
|---|---|
| **Cliente** | ${b.nome_cliente || '—'} |
| **Marca** | ${b.nome_marca || '—'} |
| **Slug** | ${b.slug || '—'} |
| **Segmento** | ${b.segmento || '—'} |
| **Tipo** | ${b.tipo || '—'} |
| **Objetivo de conversão** | ${b.objetivo_conversao || '—'} |
| **WhatsApp** | ${b.whatsapp || '—'} |
| **E-mail** | ${b.email || '—'} |
| **Horários** | ${b.horarios || '—'} |
| **GTM ID** | ${b.gtm_id || '—'} |
| **Domínio** | ${b.dominio || '—'} |
| **Modalidade** | ${b.modalidade || '—'} |
| **CNPJ** | ${b.cnpj || '—'} |
| **Aviso legal** | ${b.aviso_legal || '—'} |

---

## PARTE 2 — SERVIÇOS E PRODUTO

### Serviço Principal
${b.servico_principal || '—'}

### Todos os Serviços
${b.servicos_lista || '—'}

### Descrição Detalhada
${b.servicos_descricao || '—'}

### Preço
${b.preco_exibir === 'Sim' ? `Exibir preço: ${b.preco_valor || ''} — ${b.preco_condicao || ''}` : 'Não exibir preço'}

### Oferta Especial
${b.oferta_especial || 'Não há'}

---

## PARTE 3 — PÚBLICO-ALVO

### Público Primário
${b.publico_primario || '—'}

### Dor Principal
${b.publico_dor || '—'}

### Resultado Desejado
${b.publico_resultado || '—'}

### Público Secundário
${b.publico_secundario || 'Não definido'}

---

## PARTE 4 — COPY E PERSUASÃO

### Diferencial Real
${b.diferencial || '—'}

### Frase de Impacto
${b.frase_impacto || '—'}

### História / Origem
${b.historia || 'Não fornecida'}

### FAQ — Principais Dúvidas
${b.faq || 'Não fornecido — IA decide baseado no nicho'}

---
```

### `docs\IMPLEMENTACAO-LANDINGAI.md`

> ⚠️ **Truncado:** mostrando primeiras 1000 linhas

```markdown
# LANDINGAI — Documento de Implementação v2
> Stack: Astro · Tailwind · GSAP · Framer Motion · Lenis · Web3Forms  
> Output: Doc 3 (.md) pronto para o Roo implementar  
> Leia tudo antes de escrever uma linha de código.

---

## 1. VISÃO GERAL

O LandingAI é um sistema web de uso interno da Adsgator. Substitui e automatiza a etapa de preenchimento dos Documentos 1 e 2, e usa o Gemini 2.5 Pro para gerar o **Documento 3 — Ficha de Implementação** completo e pronto para o Roo.

### Fluxo de trabalho

```
ANTES (manual):
  Doc 1 → IA gera copy → Doc 2 → IA gera Doc 3 → Roo implementa

COM LANDINGAI:
  Briefing no sistema → Gemini gera Doc 3 → Roo implementa
```

### O que o sistema entrega

| Arquivo | Quando | Descrição |
|---|---|---|
| `briefing-[slug].md` | Sempre (sem API) | Briefing estruturado + prompt completo |
| `doc3-[slug].md` | Com API Gemini | Ficha de Implementação completa para o Roo |

> O sistema **não gera código Astro**. Gera o Doc 3 que o Roo usa para implementar o projeto Astro corretamente.

### Dois modos de operação

**Modo Completo (com API Gemini):** Briefing → Gemini gera Doc 3 → download do `.md`

**Modo Prompt (sem API):** Briefing → download do `briefing-[slug].md` com o prompt estruturado para usar manualmente

---

## 2. ESTRUTURA DE ARQUIVOS DO SISTEMA

```
landingai/
├── index.html          ← App principal (arquivo único)
├── assets/
│   ├── app.css         ← Estilos do sistema
│   └── app.js          ← Lógica completa
├── output/
│   └── .gitkeep        ← Pasta onde os .md gerados são salvos
└── README.md
```

> Sistema 100% browser. Zero build, zero npm, zero backend. Abre com duplo clique.

---

## 3. DESIGN SYSTEM DO APP

### Paleta

```css
:root {
  --bg-base:       #0B0D12;
  --bg-surface:    #13151C;
  --bg-raised:     #1A1D26;
  --bg-overlay:    #21242F;

  --border-subtle: rgba(255,255,255,0.06);
  --border-muted:  rgba(255,255,255,0.10);
  --border-strong: rgba(255,255,255,0.18);

  --text-primary:  #F2F2F4;
  --text-secondary:#9A9CAA;
  --text-tertiary: #5A5C6A;

  --accent:        #00E5A0;
  --accent-dim:    rgba(0,229,160,0.12);
  --accent-border: rgba(0,229,160,0.30);

  --accent2:       #7B8CFF;
  --accent2-dim:   rgba(123,140,255,0.12);
  --accent2-border:rgba(123,140,255,0.30);

  --danger:        #FF6B6B;
  --danger-dim:    rgba(255,107,107,0.10);
  --warning:       #FFB547;
  --warning-dim:   rgba(255,181,71,0.10);

  --r-xs: 4px;
  --r-sm: 8px;
  --r-md: 12px;
  --r-lg: 16px;
  --r-pill: 999px;
}
```

### Tipografia do sistema

```
Display/títulos: 'Syne' (700, 800)
Corpo/labels:    'DM Sans' (300, 400, 500)
Código/mono:     'DM Mono' (400, 500)
```

Import CDN:
```
https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap
```

### Componentes base

**Input/Textarea/Select:**
```css
background: var(--bg-raised);
border: 1px solid var(--border-muted);
border-radius: var(--r-sm);
color: var(--text-primary);
font-family: 'DM Sans', sans-serif;
font-size: 14px;
padding: 11px 14px;
outline: none;
transition: border-color 0.2s, box-shadow 0.2s;

:focus {
  border-color: var(--accent2);
  box-shadow: 0 0 0 3px rgba(123,140,255,0.12);
}
```

**Label:**
```css
font-size: 11px;
font-weight: 500;
text-transform: uppercase;
letter-spacing: 0.07em;
color: var(--text-tertiary);
margin-bottom: 6px;
display: block;
```

**Chip seleção múltipla (.chip):**
```css
padding: 7px 14px;
border: 1px solid var(--border-muted);
border-radius: var(--r-pill);
font-size: 13px;
cursor: pointer;
background: transparent;
color: var(--text-secondary);
transition: all 0.15s;

.chip.on {
  background: var(--accent2-dim);
  border-color: var(--accent2-border);
  color: var(--accent2);
}
```

**Card de seleção única (.sel-card):**
```css
border: 1px solid var(--border-muted);
border-radius: var(--r-md);
padding: 16px 18px;
cursor: pointer;
transition: all 0.15s;
background: var(--bg-surface);

.sel-card.on {
  border-color: var(--accent-border);
  background: var(--accent-dim);
}

.sel-card .card-title {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.sel-card .card-desc {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
}
```

**Botão primário:**
```css
background: var(--accent);
color: #031a10;
font-weight: 600;
padding: 12px 24px;
border-radius: var(--r-pill);
border: none;
cursor: pointer;
transition: opacity 0.15s, transform 0.15s;

:hover { opacity: 0.88; transform: translateY(-1px); }
:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }
```

**Botão ghost:**
```css
background: transparent;
color: var(--text-secondary);
border: 1px solid var(--border-muted);
padding: 11px 20px;
border-radius: var(--r-pill);
cursor: pointer;
transition: all 0.15s;

:hover { color: var(--text-primary); border-color: var(--border-strong); background: var(--bg-raised); }
```

---

## 4. LAYOUT DO APP

```
┌───────────────────────────────────────────────────────────┐
│  SIDEBAR (270px, sticky, altura 100vh)                    │
│  ─────────────────  MAIN (flex:1)                         │
│  Logo                TOPBAR (60px sticky)                 │
│                      ───────────────────────────────────  │
│  ── BRIEFING ──       Título da etapa + subtítulo         │
│  1. Identificação     PROGRESS BAR (2px)                  │
│  2. Negócio           ───────────────────────────────────  │
│  3. Público           CONTEÚDO DA ETAPA (scrollável)      │
│  4. Conversão         max-width: 860px                    │
│  5. Tom de Voz                                            │
│  6. Direção Visual                                        │
│  7. Assets                                                │
│  8. Integrações                                           │
│  ── GERAÇÃO ──                                            │
│  9. Revisar & Gerar                                       │
│                       RODAPÉ DA ETAPA                     │
│  ────────────────     [← Voltar]  [Próximo →]             │
│  Status API                                               │
│  Modo: API / Prompt                                       │
└───────────────────────────────────────────────────────────┘
```

### Estados da sidebar

- **Não visitado:** número cinza, texto cinza
- **Visitado:** check verde (✓), texto branco
- **Ativo:** número accent2 iluminado, fundo levemente claro, texto branco
- **Clicável:** qualquer etapa já visitada pode ser acessada diretamente

---

## 5. ETAPAS DO BRIEFING — ESPECIFICAÇÃO COMPLETA

### ETAPA 1 — Identificação do Projeto

**Objetivo:** Criar a identidade base do projeto que nomeia todos os arquivos gerados.

**Campo: Tipo de projeto** — cards de seleção única, obrigatório

```
[ SERVIÇO ]                         [ PRODUTO ]
Prestação de serviço ou resultado.  Venda de produto físico ou digital.
Ex: clínica, coach, advocacia,      Ex: curso online, suplemento,
    consultoria, adestramento.          software, e-book.
```

**Grid 2 colunas:**

| Campo | Req | Placeholder |
|---|---|---|
| Nome do cliente / projeto | sim | ex: Beatriz Mattos, Clínica Vita |
| Slug do projeto | sim | ex: beatriz-mattos, clinica-vita — auto-gerado do nome, editável |
| Nome da agência responsável | não | ex: Adsgator |
| Data do briefing | sim | auto-preenchido com data atual |

**Campo full-width: Nome do domínio final** (texto)
- Placeholder: `ex: beatrizmattos.com.br, vitaestetica.com.br — só o domínio`
- Usado para gerar sitemap, robots.txt e og:image corretamente

> Ao digitar o nome do cliente, gerar o slug automaticamente (kebab-case, sem acentos). Campo slug editável.

---

### ETAPA 2 — Negócio & Serviço

**Objetivo:** Contextualizar o que é oferecido, como funciona e o posicionamento.

**Grid 2 colunas:**

| Campo | Req | Placeholder |
|---|---|---|
| Nicho / segmento | sim | ex: Adestramento comportamental, Psicologia clínica |
| Serviço ou produto principal | sim | ex: Mentoria online de adestramento individual |
| Objetivo de conversão | sim | ex: Mensagem no WhatsApp, Agendamento, Formulário |
| Cidade / região | sim | ex: São Paulo SP, Online Brasil, Região do ABC |
| Modalidade | sim | chips: Presencial / Online / Híbrido / Domiciliar |

**Se SERVIÇO:**

| Campo | Req | Placeholder |
|---|---|---|
| O que está incluso | sim | ex: 4 sessões online, relatório semanal, grupo de suporte |
| Duração / formato | sim | ex: 8 semanas, sessões de 60min via Zoom |
| Para quem é / pré-requisito | não | ex: Donos com cão acima de 6 meses sem cirurgia recente |
| Garantia oferecida | não | ex: Reembolso integral nos primeiros 7 dias |

**Se PRODUTO:**

| Campo | Req | Placeholder |
|---|---|---|
| O que está incluso | sim | ex: 60 cápsulas, fórmula com 5 ativos patenteados |
| Prazo de entrega | sim | ex: Entrega em até 3 dias úteis para todo Brasil |
| Garantia | sim | ex: 30 dias de garantia incondicional |
| Onde é vendido | sim | ex: Hotmart, loja própria, Amazon |

**Campo full-width: Apresentação do negócio** (textarea, obrigatório)
- Label: `Descreva o negócio com suas próprias palavras — exatamente como explicaria para alguém`
- Placeholder: `O que faz, quem atende, por que existe, qual problema resolve, contexto do mercado...`
- Min-height: 120px

**Campo full-width: Contexto extra / observações** (textarea)
- Label: `O que ficou fora do formulário — nuances da conversa, detalhes do cliente`
- Placeholder: `Informações brutas da reunião, prints de conversa, qualquer contexto adicional`

---

### ETAPA 3 — Público & Intenção de Busca

**Objetivo:** Mapear quem compra e como pensa antes de pesquisar.

**Grid 2 colunas:**

| Campo | Req | Placeholder |
|---|---|---|
| Público primário | sim | ex: Donos de cães com problemas de comportamento |
| Público secundário | não | ex: Adestradores iniciantes buscando mentoria técnica |
| Faixa etária | sim | ex: 28-55 anos, predominantemente 30-45 |
| Perfil socioeconômico | sim | ex: Classe B, renda acima de R$5k/mês |

**Campo: Maturidade do público** — cards seleção única

```
FRIO                  MORNO                 QUENTE              MUITO QUENTE
Não sabe que          Sabe do               Conhece a           Pronto para
tem o problema.       problema, não         solução,            comprar —
Precisa ser           conhece a             compara             precisa do
educado.              solução.              opções.             gatilho.
```

**Campo full-width: Dores principais do público** (textarea, obrigatório)
- Label: `Quais são as dores reais — o que tira o sono, o que já tentou sem sucesso`
- Placeholder: `Liste as principais dores. Ex:\n- Cão late o dia todo e reclamação de vizinhos\n- Já contratou 3 adestradores sem resultado duradouro\n- Medo de que o comportamento piore com o tempo`

**Campo full-width: Palavras de busca** (textarea, obrigatório)
- Label: `Como o público pesquisa no Google — o vocabulário real, não o técnico`
- Placeholder: `ex: "adestrador de cão online", "como parar meu cachorro de latir", "adestramento comportamental preço"`

**Campo full-width: Resultado desejado pelo público** (textarea, obrigatório)
- Label: `O que o cliente imagina conquistar — o sonho concreto`
- Placeholder: `ex: Ter um cão tranquilo que obedece sem precisar gritar, poder levar para lugares públicos sem vergonha`

**Campo full-width: Objeções principais** (textarea, obrigatório)
- Label: `Por que o cliente ideal ainda NÃO contratou / comprou?`
- Placeholder: `Liste as objeções reais. Ex:\n- Acha que o cão é muito velho para aprender\n- Preço parece alto sem saber o que está pagando\n- Já tentou antes e não funcionou\n- Não sabe se funciona online`

---

### ETAPA 4 — Conversão & Rastreamento

**Objetivo:** Definir os dados técnicos de conversão que alimentam o Doc 3.

**Campo: Tipo de CTA principal** — cards seleção única, obrigatório

```
WHATSAPP               FORMULÁRIO             AGENDAMENTO
Link wa.me com         Web3Forms com          Link externo
mensagem               email de destino       Calendly/similar
pré-preenchida.        e notificação.         ou embed.
```

**Se WHATSAPP:**

| Campo | Req | Placeholder |
|---|---|---|
| Número WhatsApp (DDI+DDD+número) | sim | ex: 5511918952921 — só números |
| Mensagem pré-preenchida | sim | ex: Olá! Vi o site e quero saber mais sobre a mentoria. |

> Gerar preview do link: `wa.me/[número]?text=[mensagem codificada em URL]`

**Se FORMULÁRIO (Web3Forms):**

| Campo | Req | Placeholder |
|---|---|---|
| Email de destino (notificações) | sim | ex: contato@empresa.com.br |
| Access Key Web3Forms | não | ex: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
| Campos do formulário | não | chips: Nome / Email / Telefone / Mensagem / Serviço de interesse |
| Redirect após envio | não | ex: /obrigado — deixar vazio para mensagem inline |

> Link para obter access key: `https://web3forms.com`

**Se AGENDAMENTO:**

| Campo | Req | Placeholder |
|---|---|---|
| Link de agendamento | sim | ex: https://calendly.com/... |
| Abrir em: | sim | chips: Nova aba / Embed na página |

**Grid 2 colunas — sempre:**

| Campo | Req | Placeholder |
|---|---|---|
| ID do Google Tag Manager | não | ex: GTM-XXXXXXX |
| Telefone para ligação (opcional) | não | ex: (11) 99999-0000 |

**Campo: CTAs de rastreamento** — chips seleção múltipla
```
contato_wpp (padrão)    view_content    view_links    agendamento_iniciado
formulario_enviado      ligacao_mobile  download
```

**Campo full-width: Texto do botão principal** (texto, obrigatório)
- Placeholder: `ex: Quero Iniciar a Mentoria, Agendar Avaliação Gratuita, Falar com Especialista`

**Campo: Micro-garantias do CTA** (texto)
- Placeholder: `ex: ✓ Resposta em até 1h ✓ Sem compromisso ✓ Atendimento personalizado`

---

### ETAPA 5 — Tom de Voz

**Objetivo:** Capturar a voz da marca para que o Doc 3 instrua o copywriting corretamente.

**Campo full-width: Personalidade da marca** (texto, obrigatório)
- Placeholder: `ex: Técnico e direto / Acolhedor e empático / Premium e discreto / Especialista que fala sem rodeios`

**Campo full-width: Vocabulário que DEVE aparecer na copy** (textarea)
- Label: `Palavras e expressões que o cliente usa — vêm da conversa, não do formulário`
- Placeholder: `ex: "manejo", "vínculo", "comportamento", "marcadores", "autonomia do animal"`

**Campo full-width: Vocabulário PROIBIDO** (textarea)
- Label: `O que o cliente jamais diria — palavras que quebram a identidade`
- Placeholder: `ex: "pet", "fofo", "amiguinho", "tutor consciente", "jornada", "transforme"`

**Campo: Frase que resume o tom** (texto)
- Placeholder: `ex: Especialista que já viu tudo e fala sem rodeios / Quem cuida sem enrolar`

**Campo: Proibições de copy — DNA Adsgator** (leitura, não editável)

> Exibir como bloco informativo fixo (não é campo de input):

```
DNA ADSGATOR — SEMPRE APLICADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✗  "inovador", "excelência", "missão", "visão"
✗  "somos apaixonados por", "comprometidos com"
✗  "resultados extraordinários", "transforme sua vida"
✗  "saiba mais", "clique aqui", "entre em contato"
✗  Inventar depoimentos, avaliações ou notas
✗  Blocos sem sustentação no briefing
✗  Promessas sem base real

✓  H1 espelha a dor da busca nos primeiros 3 segundos
✓  Vender o alívio da dor, não o nome técnico
✓  Especialista conversando olho no olho
✓  Cada palavra tem função persuasiva
```

---

### ETAPA 6 — Direção Visual & Design

**Objetivo:** Capturar as decisões visuais que definem a identidade do projeto.

**Campo: Intensidade visual** — cards seleção única, obrigatório

```
CONTIDO                  MÉDIO                    ALTO
Animações sutis.         Presença notável.         Efeito uau total.
Foco na copy.            Personalidade             Scroll experience,
Elegância pela           clara sem                 transições que
ausência.                exagero.                  definem o site.
```

**Campo: Tema** — chips seleção única
```
Claro  |  Escuro  |  IA decide com base nas referências
```

**Campo full-width: Referências visuais** (textarea, obrigatório)
- Label: `Links ou descrições — para cada uma, diga em 1 linha o que te atraiu`
- Placeholder: `Referência 1: functionhealth.com\nO que me atraiu: tipografia com serifa, off-white, blocos limpos\n\nReferência 2: outseta.com\nO que me atraiu: elementos manuais, setas Caveat, toque humano`

**Grid 2 colunas — cores:**

| Campo | Req | Placeholder |
|---|---|---|
| Cor principal da marca | sim | ex: #1A4731 ou "sem identidade definida" |
| Cor secundária | não | ex: #C9A84C ou "não existe" |
| Logo disponível | sim | chips: SVG / PNG / Não tem |
| Observações de cor | não | ex: Cliente usa muito preto, evitar cores vibrantes |

**Campo full-width: Estilo geral** (texto, obrigatório)
- Label: `Descreva como você quer que o site pareça — sem termos técnicos`
- Placeholder: `ex: Sóbrio e técnico, algo próximo de uma marca premium europeia, sem parecer infoproduto`

**Campo full-width: O que NÃO quero** (texto, obrigatório)
- Placeholder: `ex: Nada que pareça clínica genérica / sem visual de pet shop / sem rosa / sem gradiente roxo`

**Campo: Menu mobile** — cards seleção única

```
FULLSCREEN OVERLAY       DRAWER LATERAL         BOTTOM SHEET
Abre em tela cheia       Desliza da lateral.    Sobe do rodapé.
com animação.            Mais familiar.         Moderno, mobile-first.
Impacto máximo.          

IA DECIDE
Com base nas referências e intensidade visual.
```

**Campo: Elemento especial no menu** (texto)
- Placeholder: `ex: Número de telefone em destaque / Foto do profissional / Frase de impacto / Nenhum`

---

### ETAPA 7 — Assets Disponíveis

**Objetivo:** Informar o que existe de material para que o Doc 3 especifique corretamente.

**Grid 2 colunas:**

| Campo | Tipo | Placeholder |
|---|---|---|
| Foto do profissional / produto | select | Sim — alta qualidade / Sim — qualidade média / Não tem |
| Logo da marca | select | Sim — SVG / Sim — PNG / Não tem |
| Depoimentos de clientes | select | Sim — texto / Sim — print / Sim — vídeo / Não tem |
| Perfil Google Business | select | Sim / Não |
| Se sim, nota e nº de avaliações | texto | ex: 4.8 estrelas com 127 avaliações |
| Perfil Instagram | select | Sim — ativo e relevante / Sim — pouco ativo / Não |
| Se sim, @ do perfil | texto | ex: @abeak9 |
| Endereço físico | select | Sim / Não |
| Se sim, endereço completo | texto | ex: Rua das Flores, 123 — Pinheiros, São Paulo SP |
| Outros assets | textarea | ex: Vídeo de apresentação, certificados em PDF, fotos do espaço |

> **Regra de negócio visual:** Se Google Business = Não → bloco Avaliações Google não é incluído no Doc 3. Se Instagram = Não ou pouco ativo → Feed Instagram não incluído. Aplicar esta lógica automaticamente ao gerar o prompt.

---

### ETAPA 8 — Integrações

**Objetivo:** Confirmar quais blocos técnicos entram no projeto.

**Checkboxes — marcar apenas o confirmado:**

```
[ ] Google Maps embed — endereço presencial confirmado (etapa 7)
[ ] Google Reviews widget — perfil Google com ≥ 10 avaliações confirmado (etapa 7)
[ ] Feed Instagram — perfil ativo confirmado (etapa 7)
[ ] Formulário Web3Forms — CTA formulário selecionado (etapa 4)
[ ] Botão WhatsApp flutuante — padrão Adsgator, sempre recomendado
[ ] Botão ligação mobile — se telefone foi informado (etapa 4)
[ ] Planos e preços — se cliente forneceu valores e autorizou exibição
[ ] Seção FAQ — se objeções fortes documentadas (etapa 3)
[ ] Contador regressivo — se há prazo ou oferta com data
[ ] Seção Como Funciona — se o processo reduz objeção de "como é isso?"
```

**Campo: Informações de preço / planos** (textarea — exibir apenas se "Planos e preços" marcado)
- Placeholder: `Descreva os planos com valores. Ex:\nPlano Básico — R$497/mês — 2 sessões\nPlano Completo — R$897/mês — 4 sessões + grupo de suporte`

**Campo: Observações técnicas finais** (textarea)
- Placeholder: `Qualquer detalhe técnico adicional: redirecionamentos, subdomínio, integração específica, restrições de deploy`

---

### ETAPA 9 — Revisar & Gerar

**Objetivo:** Validar, revisar e acionar a geração do Doc 3.

**Layout desta etapa:**

**1. Card de validação** — exibir apenas se há campos obrigatórios vazios
- Fundo danger-dim, border danger, lista dos campos pendentes

**2. Resumo do projeto** — grid 3 colunas com cards de todos os campos preenchidos
- Cada card: label em cima + valor em baixo
- Cards clicáveis que voltam para a etapa correspondente

**3. Blocos confirmados** — lista visual dos blocos que entrarão no Doc 3
- Baseado nas respostas das etapas 7 e 8
- Cada item com ícone de check verde

**4. Preview do prompt** — accordion expansível
- Mostra o prompt completo que será enviado ao Gemini
- Botão de copiar
- Label: "Prompt que será enviado ao Gemini"

**5. Configuração da API:**

```
┌────────────────────────────────────────────────────────┐
│  API KEY — GEMINI                                      │
│  Obter chave: aistudio.google.com/app/apikey           │
│                                                        │
│  [••••••••••••••••••••••••]  [👁]  [Salvar]           │
│                                                        │
│  ● API configurada e pronta        ← se válida         │
│  ○ Sem API — modo prompt apenas    ← se vazia          │
└────────────────────────────────────────────────────────┘
```

**6. Botões de ação:**

```
[⬇ Baixar briefing-[slug].md]     [⚡ Gerar Doc 3 com Gemini]
```

- "Baixar briefing" funciona sempre — sem API
- "Gerar Doc 3" requer API key — abre painel de geração

---

## 6. PAINEL DE GERAÇÃO

Modal fullscreen que aparece ao clicar em "Gerar Doc 3".

```
┌──────────────────────────────────────────────────────────┐
│  ⚡ Gerando Doc 3 — [Nome do Cliente]          [× fechar]│
├──────────────────────────────────────────────────────────┤
│                                                          │
│  PROGRESSO  ████████████████░░░░░░░░  75%               │
│                                                          │
│  ✓  Compilando briefing...                               │
│  ✓  Analisando intenção de busca...                      │
│  ⟳  Gerando metadados SEO e fluxo de blocos...          │
│  ○  Construindo especificação por seção...               │
│  ○  Finalizando checklists e assets...                   │
│                                                          │
│  ─────────────────────────────────────────────────────  │
│  O Gemini 2.5 Pro está gerando a Ficha de               │
│  Implementação completa. Isso leva ~30-60 segundos.      │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  [⬇ Baixar doc3-[slug].md quando pronto]                 │
└──────────────────────────────────────────────────────────┘
```

### Comportamento

- Uma única chamada à API do Gemini para gerar o Doc 3 completo
- Usar `max_tokens: 16000` — o Doc 3 é longo
- Após receber a resposta, oferecer download imediato do `.md`
- Em caso de erro, mostrar mensagem clara e botão "Tentar novamente"
- Sempre oferecer download do `briefing-[slug].md` como fallback

---

## 7. INTEGRAÇÃO COM GEMINI API

### Endpoint e modelo

```javascript
const GEMINI_MODEL    = 'gemini-2.5-pro';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
```

### Função de chamada

```javascript
async function callGemini(apiKey, prompt) {
  const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 16000,
        temperature: 0.65,
        topP: 0.95,
      }
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || `Erro HTTP ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Resposta vazia da API');
  return text;
}
```

### Tratamento de erros

```javascript
// Exibir no painel de geração — mensagens amigáveis
const ERROR_MESSAGES = {
  429: 'Limite de requisições atingido. Aguarde alguns segundos e tente novamente.',
  400: 'Problema no prompt. Verifique se todos os campos obrigatórios estão preenchidos.',
  403: 'API Key inválida ou sem permissão. Verifique a chave em aistudio.google.com',
  500: 'Erro interno do Gemini. Tente novamente em instantes.',
};
```

---

## 8. PROMPT MESTRE — GERADOR DO DOC 3

Este é o prompt completo enviado ao Gemini. Todos os `[campos]` são substituídos pelos valores do briefing.

```
Você é um Diretor de Arte, UI Designer de elite e Engenheiro Front-end Sênior,
trabalhando para a agência Adsgator.

Sua missão é ler o briefing abaixo na íntegra e gerar como output o
**Documento 3 — Ficha de Implementação**, completo, específico e pronto para
ser enviado ao Roo Code implementar a landing page.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGRAS QUE VOCÊ NUNCA VIOLA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Você toma todas as decisões de design que não estão explicitadas:
   tipografia, escala, tokens, animações, layout de cada seção.

2. Você preenche TODOS os campos do Doc 3 com valores concretos.
   Sem placeholders. Sem "[definir depois]". Sem "[a combinar]".

3. O output deve poder ser copiado e enviado ao Roo sem nenhuma edição.

4. Padrão de qualidade: design editorial de alto padrão.
   Pense Raycast, Linear, Family.co. Layouts com intenção.
   Tipografia com personalidade. Animações com razão de existir.
   O site não pode parecer gerado por IA nem template genérico.

5. DNA ADSGATOR — REGRAS INEGOCIÁVEIS DE COPY:
   ✗ Proibido: "inovador", "excelência", "missão", "visão", "somos apaixonados",
     "comprometidos com", "resultados extraordinários", "transforme sua vida"
   ✗ Proibido: "saiba mais", "clique aqui", "solicite um orçamento", "entre em contato"
   ✗ Proibido: inventar depoimentos, avaliações, notas ou qualquer dado não confirmado
   ✗ Proibido: incluir bloco de integração sem o ativo digital confirmado no briefing
   ✓ H1 espelha a Dor #1 do usuário nos primeiros 3 segundos
   ✓ Vender o alívio da dor, não o nome técnico do serviço
   ✓ Especialista conversando olho no olho — firmeza sem arrogância
   ✓ Cada palavra tem função persuasiva — zero texto decorativo

6. STACK TÉCNICA FIXA (nunca propor alternativas):
   Astro + Tailwind CSS + GSAP + ScrollTrigger + Framer Motion + Lenis

7. FORMULÁRIO: usar Web3Forms (não Resend, não Formspree, não EmailJS).
   Access key via .env. Nunca hardcoded.

8. DEPLOY ALVO: Vercel (output: 'static') ou Netlify.

9. REGRAS ABSOLUTAS DE CÓDIGO:
   - Zero HEX hardcoded — sempre via token Tailwind em tailwind.config.js
   - Zero console.log em produção
   - Zero imagem sem width e height definidos
   - Zero animação sem prefers-reduced-motion check
   - Zero credencial hardcoded — sempre via .env
   - Zero <form> HTML nativo em islands React — usar event handlers
   - Zero <div> clicável — usar <button> ou <a>
   - <h1> única por página — sempre no Hero
   - Hierarquia h1 → h2 → h3 — nunca pular nível

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BRIEFING COMPLETO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IDENTIFICAÇÃO:
- Cliente: [nome_cliente]
- Slug: [slug]
- Tipo: [tipo — Serviço / Produto]
- Domínio: [dominio]
- Data: [data]

NEGÓCIO:
- Nicho: [nicho]
- Serviço/Produto principal: [servico_produto]
- Objetivo de conversão: [objetivo_conversao]
- Cidade/Região: [cidade]
- Modalidade: [modalidade]
- O que está incluso: [incluso]
- Duração/Formato: [duracao]
- Garantia: [garantia]
- Apresentação: [apresentacao]
- Contexto extra: [contexto_extra]

PÚBLICO:
- Público primário: [publico_primario]
- Público secundário: [publico_secundario]
- Faixa etária: [faixa_etaria]
- Perfil socioeconômico: [perfil_socioeconomico]
- Maturidade: [maturidade]
- Dores principais: [dores]
- Palavras de busca: [palavras_busca]
- Resultado desejado: [resultado_desejado]
- Objeções: [objecoes]

CONVERSÃO:
- Tipo de CTA: [tipo_cta]
- Número WhatsApp: [whatsapp]
- Mensagem pré-preenchida: [mensagem_whatsapp]
- Email formulário: [email_formulario]
- Access Key Web3Forms: [web3forms_key]
- Campos do formulário: [campos_formulario]
- GTM ID: [gtm_id]
- Telefone: [telefone]
- Texto do botão principal: [texto_botao]
- Micro-garantias: [micro_garantias]
- CTAs de rastreamento: [ctas_rastreamento]

TOM DE VOZ:
- Personalidade: [personalidade]
- Vocabulário que usa: [vocab_usa]
- Vocabulário proibido: [vocab_proibido]
- Frase do tom: [frase_tom]

DIREÇÃO VISUAL:
- Intensidade: [intensidade]
- Tema: [tema]
- Referências: [referencias]
- Cor principal: [cor_principal]
- Cor secundária: [cor_secundaria]
- Logo: [logo]
- Estilo geral: [estilo_geral]
- O que não quero: [o_que_nao_quero]
- Menu mobile: [menu_mobile]
- Elemento especial menu: [elemento_menu]

ASSETS:
- Foto profissional/produto: [foto]
- Logo: [logo_status]
- Depoimentos: [depoimentos]
- Google Business: [google_business]
- Nota/avaliações Google: [nota_google]
- Instagram: [instagram]
- @ Instagram: [instagram_handle]
- Endereço: [endereco]
- Endereço completo: [endereco_completo]

INTEGRAÇÕES CONFIRMADAS:
[lista das integrações marcadas]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORMATO DE ENTREGA — DOCUMENTO 3
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Gere o documento exatamente nesta estrutura. Sem resumir. Sem pular seções.

# [Nome Cliente] — Ficha de Implementação

> Documento 3 de 3 — Adsgator
> Gerado a partir do briefing completo pelo LandingAI.
> Copie, cole no Roo e execute — sem edições adicionais,
> exceto os campos listados na Seção 12.

---

## INSTRUÇÃO MESTRE

[Instrução objetiva para o Roo contextualizando o projeto,
reforçando regras absolutas e definindo padrão de qualidade.
Mencionar: stack, deploy, tracking, acessibilidade, prefers-reduced-motion, asset paths.
Mencionar que formulário usa Web3Forms (se aplicável).]

---

## 1. VISÃO GERAL

| Campo | Valor |
|---|---|
| Cliente | [valor] |
| Domínio | [valor] |
| Nicho | [valor] |
| Serviço principal | [valor] |
| Objetivo de conversão | [valor] |
| CTA principal | [valor] |
| WhatsApp | [valor — formato: wa.me/55XXXXXXXXXX] |
| Mensagem WPP codificada | [valor — URL encoded] |
| Link CTA completo | [valor — wa.me completo ou link formulário] |
| Modalidade | [valor] |
| GTM ID | [valor ou "A inserir — ver Seção 12"] |

---

## 2. ANÁLISE DE INTENÇÃO DE BUSCA

[Mapear as 3 dores principais do usuário que pesquisa por este serviço.
Para cada dor:
- Dor real: o que o usuário sente / problema concreto
- Palavra de busca: como ele digita no Google (não o técnico)
- Resultado desejado: o que imagina conquistar
Confirmar que a H1 gerada espelha diretamente a Dor #1.]

---

## 3. METADADOS DE SEO

Landing page (index.astro):
  <title>: "[máximo 60 caracteres — palavra-chave + cidade se local]"
  <meta name="description" content="[máximo 160 caracteres — dor + benefício + CTA implícito]">
  <meta name="keywords" content="[5-8 termos relevantes]">
  <meta property="og:title" content="[igual ou adaptado do title]">
  <meta property="og:description" content="[igual ou adaptado da description]">
  <meta property="og:image" content="/assets/images/og-image.webp">
  <meta property="og:url" content="https://[domínio]">
  <link rel="canonical" href="https://[domínio]">

/links (links/index.astro):
  <title>: "[máximo 60 caracteres]"
  <meta name="description" content="[máximo 100 caracteres — foco em conversão direta]">
  <meta name="robots" content="noindex">

/politica-de-privacidade:
  <title>: "Política de Privacidade — [Nome Cliente]"
  <meta name="robots" content="noindex">

/404:
  <meta name="robots" content="noindex">

---

## 4. STACK TÉCNICA

[Stack confirmada para este projeto com decisões específicas:
- Confirmar uso de React (sim/não — justificar quais componentes precisam de ilha)
- Confirmar GSAP (quais seções usam)
- Confirmar Framer Motion (quais componentes)
- Confirmar Lenis
- Confirmar Web3Forms se formulário ativo
- Versões dos packages: Astro ^4.x, Tailwind ^3.x, GSAP ^3.x]

### package.json — dependências completas

[JSON completo do package.json com todas as dependências necessárias para este projeto]

### astro.config.mjs — completo

[Código completo do astro.config.mjs com:
- output: 'static'
- site: 'https://[domínio]'
- integrations: tailwind, sitemap (com excludes)
- vite alias ~]

### .env.example — completo

[Todas as variáveis com comentário — sem valores reais:
GTM_ID=GTM-XXXXXXX
WHATSAPP_NUMBER=
WEB3FORMS_ACCESS_KEY= (se formulário)
INSTAGRAM_TOKEN= (se feed)
GOOGLE_MAPS_API_KEY= (se mapa)]

### robots.txt

[Conteúdo completo do public/robots.txt]

---

## 5. SISTEMA DE DESIGN

### tailwind.config.js — completo

[Arquivo completo com:
- colors: tokens com HEX reais decididos pela IA — mínimo: primary, secondary,
  background, surface, text-dark, text-light, text-muted, border
- fontFamily: heading, display, sans, mono (conforme fontes escolhidas)
- fontSize: escala customizada com clamp() reais
- spacing: tokens extras se necessário
- borderRadius: tokens para botões, cards, avatares
- maxWidth, height: tokens customizados se necessário]

### Tipografia — decisão completa

[Fontes escolhidas com justificativa de 1 linha cada.
Instalação via npm @fontsource:
  npm install @fontsource/[fonte-1] @fontsource/[fonte-2]
Importação no Layout.astro:
  import '@fontsource/[fonte]/[peso].css'
Escala de tamanhos com clamp() reais para cada nível]

### Ícones

[Biblioteca: lucide-react (padrão) ou heroicons — definir uma só.
Estilo: outline ou solid — manter em 100% das instâncias.
strokeWidth: [valor concreto — ex: 1.5]
Tamanho padrão: [ex: 20px — h-5 w-5]]

### Sistema de Animação

[Tokens GSAP para este projeto:
- Duração padrão por tipo de elemento
- Easing padrão
- Delay de stagger
- Trigger de ScrollTrigger (start, end)
```

### `docs\LANDINGAI-V2-IMPLEMENTACAO.md`

> ⚠️ **Truncado:** mostrando primeiras 1000 linhas

```markdown
# LandingAI v2 — Documentação de Implementação
> Adsgator · Sistema Interno · Uso Solo  
> Stack: HTML + CSS + Vanilla JS (zero build, zero npm, abre com duplo clique)  
> Output: DOC-1 formatado + DOC-IMPL (se API ativa)  
> Leia tudo antes de escrever uma linha de código.

---

## 1. VISÃO GERAL

### O que é o LandingAI v2

Sistema web interno da Adsgator para criação de landing pages premium. Substitui o processo manual de preenchimento de documentos, centralizando tudo em uma interface visual guiada, com validação inteligente e geração de documentação via IA.

### Fluxo de Trabalho

```
ANTES (manual):
  Briefing bruto → Doc 1 (IA gera copy) → Doc 2 (você preenche direção) → IA gera Doc Impl → Roo implementa

COM LANDINGAI v2:
  Formulário multi-step → Validação → DOC-1 formatado
    ↓ Rota Manual:    Baixa DOC-1 → Claude gera DOC-IMPL → IDE implementa
    ↓ Rota Auto:      API chama IA → IA gera DOC-IMPL → Download + Preview
```

### O que o sistema entrega

| Arquivo | Quando | Descrição |
|---|---|---|
| `doc1-[slug].md` | Sempre (ambas as rotas) | Briefing estruturado + direção visual completa — pronto para IA |
| `doc-impl-[slug].md` | Rota automática (API) | Ficha de Implementação completa para IDE |

### Dois modos de operação

**Modo Manual (sem API):**
- Preenche → Valida → Baixa `doc1-[slug].md` → Você envia para Claude → Claude gera DOC-IMPL

**Modo Automático (com API):**
- Preenche → Valida → Clica "Gerar DOC-IMPL" → IA processa → Download `doc-impl-[slug].md` + Preview

---

## 2. ARQUITETURA TÉCNICA

### Stack

```
Sistema 100% browser — zero build, zero npm, zero backend
Abre com duplo clique no index.html
```

| Camada | Tecnologia | Justificativa |
|---|---|---|
| HTML | Único arquivo `index.html` | Portabilidade total |
| CSS | `assets/app.css` | Design system proprietário |
| JS | `assets/app.js` | Lógica completa do app |
| Armazenamento | `localStorage` | Persistência local sem servidor |
| APIs | Fetch nativo | Gemini, Claude, Grok, Mistral |
| Ícones | Lucide Icons (CDN) | Modernos, SVG-based, consistentes |
| Fontes | Google Fonts (CDN) | Syne + DM Sans + DM Mono |

### Estrutura de Arquivos

```
landingai/
├── index.html              ← App principal
├── assets/
│   ├── app.css             ← Design system + estilos
│   └── app.js              ← Lógica completa (App object)
├── output/
│   └── .gitkeep            ← Arquivos .md gerados aqui
└── README.md
```

### Estrutura do App Object (JavaScript)

```javascript
const App = {
  // Estado global
  state: {
    currentStep: 1,
    totalSteps: 9,
    projects: {},          // Todos os projetos salvos
    activeProjectId: null, // Projeto ativo
    visitedSteps: new Set(),
    apiKeys: {
      gemini: '',
      claude: '',
      grok: '',
      mistral: ''
    },
    selectedModel: 'gemini-2.5-flash',
    isGenerating: false,
    generationLog: [],
    lastError: null
  },

  // Briefing ativo (projeto em edição)
  briefing: { /* campos — ver Seção 5 */ },

  // Métodos de ciclo de vida
  init(),
  render(),
  destroy(),

  // Navegação
  goToStep(n),
  goToProject(id),

  // Projetos
  createProject(),
  saveProject(),
  loadProject(id),
  cloneProject(id),
  deleteProject(id),
  listProjects(),

  // Formulário
  setField(field, val),
  toggleArrayField(field, val),
  updateName(val),
  sanitizeSlug(val),

  // Validação
  validateStep(n),
  validateAll(),
  getFieldScore(field),
  getStepScore(n),
  getTotalScore(),
  getWarnings(),
  getCriticalMissing(),

  // Geração de documento
  buildDoc1(),           // Compila o DOC-1 em markdown
  buildMasterPrompt(),   // Prompt para IA gerar DOC-IMPL
  downloadDoc1(),        // Rota manual

  // APIs de IA
  generateDocImpl(),     // Orquestra geração
  callGemini(prompt),
  callClaude(prompt),
  callGrok(prompt),
  callMistral(prompt),
  updateGenProgress(step, icon, label),
  showGenError(err),

  // Preview
  generatePreview(docImpl), // Gera mockup HTML a partir do DOC-IMPL

  // Persistência
  autosave(),
  checkDraft(),
  exportProject(),
  importProject(),

  // UI helpers
  renderSidebar(),
  renderTopbar(),
  renderStepContent(),
  syncFieldValues(container),
  showToast(msg, type),
  showNotification(title, msg),  // Windows Notification API
  openModal(id),
  closeModal(id)
}
```

---

## 3. DESIGN SYSTEM

### Paleta de Cores

```css
:root {
  /* Backgrounds */
  --bg-base:       #08090E;   /* Fundo global — quase preto */
  --bg-surface:    #0F1118;   /* Cards, sidebar */
  --bg-raised:     #161922;   /* Inputs, campos */
  --bg-overlay:    #1E2130;   /* Hover states, tooltips */

  /* Bordas */
  --border-subtle: rgba(255,255,255,0.04);
  --border-muted:  rgba(255,255,255,0.08);
  --border-default:rgba(255,255,255,0.13);
  --border-strong: rgba(255,255,255,0.22);

  /* Textos */
  --text-primary:  #EEEEF2;
  --text-secondary:#8A8C9E;
  --text-tertiary: #4A4C5E;
  --text-disabled: #2E3040;

  /* Accent Verde — Adsgator */
  --accent:        #00E5A0;
  --accent-hover:  #00FFAF;
  --accent-dim:    rgba(0,229,160,0.10);
  --accent-glow:   rgba(0,229,160,0.20);
  --accent-border: rgba(0,229,160,0.28);

  /* Accent Azul — Elementos secundários */
  --accent2:        #7B8CFF;
  --accent2-hover:  #8F9FFF;
  --accent2-dim:    rgba(123,140,255,0.10);
  --accent2-border: rgba(123,140,255,0.28);

  /* Semântico */
  --danger:        #FF5C5C;
  --danger-dim:    rgba(255,92,92,0.10);
  --danger-border: rgba(255,92,92,0.25);
  --warning:       #FFB547;
  --warning-dim:   rgba(255,181,71,0.10);
  --warning-border:rgba(255,181,71,0.25);
  --success:       #00E5A0;
  --success-dim:   rgba(0,229,160,0.10);

  /* Raios de borda */
  --r-xs:  3px;
  --r-sm:  7px;
  --r-md:  12px;
  --r-lg:  18px;
  --r-xl:  24px;
  --r-pill:999px;

  /* Sombras */
  --shadow-sm:  0 1px 3px rgba(0,0,0,0.4);
  --shadow-md:  0 4px 12px rgba(0,0,0,0.5);
  --shadow-lg:  0 8px 24px rgba(0,0,0,0.6);
  --shadow-glow:0 0 24px rgba(0,229,160,0.15);

  /* Transições */
  --ease-fast:  0.12s ease;
  --ease-base:  0.20s ease;
  --ease-slow:  0.35s ease;
  --ease-spring:0.25s cubic-bezier(0.34,1.56,0.64,1);
}
```

### Tipografia

```css
/* Import CDN */
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

/* Aplicação */
:root {
  --font-display: 'Syne', sans-serif;     /* Títulos, logo, stepNames */
  --font-body:    'DM Sans', sans-serif;  /* Labels, inputs, texto geral */
  --font-mono:    'DM Mono', monospace;   /* Código, slugs, IDs */
}
```

### Ícones — Lucide Icons

```html
<!-- CDN no <head> -->
<script src="https://unpkg.com/lucide@latest"></script>

<!-- Uso no HTML -->
<i data-lucide="zap" class="icon"></i>
<i data-lucide="check-circle" class="icon icon--success"></i>

<!-- Inicializar após render -->
<script>lucide.createIcons();</script>
```

**Ícones utilizados por contexto:**

| Contexto | Ícone Lucide | Classe |
|---|---|---|
| Novo projeto | `plus-circle` | `.icon` |
| Salvar | `save` | `.icon` |
| Download | `download` | `.icon` |
| Gerar (IA) | `zap` | `.icon--accent` |
| Sucesso | `check-circle` | `.icon--success` |
| Erro | `alert-circle` | `.icon--danger` |
| Aviso | `alert-triangle` | `.icon--warning` |
| Carregando | `loader-2` (spin) | `.icon--spin` |
| Projeto | `layout-template` | `.icon` |
| Configurações | `settings` | `.icon` |
| API Key | `key` | `.icon` |
| Modelos IA | `cpu` | `.icon` |
| Preview | `eye` | `.icon` |
| Versão | `git-branch` | `.icon` |
| Clonar | `copy` | `.icon` |
| Deletar | `trash-2` | `.icon--danger` |
| Steps completados | `check` | `.icon--success` |
| Steps com erro | `x` | `.icon--danger` |
| Steps em progresso | `circle` | `.icon--muted` |

### Componentes Base

```css
/* === INPUTS === */
.field-input,
.field-textarea,
.field-select {
  background: var(--bg-raised);
  border: 1px solid var(--border-default);
  border-radius: var(--r-sm);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 14px;
  padding: 11px 14px;
  width: 100%;
  outline: none;
  transition: border-color var(--ease-base), box-shadow var(--ease-base);
}

.field-input:focus,
.field-textarea:focus,
.field-select:focus {
  border-color: var(--accent2);
  box-shadow: 0 0 0 3px var(--accent2-dim);
}

.field-input.has-error {
  border-color: var(--danger);
  box-shadow: 0 0 0 3px var(--danger-dim);
}

.field-input.has-warning {
  border-color: var(--warning);
  box-shadow: 0 0 0 3px var(--warning-dim);
}

.field-textarea { resize: vertical; min-height: 100px; line-height: 1.6; }

/* === LABEL === */
.field-label {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-tertiary);
  margin-bottom: 7px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.field-label .required { color: var(--danger); }
.field-label .optional { color: var(--text-disabled); font-weight: 400; text-transform: none; letter-spacing: 0; font-size: 10px; }

/* === CHIPS (seleção múltipla) === */
.chip-group { display: flex; flex-wrap: wrap; gap: 8px; }

.chip {
  padding: 7px 14px;
  border: 1px solid var(--border-default);
  border-radius: var(--r-pill);
  font-family: var(--font-body);
  font-size: 13px;
  cursor: pointer;
  background: transparent;
  color: var(--text-secondary);
  transition: all var(--ease-base);
  user-select: none;
}

.chip:hover { color: var(--text-primary); border-color: var(--border-strong); background: var(--bg-overlay); }

.chip.on {
  background: var(--accent2-dim);
  border-color: var(--accent2-border);
  color: var(--accent2);
}

/* === SEL-CARDS (seleção única) === */
.sel-card {
  border: 1px solid var(--border-default);
  border-radius: var(--r-md);
  padding: 16px 18px;
  cursor: pointer;
  transition: all var(--ease-base);
  background: var(--bg-surface);
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.sel-card:hover { border-color: var(--border-strong); background: var(--bg-overlay); }

.sel-card.on {
  border-color: var(--accent-border);
  background: var(--accent-dim);
  box-shadow: 0 0 0 1px var(--accent-border);
}

.sel-card .card-icon { flex-shrink: 0; color: var(--text-tertiary); }
.sel-card.on .card-icon { color: var(--accent); }
.sel-card .card-title { font-family: var(--font-display); font-weight: 700; font-size: 14px; color: var(--text-primary); margin-bottom: 3px; }
.sel-card .card-desc { font-size: 12px; color: var(--text-secondary); line-height: 1.5; }

/* === BOTÃO PRIMÁRIO === */
.btn-primary {
  background: var(--accent);
  color: #031a10;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 14px;
  padding: 12px 24px;
  border-radius: var(--r-pill);
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: opacity var(--ease-base), transform var(--ease-spring), box-shadow var(--ease-base);
}

.btn-primary:hover { opacity: 0.88; transform: translateY(-1px); box-shadow: var(--shadow-glow); }
.btn-primary:active { transform: translateY(0); }
.btn-primary:disabled { opacity: 0.3; cursor: not-allowed; transform: none; box-shadow: none; }

/* === BOTÃO GHOST === */
.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-default);
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 14px;
  padding: 11px 20px;
  border-radius: var(--r-pill);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all var(--ease-base);
}

.btn-ghost:hover { color: var(--text-primary); border-color: var(--border-strong); background: var(--bg-overlay); }

/* === BOTÃO DANGER === */
.btn-danger {
  background: var(--danger-dim);
  color: var(--danger);
  border: 1px solid var(--danger-border);
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 14px;
  padding: 11px 20px;
  border-radius: var(--r-pill);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all var(--ease-base);
}

.btn-danger:hover { background: rgba(255,92,92,0.18); }

/* === SCORE BADGE === */
.score-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: var(--r-pill);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.score-badge.high   { background: var(--success-dim); color: var(--success); }
.score-badge.medium { background: var(--warning-dim); color: var(--warning); }
.score-badge.low    { background: var(--danger-dim);  color: var(--danger);  }
```

---

## 4. LAYOUT DO APP

```
┌────────────────────────────────────────────────────────────────┐
│ SIDEBAR (260px fixo, sticky, 100vh)  │  MAIN (flex:1)          │
│ ─────────────────────────────────── │ ──────────────────────── │
│ LOGO                                 │ TOPBAR (60px sticky)     │
│ ─────────────────────────────────── │   Título step + subtítulo│
│ PROJETOS                             │   Score badge global     │
│  ● Projeto Ativo                     │   Btn ações rápidas      │
│  ○ Projeto B                         │ ──────────────────────── │
│  ○ Projeto C                         │ PROGRESS LINE (3px)      │
│  [+ Novo Projeto]                    │ ──────────────────────── │
│ ─────────────────────────────────── │ STEP CONTENT (scrollável)│
│ STEPS                                │   max-width: 820px       │
│  ✓ 1. Identificação                  │   padding: 40px 48px     │
│  ✓ 2. Contato                        │                          │
│  ✓ 3. Redes Sociais                  │                          │
│  ✓ 4. Localização                    │ ──────────────────────── │
│  ● 5. Serviços                       │ BOTTOMBAR (64px sticky)  │
│  ○ 6. Público                        │  [Anterior]  [Próximo →] │
│  ○ 7. Direção Visual                 │                          │
│  ○ 8. Assets & Integrações           │                          │
│  ○ 9. Revisão                        │                          │
│ ─────────────────────────────────── │                          │
│ API CONFIG                           │                          │
│ [key icon] Configurar chaves         │                          │
│ ─────────────────────────────────── │                          │
│ [dot] Status do sistema              │                          │
└────────────────────────────────────────────────────────────────┘
```

### HTML Base — index.html

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LandingAI — Adsgator</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/app.css">
</head>
<body>

  <div id="app">
    <!-- SIDEBAR -->
    <aside id="sidebar" class="sidebar"></aside>

    <!-- MAIN -->
    <main id="main" class="main">
      <header id="topbar" class="topbar"></header>
      <div id="progress-line" class="progress-line">
        <div id="progress-fill" class="progress-fill"></div>
      </div>
      <section id="step-content" class="step-content"></section>
      <footer id="bottombar" class="bottombar"></footer>
    </main>
  </div>

  <!-- MODAIS -->
  <div id="modal-api"       class="modal-backdrop"></div>
  <div id="modal-gen"       class="modal-backdrop"></div>
  <div id="modal-preview"   class="modal-backdrop"></div>
  <div id="modal-projects"  class="modal-backdrop"></div>
  <div id="modal-error"     class="modal-backdrop"></div>

  <!-- TOAST -->
  <div id="toast" class="toast"></div>

  <!-- ICONS -->
  <script src="https://unpkg.com/lucide@latest"></script>

  <!-- APP -->
  <script src="assets/app.js"></script>
  <script>App.init();</script>

</body>
</html>
```

---

## 5. STEPS DO FORMULÁRIO — ESPECIFICAÇÃO COMPLETA

### Mapeamento de Campos (briefing object)

```javascript
// Estado inicial do briefing
const defaultBriefing = {
  // STEP 1 — Identificação
  nome_cliente: '',
  nome_marca: '',
  slug: '',
  segmento: '',
  tipo: '',             // servico | produto | mentoria | consultoria | saas

  // STEP 2 — Contato
  whatsapp: '',
  email: '',
  horarios: '',
  gtm_id: '',

  // STEP 3 — Redes Sociais
  instagram: '',
  tiktok: '',
  youtube: '',
  outras_redes: '',

  // STEP 4 — Localização
  modalidade: '',       // presencial | online | hibrido
  endereco: '',
  exibir_localizacao: '',// completo | cidade | nao
  cidades_atendimento: '',
  plataforma_online: '',

  // STEP 5 — Serviços
  servicos_lista: '',
  servicos_descricao: '',
  servico_principal: '',
  objetivo_conversao: '',// whatsapp | formulario | agendamento | outro
  objetivo_outro: '',

  // STEP 6 — Público
  publico_primario: '',
  publico_dor: '',
  publico_resultado: '',
  publico_secundario: '',

  // STEP 7 — Diferenciais, Copy e Prova Social
  diferencial: '',
  historia: '',
  frase_impacto: '',
  preco_exibir: '',     // sim | nao
  preco_valor: '',
  preco_condicao: '',
  depoimentos: '',      // sim | nao
  depoimentos_formato: [],  // print | texto | video
  depoimentos_qtd: '',
  google_business: '',  // sim | nao
  google_nota: '',
  google_qtd: '',
  casos_resultados: '',
  faq: '',
  oferta_especial: '',

  // STEP 8 — Direção Visual
  estilo_desejado: '',
  sensacao_visitante: '',
  referencias_pessoais: '',     // campo livre
  referencias_nicho: '',        // campo livre
  cor_principal: '',
  cor_secundaria: '',
  logo_disponivel: '',          // svg | png | nao
  tema: '',                     // claro | escuro | ia-decide
  intensidade_visual: '',       // contido | medio | alto
  footer_tom: '',
  footer_elemento: '',
  footer_sensacao: '',
  menu_mobile_estilo: '',       // fullscreen | drawer | bottom | ia-decide
  menu_mobile_especial: '',
  o_que_nao_quero: '',
  referencia_marca: '',

  // STEP 9 — Assets & Integrações
  foto_profissional: '',        // boa | media | nao
  assets_outros: '',
  dominio: '',
  cnpj: '',
  aviso_legal: '',
  restricoes: '',
  integracoes: [],              // maps | reviews | instagram | formulario | whatsapp | ligacao
  instrucoes_adicionais: ''
}
```

---

### STEP 1 — Identificação

**Objetivo:** Definir a identidade do projeto.  
**Score:** obrigatório: `nome_cliente`, `tipo`, `segmento`  

**Campos:**

| Campo | Tipo | Obrigatório | Validação |
|---|---|---|---|
| Nome do cliente | text | ✅ | Min 2 caracteres |
| Nome da marca | text | ✅ | Min 2 caracteres |
| Slug | text (auto) | ✅ | Auto-gerado de nome_cliente, editável |
| Segmento / profissão | text | ✅ | Min 5 caracteres |
| Tipo de projeto | sel-cards (5 opções) | ✅ | Uma seleção obrigatória |

**Sel-cards tipo de projeto:**
```
● Serviço         — Adestramento, fisioterapia, advocacia, etc
● Produto         — Ecommerce, venda física, produto digital
● Mentoria        — Mentoria individual, grupo, programa
● Consultoria     — B2B, consultoria especializada
● SaaS / Digital  — Software, app, ferramenta online
```

---

### STEP 2 — Contato

**Objetivo:** Dados de contato e rastreamento.  
**Score:** obrigatório: `whatsapp`, `objetivo_conversao`  

**Campos:**

| Campo | Tipo | Obrigatório | Validação |
|---|---|---|---|
| WhatsApp | text | ✅ | Auto-formata para `5511999999999` — valida comprimento |
| E-mail de contato | email | ❌ | Formato válido |
| Horários de atendimento | text | ❌ | Min 5 caracteres |
| ID do GTM | text | ❌ | Regex `GTM-[A-Z0-9]+` |

**Nota:** WhatsApp deve mostrar preview da URL formatada conforme usuário digita:
```
Input: 11 99999-9999
Preview: 5511999999999 ✓
Link: https://wa.me/5511999999999
```

---

### STEP 3 — Redes Sociais

**Objetivo:** Ativos digitais do cliente para integrações.  
**Score:** nenhum obrigatório — mas aviso se tudo vazio  

**Campos:**

| Campo | Tipo | Obrigatório | Formato |
|---|---|---|---|
| Instagram | text | ❌ | Auto-remove `@` |
| TikTok | text | ❌ | Auto-remove `@` |
| YouTube | text | ❌ | URL ou @canal |
| Outras redes | textarea | ❌ | Campo livre |

---

### STEP 4 — Localização e Modalidade

**Objetivo:** Definir onde e como o profissional atende (impacta diretamente quais blocos o DOC-1 inclui).  
**Score:** obrigatório: `modalidade`  

**Campos:**

| Campo | Tipo | Obrigatório | Condicional |
|---|---|---|---|
| Modalidade | chips (3 opções) | ✅ | — |
| Endereço completo | textarea | Se presencial | Aparece se `modalidade` inclui presencial |
| Exibir localização | chips (3 opções) | Se presencial | Aparece se `modalidade` inclui presencial |
| Cidades de atendimento | text | Se presencial | Aparece se `modalidade` inclui presencial |
| Plataforma online | text | Se online | Aparece se `modalidade` é online/híbrido |

---

### STEP 5 — Serviços e Produto

**Objetivo:** Core da landing page — o que é vendido, como funciona, por qual canal.  
**Score:** obrigatório: `servico_principal`, `objetivo_conversao`, `servicos_descricao`  
**Validação:** aviso se `servicos_descricao` < 80 caracteres  

**Campos:**

| Campo | Tipo | Obrigatório | Validação |
|---|---|---|---|
| Lista de serviços | textarea | ✅ | Min 1 item |
| Descrição dos serviços | textarea | ✅ | Min 80 chars (aviso se < 150) |
| Serviço principal | text | ✅ | — |
| Objetivo de conversão | sel-cards (4 opções) | ✅ | Uma seleção obrigatória |
| Exibir preço? | chips (Sim/Não) | ✅ | — |
| Valor + forma de cobrança | text | Se sim | Aparece se `preco_exibir` = sim |
| Oferta especial | text | ❌ | — |

---

### STEP 6 — Público-Alvo

**Objetivo:** Definir PARA QUEM a landing page fala (crítico para copy e headlines).  
**Score:** obrigatório: `publico_primario`, `publico_dor`, `publico_resultado`  
**Validação especial:** Aviso se `publico_primario` for muito genérico (< 20 chars ou apenas "homens", "mulheres", "pessoas")  

**Campos:**

| Campo | Tipo | Obrigatório | Validação |
|---|---|---|---|
| Público primário | textarea | ✅ | Min 20 chars + check genérico |
| Problema principal antes de contratar | textarea | ✅ | Min 30 chars |
| O que ele quer alcançar | textarea | ✅ | Min 30 chars |
| Público secundário | textarea | ❌ | — |
| FAQ — principais dúvidas | textarea | ❌ | — |

**Lógica de aviso de público genérico:**
```javascript
const genericTerms = ['homens', 'mulheres', 'pessoas', 'todos', 'qualquer', 'adultos']
if (genericTerms.some(t => publico_primario.toLowerCase().includes(t)) && publico_primario.length < 40) {
  showWarning('Público muito genérico. Especifique idade, contexto, profissão ou situação de vida.')
}
```

---

### STEP 7 — Diferenciais, Copy e Prova Social

**Objetivo:** Material para copy de persuasão — o que torna o cliente único + provas.  
**Score:** obrigatório: `diferencial`, `frase_impacto`  

**Campos:**

| Campo | Tipo | Obrigatório | Validação |
|---|---|---|---|
| Diferencial | textarea | ✅ | Aviso se inclui "qualidade" ou "excelência" |
| História / origem | textarea | ❌ | Opcional mas recomendado |
| Frase de impacto | text | ✅ | 1 linha, max 120 chars |
| Depoimentos? | chips (Sim/Não) | ✅ | — |
| Formato dos depoimentos | chips (múltiplos) | Se sim | Aparece se `depoimentos` = sim |
| Quantidade de depoimentos | number | Se sim | Min 1 |
| Google Business? | chips (Sim/Não) | ✅ | — |
| Nota Google | number | Se sim | 1.0–5.0 |
| Qtd. avaliações Google | number | Se sim | Aviso se < 10 (não inclui bloco Reviews) |
| Cases / resultados | textarea | ❌ | — |

**Lógica especial — Google Reviews:**
```javascript
// Só inclui bloco Google Reviews no DOC-1 se:
if (google_business === 'sim' && parseInt(google_qtd) >= 10) {
  incluir_bloco_google_reviews = true
}
```

**Lógica especial — Proibições de diferencial:**
```javascript
const genericDiff = ['qualidade', 'excelência', 'comprometimento', 'dedicação', 'atendimento personalizado']
if (genericDiff.some(t => diferencial.toLowerCase().includes(t))) {
  showWarning('Seu diferencial usa termos genéricos. O que especificamente te diferencia na prática?')
}
```

---

### STEP 8 — Direção Visual

**Objetivo:** Toda a direção de arte que alimenta o DOC-1 para a IA gerar design premium.  
**Score:** obrigatório: `estilo_desejado`, `tema`, `intensidade_visual`  

**Campos:**

| Campo | Tipo | Obrigatório | Validação |
|---|---|---|---|
| Como o site deve ser percebido | textarea | ✅ | Min 20 chars |
| Sensação do visitante | textarea | ✅ | Min 15 chars |
| Referências pessoais | textarea | ✅ | Campo livre com helper text |
| Referências do nicho | textarea | ❌ | Recomendado |
| Cor principal | color picker + text | ❌ | HEX automático |
| Cor secundária | color picker + text | ❌ | HEX automático |
| Logo disponível | chips (SVG/PNG/Não) | ✅ | — |
| Tema | chips (3 opções) | ✅ | — |
| Intensidade visual | sel-cards (3 opções) | ✅ | — |
| Estilo do footer | textarea | ❌ | Com helper text |
| Menu mobile | chips (4 opções) | ❌ | — |
| O que NÃO quero | textarea | ❌ | Recomendado — previne outputs ruins |
| Referência de marca | text | ❌ | Ex: "próximo de Notion/Linear/Stripe" |

**Sel-cards Intensidade Visual:**
```
● Contido     — Animações sutis, foco no conteúdo. Clínicas, consultórios, B2B.
● Médio       — Presença notável. Profissionais criativos, mentores, serviços premium.
● Alto        — Efeito uau total. Imersivo, editorial, tecnologia. Diferença imediata.
```

---

### STEP 9 — Assets, Integrações e Finalizações

**Objetivo:** Confirmar ativos disponíveis e integrações ativas. Define o checklist final do DOC-1.  
**Score:** obrigatório: `dominio`  

**Campos:**

| Campo | Tipo | Obrigatório | Validação |
|---|---|---|---|
| Foto do profissional/produto | chips (3 qualidades) | ✅ | — |
| Outros assets | textarea | ❌ | — |
| Domínio desejado | text | ✅ | Placeholder: seunome.com.br |
| CNPJ | text | ❌ | Auto-formata |
| Aviso legal (CRM, OAB, etc) | text | ❌ | — |
| Restrições de conteúdo | textarea | ❌ | — |
| Integrações ativas | checkboxes | ❌ | Lógica condicional |
| Instruções adicionais | textarea | ❌ | — |
| Briefing bruto do cliente | textarea | ❌ | Campo livre para colar o briefing cru |

**Integrações — checkboxes com lógica condicional:**
```
☐ Google Maps embed           — aparece se modalidade é presencial
☐ Google Reviews widget       — aparece se google_qtd >= 10
☐ Instagram Feed              — aparece se instagram preenchido
☐ Formulário de Contato       — sempre disponível
☐ WhatsApp flutuante          — sempre ativo (padrão Adsgator, pré-marcado)
☐ Botão de ligação mobile     — disponível se objetivo inclui ligação
```

---

## 6. VALIDAÇÃO INTELIGENTE

### Regras por Categoria

#### 6.1 Campos Críticos (bloqueia geração)

```javascript
const criticalFields = {
  1: ['nome_cliente', 'tipo', 'segmento'],
  2: ['whatsapp', 'objetivo_conversao'],
  4: ['modalidade'],
  5: ['servico_principal', 'servicos_descricao'],
  6: ['publico_primario', 'publico_dor', 'publico_resultado'],
  7: ['diferencial', 'frase_impacto'],
  8: ['estilo_desejado', 'tema', 'intensidade_visual'],
  9: ['dominio']
}
```

#### 6.2 Campos Genéricos (warning visual — não bloqueia)

```javascript
const genericChecks = [
  {
    field: 'publico_primario',
    terms: ['homens', 'mulheres', 'pessoas', 'todos', 'qualquer'],
    minLength: 40,
    msg: 'Público muito genérico. Especifique idade, contexto, profissão ou situação de vida do cliente ideal.'
  },
  {
    field: 'diferencial',
    terms: ['qualidade', 'excelência', 'comprometimento', 'dedicação', 'atendimento personalizado', 'inovador'],
    msg: 'Diferencial genérico detectado. O que na prática te diferencia? Seja específico e real.'
  },
  {
    field: 'frase_impacto',
    terms: ['transforme', 'revolucionar', 'definitiva', 'solução completa', 'do seu jeito'],
    msg: 'Frase usa clichês de marketing. Reescreva com uma dor real ou resultado concreto.'
  },
  {
    field: 'estilo_desejado',
    terms: ['moderno', 'profissional', 'clean', 'simples'],
    minLength: 30,
    msg: 'Muito vago. Descreva o estilo com mais precisão — ex: "sóbrio e técnico, quase editorial".'
  },
  {
    field: 'servicos_descricao',
    minLength: 80,
    msg: 'Descrição muito curta. Quanto mais detalhe aqui, melhor a IA consegue montar a copy.'
  }
]
```

#### 6.3 Consistência Visual (warning)

```javascript
const consistencyChecks = [
  // Tema escuro + intensidade alta + nicho delicado → aviso
  {
    condition: () => tema === 'escuro' && intensidade_visual === 'alto' && 
                     ['psicologia', 'saúde', 'infantil'].includes(segmento.toLowerCase()),
    msg: 'Tema escuro + intensidade alta pode conflitar com nichos de saúde. Confirmar direção?'
  },
  // "Premium sóbrio" + referências muito agitadas → aviso
  {
    condition: () => estilo_desejado.includes('sóbrio') && 
                     referencias_pessoais.toLowerCase().includes('vibrant'),
    msg: 'Direção visual contraditória detectada: estilo sóbrio + referências vibrantes. Esclareça qual prevalece.'
  }
]
```

### Score por Step (sidebar)

```javascript
function getStepScore(step) {
  const fields = stepFields[step]
  const filled = fields.filter(f => briefing[f] && briefing[f].toString().trim().length > 0)
  const warnings = fields.filter(f => hasWarning(f))
  
  const base = filled.length / fields.length * 100
  const penalty = warnings.length * 5
  return Math.max(0, Math.round(base - penalty))
}

// Ícone na sidebar por score:
// >= 90%  → check-circle (verde)
// 50–89%  → alert-circle (amarelo)
// < 50%   → circle (cinza) se não visitado, x-circle (vermelho) se visitado
```

---

## 7. SISTEMA DE PROJETOS

### Estrutura de Armazenamento

```javascript
// localStorage keys:
// 'landingai_projects'  → objeto com todos os projetos
// 'landingai_active'    → ID do projeto ativo

const projectSchema = {
  id: 'uuid-v4',
  name: '',              // Ex: "B.MATTOS - Mentoria"
  slug: '',
  createdAt: '',         // ISO string
  updatedAt: '',
  status: 'rascunho',    // rascunho | revisando | gerado | entregue
  briefing: { /* ... */ },
  visitedSteps: [],
  versions: [
    {
      v: 1,
      savedAt: '',
      doc1: '',          // Conteúdo do DOC-1 em markdown
      docImpl: '',       // Conteúdo do DOC-IMPL (se gerado)
```

### `docs\doc1-teste.md`

```markdown
---
title: teste — Brainstorm Visual
date: 2026-05-06T00:17:07.272Z
tags: [adsgator, design, doc-2]
status: pronto-para-ia
gerado_por: LandingAI v2
modelo_ia: Gemini 3.0 Flash
---

# teste — Brainstorm Visual

> **Documento 1 de 2 — Adsgator (gerado pelo LandingAI v2)**
> Preencha este documento e envie para a IA gerar a Ficha de Implementação.

---

## INSTRUÇÃO MESTRE PARA A IA

Você é um Diretor de Arte, UI Designer de elite e Engenheiro Front-end Sênior, trabalhando para a agência Adsgator.

Sua missão é ler este documento inteiro e gerar como output a **Ficha de Implementação**, completa, específica e pronta para ser enviada diretamente ao Claude, Roo Code ou outro agente implementador construir a landing page.

**O que isso significa na prática:**
- Você toma todas as decisões de design que não estão explicitadas — tipografia, escala, tokens, animações, layout de cada seção.
- Você preenche cada campo da Ficha de Implementação com valores concretos. Sem placeholders. Sem [definir depois]. Sem [a combinar].
- Você transforma a direção criativa e a copy abaixo em especificações técnicas de implementação.
- O output que você entrega deve poder ser copiado e enviado para outra IA sem nenhuma edição adicional.

**Padrão de qualidade esperado:**
O documento gerado deve orquestrar uma landing page com design editorial de alto padrão — atípico, com personalidade visual forte, fora do visual genérico de IA. Pense Raycast, Linear, Family.co. Layouts com intenção. Tipografia com personalidade. Animações que têm razão de existir. Cada decisão de tipografia, espaçamento, cor e animação deve ser intencional e coesa.

**Sobre o viewport:**
O site não fica preso em um container central. Seções que se beneficiam de ocupar o viewport completo devem fazê-lo — backgrounds que sangram até as bordas, tipografia que respira, imagens que não ficam comprimidas. O container é uma ferramenta de legibilidade, não uma prisão de layout.

**Sobre o mobile:**
Mobile não é adaptação — é o ponto de partida. O design começa em 375px. Cada decisão de tipografia, espaçamento, hierarquia e layout é tomada primeiro para mobile e expandida para desktop.

**Sobre o footer:**
O footer não é um afterthought — é a última impressão. Deve ter identidade visual clara, conectada ao tom da landing page. Hierarquia tipográfica real. Personalidade.

**DNA ADSGATOR — REGRAS INEGOCIÁVEIS DE COPY:**
- Intenção de Busca em Primeiro Lugar — a H1 justifica o clique no anúncio nos primeiros 3 segundos
- Primeira Pessoa Sempre — "eu", "meu", "com você" — nunca terceira pessoa
- Zero Institucional — proibido: "inovador", "excelência", "missão", "visão"
- Comunicação Direta e Realista — sem promessas milagrosas
- Tom Conversacional com Autoridade
- Foco na Ação — cada palavra tem função persuasiva

**STACK TÉCNICA FIXA:**
Astro + Tailwind CSS + GSAP + ScrollTrigger + Framer Motion + Lenis + Web3Forms
Deploy: Vercel (output: 'static')

---

## PARTE 1 — IDENTIDADE DO PROJETO

### Resumo do Projeto

| Campo | Valor |
|---|---|
| **Cliente** | teste |
| **Marca** | — |
| **Slug** | teste |
| **Segmento** | — |
| **Tipo** | — |
| **Objetivo de conversão** | — |
| **WhatsApp** | — |
| **E-mail** | — |
| **Horários** | — |
| **GTM ID** | — |
| **Domínio** | — |
| **Modalidade** | — |
| **CNPJ** | — |
| **Aviso legal** | — |

---

## PARTE 2 — SERVIÇOS E PRODUTO

### Serviço Principal
—

### Todos os Serviços
—

### Descrição Detalhada
—

### Preço
Não exibir preço

### Oferta Especial
Não há

---

## PARTE 3 — PÚBLICO-ALVO

### Público Primário
—

### Dor Principal
—

### Resultado Desejado
—

### Público Secundário
Não definido

---

## PARTE 4 — COPY E PERSUASÃO

### Diferencial Real
—

### Frase de Impacto
—

### História / Origem
Não fornecida

### FAQ — Principais Dúvidas
Não fornecido — IA decide baseado no nicho

---

## PARTE 5 — PRESENÇA DIGITAL

### Redes Sociais
| Rede | Handle/Link |
|---|---|
| Instagram | — |
| TikTok | — |
| YouTube | — |
| Outras | — |

### Google Business
Não possui

### Depoimentos
Não há depoimentos disponíveis

### Cases / Resultados Concretos
Não fornecidos

---

## PARTE 6 — LOCALIZAÇÃO

### Modalidade de Atendimento
—





---

## PARTE 7 — DIREÇÃO DE DESIGN

### Como o site deve ser percebido
—

### Sensação do visitante
—

### Referências Pessoais
—

### Referências do Nicho
Não fornecidas

### Cores da Marca
| Cor | Valor |
|---|---|
| Principal | Não definida |
| Secundária | Não definida |

### Direção Geral
| Parâmetro | Valor |
|---|---|
| Tema | — |
| Intensidade Visual | — |
| Referência de marca | Não definida |
| O que NÃO quero | Não especificado |

### Footer
| Parâmetro | Valor |
|---|---|
| Tom visual | IA decide |
| Elemento âncora | IA decide |
| Sensação | IA decide |

### Menu Mobile
IA decide — Padrão

---

## PARTE 8 — ASSETS E INTEGRAÇÕES

### Assets Disponíveis
| Asset | Status |
|---|---|
| Logo | — |
| Foto do profissional/produto | — |
| Outros | — |

### Integrações Ativas


---

## PARTE 9 — BRIEFING BRUTO DO CLIENTE

> Cole abaixo o briefing exatamente como veio do cliente. A IA usa como fonte primária.

Não fornecido — usar dados dos campos acima

---

## PARTE 10 — INSTRUÇÕES ADICIONAIS

Nenhuma instrução adicional

---

## PARTE 11 — REGRAS FIXAS ADSGATOR


> A PARTE 11 contém as Regras Fixas da Adsgator. Não altere ou resumo.
> Utilize integralmente ao gerar a Ficha de Implementação.

1. O layout deve ser mobile-first, pensado para 375px e expandido para desktop.
2. A tipografia deve seguir uma hierarquia clara e funcional (H1, H2, H3, P).
3. Todo formulário deve ter validação inline visual.
4. Animações devem focar no UX e conversão, sem excessos gratuitos.
5. Cores devem respeitar contraste de acessibilidade (WCAG AA).

```

