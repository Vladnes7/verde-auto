import json, subprocess
from pathlib import Path
root=Path(__file__).resolve().parent.parent
subprocess.run(['node','--input-type=module','-e','import "./src/catalog.js"'],cwd=root,check=True)
data=json.loads((root/'lab/revision-3-manifest.json').read_text())
for item in data['catalog']:
 for i in range(3):
  subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',item['path'],'-vf',f'crop=iw:floor(ih/3):0:floor(ih*{i}/3)','-frames:v','1','-q:v','3',str(root/f"public/media/catalog/{item['id']}-{i+1}.jpg")],check=True)
for item in data['salon']:
 subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',item['path'],'-q:v','3',str(root/f"public/media/{item['id']}.jpg")],check=True)
print(f"Exported {len(data['catalog'])*3} new vehicle angles and {len(data['salon'])} salon photographs.")
