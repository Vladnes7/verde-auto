import json, subprocess
from pathlib import Path
root=Path(__file__).resolve().parent.parent
data=json.loads((root/'lab/revision-2-manifest.json').read_text())
for item in data['catalog']:
 for i in range(3):
  subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',item['path'],'-vf',f'crop=iw:ih/3:0:ih*{i}/3','-frames:v','1','-q:v','3',str(root/f"public/media/catalog/{item['id']}-{i+1}.jpg")],check=True)
for item in data['hub']:
 subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',item['path'],'-q:v','3',str(root/f"public/media/{item['id']}.jpg")],check=True)
print('Exported 72 new vehicle photos and 3 hub photographs.')
