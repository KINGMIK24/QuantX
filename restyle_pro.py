import os
import re

pages_dir = r"c:\Users\Mukesh karthik M\Documents\Projects\Quantx\src\pages"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Professional color replacements
    replacements = {
        '#00e5ff': '#00c896',
        '#ff1744': '#ff4d4d',
        '#0a84ff': '#e040fb',
        "'#00ff41'": "'#00c896'",
        "'#ff3b30'": "'#ff4d4d'",
        "'#ff9f0a'": "'rgba(255, 255, 255, 0.2)'",
        'ghost-cyan': 'qx-positive',
        'ghost-error': 'qx-negative',
        'ghost-purple': 'qx-accent',
        'text-ghost-cyan': 'text-qx-positive',
        'bg-ghost-cyan': 'bg-qx-positive',
        'border-ghost-cyan': 'border-qx-positive',
        # Remove old ghost-card references
        'ghost-card-purple': 'qx-card',
        'ghost-card-cyan': 'qx-card',
        'ghost-card': 'qx-card',
        # Background colors
        "background: 'rgba(15, 12, 41, 0.5)'": "background: '#0f0f17'",
        "background: 'rgba(15, 12, 41, 0.85)'": "background: '#0c0c14'",
        "background: 'rgba(15, 12, 41, 0.95)'": "background: '#1a1a28'",
        "background: 'rgba(0, 0, 0, 0.4)'": "background: '#0f0f17'",
        "background: 'rgba(0, 0, 0, 0.5)'": "background: '#080810'",
        # Border colors - make more subtle
        "borderColor: 'rgba(255, 255, 255, 0.18)'": "borderColor: 'rgba(255, 255, 255, 0.07)'",
        "borderColor: 'rgba(255, 255, 255, 0.2)'": "borderColor: 'rgba(255, 255, 255, 0.07)'",
        "borderColor: 'rgba(255, 255, 255, 0.15)'": "borderColor: 'rgba(255, 255, 255, 0.07)'",
        "borderColor: 'rgba(255, 255, 255, 0.12)'": "borderColor: 'rgba(255, 255, 255, 0.07)'",
        "borderColor: 'rgba(255, 255, 255, 0.1)'": "borderColor: 'rgba(255, 255, 255, 0.07)'",
        # Text color adjustments  
        "color: 'rgba(255, 255, 255, 0.55)'": "color: 'rgba(255, 255, 255, 0.45)'",
        # Remove signal-green references
        'bg-signal-green': 'bg-qx-positive',
        # steel-50 is white
        'text-steel-50': 'text-white',
        "color: '#0f0c29'": "color: '#0a0a0f'",
        "fill: '#0f0c29'": "fill: '#0a0a0f'",
        "stroke: '#0f0c29'": "stroke: '#0a0a0f'",
    }
    
    for old, new in replacements.items():
        content = content.replace(old, new)
    
    # Remove shadow-brutal references
    content = re.sub(r'shadow-brutal[-\w]*', '', content)
    # Remove border-3 references
    content = content.replace('border-3 ', 'border ')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for f in os.listdir(pages_dir):
    if f.endswith('.tsx') and f != 'Dashboard.tsx':
        process_file(os.path.join(pages_dir, f))

print("Pages restyled.")
