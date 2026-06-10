import os
import re

pages_dir = r"c:\Users\Mukesh karthik M\Documents\Projects\Quantx\src\pages"
charts_dir = r"c:\Users\Mukesh karthik M\Documents\Projects\Quantx\src\components\charts"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove isDark ternaries
    # Pattern: ${isDark ? 'dark-classes' : 'light-classes'}
    content = re.sub(r"\$\{isDark \? '([^']+)' : '([^']+)'\}", r"\1", content)
    # Pattern: isDark ? 'dark' : 'light'
    content = re.sub(r"isDark \? '([^']+)' : '([^']+)'", r"'\1'", content)
    # Pattern: isDark ? darkVar : lightVar
    content = re.sub(r"isDark \? ([a-zA-Z0-9_]+) : ([a-zA-Z0-9_]+)", r"\1", content)
    
    # 2. Colors replacement
    # Colors
    replacements = {
        '#00ff41': '#00e5ff',
        '#ff3b30': '#ff1744',
        'acid-500': 'ghost-cyan',
        'signal-red': 'ghost-error',
        'signal-blue': 'ghost-purple',
        'signal-yellow': 'white/40',
        'steel-100': 'white',
        'steel-200': 'white/80',
        'steel-300': 'white/60',
        'steel-400': 'white/50',
        'steel-500': 'white/40',
        'steel-600': 'white/30',
        'steel-700': 'white/20',
        'steel-800': 'white/10',
        'steel-900': 'white/5',
        'void-900': 'transparent',
        'void-950': 'transparent',
        'bg-void': 'bg-transparent',
        'emerald-600': 'ghost-cyan',
        'text-acid': 'text-ghost-cyan',
        'bg-acid': 'bg-ghost-cyan',
        'border-acid': 'border-ghost-cyan',
        'lm-border': 'white/10',
        'lm-bg': 'transparent',
        'lm-muted': 'white/40',
        'lm-text': 'white'
    }
    
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    # Remove unused useTheme import
    content = re.sub(r"import\s*\{\s*useTheme\s*\}\s*from\s*'@/utils/useTheme';?\n?", "", content)
    content = re.sub(r"const\s*\{\s*isDark\s*\}\s*=\s*useTheme\(\);?\n?", "", content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for d in [pages_dir, charts_dir]:
    for f in os.listdir(d):
        if f.endswith('.tsx'):
            process_file(os.path.join(d, f))

print("Restyling complete.")
