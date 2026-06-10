import os
import re

def fix_screener():
    filepath = r"c:\Users\Mukesh karthik M\Documents\Projects\Quantx\src\pages\Screener.tsx"
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace the remaining ternary logic
    content = re.sub(r"\s*\?\s*isDark\s*\n\s*.*?\n\s*:\s*isDark\s*\n\s*.*", "", content)
    
    # Replace other isDark instances
    content = re.sub(r"isDark \? `[^`]+` : `[^`]+`", "''", content)
    content = re.sub(r"\$\{isDark \? [^}]+ \}", "", content)

    # remove unused
    content = re.sub(r"Zap,\s*", "", content)
    content = re.sub(r"RefreshCw,\s*", "", content)
    content = re.sub(r"const\s*\{\s*theme\s*\}\s*=\s*useTheme\(\);?", "", content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def fix_portfolio():
    filepath = r"c:\Users\Mukesh karthik M\Documents\Projects\Quantx\src\pages\Portfolio.tsx"
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace("isDark", "")
    content = content.replace("PieChart,", "")
    content = content.replace("Sparkline,", "")
    content = re.sub(r"const\s*\{\s*theme\s*\}\s*=\s*useTheme\(\);?", "", content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def fix_sidebar():
    filepath = r"c:\Users\Mukesh karthik M\Documents\Projects\Quantx\src\components\layout\Sidebar.tsx"
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove unused activeView
    content = content.replace(", activeView", "")
    content = content.replace("activeView,", "")
    
    # Remove style prop from Lucide Icon
    content = re.sub(r"style=\{\{ color: \w+ \}\}", "", content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def fix_markets():
    filepath = r"c:\Users\Mukesh karthik M\Documents\Projects\Quantx\src\pages\Markets.tsx"
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = re.sub(r"const\s*\{\s*theme\s*\}\s*=\s*useTheme\(\);?", "", content)
    content = content.replace("as Column<Record<string, unknown>>[]", "as any[]")
    content = content.replace("Column<Record<string, unknown>>[]", "any[]")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def fix_analytics():
    filepath = r"c:\Users\Mukesh karthik M\Documents\Projects\Quantx\src\pages\Analytics.tsx"
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = re.sub(r"const\s*\{\s*theme\s*\}\s*=\s*useTheme\(\);?", "", content)
    content = content.replace("Activity,", "")
    content = content.replace("Target,", "")
    content = content.replace("generatePortfolioHistory,", "")
    content = content.replace("const rsiData = useMemo(() => generateRSIData(), []);", "")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def fix_terminal():
    filepath = r"c:\Users\Mukesh karthik M\Documents\Projects\Quantx\src\pages\Terminal.tsx"
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = re.sub(r"const\s*\{\s*theme\s*\}\s*=\s*useTheme\(\);?", "", content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def fix_datatable():
    filepath = r"c:\Users\Mukesh karthik M\Documents\Projects\Quantx\src\components\ui\DataTable.tsx"
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace("compact = false,", "")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def fix_sparkline():
    filepath = r"c:\Users\Mukesh karthik M\Documents\Projects\Quantx\src\components\ui\Sparkline.tsx"
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace("const colorLight = positive ? '#10b981' : '#ef4444';", "")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def fix_useMarketData():
    filepath = r"c:\Users\Mukesh karthik M\Documents\Projects\Quantx\src\hooks\useMarketData.ts"
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace("NodeJS.Timeout", "any")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def fix_useTheme():
    filepath = r"c:\Users\Mukesh karthik M\Documents\Projects\Quantx\src\hooks\useTheme.ts"
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace("useCallback,", "")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def fix_dashboard():
    filepath = r"c:\Users\Mukesh karthik M\Documents\Projects\Quantx\src\pages\Dashboard.tsx"
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    content = content.replace("ArrowRight,", "")
    content = content.replace("BarChart2,", "")
    content = content.replace("AlertTriangle,", "")
    content = content.replace(", indices", "")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

try:
    fix_screener()
    fix_portfolio()
    fix_sidebar()
    fix_markets()
    fix_analytics()
    fix_terminal()
    fix_datatable()
    fix_sparkline()
    fix_useMarketData()
    fix_useTheme()
    fix_dashboard()
    print("Fixes applied.")
except Exception as e:
    print("Error:", e)
