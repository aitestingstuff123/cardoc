import os

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return

    original = content
    
    replacements = {
        'gold-300': 'orange-300',
        'gold-400': 'orange-400',
        'gold-500': 'orange-500',
        'gold-600': 'orange-600',
        'bg-gold-': 'bg-orange-',
        'text-gold-': 'text-orange-',
        'border-gold-': 'border-orange-',
        'shadow-gold-': 'shadow-orange-',
        'focus:border-gold-': 'focus:border-orange-',
        'focus:ring-gold-': 'focus:ring-orange-',
        'zinc-950': 'slate-950',
        'zinc-900': 'slate-900',
        'zinc-800': 'slate-800',
        'zinc-700': 'slate-700',
        'zinc-600': 'slate-600',
        'zinc-500': 'slate-500',
        'zinc-400': 'slate-400',
        'zinc-300': 'slate-300',
        'zinc-200': 'slate-200',
        'zinc-100': 'slate-100',
        'zinc-50': 'slate-50',
    }

    for k, v in replacements.items():
        content = content.replace(k, v)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated colors in {filepath}")

if __name__ == "__main__":
    replace_in_file("src/App.tsx")
    print("Done")
