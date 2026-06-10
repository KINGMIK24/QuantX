import os
import re

src_dir = r"c:\Users\Mukesh karthik M\Documents\Projects\Quantx\src\pages"

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove `accent` and `glowOnHover` props from <Card ...>
    content = re.sub(r'\baccent\b', '', content)
    content = re.sub(r'\bglowOnHover\b', '', content)

    # Remove specific unused imports or vars if it's easy, or we can just ignore TS unused vars by suppressing or removing them carefully.
    # We can just remove `isDark` completely if it's hanging.
    content = re.sub(r"const isDark = theme === 'dark';\s*", "", content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for f in os.listdir(src_dir):
    if f.endswith('.tsx'):
        fix_file(os.path.join(src_dir, f))

print("TS fixes applied.")
