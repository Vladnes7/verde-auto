"""Export three photographic frames from each generated, equally divided asset sheet."""
import json
import subprocess
from pathlib import Path

root = Path(__file__).resolve().parent.parent
target = root / 'public/media/catalog'
target.mkdir(parents=True, exist_ok=True)
manifest = json.loads((root / 'lab/generated-manifest.json').read_text())
for item in manifest:
    for i in range(3):
        output = target / f"{item['id']}-{i + 1}.jpg"
        subprocess.run(['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error', '-i', item['path'], '-vf', f'crop=iw:ih/3:0:ih*{i}/3', '-frames:v', '1', '-q:v', '3', str(output)], check=True)
print(f'Exported {len(manifest) * 3} photographs for {len(manifest)} models.')
